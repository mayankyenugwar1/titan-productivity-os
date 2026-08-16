import { useEffect, useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import { TitanButton } from "@/components/ui";

export function PWAUpdateBanner() {
  const [updateHandler, setUpdateHandler] = useState<((reloadPage?: boolean) => Promise<void>) | null>(null);
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvt = e as CustomEvent<{ updateSW: (reloadPage?: boolean) => Promise<void> }>;
      if (customEvt.detail?.updateSW) {
        setUpdateHandler(() => customEvt.detail.updateSW);
        setShowUpdate(true);
      }
    };

    window.addEventListener("titan-pwa-update-available", handleUpdate);
    return () => window.removeEventListener("titan-pwa-update-available", handleUpdate);
  }, []);

  if (!showUpdate || !updateHandler) return null;

  const handleReload = async () => {
    try {
      await updateHandler(true);
    } catch {
      window.location.reload();
    }
  };

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-md rounded-2xl border border-[#d4af37]/60 bg-[#0d0d10]/95 p-3.5 shadow-2xl shadow-black backdrop-blur-xl font-mono text-zinc-100 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <Sparkles className="size-4 shrink-0 text-[#e5c158]" />
        <div className="min-w-0">
          <p className="text-xs font-bold text-[#e5c158] uppercase tracking-wider">
            TITAN UPDATE AVAILABLE
          </p>
          <p className="text-[11px] text-zinc-400 font-sans truncate">
            New production system ready.
          </p>
        </div>
      </div>

      <TitanButton
        size="sm"
        leftIcon={<RefreshCw className="size-3.5" />}
        onClick={() => void handleReload()}
      >
        RELOAD SYSTEM
      </TitanButton>
    </div>
  );
}
