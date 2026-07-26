import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Activity, BookOpen, Bot, Calendar, ChevronRight, CircleUserRound, Compass, FolderKanban, LayoutDashboard, Network, Radar, Settings2, Shield, Target, Trophy, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useHabitStore } from "@/store/missionStore";
import { getProgressionDetails } from "@/services/xpEngineService";

const NAV_ITEMS = [
  { label: "TITAN Overview", href: "/dashboard", icon: LayoutDashboard, code: "01" },
  { label: "Command Center", href: "/command-center", icon: Compass, code: "02" },
  { label: "Mission Control", href: "/habits", icon: Target, code: "03" },
  { label: "Time OS", href: "/calendar", icon: Calendar, code: "04" },
  { label: "AI OS Core", href: "/ai-core", icon: Bot, code: "05" },
  { label: "Knowledge OS", href: "/knowledge", icon: BookOpen, code: "06" },
  { label: "Projects & Goals", href: "/projects", icon: FolderKanban, code: "07" },
  { label: "Automation OS", href: "/automation", icon: Zap, code: "08" },
  { label: "Integrations Hub", href: "/integrations", icon: Network, code: "09" },
  { label: "Achievements", href: "/achievements", icon: Trophy, code: "10" },
  { label: "Analytics", href: "/analytics", icon: Activity, code: "11" },
  { label: "Operator", href: "/profile", icon: CircleUserRound, code: "12" },
  { label: "System Control", href: "/settings", icon: Settings2, code: "13" },
];

type SidebarProps = { className?: string };

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth();
  const { totalXP } = useHabitStore();

  const progression = useMemo(() => getProgressionDetails(totalXP), [totalXP]);

  const operatorName = user?.user_metadata.full_name || user?.user_metadata.username || "TITAN Operator";
  const operatorInitial = operatorName.slice(0, 1).toUpperCase();

  return (
    <aside className={cn("relative flex h-full w-[19rem] shrink-0 flex-col overflow-hidden border-r border-zinc-800/80 bg-[#070708] text-white shadow-[20px_0_80px_rgba(0,0,0,0.35)] font-mono", className)}>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(250,204,21,0.025)_45%,transparent_70%)]" />

      {/* Header Brand */}
      <div className="relative border-b border-zinc-800/80 px-7 py-7">
        <div className="flex items-center gap-4">
          <div className="relative flex size-12 items-center justify-center rounded-2xl border border-yellow-400/25 bg-yellow-400 text-zinc-950 shadow-[0_0_28px_rgba(250,204,21,0.18)]">
            <Shield size={23} fill="currentColor" />
            <span className="absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-[#070708] bg-yellow-300" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-[0.25em] text-yellow-400">TITAN</h1>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">Mission operating system</p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
          <Radar className="size-4 text-yellow-400/70" /> Command link established
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="relative flex-1 space-y-0.5 px-4 py-1.5 overflow-y-auto">
        <p className="mb-1 px-3 text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Navigation</p>
        {NAV_ITEMS.map(({ label, href, icon: Icon, code }) => (
          <NavLink
            key={href}
            to={href}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center justify-between rounded-2xl px-3.5 py-3 transition-all duration-200",
                isActive
                  ? "border border-yellow-400/30 bg-yellow-400/10 font-bold text-yellow-400 shadow-[0_0_24px_rgba(250,204,21,0.08)]"
                  : "text-zinc-400 hover:bg-zinc-900/80 hover:text-white"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-8 items-center justify-center rounded-xl border transition-colors",
                      isActive
                        ? "border-yellow-400/40 bg-yellow-400/20 text-yellow-400"
                        : "border-zinc-800 bg-zinc-900/60 text-zinc-500 group-hover:border-zinc-700 group-hover:text-zinc-300"
                    )}
                  >
                    <Icon size={16} />
                  </div>
                  <span className="font-sans text-sm tracking-tight">{label}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-[10px] tracking-widest font-mono",
                      isActive ? "text-yellow-400/80 font-bold" : "text-zinc-600 group-hover:text-zinc-500"
                    )}
                  >
                    #{code}
                  </span>
                  <ChevronRight
                    size={14}
                    className={cn(
                      "transition-transform duration-200",
                      isActive ? "text-yellow-400 translate-x-0.5" : "text-zinc-600 group-hover:text-zinc-400"
                    )}
                  />
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Operator Status Footer */}
      <div className="relative border-t border-zinc-800/80 p-5 space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl border border-yellow-400/30 bg-yellow-400/10 font-black text-yellow-400">
              {operatorInitial}
            </div>
            <div>
              <p className="font-sans text-xs font-bold text-white truncate max-w-[110px]">{operatorName}</p>
              <p className="text-[10px] font-bold text-yellow-400">{progression.rank}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">LEVEL</span>
            <p className="text-sm font-black text-yellow-400">{progression.level}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
