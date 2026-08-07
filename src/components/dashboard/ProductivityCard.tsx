import { Gauge } from "lucide-react";
import type { ProductivityTelemetry } from "@/services/commandCenter/dashboardService";
import { TitanProgress } from "@/components/ui";
import WidgetContainer from "./WidgetContainer";

interface ProductivityCardProps {
  telemetry?: ProductivityTelemetry | null;
}

export default function ProductivityCard({ telemetry }: ProductivityCardProps) {
  const safeTelemetry = telemetry || {
    score: 100,
    velocity: 100,
    consistencyPercent: 100,
    explanation: "No active operations assigned; systems nominal.",
  };

  return (
    <WidgetContainer title="PRODUCTIVITY SCORE & VELOCITY" badge="INDEX" icon={Gauge}>
      <div className="space-y-4 text-xs font-mono">
        <div className="flex items-center justify-between">
          <span className="text-zinc-400 font-bold">Productivity Index</span>
          <span className="text-2xl font-black text-[#e5c158]">{safeTelemetry.score ?? 0} / 100</span>
        </div>

        <TitanProgress value={safeTelemetry.score ?? 0} />

        <div className="space-y-2 border-t border-zinc-800/60 pt-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Execution Velocity</span>
            <span className="font-bold text-white">{safeTelemetry.velocity ?? 0}%</span>
          </div>
          <div className="flex items-center justify-between text-zinc-400">
            <span>Consistency Rating</span>
            <span className="font-bold text-emerald-400">{safeTelemetry.consistencyPercent ?? 0}%</span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 font-sans italic border-l-2 border-[#d4af37]/40 pl-3 leading-relaxed">
          {safeTelemetry.explanation || "System telemetry operational."}
        </p>
      </div>
    </WidgetContainer>
  );
}
