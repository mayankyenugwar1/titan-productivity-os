import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ICON_SIZES } from "@/components/ui";

interface KPICardProps {
  title: string;
  value: ReactNode;
  icon: LucideIcon;
  subtext?: string;
  accent?: "gold" | "green" | "blue" | "purple";
}

const accentStyles = {
  gold: {
    border: "border-[#d4af37]/30",
    bg: "bg-[#0c0c0f]/90",
    iconBg: "bg-[#d4af37]/10",
    icon: "text-[#e5c158]",
  },
  green: {
    border: "border-emerald-500/30",
    bg: "bg-[#0c0c0f]/90",
    iconBg: "bg-emerald-500/10",
    icon: "text-emerald-400",
  },
  blue: {
    border: "border-sky-500/30",
    bg: "bg-[#0c0c0f]/90",
    iconBg: "bg-sky-500/10",
    icon: "text-sky-400",
  },
  purple: {
    border: "border-violet-500/30",
    bg: "bg-[#0c0c0f]/90",
    iconBg: "bg-violet-500/10",
    icon: "text-violet-400",
  },
};

export default function KPICard({
  title,
  value,
  icon: Icon,
  subtext,
  accent = "gold",
}: KPICardProps) {
  const style = accentStyles[accent];

  return (
    <div
      className={`group rounded-2xl border ${style.border} ${style.bg} p-6 backdrop-blur-xl transition-all duration-500 hover:border-[#d4af37]/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/90`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
            {title}
          </p>
          <h3 className="mt-3 text-3xl font-extrabold text-zinc-100 sm:text-4xl">
            {value}
          </h3>
          {subtext && (
            <p className="mt-1.5 text-xs text-zinc-500 font-medium">
              {subtext}
            </p>
          )}
        </div>
        <div className={`rounded-2xl border border-zinc-800/60 p-3.5 ${style.iconBg} ${style.icon}`}>
          <Icon size={ICON_SIZES.lg} />
        </div>
      </div>
    </div>
  );
}