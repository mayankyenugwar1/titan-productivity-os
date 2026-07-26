import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TitanBadge } from "@/components/ui";

interface WidgetContainerProps {
  title: string;
  badge?: string;
  icon?: any;
  children: React.ReactNode;
  className?: string;
}

export default function WidgetContainer({
  title,
  badge = "WIDGET",
  icon: Icon,
  children,
  className = "",
}: WidgetContainerProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black font-mono space-y-4 ${className}`}>
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="size-4 text-[#e5c158]" />}
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <TitanBadge variant="gold" size="sm">
            {badge}
          </TitanBadge>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-1 text-zinc-500 hover:text-white"
          >
            {collapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
          </button>
        </div>
      </div>

      {!collapsed && <div>{children}</div>}
    </div>
  );
}
