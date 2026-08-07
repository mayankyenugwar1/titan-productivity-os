import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, Lock, Mail, Shield } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { TitanButton, TitanCard, TitanInput } from "@/components/ui";
import type { FriendlyAuthResult } from "@/utils/authErrorHandler";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<FriendlyAuthResult | null>(null);

  const isSubmittingRef = useRef(false);

  const validateForm = (): string | null => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Please enter a valid email address.";
    }
    if (!password) {
      return "Security passcode is required.";
    }
    return null;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (loading || isSubmittingRef.current) return;

    setErrorInfo(null);

    const validationError = validateForm();
    if (validationError) {
      setErrorInfo({
        message: validationError,
        code: "CLIENT_VALIDATION",
        isRateLimit: false,
        isNetworkError: false,
      });
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    try {
      const response = await signIn(email, password);

      if (response.error) {
        setErrorInfo(response.error);
        setLoading(false);
        isSubmittingRef.current = false;
        return;
      }

      setLoading(false);
      isSubmittingRef.current = false;
      navigate("/dashboard");
    } catch (err) {
      console.error("[TITAN LOGIN UNHANDLED]:", err);
      setErrorInfo({
        message: "An unexpected system error occurred. Please try again.",
        code: "UNHANDLED",
        isRateLimit: false,
        isNetworkError: false,
      });
      setLoading(false);
      isSubmittingRef.current = false;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070708] px-6 font-mono">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(250,204,21,0.04),transparent_60%)]" />

      <TitanCard variant="default" padding="lg" className="w-full max-w-md border-yellow-500/20">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-yellow-400/25 bg-yellow-400/10 text-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.15)]">
            <Shield className="size-7" />
          </div>
          <h1 className="text-3xl font-black tracking-wider text-yellow-400 font-sans">
            TITAN OS
          </h1>
          <p className="mt-2 text-xs text-zinc-400 uppercase tracking-widest">
            Operator Authentication
          </p>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
          <TitanInput
            type="email"
            placeholder="operator@titan.os"
            label="Email Address"
            leftIcon={<Mail className="size-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <TitanInput
            type="password"
            placeholder="••••••••"
            label="Security Passcode"
            leftIcon={<Lock className="size-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          {errorInfo && (
            <div
              className={`rounded-2xl border p-4 text-xs font-mono ${
                errorInfo.isRateLimit
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                  : "border-red-500/40 bg-red-500/10 text-red-300"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                <p className="font-bold leading-normal font-sans">{errorInfo.message}</p>
              </div>
            </div>
          )}

          <TitanButton
            fullWidth
            size="lg"
            loading={loading}
            disabled={loading}
            type="submit"
          >
            {loading ? "AUTHENTICATING..." : "Authenticate Operator"}
          </TitanButton>
        </form>

        <p className="mt-8 text-center text-xs text-zinc-400 font-mono">
          Unregistered operator?{" "}
          <Link to="/signup" className="font-bold text-yellow-400 hover:underline">
            Register Account
          </Link>
        </p>
      </TitanCard>
    </div>
  );
}