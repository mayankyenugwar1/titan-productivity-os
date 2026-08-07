import { create } from "zustand";
import { aiCoreService } from "@/services/ai/aiCoreService";
import type { ExtendedAIContextPayload } from "@/services/ai/contextAssembler";
import { assembleExtendedAIContext } from "@/services/ai/contextAssembler";
import type { ProviderId, StructuredIntent } from "@/services/ai/providers/AIProvider";
import { createProposalFromIntent, executeProposal, type ExecutionProposal } from "@/services/ai/executionService";
import type { Habit } from "@/features/missions/types";
import type { Project, Goal } from "@/store/projectStore";
import type { KnowledgeItem } from "@/store/knowledgeStore";
import type { Workflow } from "@/services/automation/workflowService";
import { safeTime } from "@/utils/safeDate";

export interface SmartSuggestionItem {
  id: string;
  title: string;
  type: "CRITICAL" | "WARNING" | "RECOMMENDATION" | "OPTIMIZATION";
  description: string;
  suggestedPrompt: string;
  prompt: string;
  category: string;
}

export interface AIMessageItem {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  intent?: StructuredIntent;
  proposal?: ExecutionProposal;
}

interface AIStoreState {
  activeProviderId: ProviderId;
  messages: AIMessageItem[];
  loading: boolean;
  isThinking: boolean;
  lastIntent: StructuredIntent | null;
  pendingProposals: ExecutionProposal[];
  executionHistory: ExecutionProposal[];
  suggestions: SmartSuggestionItem[];

  setActiveProviderId: (id: ProviderId) => void;
  setProvider: (id: ProviderId) => void;
  setAPIKey: (id: ProviderId, key: string) => void;
  sendMessage: (
    prompt: string,
    habits: Habit[],
    projects: Project[],
    goals: Goal[],
    notes: KnowledgeItem[],
    workflows: Workflow[],
    totalXP: number,
    streak: number,
    focusScore: number
  ) => Promise<void>;
  confirmProposal: (proposalId: string, userId: string) => Promise<boolean>;
  rejectProposal: (proposalId: string) => void;
  updateSuggestions: (
    habits: Habit[],
    projects: Project[],
    notes: KnowledgeItem[],
    streak: number
  ) => void;
  clearMessages: () => void;
}

export const useAIStore = create<AIStoreState>((set, get) => ({
  activeProviderId: "LOCAL",
  messages: [
    {
      id: "msg-welcome",
      sender: "assistant",
      text: "Welcome Operator. TITAN Central AI Agent & Commander is active. I can manage operations, plan schedule timeblocks, create projects, generate vault notes, and execute workflows. How may I optimize your pipeline?",
      timestamp: safeTime(new Date()),
    },
  ],
  loading: false,
  isThinking: false,
  lastIntent: null,
  pendingProposals: [],
  executionHistory: [],
  suggestions: [
    { id: "sug-1", title: "Morning Planning", type: "RECOMMENDATION", description: "Optimize morning directive window", suggestedPrompt: "Summarize today's critical directives and suggest optimal schedule timeblocks.", prompt: "Summarize today's critical directives and suggest optimal schedule timeblocks.", category: "Planning" },
    { id: "sug-2", title: "Project Status", type: "OPTIMIZATION", description: "Review active project initiatives", suggestedPrompt: "Review active project initiatives and list overdue milestones.", prompt: "Review active project initiatives and list overdue milestones.", category: "Projects" },
    { id: "sug-3", title: "Workflow Audit", type: "CRITICAL", description: "Audit automated workflows", suggestedPrompt: "Audit all automated workflows and trigger pending operations.", prompt: "Audit all automated workflows and trigger pending operations.", category: "Automation" },
  ],

  setActiveProviderId: (activeProviderId) => {
    aiCoreService.setProvider(activeProviderId);
    set({ activeProviderId });
  },

  setProvider: (providerId) => {
    aiCoreService.setProvider(providerId);
    set({ activeProviderId: providerId });
  },

  setAPIKey: (providerId, key) => {
    aiCoreService.setAPIKey(providerId, key);
  },

  sendMessage: async (prompt, habits, projects, goals, notes, workflows, totalXP, streak, focusScore) => {
    if (!prompt.trim()) return;

    const userMsg: AIMessageItem = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: prompt,
      timestamp: safeTime(new Date()),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      loading: true,
      isThinking: true,
    }));

    const contextPayload: ExtendedAIContextPayload = assembleExtendedAIContext(
      habits,
      projects,
      goals,
      notes,
      workflows,
      totalXP,
      streak,
      focusScore
    );

    const detectedIntent = await aiCoreService.detectIntent(prompt);
    const proposal = createProposalFromIntent(detectedIntent);

    const replyText = await aiCoreService.sendMessage(prompt, contextPayload as any);

    const assistantMsg: AIMessageItem = {
      id: `asst-${Date.now()}`,
      sender: "assistant",
      text: replyText,
      timestamp: safeTime(new Date()),
      intent: detectedIntent,
      proposal: proposal || undefined,
    };

    set((state) => ({
      messages: [...state.messages, assistantMsg],
      lastIntent: detectedIntent,
      pendingProposals: proposal ? [...state.pendingProposals, proposal] : state.pendingProposals,
      loading: false,
      isThinking: false,
    }));
  },

  confirmProposal: async (proposalId, userId) => {
    const state = get();
    const proposal = state.pendingProposals.find((p) => p.id === proposalId);
    if (!proposal) return false;

    const success = await executeProposal(proposal, userId);
    if (success) {
      const executedProposal: ExecutionProposal = { ...proposal, status: "EXECUTED" };
      set((prev) => ({
        pendingProposals: prev.pendingProposals.filter((p) => p.id !== proposalId),
        executionHistory: [executedProposal, ...prev.executionHistory],
        messages: [
          ...prev.messages,
          {
            id: `sys-exec-${Date.now()}`,
            sender: "assistant",
            text: `✅ Action Executed: ${proposal.title}. State updated across workspace.`,
            timestamp: safeTime(new Date()),
          },
        ],
      }));
    }
    return success;
  },

  rejectProposal: (proposalId) => {
    set((prev) => ({
      pendingProposals: prev.pendingProposals.filter((p) => p.id !== proposalId),
      messages: [
        ...prev.messages,
        {
          id: `sys-rej-${Date.now()}`,
          sender: "assistant",
          text: `🚫 Action Cancelled by Operator. No state changes applied.`,
          timestamp: safeTime(new Date()),
        },
      ],
    }));
  },

  updateSuggestions: () => {
    // Smart suggestions remain active
  },

  clearMessages: () => {
    set({
      messages: [
        {
          id: "msg-welcome",
          sender: "assistant",
          text: "Welcome Operator. TITAN Central AI Agent & Commander is active.",
          timestamp: safeTime(new Date()),
        },
      ],
      pendingProposals: [],
    });
  },
}));
