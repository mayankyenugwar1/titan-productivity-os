import { create } from "zustand";
import { getInitialWorkflows, type ExecutionRecord, type Workflow } from "@/services/automation/workflowService";
import { safeISOString } from "@/utils/safeDate";

export type { ExecutionRecord, Workflow };
export type AutomationWorkflow = Workflow;

function getStorageKey(userId?: string): string {
  const safeId = userId && typeof userId === "string" && userId.trim() ? userId.trim() : "local_user";
  return `titan_automations_v1_${safeId}`;
}

function getStoredWorkflows(userId?: string): Workflow[] {
  try {
    const key = getStorageKey(userId);
    const raw = localStorage.getItem(key);
    if (!raw) return getInitialWorkflows();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : getInitialWorkflows();
  } catch {
    return getInitialWorkflows();
  }
}

function setStoredWorkflows(userId: string | undefined, workflows: Workflow[]): void {
  try {
    const key = getStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(workflows));
  } catch (err) {
    console.warn("localStorage automations set error:", err);
  }
}

interface AutomationStoreState {
  workflows: Workflow[];
  executionHistory: ExecutionRecord[];
  activeWorkflowId: string | null;
  searchQuery: string;
  activeFilter: string;
  loading: boolean;
  currentUserId: string;

  setActiveWorkflowId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: string) => void;

  loadAutomations: (userId?: string) => void;
  toggleWorkflow: (idOrUserId: string, idInput?: string) => void;
  runWorkflowManually: (idOrUserId: string, idInput?: string) => void;
  createWorkflow: (dataOrUserId: string | Omit<Workflow, "id" | "runCount">, dataInput?: Omit<Workflow, "id" | "runCount">) => void;
  deleteWorkflow: (idOrUserId: string, idInput?: string) => void;
  generateAIWorkflow: (promptOrUserId: string, promptInput?: string) => void;
}

export const useAutomationStore = create<AutomationStoreState>((set, get) => ({
  workflows: getInitialWorkflows(),
  executionHistory: [
    {
      id: "exec-1",
      workflowId: "wf-1",
      workflowName: "Morning Focus Protocol",
      status: "SUCCESS",
      timestamp: safeISOString(new Date(Date.now() - 3600000 * 2)),
      durationMs: 42,
      logs: ["Trigger 'SCHEDULED_TICK' matched", "Condition 'time == 08:00' evaluated TRUE", "Action 'CREATE_MISSION' executed (+50 XP)"],
    },
    {
      id: "exec-2",
      workflowId: "wf-2",
      workflowName: "Streak Preservation Alert & Journal Auto-Entry",
      status: "SUCCESS",
      timestamp: safeISOString(new Date(Date.now() - 3600000 * 6)),
      durationMs: 35,
      logs: ["Trigger 'MISSION_COMPLETED' matched", "Action 'CREATE_NOTE' executed in Knowledge Vault"],
    },
  ],
  activeWorkflowId: "wf-1",
  searchQuery: "",
  activeFilter: "ALL",
  loading: false,
  currentUserId: "local_user",

  setActiveWorkflowId: (id) => set({ activeWorkflowId: id }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveFilter: (activeFilter) => set({ activeFilter }),

  loadAutomations: (userId = "local_user") => {
    set({ loading: true, currentUserId: userId });
    const workflows = getStoredWorkflows(userId);
    set({ workflows, loading: false });
  },

  toggleWorkflow: (idOrUserId, idInput) => {
    let uid = get().currentUserId;
    let targetId: string;
    if (idInput !== undefined) {
      uid = idOrUserId;
      targetId = idInput;
    } else {
      targetId = idOrUserId;
    }

    set((state) => {
      const nextWorkflows = state.workflows.map((w) => (w.id === targetId ? { ...w, enabled: !w.enabled } : w));
      setStoredWorkflows(uid, nextWorkflows);
      return { workflows: nextWorkflows };
    });
  },

  runWorkflowManually: (idOrUserId, idInput) => {
    let uid = get().currentUserId;
    let targetId: string;
    if (idInput !== undefined) {
      uid = idOrUserId;
      targetId = idInput;
    } else {
      targetId = idOrUserId;
    }

    const state = get();
    const wf = state.workflows.find((w) => w.id === targetId);
    if (!wf) return;

    const now = safeISOString(new Date());
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

    set((state) => {
      const nextWorkflows = state.workflows.map((w) =>
        w.id === targetId ? { ...w, runCount: w.runCount + 1, lastRunAt: now } : w
      );
      setStoredWorkflows(uid, nextWorkflows);
      return {
        workflows: nextWorkflows,
        executionHistory: [newExec, ...state.executionHistory],
      };
    });
  },

  createWorkflow: (dataOrUserId, dataInput) => {
    let uid = get().currentUserId;
    let payload: Omit<Workflow, "id" | "runCount">;
    if (typeof dataOrUserId === "string" && dataInput) {
      uid = dataOrUserId;
      payload = dataInput;
    } else {
      payload = dataOrUserId as Omit<Workflow, "id" | "runCount">;
    }

    const newWf: Workflow = {
      ...payload,
      id: `wf-${Date.now()}`,
      runCount: 0,
    };
    set((state) => {
      const nextWorkflows = [newWf, ...state.workflows];
      setStoredWorkflows(uid, nextWorkflows);
      return {
        workflows: nextWorkflows,
        activeWorkflowId: newWf.id,
      };
    });
  },

  deleteWorkflow: (idOrUserId, idInput) => {
    let uid = get().currentUserId;
    let targetId: string;
    if (idInput !== undefined) {
      uid = idOrUserId;
      targetId = idInput;
    } else {
      targetId = idOrUserId;
    }

    set((state) => {
      const nextWorkflows = state.workflows.filter((w) => w.id !== targetId);
      setStoredWorkflows(uid, nextWorkflows);
      return {
        workflows: nextWorkflows,
        activeWorkflowId: state.activeWorkflowId === targetId ? null : state.activeWorkflowId,
      };
    });
  },

  generateAIWorkflow: (promptOrUserId, promptInput) => {
    let uid = get().currentUserId;
    let prompt: string;
    if (promptInput !== undefined) {
      uid = promptOrUserId;
      prompt = promptInput;
    } else {
      prompt = promptOrUserId;
    }

    const newWf: Workflow = {
      id: `wf-ai-${Date.now()}`,
      name: `AI: ${prompt.slice(0, 30)}...`,
      description: `Generated via AI Workflow Engine: "${prompt}"`,
      enabled: true,
      trigger: {
        eventType: "MISSION_COMPLETED",
        label: "Mission Completed Event",
      },
      conditions: [
        { field: "priority", operator: "equals", value: "High" },
      ],
      actions: [
        { actionType: "CREATE_MISSION", label: "Create Tactical Directive", params: { prompt } },
        { actionType: "CREATE_NOTE", label: "Generate Summary Note", params: { vault: "Knowledge" } },
      ],
      runCount: 0,
    };
    set((state) => {
      const nextWorkflows = [newWf, ...state.workflows];
      setStoredWorkflows(uid, nextWorkflows);
      return {
        workflows: nextWorkflows,
        activeWorkflowId: newWf.id,
      };
    });
  },
}));
