import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BookOpen,
  Bot,
  Calendar,
  Compass,
  CornerDownLeft,
  FolderKanban,
  LayoutDashboard,
  Network,
  Search,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { searchUniversalOS, type UniversalSearchResult } from "@/services/os/searchService";
import { TitanBadge } from "@/components/ui";

const ICON_MAP: Record<string, any> = {
  LayoutDashboard,
  Compass,
  Target,
  Calendar,
  Bot,
  BookOpen,
  FolderKanban,
  Zap,
  Network,
  Trophy,
  Activity,
};

export default function CommandPaletteModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Listen for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const results = searchUniversalOS(query);

  const handleSelect = (item: UniversalSearchResult) => {
    if (item.href) {
      navigate(item.href);
    } else if (item.action) {
      item.action();
    }
    setOpen(false);
    setQuery("");
  };

  const handleKeyDownInput = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 p-4 backdrop-blur-xl font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          className="relative w-full max-w-xl rounded-3xl border border-[#d4af37]/40 bg-[#0d0d10] p-5 shadow-2xl shadow-black space-y-4"
        >
          {/* Header Search Input */}
          <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-3">
            <Search className="size-5 text-[#e5c158]" />
            <input
              type="text"
              autoFocus
              placeholder="Search TITAN Operating System... (or press ESC to close)"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDownInput}
              className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-sans"
            />
            <button onClick={() => setOpen(false)} className="rounded-xl p-1 text-zinc-500 hover:text-white">
              <X className="size-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1 text-xs">
            {results.length === 0 ? (
              <p className="p-8 text-center text-zinc-500 font-sans">No matching records found across TITAN OS.</p>
            ) : (
              results.map((item, index) => {
                const IconComp = ICON_MAP[item.iconName] || Target;
                const isSelected = index === selectedIndex;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between rounded-2xl p-3 cursor-pointer transition ${
                      isSelected
                        ? "border border-[#d4af37]/40 bg-[#d4af37]/15 text-white"
                        : "border border-transparent bg-[#070709] text-zinc-300 hover:bg-[#0c0c0f]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-8 items-center justify-center rounded-xl border ${
                          isSelected
                            ? "border-[#d4af37]/40 bg-[#d4af37]/20 text-[#e5c158]"
                            : "border-zinc-800 bg-zinc-900 text-zinc-500"
                        }`}
                      >
                        <IconComp className="size-4" />
                      </div>
                      <div>
                        <h5 className="font-sans font-bold text-white text-xs">{item.title}</h5>
                        <p className="font-sans text-[11px] text-zinc-400">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <TitanBadge variant={isSelected ? "gold" : "zinc"} size="sm">
                        {item.category}
                      </TitanBadge>
                      {isSelected && <CornerDownLeft className="size-3.5 text-[#e5c158]" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Navigation Hints */}
          <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3 text-[10px] text-zinc-500 font-bold">
            <span>UP / DOWN ARROW to navigate</span>
            <span>ENTER to select</span>
            <span>ESC to close</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
