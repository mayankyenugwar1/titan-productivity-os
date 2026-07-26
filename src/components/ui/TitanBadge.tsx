import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type TitanBadgeProps = {
  variant?: "gold" | "green" | "red" | "blue" | "zinc";
  size?: "sm" | "md";
  glow?: boolean;
  leftIcon?: ReactNode;
  className?: string;
  children: ReactNode;
};

const badgeVariants = {
  gold: "border-[#d4af37]/30 bg-[#d4af37]/10 text-[#e5c158]",
  green: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  red: "border-red-500/25 bg-red-500/10 text-red-300",
  blue: "border-sky-500/25 bg-sky-400/10 text-sky-300",
  zinc: "border-zinc-800/80 bg-[#121216] text-zinc-400",
};

const badgeSizes = {
  sm: "px-2.5 py-0.5 text-[10px] tracking-[0.2em]",
  md: "px-3.5 py-1 text-xs tracking-[0.24em]",
};

export default function TitanBadge({
  variant = "gold",
  size = "md",
  glow = false,
  leftIcon,
  className,
  children,
}: TitanBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase transition-all duration-500",
        badgeVariants[variant],
        badgeSizes[size],
        glow && variant === "gold" && "shadow-[0_0_15px_rgba(212,175,55,0.18)]",
        className
      )}
    >
      {leftIcon}
      <span>{children}</span>
    </span>
  );
}