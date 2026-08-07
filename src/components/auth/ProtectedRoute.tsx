import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Shield } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#070709] font-mono text-zinc-100 p-6">
        <div className="relative flex flex-col items-center text-center space-y-4">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#e5c158] shadow-[0_0_30px_rgba(212,175,55,0.2)] animate-pulse">
            <Shield className="size-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#e5c158]">
            WAYNE OS // AUTHENTICATING OPERATOR...
          </span>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans">
            VERIFYING OPERATOR CLEARANCE MATRIX & SESSION KEYS
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}