import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bot,
  Brain,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import { ICON_SIZES, TitanBadge } from "@/components/ui";
import { fadeUp } from "@/animations/motion";
import { useAICommander } from "@/hooks/useAICommander";

export default function AITacticalBrief() {
  const {
    greeting,
    telemetry,
    prioritizedSteps,
    focusScore,
    forecast,
    recommendations,
  } = useAICommander();

  // SVG Circular Ring Offset for Focus Score (0 - 100)
  const strokeDashoffset = 440 - (440 * focusScore.score) / 100;

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden rounded-[2rem] border border-zinc-800/80 bg-gradient-to-b from-[#09090b] via-[#0d0d10] to-[#08080a] p-6 sm:p-7 lg:p-8 shadow-2xl shadow-black/90 backdrop-blur-2xl font-mono text-zinc-100 space-y-6"
    >
      {/* Soft Ambient Glows */}
      <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#d4af37]/[0.04] blur-[140px]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#d4af37] via-[#e5c158]/50 to-[#d4af37]" />

      {/* PART 1: EXECUTIVE BRIEFING CARD HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="flex size-10 items-center justify-center rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#e5c158] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Bot size={ICON_SIZES.md} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black uppercase tracking-[0.2em] text-[#e5c158] sm:text-xl font-sans">
                AI COMMANDER // EXECUTIVE BRIEFING
              </h2>
              <span className="size-2 rounded-full bg-[#e5c158] animate-pulse" />
            </div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-bold">
              WAYNE OS MODULAR INTELLIGENCE ENGINE
            </p>
          </div>
        </div>

        <TitanBadge variant="gold" size="sm">
          LOCAL ENGINE // LLM READY
        </TitanBadge>
      </div>

      {/* PART 2: OPERATOR BRIEFING BANNER */}
      <div className="rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-5.5 space-y-3">
        <h3 className="text-xl font-bold text-white sm:text-2xl font-sans">{greeting}</h3>
        <p className="text-sm text-zinc-300 font-sans leading-relaxed">
          Daily intelligence analysis complete. You have{" "}
          <span className="font-bold text-[#e5c158]">{telemetry.activeCount} active missions</span>{" "}
          ({telemetry.criticalCount} CRITICAL) totaling{" "}
          <span className="font-bold text-white">
            {(telemetry.estimatedWorkloadMins / 60).toFixed(1)} hours
          </span>{" "}
          of workload.
        </p>

        {/* Telemetry Strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs font-mono pt-1">
          <div className="rounded-xl border border-zinc-800/80 bg-[#070709] p-3 text-center">
            <span className="block text-xs text-zinc-500 uppercase font-bold tracking-wider">Recommended Start</span>
            <span className="mt-1 block font-bold text-zinc-200">{telemetry.recommendedStartTime}</span>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-[#070709] p-3 text-center">
            <span className="block text-xs text-zinc-500 uppercase font-bold tracking-wider">Est. Finish Time</span>
            <span className="mt-1 block font-bold text-[#e5c158]">{telemetry.estimatedFinishTime}</span>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-[#070709] p-3 text-center">
            <span className="block text-xs text-zinc-500 uppercase font-bold tracking-wider">Tactical Breaks</span>
            <span className="mt-1 block font-bold text-sky-400">{telemetry.recommendedBreakCount} Sessions</span>
          </div>

          <div className="rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-3 text-center">
            <span className="block text-xs text-[#e5c158] uppercase font-bold tracking-wider">Probability</span>
            <span className="mt-1 block font-extrabold text-emerald-400">{telemetry.completionProbability}%</span>
          </div>
        </div>
      </div>

      {/* PART 4: WORKLOAD ANALYSIS & WARNING ALERTS */}
      {telemetry.warnings.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-400">
            WORKLOAD WARNING ALERTS
          </p>
          <div className="space-y-2">
            {telemetry.warnings.map((w) => (
              <div
                key={w.id}
                className="flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-xs font-mono"
              >
                <AlertTriangle className="size-4 shrink-0 text-red-400 mt-0.5" />
                <div>
                  <span className="font-bold text-red-300 uppercase tracking-wider">{w.title}:</span>{" "}
                  <span className="text-zinc-300 font-sans">{w.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PART 3 & PART 6: SMART PRIORITIZATION & FOCUS SCORE ENGINE GRID */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* PART 3: SMART PRIORITIZATION SEQUENCE (7 Cols on LG) */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-5.5 space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-[#e5c158]" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
                SMART EXECUTION SEQUENCE
              </span>
            </div>
            <TitanBadge variant="gold" size="sm">
              OPTIMIZED ORDER
            </TitanBadge>
          </div>

          {prioritizedSteps.length === 0 ? (
            <p className="text-xs text-zinc-500 italic">No active missions scheduled for sequence evaluation.</p>
          ) : (
            <div className="space-y-3 text-xs">
              {prioritizedSteps.map((step) => (
                <div
                  key={step.step}
                  className="group rounded-xl border border-zinc-800/70 bg-[#070709] p-3.5 space-y-2 transition duration-300 hover:border-[#d4af37]/40"
                >
                  <div className="flex items-center justify-between font-mono">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-6 items-center justify-center rounded-lg bg-[#d4af37]/15 font-bold text-[#e5c158]">
                        #{step.step}
                      </span>
                      <TitanBadge variant={step.habit.priority === "High" ? "red" : "gold"} size="sm">
                        {step.habit.priority.toUpperCase()}
                      </TitanBadge>
                      <span className="text-zinc-400 font-medium">{step.durationStr}</span>
                    </div>
                    <span className="font-bold text-[#e5c158]">+{step.xpYield} XP</span>
                  </div>

                  <h4 className="font-sans font-bold text-sm text-zinc-100">{step.title}</h4>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed border-l-2 border-[#d4af37]/40 pl-2.5 italic">
                    WHY: {step.reasoning}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PART 6: FOCUS SCORE CIRCULAR INDICATOR (5 Cols on LG) */}
        <div className="flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-5.5 lg:col-span-5 text-center space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Brain className="size-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                FOCUS SCORE ENGINE
              </span>
            </div>
            <TitanBadge variant="green" size="sm">
              {focusScore.rating}
            </TitanBadge>
          </div>

          {/* SVG Circular Ring */}
          <div className="relative mx-auto flex size-44 items-center justify-center">
            <svg className="size-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" className="stroke-zinc-900" strokeWidth="10" fill="none" />
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-emerald-400 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                strokeWidth="10"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-white">{focusScore.score}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                / 100 SCORE
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-300 font-sans leading-relaxed px-2">
            {focusScore.explanation}
          </p>
        </div>
      </div>

      {/* PART 5: ACTIONABLE AI RECOMMENDATIONS WITH REASONING */}
      <div className="rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-5.5 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-[#e5c158]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
              ACTIONABLE AI RECOMMENDATIONS
            </span>
          </div>
          <TitanBadge variant="gold" size="sm">
            STRATEGIC DIRECTIVES
          </TitanBadge>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-3 text-xs">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="rounded-xl border border-zinc-800/70 bg-[#070709] p-4 space-y-2 font-mono transition duration-300 hover:border-[#d4af37]/40"
            >
              <div className="flex items-center justify-between">
                <TitanBadge variant={rec.impact === "CRITICAL" ? "red" : "gold"} size="sm">
                  {rec.impact} IMPACT
                </TitanBadge>
                <span className="text-xs text-zinc-400 font-bold">{rec.category}</span>
              </div>
              <h4 className="font-sans font-bold text-sm text-zinc-100">{rec.title}</h4>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">{rec.actionText}</p>
              <p className="text-xs text-zinc-500 font-sans border-t border-zinc-800/60 pt-2 italic">
                Reasoning: {rec.reasoning}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* PART 7: PRODUCTIVITY FORECAST */}
      <div className="rounded-2xl border border-[#d4af37]/30 bg-gradient-to-r from-[#d4af37]/10 via-[#d4af37]/5 to-transparent p-5 font-mono space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-[#e5c158]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
              PRODUCTIVITY FORECAST
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-400">{forecast.confidenceLevel}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
          <div className="rounded-xl border border-zinc-800 bg-[#09090b] p-3 text-center">
            <span className="block text-xs text-zinc-500 uppercase font-bold tracking-wider">Completion Rate</span>
            <span className="mt-1 block font-bold text-emerald-400">{forecast.completionRateForecast}%</span>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-[#09090b] p-3 text-center">
            <span className="block text-xs text-zinc-500 uppercase font-bold tracking-wider">Expected XP</span>
            <span className="mt-1 block font-bold text-[#e5c158]">+{forecast.expectedXP} XP</span>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-[#09090b] p-3 text-center">
            <span className="block text-xs text-zinc-500 uppercase font-bold tracking-wider">Expected Coins</span>
            <span className="mt-1 block font-bold text-zinc-200">🪙 +{forecast.expectedCoins}</span>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-[#09090b] p-3 text-center">
            <span className="block text-xs text-zinc-500 uppercase font-bold tracking-wider">Likely Finish</span>
            <span className="mt-1 block font-bold text-sky-400">{forecast.likelyFinishTime}</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
