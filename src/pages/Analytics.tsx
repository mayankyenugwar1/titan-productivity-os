import { useState } from "react";
import {
  BookOpen,
  Brain,
  Coins,
  Download,
  FileSpreadsheet,
  FileText,
  Flame,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { useHabitStore } from "@/store/missionStore";
import { useAnalytics } from "@/hooks/useAnalytics";
import { exportAnalyticsCSV, exportAnalyticsPDF } from "@/services/analytics/reportService";
import AnalyticsCharts from "@/components/analytics/AnalyticsCharts";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { SectionHeader, TitanBadge, TitanButton, TitanProgress } from "@/components/ui";

export default function Analytics() {
  const { habits, totalXP, streak } = useHabitStore();
  const { metrics, categories, performance, focus, insights } = useAnalytics();

  const [notification, setNotification] = useState<string | null>(null);

  const handleExportCSV = () => {
    exportAnalyticsCSV(habits, totalXP, streak);
    setNotification("CSV Telemetry Report downloaded successfully.");
    setTimeout(() => setNotification(null), 4000);
  };

  const handleExportPDF = () => {
    exportAnalyticsPDF(habits, totalXP, streak);
    setNotification("Operational Dossier Report downloaded successfully.");
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-10 py-4 font-mono text-zinc-100">
      <SectionHeader
        badge="Operator Intelligence Telemetry"
        title="Analytics & Performance Matrix"
        description="Comprehensive analysis of mission velocity, sector XP yields, cognitive focus allocation, and exportable dossier reports."
      />

      {/* Export Notification Toast */}
      {notification && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#d4af37]/40 bg-[#d4af37]/10 p-4 text-xs font-bold text-[#e5c158] shadow-lg shadow-black">
          <Download className="size-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Actions: CSV & PDF Export Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-800/80 bg-[#070709] p-6.5 shadow-2xl shadow-black font-mono">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            EXPORT OPERATIONAL DOSSIER
          </span>
          <h3 className="text-lg font-bold text-white font-sans mt-0.5">
            Download Classified Analytics & Telemetry
          </h3>
        </div>

        <div className="flex flex-wrap gap-3">
          <TitanButton
            size="sm"
            leftIcon={<FileSpreadsheet className="size-4" />}
            onClick={handleExportCSV}
          >
            EXPORT CSV REPORT
          </TitanButton>

          <TitanButton
            size="sm"
            variant="outline"
            leftIcon={<FileText className="size-4" />}
            onClick={handleExportPDF}
          >
            EXPORT DOSSIER REPORT
          </TitanButton>
        </div>
      </div>

      {/* PART 7: OPERATOR PERFORMANCE SCORE & LETTER GRADE BANNER */}
      <div className="rounded-3xl border border-[#d4af37]/40 bg-gradient-to-r from-[#09090b] via-[#0d0d10] to-[#08080a] p-6.5 sm:p-8 shadow-2xl shadow-black font-mono">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            {/* Grade Badge */}
            <div className="flex size-20 shrink-0 items-center justify-center rounded-3xl border border-[#d4af37]/40 bg-[#d4af37]/15 text-4xl font-black text-[#e5c158] shadow-[0_0_30px_rgba(212,175,55,0.25)]">
              {performance.grade}
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <TitanBadge variant="gold" size="sm">
                  GRADE {performance.grade} CLEARANCE
                </TitanBadge>
                <span className="text-xs font-bold text-zinc-400">SCORE: {performance.score} / 100</span>
              </div>
              <h2 className="mt-1 font-sans text-2xl font-black text-white sm:text-3xl">
                Operator Performance Rating
              </h2>
              <p className="mt-1 text-sm text-zinc-300 font-sans leading-relaxed">
                {performance.explanation}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-4 text-center">
            <span className="block text-xs text-zinc-500 uppercase font-bold tracking-wider">System Status</span>
            <span className="text-xl font-extrabold text-emerald-400">OPTIMAL PERFORMANCE</span>
          </div>
        </div>

        {/* Score Progress Bar */}
        <div className="mt-6 space-y-2 border-t border-zinc-800/80 pt-5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-400">Performance Index</span>
            <span className="font-bold text-[#e5c158]">{performance.score}% Efficiency</span>
          </div>
          <TitanProgress value={performance.score} />
        </div>
      </div>

      {/* PART 2: KEY METRICS GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
        <div className="rounded-2xl border border-zinc-800/80 bg-[#070709] p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase tracking-wider font-bold">Total Operations</span>
            <Target className="size-4 text-sky-400" />
          </div>
          <p className="text-3xl font-black text-white">
            <AnimatedNumber value={metrics.completedMissions} /> / <AnimatedNumber value={metrics.totalMissions} />
          </p>
        </div>

        <div className="rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-5 space-y-2">
          <div className="flex items-center justify-between text-[#e5c158]">
            <span className="text-xs uppercase tracking-wider font-bold">Total XP Earned</span>
            <Zap className="size-4" />
          </div>
          <p className="text-3xl font-black text-[#e5c158]">
            +<AnimatedNumber value={metrics.totalXP} /> XP
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-[#070709] p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase tracking-wider font-bold">Coin Yield</span>
            <Coins className="size-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-white">
            🪙 <AnimatedNumber value={metrics.totalCoins} />
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-[#070709] p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase tracking-wider font-bold">Active Combat Streak</span>
            <Flame className="size-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">
            <AnimatedNumber value={metrics.activeStreak} suffix=" Days" />
          </p>
        </div>
      </div>

      {/* PART 3: INTERACTIVE CHARTS SECTION */}
      <AnalyticsCharts />

      {/* PART 4 & PART 5: CATEGORY INSIGHTS & FOCUS ANALYSIS GRID */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* PART 4: CATEGORY SECTOR INSIGHTS (7 Cols on LG) */}
        <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6.5 shadow-2xl shadow-black space-y-5 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5 font-mono">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-[#e5c158]" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
                CATEGORY SECTOR PERFORMANCE
              </span>
            </div>
            <TitanBadge variant="gold" size="sm">
              SECTOR ANALYSIS
            </TitanBadge>
          </div>

          <div className="space-y-3.5 text-xs font-mono">
            {categories.map((cat) => (
              <div
                key={cat.category}
                className="rounded-2xl border border-zinc-800/70 bg-[#0c0c0f] p-4.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-sm text-zinc-100">{cat.category} Sector</span>
                  <span className="font-bold text-[#e5c158]">+{cat.xpYield} XP</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Completion Rate</span>
                    <span className="font-bold text-emerald-400">{cat.completionRate}%</span>
                  </div>
                  <TitanProgress value={cat.completionRate} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PART 5: FOCUS ANALYSIS TELEMETRY (5 Cols on LG) */}
        <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6.5 shadow-2xl shadow-black space-y-5 lg:col-span-5 font-mono">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
            <div className="flex items-center gap-2">
              <Brain className="size-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                COGNITIVE FOCUS ANALYSIS
              </span>
            </div>
            <TitanBadge variant="green" size="sm">
              TELEMETRY
            </TitanBadge>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="rounded-2xl border border-zinc-800/70 bg-[#0c0c0f] p-4 space-y-1">
              <span className="block text-xs text-zinc-500 uppercase font-bold tracking-wider">Average Session Duration</span>
              <p className="text-xl font-bold text-white">{focus.avgFocusMins} Minutes</p>
            </div>

            <div className="rounded-2xl border border-zinc-800/70 bg-[#0c0c0f] p-4 space-y-1">
              <span className="block text-xs text-zinc-500 uppercase font-bold tracking-wider">Longest Focus Session</span>
              <p className="text-xl font-bold text-[#e5c158]">{focus.longestSessionMins} Minutes</p>
            </div>

            <div className="rounded-2xl border border-zinc-800/70 bg-[#0c0c0f] p-4 space-y-1">
              <span className="block text-xs text-zinc-500 uppercase font-bold tracking-wider">Deep Work Allocation</span>
              <p className="text-xl font-bold text-sky-400">{focus.deepWorkHours} Hours</p>
            </div>

            <div className="rounded-2xl border border-zinc-800/70 bg-[#0c0c0f] p-4 space-y-1">
              <span className="block text-xs text-zinc-500 uppercase font-bold tracking-wider">Peak Focus Window</span>
              <p className="text-base font-bold text-emerald-400">{focus.peakHours}</p>
            </div>
          </div>
        </div>
      </div>

      {/* PART 6: LOCAL AI INTELLIGENCE INSIGHTS */}
      <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6.5 sm:p-8 shadow-2xl shadow-black space-y-5 font-mono">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex size-9 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#e5c158]">
              <Sparkles className="size-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
                WAYNE CORE INSIGHT ENGINE
              </span>
              <h3 className="text-lg font-bold text-zinc-100 font-sans">
                Automated Intelligence Insights ({insights.length} Telemetry Directives)
              </h3>
            </div>
          </div>

          <TitanBadge variant="gold" size="sm">
            AI INSIGHTS
          </TitanBadge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 text-xs">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className="rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-4.5 space-y-2 transition duration-300 hover:border-[#d4af37]/40"
            >
              <div className="flex items-center justify-between">
                <TitanBadge variant={ins.impact === "CRITICAL" ? "red" : "gold"} size="sm">
                  {ins.category}
                </TitanBadge>
                <span className="text-xs font-bold text-[#e5c158]">{ins.impact}</span>
              </div>

              <h4 className="font-sans font-bold text-sm text-zinc-100">{ins.title}</h4>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">{ins.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
