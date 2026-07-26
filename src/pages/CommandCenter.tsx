import { useDashboard } from "@/hooks/dashboard/useDashboard";
import { SectionHeader } from "@/components/ui";
import MorningBriefing from "@/components/dashboard/MorningBriefing";
import ProductivityCard from "@/components/dashboard/ProductivityCard";
import FocusCard from "@/components/dashboard/FocusCard";
import QuickActions from "@/components/dashboard/QuickActions";
import ActivityFeedWidget from "@/components/dashboard/ActivityFeedWidget";

export default function CommandCenter() {
  const {
    morningBriefing,
    productivityTelemetry,
    focusTelemetry,
    recentActivity,
  } = useDashboard();

  return (
    <div className="space-y-8 py-4 font-mono text-zinc-100">
      <SectionHeader
        badge="Single Screen Operational Headquarters"
        title="TITAN Unified Command Center"
        description="Aggregated intelligence hub connecting Mission OS, Time OS, Knowledge OS, Projects OS, Automation OS, and AI Core."
      />

      {/* Morning Briefing Card */}
      <MorningBriefing briefing={morningBriefing} />

      {/* Quick Actions Shortcuts */}
      <QuickActions />

      {/* Main Grid: Telemetry & Activity Feed */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <ProductivityCard telemetry={productivityTelemetry} />
          <FocusCard telemetry={focusTelemetry} />
        </div>

        <div className="space-y-6">
          <ActivityFeedWidget activities={recentActivity} />
        </div>
      </div>
    </div>
  );
}
