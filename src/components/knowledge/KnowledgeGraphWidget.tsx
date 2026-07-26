import { useMemo } from "react";
import type { KnowledgeItem } from "@/services/knowledge/knowledgeService";
import { TitanBadge } from "@/components/ui";
import { Network } from "lucide-react";

interface KnowledgeGraphWidgetProps {
  notes: KnowledgeItem[];
  onSelectNote: (note: KnowledgeItem) => void;
}

export default function KnowledgeGraphWidget({ notes, onSelectNote }: KnowledgeGraphWidgetProps) {
  const nodes = useMemo(() => {
    return notes.map((n, i) => {
      const angle = (i / Math.max(1, notes.length)) * 2 * Math.PI;
      const radius = 120 + (i % 3) * 35;
      const x = Math.round(250 + radius * Math.cos(angle));
      const y = Math.round(200 + radius * Math.sin(angle));
      return { ...n, x, y };
    });
  }, [notes]);

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black font-mono space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Network className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            INTERACTIVE KNOWLEDGE GRAPH MATRIX
          </span>
        </div>
        <TitanBadge variant="gold" size="sm">
          {nodes.length} NODES CONNECTED
        </TitanBadge>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative h-[420px] w-full rounded-2xl border border-zinc-800 bg-[#0c0c0f] overflow-hidden flex items-center justify-center">
        <svg className="absolute inset-0 h-full w-full">
          {/* Connector Lines to Center Hub */}
          {nodes.map((n) => (
            <line
              key={`line-${n.id}`}
              x1="250"
              y1="200"
              x2={n.x}
              y2={n.y}
              stroke="#d4af37"
              strokeWidth="1"
              strokeOpacity="0.25"
              strokeDasharray="4 4"
            />
          ))}

          {/* Central Hub Node */}
          <circle cx="250" cy="200" r="14" fill="#d4af37" fillOpacity="0.3" stroke="#d4af37" strokeWidth="2" />
        </svg>

        {/* Node Elements */}
        <div className="absolute inset-0">
          {nodes.map((n) => (
            <div
              key={n.id}
              onClick={() => onSelectNote(n)}
              style={{ left: `${n.x}px`, top: `${n.y}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-[#070709] px-2.5 py-1 text-[11px] font-bold text-zinc-300 shadow-lg transition duration-200 group-hover:scale-105 group-hover:border-[#d4af37] group-hover:text-white">
                <span className="size-2 rounded-full bg-[#d4af37]" />
                <span className="font-sans max-w-[110px] truncate">{n.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
