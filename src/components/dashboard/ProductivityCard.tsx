import { Gauge } from "lucide-react";
import type { ProductivityTelemetry } from "@/services/commandCenter/dashboardService";
import { TitanProgress } from "@/components/ui";
import WidgetContainer from "./WidgetContainer";

interface ProductivityCardProps {
  telemetry: ProductivityTelemetry;
}

export default function ProductivityCard({ telemetry }: ProductivityCardProps) {
  return (
    <WidgetContainer title="PRODUCTIVITY SCORE & VELOCITY" badge="INDEX" icon={Gauge}>
      <div className="space-y-4 text-xs font-mono">
        <div className="flex items-center justify-between">
          <span className="text-zinc-400 font-bold">Productivity Index</span>
          <span className="text-2xl font-black text-[#e5c158]">{telemetry.score} / 100</span>
        </div>

        <TitanProgress value={telemetry.score} />

        <div className="space-y-2 border-t border-zinc-800/60 pt-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Execution Velocity</span>
            <span className="font-bold text-white">{telemetry.velocity}%</span>
          </div>
          <div className="flex items-center justify-between text-zinc-400">
            <span>Consistency Rating</span>
            <span className="font-bold text-emerald-400">{telemetry.consistencyPercent}%</span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 font-sans italic border-l-2 border-[#d4af37]/40 pl-3 leading-relaxed">
          {telemetry.explanation}
        </p>
      </div>
    </WidgetContainer>
  );
}
