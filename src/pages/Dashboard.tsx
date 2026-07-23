import HeroBanner from "@/components/dashboard/HeroBanner";
import KPIGrid from "@/components/dashboard/KPIGrid";
import HabitList from "@/features/habits/components/HabitList";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import TodaysMission from "@/components/dashboard/TodaysMission";
import AICoach from "@/components/dashboard/AICoach";
import Analytics from "@/components/dashboard/Analytics";
import HabitHeatmap from "@/components/dashboard/HabitHeatmap";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <HeroBanner />

      <KPIGrid />

      <HabitList />

      <div className="grid gap-8 lg:grid-cols-2">
        <DashboardHeader />
        <TodaysMission />
      </div>

      <StatsCards />

      <Analytics />

      <HabitHeatmap />

      <AICoach />

      <QuickActions />

      <RecentActivity />
    </div>
  );
}