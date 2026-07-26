import { useState, type ReactNode } from "react";

interface TacticalTooltipProps {
  content: string;
  children: ReactNode;
}

export default function TacticalTooltip({ content, children }: TacticalTooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-zinc-800 bg-[#0d0d10] px-3 py-1.5 font-mono text-[10px] text-zinc-300 shadow-xl shadow-black/80 backdrop-blur-xl">
          <span>{content}</span>
          <div className="absolute top-full left-1/2 -mt-1 -translate-x-1/2 border-4 border-transparent border-t-zinc-800" />
        </div>
      )}
    </div>
  );
}
