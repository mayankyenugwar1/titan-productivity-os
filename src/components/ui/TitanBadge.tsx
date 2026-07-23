import type { ReactNode } from "react";

type TitanBadgeProps = {
  children: ReactNode;
};

export default function TitanBadge({
  children,
}: TitanBadgeProps) {
  return (
    <span
      className="
      inline-flex
      items-center
      rounded-full
      border
      border-yellow-500/20
      bg-yellow-400/10
      px-3
      py-1
      text-xs
      font-semibold
      uppercase
      tracking-[0.25em]
      text-yellow-400
      "
    >
      {children}
    </span>
  );
}