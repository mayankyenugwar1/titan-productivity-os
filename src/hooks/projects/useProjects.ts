import { useMemo } from "react";
import { useProjectStore } from "@/store/projectStore";

export function useProjects() {
  const {
    goals,
    projects,
    activeView,
    searchQuery,
    categoryFilter,
    setActiveView,
    setSearchQuery,
    setCategoryFilter,
    createGoal,
    createProject,
    updateProjectStatus,
    toggleMilestone,
  } = useProjectStore();

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (categoryFilter !== "ALL" && p.category !== categoryFilter) return false;
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
    setActiveView,
    setSearchQuery,
    setCategoryFilter,
    createGoal,
    createProject,
    updateProjectStatus,
    toggleMilestone,
  };
}
