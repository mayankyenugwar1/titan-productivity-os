import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";
import { TITAN_CARD_STYLES } from "./tokens";

export type TitanCardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: keyof typeof TITAN_CARD_STYLES;
  padding?: "none" | "sm" | "md" | "lg";
  children: ReactNode;
};

const paddingStyles = {
  none: "p-0",
  sm: "p-4 sm:p-5",
  md: "p-6 sm:p-7",
  lg: "p-8 sm:p-10",
};

export default function TitanCard({
  variant = "default",
  padding = "lg",
  className,
  children,
  ...props
}: TitanCardProps) {
  return (
    <div
      {...props}
      className={cn(
        TITAN_CARD_STYLES[variant],
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
}