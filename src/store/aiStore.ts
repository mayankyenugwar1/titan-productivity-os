import { create } from "zustand";
import type { ProviderId, StructuredIntent } from "@/services/ai/providers/AIProvider";
import { aiCoreService } from "@/services/ai/aiCoreService";
import { assembleExtendedAIContext, type ExtendedAIContextPayload } from "@/services/ai/contextAssembler";
import { classifyIntent } from "@/services/ai/intentService";
import { createProposalFromIntent, executeProposal, type ExecutionProposal } from "@/services/ai/executionService";
import { generateSmartSuggestions, type AISmartSuggestion } from "@/services/ai/reasoningService";
import type { Habit } from "@/features/missions/types";
import type { Project, Goal } from "@/services/projects/projectService";
import type { KnowledgeItem } from "@/services/knowledge/knowledgeService";
import type { Workflow } from "@/services/automation/workflowService";

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
  suggestions: AISmartSuggestion[];
  apiKeys: Record<string, string>;

  setProvider: (providerId: ProviderId) => void;
  setAPIKey: (providerId: ProviderId, key: string) => void;
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
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ],
  loading: false,
  isThinking: false,
  lastIntent: null,
  pendingProposals: [],
  executionHistory: [],
  suggestions: [],
  apiKeys: {},

  setProvider: (providerId) => {
    aiCoreService.setProvider(providerId);
    set({ activeProviderId: providerId });
  },

  setAPIKey: (providerId, key) => {
    aiCoreService.setAPIKey(providerId, key);
    set((state) => ({ apiKeys: { ...state.apiKeys, [providerId]: key } }));
  },

  sendMessage: async (prompt, habits, projects, goals, notes, workflows, totalXP, streak, focusScore) => {
    if (!prompt.trim()) return;

    const userMsg: AIMessageItem = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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

    const detectedIntent = classifyIntent(prompt);
    const proposal = createProposalFromIntent(detectedIntent);

    const replyText = await aiCoreService.sendMessage(prompt, contextPayload as any);

    const assistantMsg: AIMessageItem = {
      id: `asst-${Date.now()}`,
      sender: "assistant",
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    }));
  },

  updateSuggestions: (habits, projects, notes, streak) => {
    const list = generateSmartSuggestions(habits, projects, notes, streak);
    set({ suggestions: list });
  },

  clearMessages: () => {
    set({
      messages: [
        {
          id: "msg-welcome",
          sender: "assistant",
          text: "Welcome Operator. TITAN Central AI Agent & Commander is active.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
      pendingProposals: [],
    });
  },
}));
