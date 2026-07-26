import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type SectionHeaderProps = {
  badge?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export default function SectionHeader({
  badge,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between font-mono", className)}>
      <div>
        {badge && (
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e5c158]">
            {badge}
          </p>
        )}
        <h2 className="mt-1.5 font-sans text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-sm font-sans leading-relaxed text-zinc-300">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}