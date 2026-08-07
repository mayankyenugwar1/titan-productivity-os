import { useMemo, useState } from "react";
import { safeDate, safeDateString } from "@/utils/safeDate";
import { Award, Calendar, CheckCircle2, ChevronRight, Filter, Flame, History, Search } from "lucide-react";

import type { Habit } from "../types";
import { calculateDifficultyStars, calculateDynamicXP } from "../types";
import { TitanBadge, TitanCard } from "@/components/ui";
import { sanitizeCategory } from "@/constants/categories";

interface MissionHistoryProps {
  habits: Habit[];
}

export default function MissionHistory({ habits }: MissionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"Date" | "XP" | "Difficulty">("Date");

  // Get all completed records
  const completedMissions = useMemo(() => {
    return habits.filter((h) => h.completed || h.history.length > 0);
  }, [habits]);

  // Filtered and sorted list
  const processedList = useMemo(() => {
    const filtered = completedMissions.filter((habit) => {
      const cat = sanitizeCategory(habit.category);
      // Search
      const matchesSearch =
        habit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (habit.description && habit.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Category
      if (categoryFilter === "All") return true;
      if (categoryFilter === "Physical") return cat === "Physical" || cat === "Fitness";
      if (categoryFilter === "Operations") return cat === "Operations" || cat === "Coding";
      if (categoryFilter === "Knowledge") return cat === "Knowledge" || cat === "Reading";
      if (categoryFilter === "Personal") return cat === "Personal Ops";

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "XP") {
        return calculateDynamicXP(b) - calculateDynamicXP(a);
      }
      if (sortBy === "Difficulty") {
        return calculateDifficultyStars(b) - calculateDifficultyStars(a);
      }
      // Default: Date
      const dateA = (safeDate(a.completedAt) || safeDate(a.createdAt) || new Date(0)).getTime();
      const dateB = (safeDate(b.completedAt) || safeDate(b.createdAt) || new Date(0)).getTime();
      return dateB - dateA;
    });
  }, [completedMissions, searchQuery, categoryFilter, sortBy]);

  // Aggregate Stats
  const totalCompletedCount = completedMissions.length;
  const totalXPEarned = useMemo(() => {
    return completedMissions.reduce((acc, h) => acc + h.history.length * (h.xp || 100), 0);
  }, [completedMissions]);

  return (
    <div className="space-y-6 font-mono text-zinc-100">
      {/* Telemetry Header Strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <TitanCard className="flex items-center gap-4 p-5">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Total Operations Accomplished</p>
            <p className="text-2xl font-black text-white">{totalCompletedCount}</p>
          </div>
        </TitanCard>

        <TitanCard className="flex items-center gap-4 p-5">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-yellow-400/30 bg-yellow-400/10 text-yellow-400">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Historical XP Yield</p>
            <p className="text-2xl font-black text-yellow-400">+{totalXPEarned} XP</p>
          </div>
        </TitanCard>

        <TitanCard className="flex items-center gap-4 p-5">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-400/10 text-sky-400">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Historical Efficiency</p>
            <p className="text-2xl font-black text-sky-400">
              {totalCompletedCount > 0 ? "100% Verified" : "0 Logs"}
            </p>
          </div>
        </TitanCard>
      </div>

      {/* Control Bar: Filter, Search & Sort */}
      <TitanCard className="flex flex-wrap items-center justify-between gap-4 p-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-2.5 size-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Filter historical operation logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-[#0c0c0f] py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:border-[#d4af37] focus:outline-none"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {["All", "Operations", "Physical", "Knowledge", "Personal"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-xl px-3 py-1.5 font-bold transition ${
                categoryFilter === cat
                  ? "border border-[#d4af37]/40 bg-[#d4af37] text-zinc-950 shadow-md"
                  : "border border-zinc-800 bg-[#0c0c0f] text-zinc-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="size-3.5 text-zinc-500" />
          <span className="text-zinc-500 font-bold">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "Date" | "XP" | "Difficulty")}
            className="rounded-xl border border-zinc-800 bg-[#0c0c0f] px-3 py-1.5 text-xs text-white focus:border-[#d4af37] focus:outline-none font-mono"
          >
            <option value="Date">Recent Completion</option>
            <option value="XP">Highest XP Payload</option>
            <option value="Difficulty">Max Difficulty</option>
          </select>
        </div>
      </TitanCard>

      {/* History Log Timeline List */}
      <TitanCard className="space-y-4 p-6.5">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
          <div className="flex items-center gap-2.5">
            <History className="size-4 text-[#e5c158]" />
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
              HISTORICAL TELEMETRY TIMELINE ({processedList.length} LOGS)
            </h3>
          </div>
          <TitanBadge variant="gold" size="sm">
            VERIFIED ARCHIVE
          </TitanBadge>
        </div>

        {processedList.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 font-sans space-y-2">
            <History className="mx-auto size-8 text-zinc-700" />
            <p className="text-sm font-bold text-zinc-400">No completed operation logs match criteria.</p>
            <p className="text-xs">Accomplish directives in Mission Control to populate historical telemetry.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {processedList.map((habit) => {
              const stars = calculateDifficultyStars(habit);
              const completionDateStr = safeDateString(habit.completedAt || habit.createdAt, {
                month: "short",
                day: "2-digit",
                year: "numeric",
              });

              return (
                <div
                  key={habit.id}
                  className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-4 transition duration-300 hover:border-[#d4af37]/40 hover:bg-[#111116]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                      <CheckCircle2 className="size-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <TitanBadge variant={habit.priority === "High" ? "red" : "gold"} size="sm">
                          {sanitizeCategory(habit.category)}
                        </TitanBadge>

                        <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                          <Calendar className="size-3" /> {completionDateStr}
                        </span>
                      </div>

                      <h4 className="mt-1 font-sans text-sm font-bold text-zinc-100 group-hover:text-white">
                        {habit.title}
                      </h4>

                      {habit.description && (
                        <p className="mt-0.5 text-xs text-zinc-400 font-sans line-clamp-1">
                          {habit.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 font-mono text-xs">
                    <div className="text-right">
                      <span className="font-bold text-[#e5c158]">+{calculateDynamicXP(habit)} XP</span>
                      <p className="text-[10px] text-zinc-500">
                        Difficulty: {"★".repeat(stars)}
                      </p>
                    </div>

                    <ChevronRight className="size-4 text-zinc-600 group-hover:text-zinc-300 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </TitanCard>
    </div>
  );
}
