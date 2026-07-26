import { useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Code,
  Coins,
  Dumbbell,
  Flame,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { useHabitStore } from "@/store/missionStore";
import { evaluateAchievements } from "@/services/achievementService";
import { calculateCoinTelemetry } from "@/services/coinService";
import { calculateStreakTelemetry } from "@/services/streakService";
import ChallengesWidget from "@/components/progression/ChallengesWidget";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { SectionHeader, TitanBadge, TitanProgress } from "@/components/ui";

type StatusTab = "All" | "Unlocked" | "In Progress" | "Locked";

const ICON_MAP: Record<string, any> = {
  Target,
  ShieldCheck,
  Award,
  Trophy,
  Zap,
  Flame,
  ShieldAlert,
  Dumbbell,
  Code,
  BookOpen,
  Sparkles,
  Coins,
};

export default function Achievements() {
  const { habits, totalXP, streak } = useHabitStore();

  const [activeTab, setActiveTab] = useState<StatusTab>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const achievements = useMemo(() => {
    return evaluateAchievements(habits, totalXP, streak);
  }, [habits, totalXP, streak]);

  const streakTelemetry = useMemo(() => {
    return calculateStreakTelemetry(habits, streak);
  }, [habits, streak]);

  const coinTelemetry = useMemo(() => {
    return calculateCoinTelemetry(habits, totalXP);
  }, [habits, totalXP]);

  const totalUnlocked = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const overallProgressPercent = Math.round((totalUnlocked / totalCount) * 100);

  const categories = ["All", "Mission", "Streak", "XP", "Specialty", "Level", "Economy"];

  const filteredAchievements = useMemo(() => {
    return achievements.filter((ach) => {
      // Status Filter
      if (activeTab === "Unlocked" && !ach.unlocked) return false;
      if (activeTab === "In Progress" && (ach.unlocked || ach.progress === 0)) return false;
      if (activeTab === "Locked" && ach.unlocked) return false;

      // Category Filter
      if (selectedCategory !== "All" && ach.category !== selectedCategory) return false;

      return true;
    });
  }, [achievements, activeTab, selectedCategory]);

  return (
    <div className="space-y-10 py-4 font-mono text-zinc-100">
      <SectionHeader
        badge="Clearance Ranks & Accolades"
        title="Operator Achievements"
        description="Accomplish operational directives, maintain combat streaks, and accumulate XP to unlock classified badges and rewards."
      />

      {/* Top Telemetry Strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
        <div className="rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-5 space-y-2">
          <div className="flex items-center justify-between text-[#e5c158]">
            <span className="text-xs uppercase tracking-wider font-bold">Clearance Badges</span>
            <Trophy className="size-4" />
          </div>
          <p className="text-2xl font-black text-[#e5c158]">
            {totalUnlocked} / {totalCount} ({overallProgressPercent}%)
          </p>
          <TitanProgress value={overallProgressPercent} />
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-[#070709] p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase tracking-wider font-bold">Combat Streak</span>
            <Zap className="size-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">
            <AnimatedNumber value={streakTelemetry.currentStreak} suffix=" Days" />
          </p>
          <span className="text-[10px] text-zinc-500 font-bold">
            Best Streak: {streakTelemetry.longestStreak} Days
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-[#070709] p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase tracking-wider font-bold">Vault Coins</span>
            <Coins className="size-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">
            🪙 <AnimatedNumber value={coinTelemetry.currentCoins} />
          </p>
          <span className="text-[10px] text-zinc-500 font-bold">
            Lifetime Yield: {coinTelemetry.lifetimeCoins} Coins
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-[#070709] p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase tracking-wider font-bold">Cumulative XP</span>
            <Flame className="size-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-black text-yellow-400">
            +<AnimatedNumber value={totalXP} /> XP
          </p>
          <span className="text-[10px] text-zinc-500 font-bold">Verified Logs</span>
        </div>
      </div>

      {/* Dynamic Challenges Engine */}
      <ChallengesWidget />

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-800/80 bg-[#070709] p-5 shadow-2xl shadow-black font-mono">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-1 text-xs">
          {(["All", "Unlocked", "In Progress", "Locked"] as StatusTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-3 py-1.5 font-bold transition ${
                activeTab === tab
                  ? "border border-[#d4af37]/40 bg-[#d4af37] text-zinc-950 shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-[#0c0c0f] px-3 py-2 text-xs text-white focus:border-[#d4af37] focus:outline-none font-mono"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Achievements Cards Grid */}
      <div className="space-y-4 font-mono">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider">
          <span>CLASSIFIED BADGES ({filteredAchievements.length} DISPLAYED)</span>
          <span>{totalUnlocked} UNLOCKED TOTAL</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAchievements.map((ach) => {
            const IconComp = ICON_MAP[ach.iconName] || Trophy;
            const percent = Math.round((ach.progress / ach.requirement) * 100);

            return (
              <div
                key={ach.id}
                className={`relative flex flex-col justify-between rounded-3xl border p-6 space-y-4 transition duration-300 ${
                  ach.unlocked
                    ? "border-[#d4af37]/40 bg-[#0d0d10] shadow-xl shadow-black hover:border-[#d4af37]"
                    : "border-zinc-800/80 bg-[#070709]/80 opacity-75 hover:opacity-100"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-11 items-center justify-center rounded-2xl border ${
                        ach.unlocked
                          ? "border-[#d4af37]/40 bg-[#d4af37]/15 text-[#e5c158]"
                          : "border-zinc-800 bg-zinc-900 text-zinc-600"
                      }`}
                    >
                      <IconComp className="size-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <TitanBadge variant={ach.unlocked ? "gold" : "zinc"} size="sm">
                          {ach.category}
                        </TitanBadge>
                        {ach.unlocked ? (
                          <span className="text-[10px] font-bold text-emerald-400 uppercase">UNLOCKED</span>
                        ) : (
                          <Lock className="size-3 text-zinc-600" />
                        )}
                      </div>
                      <h4 className="mt-1 font-sans text-base font-bold text-white">{ach.title}</h4>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 font-sans leading-relaxed">{ach.description}</p>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Progress</span>
                    <span className="font-bold text-[#e5c158]">
                      {ach.progress} / {ach.requirement} ({percent}%)
                    </span>
                  </div>
                  <TitanProgress value={percent} />
                </div>

                {/* Rewards Footer */}
                <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3 text-[11px] font-mono">
                  <span className="text-zinc-500 uppercase">Reward</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#e5c158]">+{ach.xpReward} XP</span>
                    <span className="font-bold text-zinc-300">🪙 +{ach.coinReward}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}