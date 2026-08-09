import { useEffect, useMemo } from "react";
import { useProjectStore, type Goal, type Project, type ProjectStatus } from "@/store/projectStore";
import { useAuth } from "@/context/AuthContext";

export function useProjects() {
  const { user } = useAuth();
  const userId = user?.id || "local_user";

  const {
    goals,
    projects,
    activeView,
    searchQuery,
    categoryFilter,
    loading,
    setActiveView,
    setSearchQuery,
    setCategoryFilter,
    loadProjects,
    createGoal: storeCreateGoal,
    createProject: storeCreateProject,
    updateProjectStatus: storeUpdateStatus,
    toggleMilestone: storeToggleMilestone,
    deleteProject: storeDeleteProject,
  } = useProjectStore();

  useEffect(() => {
    loadProjects(userId);
  }, [loadProjects, userId]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (categoryFilter !== "ALL" && categoryFilter !== "All" && p.category !== categoryFilter) return false;
      if (
        searchQuery.trim() &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [projects, categoryFilter, searchQuery]);

  return {
    goals,
    projects: filteredProjects,
    allProjects: projects,
    activeView,
    searchQuery,
    categoryFilter,
    loading,
    setActiveView,
    setSearchQuery,
    setCategoryFilter,
    createGoal: (goal: Omit<Goal, "id">) => storeCreateGoal(userId, goal),
    createProject: (proj: Omit<Project, "id" | "milestones">) => storeCreateProject(userId, proj),
    updateProjectStatus: (id: string, status: ProjectStatus) => storeUpdateStatus(userId, id, status),
    toggleMilestone: (projectId: string, milestoneId: string) => storeToggleMilestone(userId, projectId, milestoneId),
    deleteProject: (id: string) => storeDeleteProject(userId, id),
  };
}
