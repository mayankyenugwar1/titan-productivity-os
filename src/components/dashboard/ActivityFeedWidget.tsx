import { Activity } from "lucide-react";
import WidgetContainer from "./WidgetContainer";

interface ActivityFeedWidgetProps {
  activities: { id: string; text: string; time: string; type: string }[];
}

export default function ActivityFeedWidget({ activities }: ActivityFeedWidgetProps) {
  return (
    <WidgetContainer title="LIVE OPERATIONAL ACTIVITY FEED" badge="LIVE FEED" icon={Activity}>
      <div className="space-y-3 font-mono text-xs">
        {activities.map((act) => (
          <div key={act.id} className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-[#0c0c0f] p-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#e5c158]" />
              <span className="font-sans font-bold text-zinc-200">{act.text}</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">{act.time}</span>
          </div>
        ))}
      </div>
    </WidgetContainer>
  );
}
