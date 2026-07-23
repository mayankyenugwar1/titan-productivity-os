import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type TitanButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary";
  };

export default function TitanButton({
  variant = "primary",
  className,
  children,
  ...props
}: TitanButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        `
        rounded-xl
        px-6
        py-3
        font-semibold
        transition-all
        duration-300
        hover:-translate-y-1
        active:scale-95
        `,
        variant === "primary"
          ? `
            bg-yellow-400
            text-black
            hover:bg-yellow-300
            hover:shadow-[0_0_20px_rgba(250,204,21,0.35)]
          `
          : `
            border
            border-zinc-700
            bg-transparent
            text-zinc-300
            hover:border-yellow-400
            hover:bg-yellow-400/10
            hover:text-white
          `,
        className
      )}
    >
      {children}
    </button>
  );
}