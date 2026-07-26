import { useMemo } from "react";
import { useAutomationStore } from "@/store/automationStore";

export function useAutomation() {
  const {
    workflows,
    executionHistory,
    activeWorkflowId,
    searchQuery,
    activeFilter,
    setActiveWorkflowId,
    setSearchQuery,
    setActiveFilter,
    toggleWorkflow,
    runWorkflowManually,
    createWorkflow,
    deleteWorkflow,
  } = useAutomationStore();

  const activeWorkflow = useMemo(() => {
    return workflows.find((w) => w.id === activeWorkflowId) || workflows[0] || null;
  }, [workflows, activeWorkflowId]);

  const filteredWorkflows = useMemo(() => {
    return workflows.filter((w) => {
      if (activeFilter === "ACTIVE" && !w.enabled) return false;
      if (activeFilter === "INACTIVE" && w.enabled) return false;
      if (
        searchQuery.trim() &&
        !w.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !w.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [workflows, activeFilter, searchQuery]);

  return {
    workflows: filteredWorkflows,
    allWorkflows: workflows,
    executionHistory,
    activeWorkflow,
    activeWorkflowId,
    searchQuery,
    activeFilter,
    setActiveWorkflowId,
    setSearchQuery,
    setActiveFilter,
    toggleWorkflow,
    runWorkflowManually,
    createWorkflow,
    deleteWorkflow,
  };
}
