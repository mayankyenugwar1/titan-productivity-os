import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Check,
  Trash2,
  X,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { TitanBadge } from "@/components/ui";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
  } = useNotifications();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm font-mono text-zinc-100">
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative flex h-full w-full max-w-md flex-col border-l border-zinc-800/80 bg-[#09090b] shadow-2xl shadow-black p-6 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#e5c158]">
                <Bell className="size-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#e5c158]">
                  NOTIFICATION CENTER
                </span>
                <h3 className="text-sm font-bold text-white font-sans">
                  System Alerts ({unreadCount} Unread)
                </h3>
              </div>
            </div>

            <button onClick={onClose} className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white">
              <X className="size-5" />
            </button>
          </div>

          {/* Action Header */}
          <div className="flex items-center justify-between text-xs border-b border-zinc-800/60 pb-3">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-[#e5c158] font-bold"
            >
              <Check className="size-4" /> MARK ALL READ
            </button>
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-zinc-500 hover:text-red-400 font-bold"
            >
              <Trash2 className="size-3.5" /> CLEAR ALL
            </button>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 font-sans italic">
                No active notifications logged. System parameters nominal.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`group relative rounded-2xl border p-4 space-y-2 transition duration-300 ${
                    n.read
                      ? "border-zinc-800/60 bg-[#0c0c0f]/60 opacity-75"
                      : "border-[#d4af37]/40 bg-[#0d0d10] shadow-lg shadow-black/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <TitanBadge variant={n.type === "LEVEL_UP" ? "gold" : "blue"} size="sm">
                        {n.type}
                      </TitanBadge>
                      {!n.read && <span className="size-2 rounded-full bg-[#e5c158]" />}
                    </div>

                    <button
                      onClick={() => dismissNotification(n.id)}
                      className="text-zinc-600 hover:text-red-400"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <h4 className="font-sans font-bold text-sm text-zinc-100">{n.title}</h4>
                  <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">{n.message}</p>

                  <div className="flex items-center justify-between border-t border-zinc-800/60 pt-2 text-[10px] text-zinc-500">
                    <span>{n.createdAt}</span>
                    {!n.read && (
                      <button onClick={() => markAsRead(n.id)} className="font-bold text-[#e5c158] hover:underline">
                        ACKNOWLEDGE
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
