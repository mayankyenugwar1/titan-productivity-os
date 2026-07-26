import { useCallback, useEffect } from "react";
import { useHabitStore } from "@/store/missionStore";
import { useProjectStore } from "@/store/projectStore";
import { useKnowledgeStore } from "@/store/knowledgeStore";
import { useAutomationStore } from "@/store/automationStore";
import { useAuth } from "@/context/AuthContext";
import { useAIStore } from "@/store/aiStore";
import type { ProviderId } from "@/services/ai/providers/AIProvider";

export function useAI() {
  const { user } = useAuth();
  const { habits, totalXP, streak, focusScore } = useHabitStore();
  const { projects, goals } = useProjectStore();
  const { items: notes } = useKnowledgeStore();
  const { workflows } = useAutomationStore();

  const {
    activeProviderId,
    messages,
    loading,
    isThinking,
    lastIntent,
    pendingProposals,
    suggestions,
    setProvider,
    setAPIKey,
    sendMessage,
    confirmProposal,
    rejectProposal,
    updateSuggestions,
    clearMessages,
  } = useAIStore();

  const userId = user?.id || "local_user";

  useEffect(() => {
    updateSuggestions(habits, projects, notes, streak);
  }, [habits, projects, notes, streak, updateSuggestions]);

  const handleSend = useCallback(
    async (prompt: string) => {
      await sendMessage(prompt, habits, projects, goals, notes, workflows, totalXP, streak, focusScore);
    },
    [sendMessage, habits, projects, goals, notes, workflows, totalXP, streak, focusScore]
  );

  const handleConfirmProposal = useCallback(
    async (proposalId: string) => {
      return confirmProposal(proposalId, userId);
    },
    [confirmProposal, userId]
  );

  return {
    activeProviderId,
    messages,
    loading,
    isThinking,
    isStreaming: loading,
    lastIntent,
    pendingProposals,
    proposals: pendingProposals,
    suggestions,
    habits,
    projects,
    streak,
    totalXP,
    setProvider: (id: ProviderId) => setProvider(id),
    setAPIKey: (id: ProviderId, key: string) => setAPIKey(id, key),
    sendMessage: handleSend,
    confirmProposal: handleConfirmProposal,
    rejectProposal,
    clearMessages,
    clearHistory: clearMessages,
  };
}
