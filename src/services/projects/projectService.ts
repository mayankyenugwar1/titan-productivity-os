export type ProjectStatus = "Backlog" | "Planned" | "Active" | "Blocked" | "Review" | "Completed";
export type GoalCategory = "Personal" | "Professional" | "Learning" | "Health" | "Finance" | "Operations";

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  completed: boolean;
  xpReward: number;
}

export interface KeyResult {
  id: string;
  goalId: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority: "High" | "Medium" | "Low";
  targetDate: string;
  keyResults: KeyResult[];
}

export interface Project {
  id: string;
  goalId?: string;
  name: string;
  description: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  color: string;
  milestones: Milestone[];
  tags: string[];
}

export function getInitialGoals(): Goal[] {
  return [
    {
      id: "goal-1",
      title: "TITAN OS Production Deployment",
      description: "Complete all 6 Operating System sprints and deliver production-ready code.",
      category: "Professional",
      priority: "High",
      targetDate: "2026-08-15",
      keyResults: [
        { id: "kr-1", goalId: "goal-1", title: "Complete System Sprints", currentValue: 5, targetValue: 6, unit: "sprints" },
        { id: "kr-2", goalId: "goal-1", title: "Maintain Build Success", currentValue: 100, targetValue: 100, unit: "%" },
      ],
    },
    {
      id: "goal-2",
      title: "Physical Conditioning & Endurance",
      description: "Maintain combat readiness through daily physical training routines.",
      category: "Health",
      priority: "Medium",
      targetDate: "2026-12-31",
      keyResults: [
        { id: "kr-3", goalId: "goal-2", title: "Weekly Workout Directives", currentValue: 4, targetValue: 5, unit: "days/wk" },
      ],
    },
  ];
}

export function getInitialProjects(): Project[] {
  return [
    {
      id: "proj-1",
      goalId: "goal-1",
      name: "Time OS Chrono Engine",
      description: "Build scalable 6-view scheduling matrix with conflict detection.",
      category: "Operations",
      priority: "High",
      status: "Completed",
      startDate: "2026-07-20",
      endDate: "2026-07-25",
      color: "#d4af37",
      tags: ["calendar", "time-os", "react"],
      milestones: [
        { id: "m-1", projectId: "proj-1", title: "Multi-View Grid Engine", dueDate: "2026-07-22", completed: true, xpReward: 200 },
        { id: "m-2", projectId: "proj-1", title: "Conflict Detection Service", dueDate: "2026-07-25", completed: true, xpReward: 150 },
      ],
    },
    {
      id: "proj-2",
      goalId: "goal-1",
      name: "AI OS Core System Architecture",
      description: "Build provider-agnostic central AI orchestrator.",
      category: "Operations",
      priority: "High",
      status: "Completed",
      startDate: "2026-07-25",
      endDate: "2026-07-26",
      color: "#38bdf8",
      tags: ["ai", "ai-core", "providers"],
      milestones: [
        { id: "m-3", projectId: "proj-2", title: "Provider Abstraction Layer", dueDate: "2026-07-25", completed: true, xpReward: 250 },
      ],
    },
    {
      id: "proj-3",
      goalId: "goal-1",
      name: "Project & Goals OS Execution Engine",
      description: "Hierarchical workspaces, Kanban board, roadmaps, and OKRs.",
      category: "Operations",
      priority: "High",
      status: "Active",
      startDate: "2026-07-25",
      endDate: "2026-07-30",
      color: "#a855f7",
      tags: ["projects", "goals", "kanban"],
      milestones: [
        { id: "m-4", projectId: "proj-3", title: "Kanban & Timeline Architecture", dueDate: "2026-07-28", completed: false, xpReward: 300 },
      ],
    },
  ];
}
