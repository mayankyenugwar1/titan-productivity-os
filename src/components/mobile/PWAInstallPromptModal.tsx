import { useEffect, useState } from "react";
import { Download, PlusSquare, Share, Sparkles, X } from "lucide-react";
import { TitanButton } from "@/components/ui";

export function PWAInstallPromptModal() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone;
    if (standalone) return;

    const userAgent = navigator.userAgent || "";
    const ios = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    if (ios) {
      setIsIOS(true);
      setShowPrompt(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-16 md:bottom-6 right-4 md:right-6 z-50 max-w-sm w-[92vw] sm:w-full rounded-3xl border border-[#d4af37]/40 bg-[#0d0d10]/95 p-4.5 shadow-2xl shadow-black backdrop-blur-xl font-mono text-zinc-100 space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#e5c158]">
            INSTALL TITAN OS APP
          </span>
        </div>
        <button onClick={() => setShowPrompt(false)} className="text-zinc-500 hover:text-white">
          <X className="size-4" />
        </button>
      </div>

      {isIOS ? (
        <div className="space-y-2.5 font-sans text-xs text-zinc-300">
          <p className="leading-relaxed">
            To install TITAN OS on your iOS device:
          </p>
          <div className="rounded-xl border border-zinc-800 bg-[#070709] p-2.5 space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2 text-zinc-200">
              <span>1. Tap the</span>
              <span className="inline-flex items-center gap-1 rounded bg-zinc-800 px-1.5 py-0.5 text-xs font-bold text-yellow-400">
                <Share className="size-3.5" /> Share
              </span>
              <span>button</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-200">
              <span>2. Select</span>
              <span className="inline-flex items-center gap-1 rounded bg-zinc-800 px-1.5 py-0.5 text-xs font-bold text-yellow-400">
                <PlusSquare className="size-3.5" /> Add to Home Screen
              </span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p className="font-sans text-xs text-zinc-300 leading-relaxed">
            Install TITAN OS to your desktop taskbar or home screen for standalone window execution and offline access.
          </p>

          <div className="pt-1">
            <TitanButton
              size="sm"
              className="w-full justify-center"
              leftIcon={<Download className="size-4" />}
              onClick={handleInstallClick}
            >
              INSTALL DESKTOP / MOBILE APP
            </TitanButton>
          </div>
        </>
      )}
    </div>
  );
}
