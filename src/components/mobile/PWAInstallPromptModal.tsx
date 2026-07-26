import { useEffect, useState } from "react";
import { Download, Sparkles, X } from "lucide-react";
import { TitanButton } from "@/components/ui";

export function PWAInstallPromptModal() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
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
    <div className="fixed bottom-16 md:bottom-6 right-6 z-50 max-w-sm w-full rounded-3xl border border-[#d4af37]/40 bg-[#0d0d10]/95 p-5 shadow-2xl shadow-black backdrop-blur-xl font-mono text-zinc-100 space-y-3">
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
    </div>
  );
}
