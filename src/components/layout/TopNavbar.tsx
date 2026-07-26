import { useMemo, useState } from "react";
import { Bell, Search, ShieldCheck, Trophy } from "lucide-react";
import { useHabitStore } from "@/store/missionStore";
import { getProgressionDetails } from "@/services/xpEngineService";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationCenter from "@/components/layout/NotificationCenter";
import { TitanBadge } from "@/components/ui";

type TopNavbarProps = { title?: string };

export function TopNavbar({ title = "Mission Control" }: TopNavbarProps) {
  const { totalXP } = useHabitStore();
  const progression = useMemo(() => getProgressionDetails(totalXP), [totalXP]);
  const { unreadCount } = useNotifications();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <>
      <header className="relative z-10 flex min-h-[5.5rem] shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/50 px-5 backdrop-blur-xl lg:px-9 font-mono">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e5c158]">
            <ShieldCheck className="size-4" /> TITAN // OPERATIONS
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-100 font-sans">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Command Palette Trigger Button (Ctrl + K) */}
          <button
            onClick={() => {
              const event = new KeyboardEvent("keydown", { key: "k", ctrlKey: true });
              window.dispatchEvent(event);
            }}
            className="hidden sm:flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-[#0d0d10] px-3.5 py-2 text-xs text-zinc-300 hover:border-[#d4af37]/40 hover:text-white transition"
          >
            <Search className="size-3.5 text-[#e5c158]" />
            <span className="text-xs font-bold text-[#e5c158] font-mono">CTRL + K</span>
          </button>

          {/* Operator Rank & Level Badge */}
          <div className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-[#0d0d10] px-3.5 py-2 text-xs">
            <Trophy className="size-4 text-[#e5c158]" />
            <div className="flex items-center gap-1.5 font-mono">
              <TitanBadge variant="gold" size="sm">
                {progression.rank.toUpperCase()}
              </TitanBadge>
              <span className="font-bold text-zinc-200">LVL {progression.level}</span>
            </div>
          </div>

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotifOpen(true)}
            aria-label="Notifications"
            className="relative flex size-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/70 text-zinc-400 transition hover:border-[#d4af37]/40 hover:text-[#e5c158]"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4.5 items-center justify-center rounded-full bg-[#e5c158] text-[10px] font-black text-zinc-950">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
}
