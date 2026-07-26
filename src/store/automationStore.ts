import { create } from "zustand";
import { getInitialWorkflows, type ExecutionRecord, type Workflow } from "@/services/automation/workflowService";

export type { ExecutionRecord, Workflow };
export type AutomationWorkflow = Workflow;

interface AutomationStoreState {
  workflows: Workflow[];
  executionHistory: ExecutionRecord[];
  activeWorkflowId: string | null;
  searchQuery: string;
  activeFilter: string;

  setActiveWorkflowId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: string) => void;

  toggleWorkflow: (id: string) => void;
  runWorkflowManually: (id: string) => void;
  createWorkflow: (workflow: Omit<Workflow, "id" | "runCount">) => void;
  deleteWorkflow: (id: string) => void;
  generateAIWorkflow: (naturalPrompt: string) => void;
}

export const useAutomationStore = create<AutomationStoreState>((set, get) => ({
  workflows: getInitialWorkflows(),
  executionHistory: [
    {
      id: "exec-1",
      workflowId: "wf-1",
      workflowName: "Morning Focus Protocol",
      status: "SUCCESS",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      durationMs: 42,
      logs: ["Trigger 'SCHEDULED_TICK' matched", "Condition 'time == 08:00' evaluated TRUE", "Action 'CREATE_MISSION' executed (+50 XP)"],
    },
    {
      id: "exec-2",
      workflowId: "wf-2",
      workflowName: "Streak Preservation Alert & Journal Auto-Entry",
      status: "SUCCESS",
      timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
      durationMs: 35,
      logs: ["Trigger 'MISSION_COMPLETED' matched", "Action 'CREATE_NOTE' executed in Knowledge Vault"],
    },
  ],
  activeWorkflowId: "wf-1",
  searchQuery: "",
  activeFilter: "ALL",

  setActiveWorkflowId: (id) => set({ activeWorkflowId: id }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveFilter: (activeFilter) => set({ activeFilter }),

  toggleWorkflow: (id) => {
    set((state) => ({
      workflows: state.workflows.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w)),
    }));
  },

  runWorkflowManually: (id) => {
    const state = get();
    const wf = state.workflows.find((w) => w.id === id);
    if (!wf) return;

    const now = new Date().toISOString();
    const newExec: ExecutionRecord = {
      id: `exec-${Date.now()}`,
      workflowId: wf.id,
      workflowName: wf.name,
      status: "SUCCESS",
      timestamp: now,
      durationMs: Math.floor(Math.random() * 30) + 15,
      logs: [
        `Manual trigger initiated for '${wf.name}'`,
        ...wf.actions.map((a) => `Action '${a.label}' executed successfully`),
      ],
    };

    set({
      workflows: state.workflows.map((w) =>
        w.id === id ? { ...w, runCount: w.runCount + 1, lastRunAt: now } : w
      ),
      executionHistory: [newExec, ...state.executionHistory],
    });
  },

  createWorkflow: (data) => {
    const newWf: Workflow = {
      ...data,
      id: `wf-${Date.now()}`,
      runCount: 0,
    };
    set((state) => ({
      workflows: [newWf, ...state.workflows],
      activeWorkflowId: newWf.id,
    }));
  },

  deleteWorkflow: (id) => {
    set((state) => ({
      workflows: state.workflows.filter((w) => w.id !== id),
      activeWorkflowId: state.activeWorkflowId === id ? null : state.activeWorkflowId,
    }));
  },

  generateAIWorkflow: (naturalPrompt) => {
    const newWf: Workflow = {
      id: `wf-ai-${Date.now()}`,
      name: `AI: ${naturalPrompt.slice(0, 30)}...`,
      description: `Generated via AI Workflow Engine: "${naturalPrompt}"`,
      enabled: true,
      trigger: {
        eventType: "MISSION_COMPLETED",
        label: "Mission Completed Event",
      },
      conditions: [
        { field: "priority", operator: "equals", value: "High" },
      ],
      actions: [
        { actionType: "CREATE_MISSION", label: "Create Tactical Directive", params: { prompt: naturalPrompt } },
        { actionType: "CREATE_NOTE", label: "Generate Summary Note", params: { vault: "Knowledge" } },
      ],
      runCount: 0,
    };
    set((state) => ({
      workflows: [newWf, ...state.workflows],
      activeWorkflowId: newWf.id,
    }));
  },
}));
