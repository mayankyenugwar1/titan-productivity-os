import { create } from "zustand";
import { safeDateKey } from "@/utils/safeDate";
import {
  getInitialGoals,
  getInitialProjects,
  type Goal,
  type Project,
  type ProjectStatus,
} from "@/services/projects/projectService";

export type { Goal, Project, ProjectStatus };
export type ProjectViewMode = "kanban" | "timeline" | "roadmap" | "goals";

function getStorageKeys(userId?: string) {
  const safeId = userId && typeof userId === "string" && userId.trim() ? userId.trim() : "local_user";
  return {
    projectsKey: `titan_projects_v1_${safeId}`,
    goalsKey: `titan_goals_v1_${safeId}`,
  };
}

function getStoredProjects(userId?: string): Project[] {
  try {
    const { projectsKey } = getStorageKeys(userId);
    const raw = localStorage.getItem(projectsKey);
    if (!raw) return getInitialProjects();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : getInitialProjects();
  } catch {
    return getInitialProjects();
  }
}

function setStoredProjects(userId: string | undefined, projects: Project[]): void {
  try {
    const { projectsKey } = getStorageKeys(userId);
    localStorage.setItem(projectsKey, JSON.stringify(projects));
  } catch (err) {
    console.warn("localStorage projects set error:", err);
  }
}

function getStoredGoals(userId?: string): Goal[] {
  try {
    const { goalsKey } = getStorageKeys(userId);
    const raw = localStorage.getItem(goalsKey);
    if (!raw) return getInitialGoals();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : getInitialGoals();
  } catch {
    return getInitialGoals();
  }
}

function setStoredGoals(userId: string | undefined, goals: Goal[]): void {
  try {
    const { goalsKey } = getStorageKeys(userId);
    localStorage.setItem(goalsKey, JSON.stringify(goals));
  } catch (err) {
    console.warn("localStorage goals set error:", err);
  }
}

interface ProjectStoreState {
  goals: Goal[];
  projects: Project[];
  activeView: ProjectViewMode;
  searchQuery: string;
  categoryFilter: string;
  loading: boolean;
  currentUserId: string;

  setActiveView: (view: ProjectViewMode) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;

  loadProjects: (userId?: string) => void;
  createGoal: (goalOrUserId: string | Omit<Goal, "id">, goalInput?: Omit<Goal, "id">) => void;
  createProject: (projOrUserId: string | Omit<Project, "id" | "milestones">, projInput?: Omit<Project, "id" | "milestones">) => void;
  updateProjectStatus: (idOrUserId: string, statusOrId: string | ProjectStatus, statusInput?: ProjectStatus) => void;
  toggleMilestone: (projectIdOrUserId: string, milestoneIdOrProjId: string, milestoneIdInput?: string) => void;
  deleteProject: (idOrUserId: string, idInput?: string) => void;
}

export const useProjectStore = create<ProjectStoreState>((set, get) => ({
  goals: getInitialGoals(),
  projects: getInitialProjects(),
  activeView: "kanban",
  searchQuery: "",
  categoryFilter: "All",
  loading: false,
  currentUserId: "local_user",

  setActiveView: (view) => set({ activeView: view }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),

  loadProjects: (userId = "local_user") => {
    set({ loading: true, currentUserId: userId });
    const projects = getStoredProjects(userId);
    const goals = getStoredGoals(userId);
    set({ projects, goals, loading: false });
  },

  createGoal: (goalOrUserId, goalInput) => {
    let uid = get().currentUserId;
    let payload: Omit<Goal, "id">;
    if (typeof goalOrUserId === "string" && goalInput) {
      uid = goalOrUserId;
      payload = goalInput;
    } else {
      payload = goalOrUserId as Omit<Goal, "id">;
    }

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      ...payload,
    };
    set((state) => {
      const nextGoals = [newGoal, ...state.goals];
      setStoredGoals(uid, nextGoals);
      return { goals: nextGoals };
    });
  },

  createProject: (projOrUserId, projInput) => {
    let uid = get().currentUserId;
    let payload: Omit<Project, "id" | "milestones">;
    if (typeof projOrUserId === "string" && projInput) {
      uid = projOrUserId;
      payload = projInput;
    } else {
      payload = projOrUserId as Omit<Project, "id" | "milestones">;
    }

    const projId = `proj-${Date.now()}`;
    const today = safeDateKey(new Date());
    const newProject: Project = {
      id: projId,
      milestones: [
        { id: `m1-${Date.now()}`, projectId: projId, title: "Initial Specs", completed: false, dueDate: today, xpReward: 50 },
        { id: `m2-${Date.now()}`, projectId: projId, title: "Implementation Gate", completed: false, dueDate: today, xpReward: 100 },
      ],
      ...payload,
    };
    set((state) => {
      const nextProjects = [newProject, ...state.projects];
      setStoredProjects(uid, nextProjects);
      return { projects: nextProjects };
    });
  },

  updateProjectStatus: (idOrUserId, statusOrId, statusInput) => {
    let uid = get().currentUserId;
    let targetId: string;
    let nextStatus: ProjectStatus;

    if (statusInput !== undefined) {
      uid = idOrUserId;
      targetId = statusOrId as string;
      nextStatus = statusInput;
    } else {
      targetId = idOrUserId;
      nextStatus = statusOrId as ProjectStatus;
    }

    set((state) => {
      const nextProjects = state.projects.map((p) => (p.id === targetId ? { ...p, status: nextStatus } : p));
      setStoredProjects(uid, nextProjects);
      return { projects: nextProjects };
    });
  },

  toggleMilestone: (projectIdOrUserId, milestoneIdOrProjId, milestoneIdInput) => {
    let uid = get().currentUserId;
    let targetProjId: string;
    let targetMilestoneId: string;

    if (milestoneIdInput !== undefined) {
      uid = projectIdOrUserId;
      targetProjId = milestoneIdOrProjId;
      targetMilestoneId = milestoneIdInput;
    } else {
      targetProjId = projectIdOrUserId;
      targetMilestoneId = milestoneIdOrProjId;
    }

    set((state) => {
      const nextProjects = state.projects.map((p) => {
        if (p.id !== targetProjId) return p;
        return {
          ...p,
          milestones: p.milestones.map((m) =>
            m.id === targetMilestoneId ? { ...m, completed: !m.completed } : m
          ),
        };
      });
      setStoredProjects(uid, nextProjects);
      return { projects: nextProjects };
    });
  },

  deleteProject: (idOrUserId, idInput) => {
    let uid = get().currentUserId;
    let targetId: string;

    if (idInput !== undefined) {
      uid = idOrUserId;
      targetId = idInput;
    } else {
      targetId = idOrUserId;
    }

    set((state) => {
      const nextProjects = state.projects.filter((p) => p.id !== targetId);
      setStoredProjects(uid, nextProjects);
      return { projects: nextProjects };
    });
  },
}));
