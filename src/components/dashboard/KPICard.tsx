import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "gold" | "green" | "blue" | "purple";
}

const accentStyles = {
  gold: {
    border: "border-yellow-400/20",
    bg: "bg-yellow-400/10",
    icon: "text-yellow-400",
  },
  green: {
    border: "border-emerald-400/20",
    bg: "bg-emerald-400/10",
    icon: "text-emerald-400",
  },
  blue: {
    border: "border-sky-400/20",
    bg: "bg-sky-400/10",
    icon: "text-sky-400",
  },
  purple: {
    border: "border-violet-400/20",
    bg: "bg-violet-400/10",
    icon: "text-violet-400",
  },
};

export default function KPICard({
  title,
  value,
  icon: Icon,
  accent = "gold",
}: KPICardProps) {
  const style = accentStyles[accent];

  return (
    <div
      className={`
        group
        rounded-3xl
        border
        ${style.border}
        ${style.bg}
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            {title}
          </p>

          <h3 className="mt-3 text-4xl font-black text-white">
            {value}
          </h3>
        </div>

        <div
          className={`
            rounded-2xl
            bg-black/30
            p-4
            ${style.icon}
          `}
        >
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}