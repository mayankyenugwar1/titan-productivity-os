import { useEffect, useState } from "react";
import CommandCenterHero from "@/components/dashboard/CommandCenterHero";
import AITacticalBrief from "@/components/dashboard/AITacticalBrief";
import MissionTimelineEngine from "@/components/dashboard/MissionTimelineEngine";
import MissionStatisticsBar from "@/components/dashboard/MissionStatisticsBar";
import OperatorInsightsPanel from "@/components/dashboard/OperatorInsightsPanel";
import MissionList from "@/features/missions/components/MissionList";
import KPIGrid from "@/components/dashboard/KPIGrid";
import RecentActivity from "@/components/dashboard/RecentActivity";
import MissionModal from "@/features/missions/components/MissionModal";
import MissionCompletionModal from "@/components/missions/MissionCompletionModal";
import OnboardingModal from "@/components/common/OnboardingModal";
import ErrorBoundary from "@/components/common/ErrorBoundary";

import { useAuth } from "@/context/AuthContext";
import { useHabitStore } from "@/store/missionStore";
import type { Habit, HabitInput } from "@/features/missions/types";

export default function Dashboard() {
  const { user } = useAuth();
  const {
    habits,
    totalXP,
    streak,
    focusScore,
    loading,
    loadHabits,
    addHabit,
    toggleHabit,
    updateHabit,
    deleteHabit,
    subscribeRealtime,
    unsubscribeRealtime,
  } = useHabitStore();

  const [openModal, setOpenModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  useEffect(() => {
    if (user) {
      void loadHabits(user.id);
      subscribeRealtime(user.id);
    }
    const hasSeenOnboarding = localStorage.getItem("titan_onboarding_seen");
    if (!hasSeenOnboarding) {
      setOnboardingOpen(true);
    }
    return () => {
      unsubscribeRealtime();
    };
  }, [loadHabits, subscribeRealtime, unsubscribeRealtime, user]);

  const handleCloseOnboarding = () => {
    localStorage.setItem("titan_onboarding_seen", "true");
    setOnboardingOpen(false);
  };

  const handleSubmit = async (input: HabitInput) => {
    if (!user) return false;
    if (editingHabit) {
      return updateHabit(user.id, editingHabit.id, input);
    }
    return addHabit(user.id, input);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingHabit(null);
  };

  const userId = user?.id || "local_user";

  return (
    <ErrorBoundary>
      <div className="space-y-10 pb-12">
        {/* Onboarding Welcome Modal */}
        <OnboardingModal open={onboardingOpen} onClose={handleCloseOnboarding} />

        {/* Section 1 & 2: Command Center Hero & Operator Status */}
        <CommandCenterHero onNewMission={() => setOpenModal(true)} />

        {/* Live Mission Statistics Bar */}
        <MissionStatisticsBar />

        {/* Operator Insights Intelligence Panel */}
        <OperatorInsightsPanel />

        {/* AI Tactical Brief Module */}
        <AITacticalBrief />

        {/* Chronological Mission Timeline & Priority Engine */}
        <MissionTimelineEngine onNewMission={() => setOpenModal(true)} />

        {/* Tactical Mission Control Operations */}
        <MissionList
          habits={habits}
          totalXP={totalXP}
          streak={streak}
          focusScore={focusScore}
          loading={loading}
          onAdd={(input) => addHabit(userId, input)}
          onToggle={(id) => toggleHabit(userId, id)}
          onEdit={(id, input) => updateHabit(userId, id, input)}
          onDelete={(id) => deleteHabit(userId, id)}
        />

        {/* Operator Intelligence Telemetry */}
        <KPIGrid />

        {/* Timeline Recent Activity */}
        <RecentActivity />

        {/* Mission Creation / Editing Modal */}
        <MissionModal
          open={openModal}
          habit={editingHabit}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />

        <MissionCompletionModal />
      </div>
    </ErrorBoundary>
  );
}