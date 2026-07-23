import { NavLink } from "react-router-dom";
import {
  Award,
  LayoutDashboard,
  Settings,
  Shield,
  Target,
  Trophy,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Habits",
    href: "/habits",
    icon: Target,
  },
  {
    label: "Achievements",
    href: "/achievements",
    icon: Trophy,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

type SidebarProps = {
  className?: string;
};

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-72 shrink-0 flex-col border-r border-zinc-800 bg-[#09090B] text-white",
        className
      )}
    >
      {/* Logo */}
      <div className="border-b border-zinc-800 px-8 py-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-black shadow-[0_0_30px_rgba(250,204,21,0.25)]">
            <Shield size={26} />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-[0.35em] text-yellow-400">
              TITAN
            </h1>

            <p className="mt-1 text-xs uppercase tracking-[0.35em] text-zinc-500">
              Productivity OS
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-5 py-8">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <NavLink key={href} to={href}>
            {({ isActive }) => (
              <div
                className={cn(
                  "group relative flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300",
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-yellow-400" />
                )}

                <Icon
                  className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isActive
                      ? "text-yellow-400"
                      : "group-hover:text-yellow-400"
                  )}
                />

                <span className="font-medium">{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* XP Card */}
      <div className="border-t border-zinc-800 p-5">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                LEVEL
              </p>

              <h2 className="mt-2 text-4xl font-black text-white">12</h2>
            </div>

            <Award className="h-8 w-8 text-yellow-400" />
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs">
              <span className="text-zinc-500">XP Progress</span>

              <span className="text-yellow-400">1280 / 1800</span>
            </div>

            <div className="h-2 rounded-full bg-zinc-800">
              <div className="h-2 w-[71%] rounded-full bg-yellow-400" />
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/10 p-3">
            <p className="text-xs uppercase tracking-[0.25em] text-green-400">
              Mission Status
            </p>

            <p className="mt-1 font-medium text-white">● ACTIVE</p>
          </div>
        </div>
      </div>
    </aside>
  );
}