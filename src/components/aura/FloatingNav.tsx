import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Home, Store, Sparkles, Palette, MessageCircle, Calendar, User, LogOut } from "lucide-react";

import { useAuth } from "@/lib/auth-store";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/marketplace", label: "Salons", icon: Store },
  { to: "/planner", label: "Planner", icon: Sparkles },
  { to: "/styles", label: "Styles", icon: Palette },
  { to: "/assistant", label: "Aura", icon: MessageCircle },
  { to: "/bookings", label: "Bookings", icon: Calendar },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function FloatingNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <div className="glass flex items-center gap-1 rounded-full px-2 py-2 shadow-[0_20px_60px_-15px_oklch(0.5_0.08_30/0.35)]">
        <Link
          to="/"
          className="mr-2 hidden items-center gap-2 pl-3 pr-1 sm:flex"
        >
          <span className="font-display text-lg tracking-wider text-noir">
            Aura<span className="text-gradient-rose font-medium">AI</span>
          </span>
        </Link>
        {items.map(({ to, label, icon: Icon }) => {
          const active =
            to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className="group relative"
            >
              <div
                className={`relative flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
                  active ? "text-white" : "text-noir/70 hover:text-noir"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    className="absolute inset-0 rounded-full"
                    style={{ background: "var(--gradient-rose)" }}
                  />
                )}
                <Icon className="relative h-3.5 w-3.5" strokeWidth={1.6} />
                <span className="relative hidden md:inline">{label}</span>
              </div>
            </Link>
          );
        })}

        <div className="ml-1 hidden h-6 w-px bg-noir/10 sm:block" />

        {isAuthenticated && (
          <button
            onClick={() => { signOut(); navigate({ to: "/" }); }}
            className="group relative"
            title={`Sign out of ${user?.name ?? "account"}`}
          >
            <div className="relative flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-noir/70 transition-colors hover:text-noir">
              <LogOut className="relative h-3.5 w-3.5" strokeWidth={1.6} />
              <span className="relative hidden md:inline">Sign Out</span>
            </div>
          </button>
        )}
      </div>
    </motion.nav>
  );
}
