import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Bot, Calendar, Compass, Target } from "lucide-react";

export function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: "cmd", label: "Center", href: "/command-center", icon: Compass },
    { id: "hab", label: "Missions", href: "/habits", icon: Target },
    { id: "cal", label: "Time OS", href: "/calendar", icon: Calendar },
    { id: "ai", label: "AI OS", href: "/ai-core", icon: Bot },
    { id: "kno", label: "Vault", href: "/knowledge", icon: BookOpen },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-zinc-800/80 bg-[#070709]/95 px-2 py-2 backdrop-blur-xl font-mono text-[10px]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.href;

        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.href)}
            className={`flex flex-col items-center gap-1 p-1.5 transition ${
              isActive ? "text-[#e5c158]" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Icon className="size-5" />
            <span className="font-bold tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
