import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Lock, Mail, Shield, User, UserCheck } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { TitanButton, TitanCard, TitanInput } from "@/components/ui";
import type { FriendlyAuthResult } from "@/utils/authErrorHandler";

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<FriendlyAuthResult | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    requiresVerification: boolean;
    email: string;
  } | null>(null);

  // Synchronous ref to prevent double-click / rapid multi-tap execution
  const isSubmittingRef = useRef(false);

  const validateForm = (): string | null => {
    if (!fullName.trim()) return "Operator Name is required.";
    if (!username.trim()) return "Username / Callsign is required.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Please enter a valid email address (e.g. operator@titan.os).";
    }
    if (!password || password.length < 6) {
      return "Security passcode must be at least 6 characters long.";
    }
    return null;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (loading || isSubmittingRef.current) return;

    setErrorInfo(null);

    // Client-side pre-validation
    const validationMessage = validateForm();
    if (validationMessage) {
      setErrorInfo({
        message: validationMessage,
        code: "CLIENT_VALIDATION",
        isRateLimit: false,
        isNetworkError: false,
      });
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    try {
      const response = await signUp(fullName, username, email, password);

      if (response.error) {
        setErrorInfo(response.error);
        setLoading(false);
        isSubmittingRef.current = false;
        return;
      }

      const requiresVerification = Boolean(response.data?.requiresVerification);

      setSuccessInfo({
        requiresVerification,
        email: email.trim(),
      });
    } catch (err) {
      console.error("[TITAN SIGNUP UNHANDLED]:", err);
      setErrorInfo({
        message: "An unexpected system error occurred during registration. Please try again.",
        code: "UNHANDLED",
        isRateLimit: false,
        isNetworkError: false,
      });
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070708] px-6 py-12 font-mono">
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
            Register New Operator Record
          </p>
        </div>

        {/* Success State Readout */}
        {successInfo ? (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="size-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white font-sans">
                Operator Dossier Created
              </h3>
              <p className="mt-2 text-xs text-zinc-300 font-sans leading-relaxed">
                {successInfo.requiresVerification
                  ? `Registration signal transmitted for ${successInfo.email}. Please check your email inbox to verify your account before signing in.`
                  : "Operator record successfully provisioned into the TITAN OS clearance database."}
              </p>
            </div>

            <div className="pt-2">
              <TitanButton
                fullWidth
                size="lg"
                onClick={() => navigate("/login")}
              >
                PROCEED TO AUTHENTICATION
              </TitanButton>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <TitanInput
              type="text"
              placeholder="Operator Name"
              label="Full Name"
              leftIcon={<User className="size-4" />}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              required
            />

            <TitanInput
              type="text"
              placeholder="Callsign / Handle"
              label="Username"
              leftIcon={<UserCheck className="size-4" />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />

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
              placeholder="•••••••• (Min. 6 chars)"
              label="Security Passcode"
              leftIcon={<Lock className="size-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />

            {/* Error Notification Panel */}
            {errorInfo && (
              <div
                className={`rounded-2xl border p-4 text-xs font-mono transition-all ${
                  errorInfo.isRateLimit
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                    : "border-red-500/40 bg-red-500/10 text-red-300"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold leading-normal font-sans">{errorInfo.message}</p>
                    {errorInfo.isRateLimit && (
                      <p className="text-[11px] text-amber-400/90 font-sans">
                        Tip: Supabase auth rate limits protect system security. Wait 2-3 minutes before attempting registration again.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <TitanButton
                fullWidth
                size="lg"
                loading={loading}
                disabled={loading}
                type="submit"
              >
                {loading ? "REGISTERING OPERATOR..." : "Register Operator"}
              </TitanButton>
            </div>
          </form>
        )}

        {!successInfo && (
          <p className="mt-8 text-center text-xs text-zinc-400 font-mono">
            Already registered?{" "}
            <Link to="/login" className="font-bold text-yellow-400 hover:underline">
              Authenticate Operator
            </Link>
          </p>
        )}
      </TitanCard>
    </div>
  );
}