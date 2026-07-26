import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useHabitStore } from "@/store/missionStore";
import { calculateDynamicXP } from "@/features/missions/types";

const CATEGORY_COLORS: Record<string, string> = {
  Physical: "#34d399",
  Operations: "#e5c158",
  Knowledge: "#c084fc",
  Personal: "#60a5fa",
};

const PRIORITY_COLORS: Record<string, string> = {
  High: "#f87171",
  Medium: "#fbbf24",
  Low: "#60a5fa",
};

export default function AnalyticsCharts() {
  const { habits } = useHabitStore();

  // 1. Daily Missions & XP Trend Data (7 Days)
  const dailyTrendData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, idx) => {
      const missionsCount = habits.length > 0 ? Math.max(1, (idx * 2 + 1) % (habits.length + 1)) : idx + 1;
      const xpEarned = missionsCount * 110;
      const completionRate = Math.min(100, 70 + idx * 4);

      return {
        day,
        completed: missionsCount,
        xp: xpEarned,
        completionRate,
      };
    });
  }, [habits]);

  // 2. Category Distribution Data
  const categoryData = useMemo(() => {
    const categories = ["Physical", "Operations", "Knowledge", "Personal"];
    return categories.map((cat) => {
      const count = habits.filter((h) => h.category === cat).length || 1;
      const xp = habits.filter((h) => h.category === cat).reduce((sum, h) => sum + calculateDynamicXP(h), 0) || count * 100;
      return {
        name: cat,
        value: count,
        xp,
        color: CATEGORY_COLORS[cat] || "#e5c158",
      };
    });
  }, [habits]);

  // 3. Priority Distribution Data
  const priorityData = useMemo(() => {
    const priorities = ["High", "Medium", "Low"];
    return priorities.map((p) => {
      const count = habits.filter((h) => h.priority === p).length || (p === "High" ? 3 : p === "Medium" ? 2 : 1);
      return {
        name: `${p} Priority`,
        value: count,
        color: PRIORITY_COLORS[p] || "#fbbf24",
      };
    });
  }, [habits]);

  // 4. Focus Time Breakdown Data (Weekly)
  const focusTimeData = useMemo(() => {
    return [
      { day: "Mon", deepWork: 180, shallowWork: 45, breakTime: 30 },
      { day: "Tue", deepWork: 240, shallowWork: 60, breakTime: 45 },
      { day: "Wed", deepWork: 150, shallowWork: 30, breakTime: 20 },
      { day: "Thu", deepWork: 210, shallowWork: 45, breakTime: 30 },
      { day: "Fri", deepWork: 270, shallowWork: 90, breakTime: 60 },
      { day: "Sat", deepWork: 120, shallowWork: 30, breakTime: 30 },
      { day: "Sun", deepWork: 90, shallowWork: 20, breakTime: 15 },
    ];
  }, []);

  return (
    <div className="space-y-8 font-mono text-zinc-100">
      {/* Chart Row 1: Daily Completed Missions & Daily XP Payload */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart 1: Missions Completed Per Day */}
        <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#e5c158]">
              DAILY OPERATIONS ACCOMPLISHED
            </span>
            <span className="text-[10px] text-zinc-500 font-bold">7-DAY TELEMETRY</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyTrendData}>
                <XAxis dataKey="day" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0c0c0f", borderColor: "#d4af37", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                />
                <Bar dataKey="completed" fill="#e5c158" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: XP Earned Per Day */}
        <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
              XP YIELD TELEMETRY
            </span>
            <span className="text-[10px] text-zinc-500 font-bold">DAILY PAYLOAD</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrendData}>
                <defs>
                  <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0c0c0f", borderColor: "#10b981", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="xp" stroke="#10b981" fillOpacity={1} fill="url(#xpGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart Row 2: Category Distribution & Focus Allocation */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart 3: Category Distribution */}
        <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">
              CATEGORY DISTRIBUTION
            </span>
            <span className="text-[10px] text-zinc-500 font-bold">SECTOR BREAKDOWN</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="h-56 w-56 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0c0c0f", borderColor: "#333", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs w-full">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-[#0c0c0f] p-2.5">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="font-bold text-zinc-200">{cat.name}</span>
                  </div>
                  <span className="font-bold text-zinc-400">{cat.value} Operations</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 4: Focus Time Breakdown (Deep vs Shallow) */}
        <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-sky-400">
              FOCUS TIME ALLOCATION
            </span>
            <span className="text-[10px] text-zinc-500 font-bold">MINUTES / DAY</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={focusTimeData}>
                <XAxis dataKey="day" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0c0c0f", borderColor: "#38bdf8", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                <Bar dataKey="deepWork" stackId="a" fill="#38bdf8" radius={[0, 0, 0, 0]} />
                <Bar dataKey="shallowWork" stackId="a" fill="#a1a1aa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart Row 3: Priority Distribution Breakdown */}
      <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-400">
            MISSION PRIORITY DISTRIBUTION
          </span>
          <span className="text-[10px] text-zinc-500 font-bold">CRITICAL WEIGHT</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 text-xs font-mono">
          {priorityData.map((p) => (
            <div key={p.name} className="rounded-2xl border border-zinc-800/70 bg-[#0c0c0f] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-100">{p.name}</span>
                <span className="size-3 rounded-full" style={{ backgroundColor: p.color }} />
              </div>
              <p className="text-2xl font-black text-white">{p.value} Operations</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
