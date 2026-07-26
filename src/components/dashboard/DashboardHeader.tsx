import { Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardHeader() {
  const { user } = useAuth();
  const operatorName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.username ||
    "OPERATOR";

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "GOOD MORNING";
    if (hour < 18) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  };

  const timeGreeting = getGreetingTime();

  return (
    <div className="relative">
      <div className="flex items-center gap-3 text-yellow-400">
        <Shield className="size-4" />
        <p className="text-xs font-bold uppercase tracking-[0.38em]">
          TITAN // SYSTEM ONLINE
        </p>
      </div>

      <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
        {timeGreeting},{" "}
        <span className="text-yellow-400">{operatorName.toUpperCase()}</span>
      </h1>

      <p className="mt-3 text-base text-zinc-400 sm:text-lg">
        Every completed mission strengthens the operator.
      </p>
    </div>
  );
}