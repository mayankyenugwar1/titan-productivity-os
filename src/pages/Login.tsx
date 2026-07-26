import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, Shield } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { TitanButton, TitanCard, TitanInput } from "@/components/ui";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070708] px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(250,204,21,0.04),transparent_60%)]" />

      <TitanCard variant="default" padding="lg" className="w-full max-w-md border-yellow-500/20">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-yellow-400/25 bg-yellow-400/10 text-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.15)]">
            <Shield className="size-7" />
          </div>
          <h1 className="text-3xl font-black tracking-wider text-yellow-400">
            TITAN OS
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Operator Authentication
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <TitanInput
            type="email"
            placeholder="operator@titan.os"
            label="Email Address"
            leftIcon={<Mail className="size-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TitanInput
            type="password"
            placeholder="••••••••"
            label="Security Passcode"
            leftIcon={<Lock className="size-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
              {error}
            </p>
          )}

          <TitanButton fullWidth size="lg" loading={loading} type="submit">
            Authenticate Operator
          </TitanButton>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-400">
          Unregistered operator?{" "}
          <Link to="/signup" className="font-bold text-yellow-400 hover:underline">
            Register Account
          </Link>
        </p>
      </TitanCard>
    </div>
  );
}