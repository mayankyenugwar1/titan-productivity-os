import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type TitanCardProps = {
  children: ReactNode;
  className?: string;
};

export default function TitanCard({
  children,
  className,
}: TitanCardProps) {
  return (
    <div
      className={cn(
        `
        rounded-3xl
        border
        border-zinc-800
        bg-zinc-900/70
        backdrop-blur-xl
        p-8
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-yellow-400/40
        hover:shadow-[0_0_30px_rgba(250,204,21,0.08)]
        `,
        className
      )}
    >
      {children}
    </div>
  );
}