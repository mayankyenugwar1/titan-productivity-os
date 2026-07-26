import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export type LoadingStateProps = {
  message?: string;
  className?: string;
};

export default function LoadingState({
  message = "Loading tactical data...",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[1.75rem] border border-zinc-800 bg-zinc-950/60 p-12 text-center text-zinc-500",
        className
      )}
    >
      <Loader2 className="size-7 animate-spin text-yellow-400" />
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
        {message}
      </p>
    </div>
  );
}
