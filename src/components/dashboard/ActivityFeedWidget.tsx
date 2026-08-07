import { Activity } from "lucide-react";
import WidgetContainer from "./WidgetContainer";
import { safeTime } from "@/utils/safeDate";

interface ActivityFeedWidgetProps {
  activities?: { id: string; text: string; time: string; type: string }[] | null;
}

export default function ActivityFeedWidget({ activities }: ActivityFeedWidgetProps) {
  const safeActivities = Array.isArray(activities) ? activities : [];

  return (
    <WidgetContainer title="LIVE OPERATIONAL ACTIVITY FEED" badge="LIVE FEED" icon={Activity}>
      <div className="space-y-3 font-mono text-xs">
        {safeActivities.length === 0 ? (
          <div className="rounded-xl border border-zinc-800/60 bg-[#0c0c0f] p-4 text-center text-zinc-500 font-sans">
            No recent operational activity logged.
          </div>
        ) : (
          safeActivities.map((act) => {
            const displayTime = safeTime(act.time, { hour: "2-digit", minute: "2-digit" }, act.time || "—");
            return (
              <div key={act.id} className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-[#0c0c0f] p-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#e5c158]" />
                  <span className="font-sans font-bold text-zinc-200">{act.text || "Operational Event"}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">{displayTime}</span>
              </div>
            );
          })
        )}
      </div>
    </WidgetContainer>
  );
}
