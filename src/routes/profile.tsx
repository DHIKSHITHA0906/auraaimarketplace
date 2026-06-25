import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Crown, Calendar, MapPin, Heart, Sparkles, Check, ArrowUpRight, Wallet, Bell, BellOff, ListChecks, Trash2, Pencil, X, LogIn, LogOut, ShieldCheck } from "lucide-react";

import { PageShell, Eyebrow } from "@/components/aura/PageShell";
import { Petals } from "@/components/aura/Petals";
import {
  useProfile, useBookings, useWishlist, buildTimeline,
  useTasks, useBudget, useNotifs,
} from "@/lib/aura-store";
import { useAuth } from "@/lib/auth-store";
import { SALONS } from "./marketplace";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — AuraAI" }] }),
  component: Profile,
});

const fmt = (iso: string) => iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function Profile() {
  const { profile, setProfile, hasProfile } = useProfile();
  const { upcoming, past, bookings } = useBookings();
  const wishlist = useWishlist();
  const tasks = useTasks();
  const budget = useBudget();
  const notifs = useNotifs();
  const auth = useAuth();
  const saved = SALONS.filter((s) => wishlist.has(s.id));

  // Auto-derive task completion from real activity
  useEffect(() => {
    const set = (k: string, done: boolean) => {
      const t = tasks.tasks.find((x) => x.key === k);
      if (t && t.done !== done) tasks.setAuto(k, done);
    };
    set("date",   !!profile.weddingDate);
    set("budget", budget.total > 0);
    set("salon",  saved.length > 0 || bookings.length > 0);
    set("makeup", bookings.some((b) => /makeup|bridal/i.test(b.service)));
    set("mehendi", bookings.some((b) => /mehendi/i.test(b.service)));
    set("hair",    past.some((b) => /hair/i.test(b.service)));
    set("skincare",past.some((b) => /skin|facial|pre-bridal/i.test(b.service)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.weddingDate, budget.total, saved.length, bookings.length, past.length]);

  // IMPORTANT: this hook must run on every render (even before we know
  // hasProfile), otherwise the number of hooks called changes between
  // renders and React throws "Rendered fewer hooks than expected", which
  // crashes the page into the error boundary ("This page didn't load").
  const countdown = useMemo(() => {
    if (!profile.weddingDate) return { d: 0, h: 0, m: 0 };
    const ms = +new Date(profile.weddingDate) - Date.now();
    const d = Math.max(0, Math.floor(ms / 86400000));
    const h = Math.max(0, Math.floor((ms / 3600000) % 24));
    const m = Math.max(0, Math.floor((ms / 60000) % 60));
    return { d, h, m };
  }, [profile.weddingDate]);

  if (!hasProfile) {
    return (
      <PageShell>
        <div className="mx-auto max-w-3xl px-6 pt-32 pb-32 text-center">
          <Eyebrow>The Bride</Eyebrow>
          {auth.isAuthenticated && (
            <div className="mx-auto mt-6 max-w-md">
              <p className="text-[11px] uppercase tracking-[0.22em] text-noir/50">Bride Name</p>
              <div className="mt-2">
                <BrideNameField
                  name={auth.user?.name || profile.name}
                  onSave={(name) => {
                    auth.updateName(name);
                    setProfile({ ...profile, name });
                  }}
                />
              </div>
            </div>
          )}
          <h1 className="mt-6 font-display text-5xl tracking-tight text-noir md:text-6xl">Your bridal profile awaits</h1>
          <p className="mx-auto mt-5 max-w-md text-sm text-noir/60">
            Tell Aura about your wedding — date, makeup style, city — and we'll compose your full bridal beauty journey, just for you.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/planner" className="btn-luxury"><Sparkles className="h-3.5 w-3.5" /> Start My Journey</Link>
            <Link to="/marketplace" className="btn-ghost-luxury">Browse Salons</Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const milestones = buildTimeline(profile.weddingDate, profile.services, profile.skinType, profile.makeupStyle);
  const completedKeys = new Set(past.map((b) => b.service));
  const completedMilestones = milestones.filter((m) => completedKeys.has(m.title)).length;
  const daysLeft = Math.max(0, Math.ceil((+new Date(profile.weddingDate) - Date.now()) / 86400000));

  return (
    <PageShell>
      <section className="relative h-[36vh] w-full overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-rose)" }} />
        <Petals count={16} opacity={0.55} />
        <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/10 to-transparent" />
      </section>

      <div className="mx-auto max-w-6xl px-6 -mt-28 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-6 rounded-[2rem] p-8 md:flex md:items-end md:p-10"
        >
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full text-3xl font-display text-white shadow-xl md:h-24 md:w-24 md:text-4xl"
            style={{ background: "var(--gradient-rose)" }}>
            {(profile.name || "B")[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <Eyebrow>The Bride</Eyebrow>
            <BrideNameField
              name={auth.user?.name || profile.name}
              onSave={(name) => { auth.updateName(name); setProfile({ ...profile, name }); }}
            />
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-noir/60">
              <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {fmt(profile.weddingDate)}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {profile.area}, Chennai</span>
              {profile.makeupStyle && <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> {profile.makeupStyle}</span>}
            </p>
          </div>
          <Link to="/planner" className="btn-ghost-luxury col-span-2 justify-self-start md:col-auto">Edit Plan</Link>
        </motion.div>

        {/* Account status */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-gold/15 bg-white/40 px-5 py-3.5 text-sm">
          {auth.isAuthenticated ? (
            <>
              <span className="flex items-center gap-2 text-noir/70">
                <ShieldCheck className="h-4 w-4 text-rose-gold" />
                Signed in as <span className="font-medium text-noir">{auth.user?.name}</span> · your data is saved to this account.
              </span>
              <button onClick={auth.signOut} className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-noir/55 hover:text-rose-gold">
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <span className="text-noir/60">You're browsing as a guest — your data is only saved on this device.</span>
              <Link to="/signup" className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-rose-gold hover:underline">
                <LogIn className="h-3.5 w-3.5" /> Create an account
              </Link>
            </>
          )}
        </div>

        {/* Countdown */}
        <div className="mt-6 grid gap-6 md:grid-cols-[2fr_1fr_1fr]">
          <div className="glass rounded-3xl p-7">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-noir/50">
              <span>Wedding Countdown</span><span className="text-rose-gold"><Sparkles className="h-4 w-4" /></span>
            </div>
            <div className="mt-4 flex items-end gap-6">
              <CountdownBlock value={countdown.d} label="Days" />
              <CountdownBlock value={countdown.h} label="Hours" />
              <CountdownBlock value={countdown.m} label="Mins" />
            </div>
            <p className="mt-3 text-xs text-noir/55">{fmt(profile.weddingDate)} · {profile.area}</p>
          </div>
          <Stat title="Bookings" value={String(bookings.length).padStart(2, "0")} caption={`${upcoming.length} upcoming · ${past.length} done`} icon={<Calendar className="h-4 w-4" />} />
          <Stat title="Saved" value={String(saved.length).padStart(2, "0")} caption="salons shortlisted" icon={<Heart className="h-4 w-4" />} />
        </div>

        {/* Bridal Achievements */}
        <div className="mt-10 glass rounded-3xl p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] uppercase tracking-[0.3em] text-noir/50 inline-flex items-center gap-2">
              <Crown className="h-3.5 w-3.5" /> Bridal Achievements
            </h2>
            <span className="text-xs text-noir/55">{tasks.percent}% complete</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {tasks.tasks.map((t) => (
              <div key={t.key}
                className={`flex items-center gap-2.5 rounded-2xl border px-3.5 py-3 transition ${t.done ? "border-rose-gold/40 bg-rose-gold/10" : "border-rose-gold/15 bg-white/40"}`}>
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] ${t.done ? "bg-rose-gold text-white" : "border border-rose-gold/30 text-transparent"}`}>
                  {t.done && <Check className="h-3 w-3" />}
                </span>
                <span className={`text-xs leading-tight ${t.done ? "text-noir" : "text-noir/50"}`}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trackers row: Tasks + Budget */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="glass rounded-3xl p-7">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] uppercase tracking-[0.3em] text-noir/50 inline-flex items-center gap-2">
                <ListChecks className="h-3.5 w-3.5" /> Bridal Progress
              </h2>
              <span className="text-xs text-noir/55">{tasks.completed} / {tasks.total} · {tasks.percent}%</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-rose-gold/10">
              <div className="h-full rounded-full transition-all" style={{ width: `${tasks.percent}%`, background: "var(--gradient-rose)" }} />
            </div>
            <ul className="mt-5 space-y-2">
              {tasks.tasks.map((t) => (
                <li key={t.key}>
                  <button onClick={() => tasks.toggle(t.key)}
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-white/70">
                    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${t.done ? "border-rose-gold bg-rose-gold text-white" : "border-rose-gold/40"}`}>
                      {t.done && <Check className="h-3 w-3" />}
                    </span>
                    <span className={`flex-1 text-sm ${t.done ? "text-noir/40 line-through" : "text-noir"}`}>{t.label}</span>
                    {t.auto && <span className="text-[10px] uppercase tracking-[0.2em] text-rose-gold/60">auto</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-3xl p-7">
            <h2 className="text-[11px] uppercase tracking-[0.3em] text-noir/50 inline-flex items-center gap-2">
              <Wallet className="h-3.5 w-3.5" /> Budget Tracker
            </h2>
            <div className="mt-5">
              <label className="text-[11px] uppercase tracking-[0.22em] text-noir/50">Total budget</label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-rose-gold/25 bg-white/60 px-3 py-2.5">
                <span className="font-display text-base text-rose-gold">₹</span>
                <input
                  type="number" min={0} placeholder="e.g. 80000"
                  value={budget.total || ""}
                  onChange={(e) => budget.setTotal(Number(e.target.value) || 0)}
                  className="w-full bg-transparent text-base text-noir focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <BudgetBlock label="Total" value={inr(budget.total)} />
              <BudgetBlock label="Used" value={inr(budget.used)} tone="rose" />
              <BudgetBlock label={budget.overspend ? "Over" : "Left"} value={inr(budget.overspend || budget.remaining)} tone={budget.overspend ? "warn" : "ok"} />
            </div>
            {budget.total > 0 && (
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-rose-gold/10">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (budget.used / budget.total) * 100)}%`,
                    background: budget.overspend ? "linear-gradient(90deg,#d97757,#b54240)" : "var(--gradient-rose)" }} />
              </div>
            )}
            <p className="mt-4 text-[11px] text-noir/50">Auto-calculated from your bookings · update total any time.</p>
          </div>
        </div>

        {/* Bridal plan + preferences */}
        <div className="mt-10 grid gap-6 md:grid-cols-[1.5fr_1fr]">
          <div className="glass rounded-3xl p-7">
            <h2 className="text-[11px] uppercase tracking-[0.3em] text-noir/50">Bridal Plan · Milestones</h2>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-rose-gold/10">
                <div className="h-full rounded-full transition-all" style={{ width: `${milestones.length ? (completedMilestones / milestones.length) * 100 : 0}%`, background: "var(--gradient-rose)" }} />
              </div>
              <span className="text-xs text-noir/60">{completedMilestones} / {milestones.length}</span>
            </div>
            <ul className="mt-6 space-y-3">
              {milestones.map((m) => {
                const done = completedKeys.has(m.title);
                return (
                  <li key={m.key} className="flex items-center justify-between gap-4 border-b border-rose-gold/10 pb-3 last:border-0">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${done ? "bg-rose-gold text-white" : "border border-rose-gold/30 text-rose-gold/50"}`}>
                        {done && <Check className="h-3 w-3" />}
                      </span>
                      <div className="min-w-0">
                        <p className={`truncate text-sm ${done ? "line-through text-noir/40" : "text-noir"}`}>{m.title}</p>
                        <p className="text-[11px] text-noir/45">{fmt(m.recommendedDate)}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-noir/40">{m.service}</span>
                  </li>
                );
              })}
              {milestones.length === 0 && <li className="text-sm text-noir/55">No future milestones — your wedding is here ✦</li>}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-3xl p-7">
              <h2 className="text-[11px] uppercase tracking-[0.3em] text-noir/50">Preferences</h2>
              <div className="mt-5 space-y-3">
                <Pref label="Makeup Style" value={profile.makeupStyle} />
                <Pref label="Skin Type" value={profile.skinType} />
                <Pref label="Budget Tier" value={profile.budget} />
                <Pref label="Services" value={profile.services.join(" · ")} />
              </div>
            </div>

            <div className="glass rounded-3xl p-7">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] uppercase tracking-[0.3em] text-noir/50 inline-flex items-center gap-2">
                  <Bell className="h-3.5 w-3.5" /> Notifications {notifs.unread > 0 && <span className="rounded-full bg-rose-gold px-1.5 text-[10px] text-white">{notifs.unread}</span>}
                </h2>
                {notifs.list.length > 0 && (
                  <button onClick={notifs.markAllRead} className="text-[10px] uppercase tracking-[0.22em] text-noir/50 hover:text-rose-gold">Mark read</button>
                )}
              </div>
              {daysLeft <= 90 && daysLeft > 0 && (
                <button onClick={() => notifs.add({ title: `${daysLeft} days to go ✦`, body: `Your wedding is approaching${profile.makeupStyle ? ` — time to lock in your ${profile.makeupStyle.toLowerCase()}` : ""}. Time to finalise trials.` })}
                  className="mt-4 w-full rounded-xl border border-rose-gold/25 bg-white/50 px-3 py-2 text-left text-xs text-noir/70 hover:bg-white">
                  + Add countdown reminder
                </button>
              )}
              {notifs.list.length === 0 ? (
                <p className="mt-4 flex items-center gap-2 text-sm text-noir/55"><BellOff className="h-3.5 w-3.5" /> No notifications.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {notifs.list.slice(0, 5).map((n) => (
                    <li key={n.id} className={`group rounded-xl p-3 transition ${n.read ? "bg-white/40" : "bg-rose-gold/10"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-noir">{n.title}</p>
                          <p className="mt-0.5 text-xs text-noir/60">{n.body}</p>
                        </div>
                        <button onClick={() => notifs.remove(n.id)} className="shrink-0 text-noir/30 hover:text-rose-gold opacity-0 group-hover:opacity-100">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Saved + Upcoming */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="glass rounded-3xl p-7">
            <h2 className="text-[11px] uppercase tracking-[0.3em] text-noir/50">Saved Ateliers</h2>
            {saved.length === 0 ? (
              <p className="mt-4 text-sm text-noir/55">No saved salons yet. <Link to="/marketplace" className="text-rose-gold hover:underline">Browse →</Link></p>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {saved.slice(0, 4).map((s) => (
                  <Link key={s.id} to="/marketplace/$salonId" params={{ salonId: s.id }}
                    className="group flex items-center gap-3 rounded-2xl border border-rose-gold/15 bg-white/60 p-3 transition hover:border-rose-gold">
                    <img src={s.image} alt={s.name} className="h-12 w-12 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-base text-noir">{s.name}</p>
                      <p className="text-[11px] text-noir/55">{s.area}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-rose-gold opacity-0 transition group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="glass rounded-3xl p-7">
            <h2 className="text-[11px] uppercase tracking-[0.3em] text-noir/50">Upcoming Appointments</h2>
            {upcoming.length === 0 ? (
              <p className="mt-4 text-sm text-noir/55">No upcoming appointments. <Link to="/marketplace" className="text-rose-gold hover:underline">Book one →</Link></p>
            ) : (
              <ul className="mt-5 space-y-3">
                {upcoming.slice(0, 4).map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-3 border-b border-rose-gold/10 pb-3 last:border-0">
                    <div className="min-w-0">
                      <p className="truncate font-display text-base text-noir">{b.service}</p>
                      <p className="text-[11px] text-noir/55">{b.salonName} · {b.time}</p>
                    </div>
                    <p className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-rose-gold">{fmt(b.date)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function BrideNameField({ name, onSave }: { name: string; onSave: (name: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);

  const save = () => {
    onSave(value.trim());
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="mt-2 flex items-center gap-2">
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") { setValue(name); setEditing(false); } }}
          placeholder="Your name"
          className="w-full max-w-xs rounded-xl border border-rose-gold/30 bg-white/80 px-3 py-1.5 font-display text-2xl text-noir focus:outline-none md:text-4xl"
        />
        <button onClick={save} aria-label="Save name" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-rose-gold text-white hover:bg-rose-gold/90">
          <Check className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => { setValue(name); setEditing(false); }} aria-label="Cancel" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-rose-gold/30 text-noir/60 hover:text-rose-gold">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => { setValue(name); setEditing(true); }} className="group mt-2 flex items-center gap-2 text-left">
      <h1 className="truncate font-display text-3xl tracking-tight text-noir md:text-5xl">{name || "Add your name"}</h1>
      <Pencil className="h-4 w-4 shrink-0 text-noir/30 opacity-0 transition group-hover:opacity-100" />
    </button>
  );
}

function Stat({ title, value, caption, icon }: { title: string; value: string; caption: string; icon: ReactNode }) {
  return (
    <div className="glass rounded-3xl p-7">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-noir/50">
        <span>{title}</span><span className="text-rose-gold">{icon}</span>
      </div>
      <p className="mt-4 font-display text-5xl tracking-tight text-noir">{value}</p>
      <p className="mt-1 text-xs text-noir/55">{caption}</p>
    </div>
  );
}
function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="font-display text-5xl tracking-tight text-noir md:text-6xl">{String(value).padStart(2, "0")}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-noir/55">{label}</p>
    </div>
  );
}
function BudgetBlock({ label, value, tone }: { label: string; value: string; tone?: "rose" | "ok" | "warn" }) {
  const toneCls = tone === "warn" ? "text-[#b54240]" : tone === "ok" ? "text-emerald-700" : tone === "rose" ? "text-rose-gold" : "text-noir";
  return (
    <div className="rounded-2xl border border-rose-gold/15 bg-white/50 px-3 py-3">
      <p className="text-[10px] uppercase tracking-[0.22em] text-noir/50">{label}</p>
      <p className={`mt-1 font-display text-lg ${toneCls}`}>{value}</p>
    </div>
  );
}
function Pref({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-rose-gold/10 pb-3 last:border-0 last:pb-0">
      <span className="shrink-0 text-xs uppercase tracking-[0.22em] text-noir/50">{label}</span>
      <span className="truncate text-right font-display text-base text-noir">{value || "—"}</span>
    </div>
  );
}
