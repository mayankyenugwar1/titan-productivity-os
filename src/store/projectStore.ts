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

interface ProjectStoreState {
  goals: Goal[];
  projects: Project[];
  activeView: ProjectViewMode;
  searchQuery: string;
  categoryFilter: string;

  setActiveView: (view: ProjectViewMode) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;

  createGoal: (goal: Omit<Goal, "id">) => void;
  createProject: (project: Omit<Project, "id" | "milestones">) => void;
  updateProjectStatus: (id: string, status: ProjectStatus) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;
}

export const useProjectStore = create<ProjectStoreState>((set) => ({
  goals: getInitialGoals(),
  projects: getInitialProjects(),
  activeView: "kanban",
  searchQuery: "",
  categoryFilter: "All",

  setActiveView: (view) => set({ activeView: view }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),

  createGoal: (goalInput) => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      ...goalInput,
    };
    set((state) => ({ goals: [newGoal, ...state.goals] }));
  },

  createProject: (projectInput) => {
    const projId = `proj-${Date.now()}`;
    const today = safeDateKey(new Date());
    const newProject: Project = {
      id: projId,
      milestones: [
        { id: `m1-${Date.now()}`, projectId: projId, title: "Initial Specs", completed: false, dueDate: today, xpReward: 50 },
        { id: `m2-${Date.now()}`, projectId: projId, title: "Implementation Gate", completed: false, dueDate: today, xpReward: 100 },
      ],
      ...projectInput,
    };
    set((state) => ({ projects: [newProject, ...state.projects] }));
  },

  updateProjectStatus: (id, status) => {
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, status } : p)),
    }));
  },

  toggleMilestone: (projectId, milestoneId) => {
    set((state) => ({
      projects: state.projects.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          milestones: p.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          ),
        };
      }),
    }));
  },
}));
