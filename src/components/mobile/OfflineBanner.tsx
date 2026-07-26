import { useEffect, useState } from "react";
import { subscribeNetworkStatus } from "@/services/platform/networkService";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    return subscribeNetworkStatus(setIsOnline);
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-amber-500/90 py-1.5 px-4 text-[11px] font-bold text-zinc-950 shadow-md font-mono">
      <WifiOff className="size-4" />
      <span>TITAN OFFLINE MODE — Changes will synchronize automatically when connection restores.</span>
    </div>
  );
}
