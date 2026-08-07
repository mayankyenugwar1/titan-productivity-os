import { useMemo, useState } from "react";
import { safeDate } from "@/utils/safeDate";
import { motion } from "framer-motion";
import {
  Award,
  Flame,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import type { Habit, HabitInput } from "../types";
import { calculateDynamicXP } from "../types";
import { getDurationSortOrder, isInfiniteDuration } from "../constants";
import MissionCard from "./MissionCard";
import MissionModal from "./MissionModal";
import MissionHistory from "./MissionHistory";
import FocusModeOverlay from "@/components/missions/FocusModeOverlay";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { TitanButton, TitanCard } from "@/components/ui";
import { sanitizeCategory } from "@/constants/categories";

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

interface MissionListProps {
  habits: Habit[];
  totalXP: number;
  streak: number;
  focusScore: number;
  loading?: boolean;
  onAdd: (input: HabitInput) => Promise<boolean>;
  onToggle: (id: string) => Promise<boolean>;
  onEdit: (id: string, input: HabitInput) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export default function MissionList({
  habits,
  totalXP,
  streak,
  focusScore,
  onAdd,
  onToggle,
  onEdit,
  onDelete,
}: MissionListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "HISTORY">("ACTIVE");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"Priority" | "XP" | "Recent" | "Duration">("Priority");
  const [searchQuery, setSearchQuery] = useState("");
  const [focusingHabit, setFocusingHabit] = useState<Habit | null>(null);

  // Part 1 Metric Calculations
  const completedToday = habits.filter((h) => h.completed).length;
  const level = Math.floor(totalXP / 500) + 1;
  const xpInCurrentLevel = totalXP % 500;
  const levelProgress = Math.round((xpInCurrentLevel / 500) * 100);

  // Filters setup
  const filterTabs = [
    { label: "All Directives", value: "All" },
    { label: "Pending", value: "Upcoming" },
    { label: "Accomplished", value: "Completed" },
    { label: "Critical Clearance", value: "Critical" },
    { label: "∞ Infinite", value: "Infinite" },
    { label: "Physical", value: "Workout" },
    { label: "Operations", value: "Coding" },
    { label: "Knowledge", value: "Study" },
    { label: "Reading", value: "Reading" },
    { label: "Personal Ops", value: "Personal" },
  ];

  const handleOpenCreate = () => {
    setEditingHabit(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setModalOpen(true);
  };

  const handleSubmitModal = async (input: HabitInput) => {
    if (editingHabit) {
      return onEdit(editingHabit.id, input);
    }
    return onAdd(input);
  };

  // Part 6 Filtered and Sorted Missions
  const processedMissions = useMemo(() => {
    const filtered = habits.filter((habit) => {
      const cat = sanitizeCategory(habit.category);
      // Search
      const matchesSearch =
        habit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (habit.description && habit.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (activeFilter === "All" || activeFilter === "Today") return !habit.archived;
      if (activeFilter === "Upcoming") return !habit.completed && !habit.archived;
      if (activeFilter === "Completed") return habit.completed && !habit.archived;
      if (activeFilter === "Critical") return habit.priority === "High" && !habit.archived;
      if (activeFilter === "Infinite") return isInfiniteDuration(habit.duration) && !habit.archived;
      if (activeFilter === "Workout") return (cat === "Physical" || cat === "Fitness") && !habit.archived;
      if (activeFilter === "Coding") return (cat === "Operations" || cat === "Coding") && !habit.archived;
      if (activeFilter === "Study") return (cat === "Knowledge" || cat === "Reading") && !habit.archived;
      if (activeFilter === "Reading") return cat === "Reading" && !habit.archived;
      if (activeFilter === "Personal") return cat === "Personal Ops" && !habit.archived;
      if (activeFilter === "Archived") return Boolean(habit.archived);

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "Priority") {
        const priorityScore = (p: string) => (p === "High" ? 3 : p === "Medium" ? 2 : 1);
        return priorityScore(b.priority) - priorityScore(a.priority);
      }
      if (sortBy === "XP") {
        return calculateDynamicXP(b) - calculateDynamicXP(a);
      }
      if (sortBy === "Duration") {
        return getDurationSortOrder(a.duration, a.priority) - getDurationSortOrder(b.duration, b.priority);
      }
      const timeA = (safeDate(a.createdAt) || new Date(0)).getTime();
      const timeB = (safeDate(b.createdAt) || new Date(0)).getTime();
      return timeB - timeA;
    });
  }, [habits, searchQuery, activeFilter, sortBy]);

  return (
    <div className="space-y-8 py-4 font-mono text-zinc-100">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Target className="size-5 text-[#e5c158]" />
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              Mission Control Console
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400 font-sans">
            Tactical Operations Queue, Clearance Levels, and Telemetry Execution Matrix.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Main Tab Switcher */}
          <div className="flex rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab("ACTIVE")}
              className={`rounded-xl px-4 py-2 transition ${
                activeTab === "ACTIVE"
                  ? "bg-[#d4af37] text-zinc-950 shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              ACTIVE DIRECTIVES ({habits.length})
            </button>
            <button
              onClick={() => setActiveTab("HISTORY")}
              className={`rounded-xl px-4 py-2 transition ${
                activeTab === "HISTORY"
                  ? "bg-[#d4af37] text-zinc-950 shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              HISTORICAL LOGS
            </button>
          </div>

          <TitanButton size="sm" leftIcon={<Plus className="size-4" />} onClick={handleOpenCreate}>
            NEW OPERATION
          </TitanButton>
        </div>
      </div>

      {activeTab === "HISTORY" ? (
        <MissionHistory habits={habits} />
      ) : (
        <>
          {/* Part 1: Top Metrics Telemetry Panel */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
            <TitanCard className="p-5 space-y-2">
              <div className="flex items-center justify-between text-[#e5c158]">
                <span className="text-xs uppercase tracking-wider font-bold">Operator Level</span>
                <Award className="size-4" />
              </div>
              <p className="text-2xl font-black text-[#e5c158]">LEVEL {level}</p>
              <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#e5c158] h-full" style={{ width: `${levelProgress}%` }} />
              </div>
            </TitanCard>

            <TitanCard className="p-5 space-y-2">
              <div className="flex items-center justify-between text-yellow-400">
                <span className="text-xs uppercase tracking-wider font-bold">Total XP Yield</span>
                <Flame className="size-4" />
              </div>
              <p className="text-2xl font-black text-white">
                <AnimatedNumber value={totalXP} suffix=" XP" />
              </p>
            </TitanCard>

            <TitanCard className="p-5 space-y-2">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="text-xs uppercase tracking-wider font-bold">Combat Streak</span>
                <Zap className="size-4" />
              </div>
              <p className="text-2xl font-black text-emerald-400">
                <AnimatedNumber value={streak} suffix=" DAYS" />
              </p>
            </TitanCard>

            <TitanCard className="p-5 space-y-2">
              <div className="flex items-center justify-between text-sky-400">
                <span className="text-xs uppercase tracking-wider font-bold">Focus Rating</span>
                <Sparkles className="size-4" />
              </div>
              <p className="text-2xl font-black text-sky-400">
                <AnimatedNumber value={focusScore} suffix="%" />
              </p>
            </TitanCard>
          </div>

          {/* Part 5 & 6: Search, Filter, Sort Controls */}
          <TitanCard className="flex flex-wrap items-center justify-between gap-4 p-5">
            {/* Search */}
            <div className="relative min-w-[260px] flex-1">
              <Search className="absolute left-3.5 top-2.5 size-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search active operations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-[#0c0c0f] py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1 text-xs">
              {filterTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveFilter(tab.value)}
                  className={`rounded-xl px-3 py-1.5 font-bold transition ${
                    activeFilter === tab.value
                      ? "border border-[#d4af37]/40 bg-[#d4af37] text-zinc-950"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <SlidersHorizontal className="size-3.5 text-zinc-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "Priority" | "XP" | "Recent" | "Duration")}
                className="rounded-xl border border-zinc-800 bg-[#0c0c0f] px-3 py-1.5 text-xs text-white focus:border-[#d4af37] focus:outline-none font-mono"
              >
                <option value="Priority">High Priority First</option>
                <option value="XP">Highest XP First</option>
                <option value="Duration">Shortest Duration First</option>
                <option value="Recent">Recently Created</option>
              </select>
            </div>
          </TitanCard>

          {/* Active Operations List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider">
              <span>ACTIVE QUEUE ({processedMissions.length} DIRECTIVES)</span>
              <span>{completedToday} ACCOMPLISHED TODAY</span>
            </div>

            {processedMissions.length === 0 ? (
              <TitanCard className="p-12 text-center text-zinc-500 font-sans space-y-3">
                <Target className="mx-auto size-10 text-zinc-700" />
                <h4 className="text-base font-bold text-zinc-300">No matching active operations.</h4>
                <p className="text-xs max-w-sm mx-auto">
                  Adjust filters or create a new tactical directive to start earning XP and advancing clearance tiers.
                </p>
                <TitanButton size="sm" onClick={handleOpenCreate} className="mt-2">
                  INITIALIZE NEW OPERATION
                </TitanButton>
              </TitanCard>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="initial"
                animate="animate"
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {processedMissions.map((habit) => (
                  <motion.div key={habit.id} variants={itemVariants}>
                    <MissionCard
                      habit={habit}
                      onToggle={onToggle}
                      onEdit={handleOpenEdit}
                      onDelete={onDelete}
                      onStartFocus={(h) => setFocusingHabit(h)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </>
      )}

      {/* Modal Dialogs */}
      <MissionModal
        open={modalOpen}
        habit={editingHabit}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitModal}
      />

      {focusingHabit && (
        <FocusModeOverlay habit={focusingHabit} onClose={() => setFocusingHabit(null)} />
      )}
    </div>
  );
}
