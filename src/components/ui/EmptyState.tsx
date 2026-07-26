import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Shield } from "lucide-react";
import TitanButton from "./TitanButton";

export type EmptyStateProps = {
  icon?: ReactNode;
  badge?: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
};

export default function EmptyState({
  icon = <Shield className="size-9 text-[#e5c158]" />,
  badge = "COMMAND SECTOR CLEAR",
  title,
  description,
  actionText,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-dashed border-zinc-800 bg-[#070709]/80 px-6 py-16 text-center font-mono",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06),transparent_55%)] pointer-events-none" />
      <div className="relative mx-auto flex max-w-md flex-col items-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-3xl border border-[#d4af37]/30 bg-black/60 shadow-[0_0_35px_rgba(212,175,55,0.12)]">
          {icon}
        </div>
        {badge && (
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e5c158]">
            {badge}
          </p>
        )}
        <h3 className="mt-2 text-2xl font-bold text-white font-sans sm:text-3xl">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300 font-sans">
          {description}
        </p>
        {actionText && onAction && (
          <div className="mt-6">
            <TitanButton variant="outline" size="sm" onClick={onAction}>
              {actionText}
            </TitanButton>
          </div>
        )}
      </div>
    </div>
  );
}
