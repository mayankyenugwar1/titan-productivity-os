import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

export type TitanButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const variantStyles: Record<NonNullable<TitanButtonProps["variant"]>, string> = {
  primary:
    "bg-[#d4af37] text-zinc-950 font-bold uppercase tracking-[0.16em] hover:bg-[#e5c158] hover:shadow-[0_0_24px_rgba(212,175,55,0.28)] active:scale-[0.98]",
  secondary:
    "border border-zinc-800/90 bg-[#111115] text-zinc-200 font-bold uppercase tracking-[0.14em] hover:border-[#d4af37]/40 hover:bg-[#16161d] hover:text-white active:scale-[0.98]",
  danger:
    "border border-red-500/30 bg-red-500/10 text-red-300 font-bold uppercase tracking-[0.14em] hover:bg-red-500/20 hover:border-red-500/50 active:scale-[0.98]",
  ghost:
    "bg-transparent text-zinc-400 font-bold uppercase tracking-[0.14em] hover:bg-zinc-800/60 hover:text-white active:scale-[0.98]",
  outline:
    "border border-[#d4af37]/40 bg-transparent text-[#e5c158] font-bold uppercase tracking-[0.16em] hover:bg-[#d4af37] hover:text-zinc-950 active:scale-[0.98]",
};

const sizeStyles: Record<NonNullable<TitanButtonProps["size"]>, string> = {
  sm: "h-9 px-4 text-xs rounded-xl gap-2 font-mono",
  md: "h-11 px-5 text-xs rounded-xl gap-2.5 font-mono",
  lg: "h-13 px-6 text-sm rounded-2xl gap-3 font-mono",
};

export default function TitanButton({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  children,
  ...props
}: TitanButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b] disabled:cursor-not-allowed disabled:opacity-50 shrink-0",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin text-current shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span className="truncate">{children}</span>
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}