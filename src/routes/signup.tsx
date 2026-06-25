import { createFileRoute, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Sparkles, ArrowRight, User, Lock, Heart } from "lucide-react";

import { PageShell, Eyebrow } from "@/components/aura/PageShell";
import { Petals } from "@/components/aura/Petals";
import { useAuth } from "@/lib/auth-store";
import { useProfile } from "@/lib/aura-store";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign Up — AuraAI" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  component: SignUp,
});

function SignUp() {
  const { signUp } = useAuth();
  const { profile, setProfile } = useProfile();
  const navigate = useNavigate();
  const search = useRouterState({ select: (s) => s.location.search as Record<string, unknown> });
  const redirectTo = typeof search?.redirect === "string" && search.redirect.startsWith("/") ? search.redirect : "/profile";

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signUp(name, username, password);
    if (!result.ok) { setError(result.error); return; }
    if (name.trim() && !profile.name) setProfile({ ...profile, name: name.trim() });
    navigate({ to: redirectTo });
  };

  return (
    <PageShell>
      <div className="relative mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 py-28">
        <Petals count={10} opacity={0.3} />
        <div className="w-full text-center">
          <Eyebrow>Begin Your Journey</Eyebrow>
          <h1 className="mt-4 font-display text-4xl tracking-tight text-noir md:text-5xl">
            Create your <em className="font-light italic text-gradient-rose">bridal account</em>
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-noir/60">
            Save your bookings, shortlisted salons and planner progress — all in one place.
          </p>
        </div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass mt-10 w-full rounded-3xl p-8 md:p-10"
        >
          {error && (
            <p className="mb-5 rounded-xl border border-[#b54240]/30 bg-[#b54240]/10 px-4 py-3 text-sm text-[#b54240]">
              {error}
            </p>
          )}

          <label className="block text-[11px] uppercase tracking-[0.22em] text-noir/50">Bride Name</label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-rose-gold/25 bg-white/70 px-4 py-3">
            <Heart className="h-4 w-4 text-noir/40" />
            <input
              type="text" required autoComplete="name" placeholder="e.g. Priya Sundaram"
              value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent text-base text-noir focus:outline-none"
            />
          </div>

          <label className="mt-5 block text-[11px] uppercase tracking-[0.22em] text-noir/50">Username</label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-rose-gold/25 bg-white/70 px-4 py-3">
            <User className="h-4 w-4 text-noir/40" />
            <input
              type="text" required autoComplete="username" placeholder="your_username"
              value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent text-base text-noir focus:outline-none"
            />
          </div>

          <label className="mt-5 block text-[11px] uppercase tracking-[0.22em] text-noir/50">Password</label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-rose-gold/25 bg-white/70 px-4 py-3">
            <Lock className="h-4 w-4 text-noir/40" />
            <input
              type="password" required autoComplete="new-password" placeholder="At least 6 characters"
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-base text-noir focus:outline-none"
            />
          </div>

          <button type="submit" className="btn-luxury mt-7 w-full justify-center">
            <Sparkles className="h-3.5 w-3.5" /> Create Account <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <p className="mt-6 text-center text-sm text-noir/60">
            Already have an account?{" "}
            <Link to="/signin" search={{ redirect: redirectTo }} className="text-rose-gold hover:underline">
              Sign in
            </Link>
          </p>
        </motion.form>
      </div>
    </PageShell>
  );
}
