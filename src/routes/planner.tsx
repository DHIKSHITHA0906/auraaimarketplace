import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, type ReactNode } from "react";
import { ArrowRight, ArrowLeft, Sparkles, Calendar, Wallet, MapPin, Check, Heart, Pencil, RotateCcw } from "lucide-react";

import { PageShell, Eyebrow } from "@/components/aura/PageShell";
import { Petals } from "@/components/aura/Petals";
import { useProfile, useBookings, usePlannerDraft, buildTimeline, type BridalProfile } from "@/lib/aura-store";
import { MAKEUP_STYLES } from "@/lib/makeup-styles";
import { SALONS, CHENNAI_AREAS, ALL_SERVICES as MARKETPLACE_SERVICES } from "./marketplace";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "Bridal Journey Planner — AuraAI Chennai" }] }),
  component: PlannerEntry,
});

const STEPS = [
  { key: "date",     label: "Wedding Date",   icon: Calendar, q: "When will you say 'I do'?" },
  { key: "area",     label: "Chennai Area",   icon: MapPin,   q: "Where in Chennai are you based?" },
  { key: "makeup",   label: "Makeup Style",   icon: Sparkles, q: "Which bridal look calls to you?" },
  { key: "skin",     label: "Skin Type",      icon: Sparkles, q: "How does your skin behave?" },
  { key: "budget",   label: "Budget",         icon: Wallet,   q: "Your beauty budget" },
  { key: "services", label: "Services",       icon: Sparkles, q: "What would you like Aura to plan?" },
] as const;

const SKIN_TYPES    = ["Dry", "Oily", "Combination", "Sensitive", "Dry + Sensitive", "Oily + Sensitive"];
const BUDGETS       = ["Under ₹25k", "₹25k–₹40k", "₹40k–₹60k", "₹60k–₹1L", "₹1L+"];
const ALL_SERVICES  = MARKETPLACE_SERVICES;

function todayISO() { return new Date().toISOString().slice(0, 10); }

function PlannerEntry() {
  const { draft, setDraft, reset, isPartial } = usePlannerDraft();
  const { profile, setProfile } = useProfile();
  const [resumePrompt, setResumePrompt] = useState(isPartial);

  // Already generated → timeline view with edit option.
  if (draft.generated) {
    return <TimelineView profile={draft.data} onEdit={() => setDraft({ ...draft, generated: false })} onRestart={() => { reset(); setProfile({ ...profile, weddingDate: "" }); }} />;
  }

  if (resumePrompt) {
    return (
      <PageShell>
        <div className="mx-auto max-w-2xl px-6 pt-32 text-center">
          <Eyebrow>Welcome back</Eyebrow>
          <h1 className="mt-4 font-display text-4xl tracking-tight text-noir md:text-5xl">
            You started your <em className="font-light italic text-gradient-rose">bridal plan</em>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-noir/65">
            Pick up where you left off — Step {draft.step + 1} of {STEPS.length}, with your previous answers saved.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button className="btn-luxury" onClick={() => setResumePrompt(false)}>
              <Sparkles className="h-3.5 w-3.5" /> Continue Planning
            </button>
            <button onClick={() => { reset(); setResumePrompt(false); }} className="btn-ghost-luxury">
              <RotateCcw className="h-3.5 w-3.5" /> Start New Plan
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  return <Wizard
    draft={draft.data}
    step={draft.step}
    onChange={(data) => setDraft({ ...draft, data })}
    onStep={(step) => setDraft({ ...draft, step })}
    onComplete={(data) => { setDraft({ step: STEPS.length - 1, data, generated: true }); setProfile(data); }}
  />;
}

function Wizard({ draft, step, onChange, onStep, onComplete }: {
  draft: BridalProfile; step: number;
  onChange: (d: BridalProfile) => void;
  onStep: (s: number) => void;
  onComplete: (d: BridalProfile) => void;
}) {
  const current = STEPS[step];
  const Icon = current.icon;

  const next = () => step < STEPS.length - 1 ? onStep(step + 1) : onComplete(draft);
  const back = () => step > 0 && onStep(step - 1);

  const valid =
    current.key === "date" ? !!draft.weddingDate :
    current.key === "area" ? !!draft.area :
    current.key === "makeup" ? !!draft.makeupStyle :
    current.key === "skin" ? !!draft.skinType :
    current.key === "budget" ? !!draft.budget :
    current.key === "services" ? draft.services.length > 0 : true;

  return (
    <PageShell>
      <div className="relative mx-auto max-w-3xl px-6 pt-28 pb-32">
        <Petals count={10} opacity={0.3} />
        <div className="text-center">
          <Eyebrow>The Bridal Journey · Step {step + 1} of {STEPS.length}</Eyebrow>
          <h1 className="mt-5 font-display text-4xl tracking-tight text-noir md:text-6xl">
            <em className="font-light italic text-gradient-rose">{current.q}</em>
          </h1>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <button onClick={() => i <= step && onStep(i)}
                className={`grid h-8 w-8 place-items-center rounded-full text-xs transition-all ${i <= step ? "text-white shadow" : "bg-white/60 text-noir/40"}`}
                style={i <= step ? { background: "var(--gradient-rose)" } : undefined}>
                <s.icon className="h-3 w-3" />
              </button>
              {i < STEPS.length - 1 && <div className={`h-px w-6 ${i < step ? "bg-rose-gold" : "bg-noir/15"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={current.key}
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="glass mt-10 rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-rose-gold">
              <Icon className="h-3.5 w-3.5" /> {current.label}
            </div>

            <div className="mt-8">
              {current.key === "date" && (
                <input type="date" value={draft.weddingDate} min={todayISO()}
                  onChange={(e) => onChange({ ...draft, weddingDate: e.target.value })}
                  className="w-full rounded-2xl border border-rose-gold/25 bg-white/70 px-5 py-4 font-display text-2xl text-noir focus:outline-none" />
              )}
              {current.key === "area"  && (
                <div className="space-y-4">
                  <select value={draft.area} onChange={(e) => onChange({ ...draft, area: e.target.value })}
                    className="w-full rounded-2xl border border-rose-gold/25 bg-white/70 px-5 py-4 font-display text-2xl text-noir focus:outline-none">
                    <option value="">Choose your Chennai area…</option>
                    {CHENNAI_AREAS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <p className="text-xs text-noir/55">Used to recommend nearby salons.</p>
                </div>
              )}
              {current.key === "makeup" && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {MAKEUP_STYLES.map((m) => {
                    const active = draft.makeupStyle === m.name;
                    return (
                      <button key={m.id} type="button" onClick={() => onChange({ ...draft, makeupStyle: m.name })}
                        className={`group relative overflow-hidden rounded-2xl border text-left transition ${active ? "border-rose-gold ring-2 ring-rose-gold/40" : "border-rose-gold/20 hover:border-rose-gold/50"}`}>
                        <div className="aspect-[2/3] w-full overflow-hidden bg-noir/5">
                          <img src={m.image} alt={m.name} loading="lazy" className="h-full w-full object-cover object-top" />
                        </div>
                        <div className={`absolute inset-0 bg-gradient-to-t ${active ? "from-rose-gold/85 via-rose-gold/10" : "from-noir/85 via-noir/10"} to-transparent`} />
                        <div className="absolute inset-x-0 bottom-0 p-3">
                          <p className="font-display text-sm leading-tight text-white">{m.short}</p>
                        </div>
                        {active && (
                          <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-rose-gold text-white">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
              {current.key === "skin"     && <Grid cols={2}>{SKIN_TYPES.map((s) => <Chip key={s} active={draft.skinType === s} onClick={() => onChange({ ...draft, skinType: s })}>{s}</Chip>)}</Grid>}
              {current.key === "budget"   && <Grid cols={2}>{BUDGETS.map((b) => <Chip key={b} active={draft.budget === b} onClick={() => onChange({ ...draft, budget: b })}>{b}</Chip>)}</Grid>}
              {current.key === "services" && (
                <Grid cols={2}>{ALL_SERVICES.map((s) => {
                  const on = draft.services.includes(s);
                  return (
                    <Chip key={s} active={on} onClick={() => onChange({ ...draft, services: on ? draft.services.filter((x) => x !== s) : [...draft.services, s] })}>
                      {on && <Check className="mr-1 inline h-3 w-3" />}{s}
                    </Chip>
                  );
                })}</Grid>
              )}
            </div>

            <div className="mt-10 flex items-center justify-between">
              <button onClick={back} disabled={step === 0}
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-noir/60 disabled:opacity-30 hover:text-rose-gold">
                <ArrowLeft className="h-3 w-3" /> Back
              </button>
              <button onClick={next} disabled={!valid} className="btn-luxury disabled:opacity-50">
                {step === STEPS.length - 1 ? "Reveal My Journey" : "Continue"}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </PageShell>
  );
}

function Grid({ cols, children }: { cols: number; children: ReactNode }) {
  return <div className={`grid gap-3 ${cols === 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}>{children}</div>;
}
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`rounded-2xl border px-4 py-4 text-left font-display text-lg transition ${active ? "border-rose-gold bg-rose-gold/10 text-rose-gold" : "border-rose-gold/20 bg-white/55 text-noir/85 hover:bg-white"}`}>
      {children}
    </button>
  );
}

function budgetCap(b: string) {
  if (b.startsWith("Under")) return 25000;
  if (b.includes("25k–₹40k")) return 40000;
  if (b.includes("40k–₹60k")) return 60000;
  if (b.includes("60k–₹1L")) return 100000;
  return 1_000_000;
}

/**
 * Recommendation scoring — matches salons on the four signals the planner
 * collects: Makeup Style, Budget, Timeline (days until the wedding), and
 * Required Services. Each signal contributes points; the salon list is
 * ranked by total score so the best-fit ateliers surface first.
 */
function scoreSalon(s: (typeof SALONS)[number], profile: BridalProfile, daysOut: number) {
  let score = 0;

  // Makeup Style — strongest signal, since it's now the planner's central category.
  if (profile.makeupStyle && s.makeupStyles.includes(profile.makeupStyle)) score += 50;

  // Budget — reward salons priced at or under the bride's cap; penalise being far over it.
  const cap = budgetCap(profile.budget);
  if (s.priceFrom <= cap) score += 25;
  else if (s.priceFrom <= cap * 1.2) score += 10;
  else score -= 15;

  // Required Services — one point per overlapping service requested.
  const overlap = profile.services.filter((sv) => s.services.includes(sv)).length;
  score += overlap * 8;

  // Timeline — a wedding under 30 days out favours highly-rated, fast-turnaround salons.
  if (daysOut <= 30) score += s.rating * 4;
  else score += s.rating * 2;

  // Small nudge for being in the bride's own area.
  if (profile.area && s.area === profile.area) score += 12;

  return score;
}

function TimelineView({ profile, onEdit, onRestart }: { profile: BridalProfile; onEdit: () => void; onRestart: () => void }) {
  const { add } = useBookings();
  const milestones = useMemo(() => buildTimeline(profile.weddingDate, profile.services, profile.skinType, profile.makeupStyle), [profile]);
  const daysOut = Math.ceil((+new Date(profile.weddingDate) - Date.now()) / 86400000);

  const recs = useMemo(() => {
    return [...SALONS]
      .map((s) => ({ salon: s, score: scoreSalon(s, profile, daysOut) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((r) => r.salon);
  }, [profile, daysOut]);

  const tip =
    profile.skinType.includes("Sensitive") ? "Sensitive skin needs a 6-week buffer for any new active — Aura's spaced this plan to avoid reactions before the date." :
    profile.skinType.startsWith("Oily")    ? "Chennai humidity meets oily skin — Aura prioritises mattifying primers and oil-control HD bases on the day." :
    profile.skinType.startsWith("Dry")     ? "For dry skin in Chennai's coastal air, we layer hydration weeks ahead and use dewy bases." :
                                              "Balanced for Chennai's humidity and your skin type.";

  const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const bookMilestone = (m: { service: string; title: string; recommendedDate: string }) => {
    const salon = recs.find((s) => s.services.includes(m.service)) ?? recs[0] ?? SALONS[0];
    add({ salonId: salon.id, salonName: salon.name, salonImage: salon.image, service: m.title, date: m.recommendedDate, time: "10:00", area: salon.area, phone: salon.phone, price: salon.priceFrom });
    alert(`Booked ${m.title} on ${fmt(m.recommendedDate)} at ${salon.name}.`);
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-6 pt-28 pb-32">
        <div className="text-center">
          <Eyebrow>Your Journey, Composed</Eyebrow>
          <h1 className="mt-5 font-display text-5xl tracking-tight text-noir md:text-7xl">
            Welcome to <em className="font-light italic text-gradient-rose">your becoming</em>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm font-light text-noir/70">
            A bespoke timeline for your {profile.makeupStyle ? profile.makeupStyle.toLowerCase() : "bridal"} look in {profile.area}, Chennai on {fmt(profile.weddingDate)} · {daysOut > 0 ? `${daysOut} days away` : "today"}.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-xs italic text-noir/60">{tip}</p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={onEdit} className="btn-ghost-luxury"><Pencil className="h-3.5 w-3.5" /> Edit Preferences</button>
            <button onClick={onRestart} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-noir/55 hover:text-rose-gold">
              <RotateCcw className="h-3 w-3" /> Start New Plan
            </button>
          </div>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-rose-gold/40 to-transparent md:block" />
          <div className="space-y-10">
            {milestones.length === 0 && (
              <p className="text-center text-sm text-noir/60">Your wedding is here — head straight to the marketplace and book your wedding-day look.</p>
            )}
            {milestones.map((m, i) => (
              <motion.div key={m.key}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.55, delay: i * 0.05 }}
                className={`relative md:grid md:grid-cols-2 md:gap-12 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div className={`glass rounded-2xl p-7 ${i % 2 ? "md:text-left" : "md:text-right"}`}>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-rose-gold">
                    {m.daysBefore === 0 ? "Wedding day" : `${m.daysBefore} days before · ${fmt(m.recommendedDate)}`}
                  </p>
                  <h3 className="mt-3 font-display text-3xl text-noir">{m.title}</h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-noir/45">{m.service}</p>
                  <p className="mt-3 text-sm text-noir/70">{m.body}</p>
                  <button onClick={() => bookMilestone(m)}
                    className={`mt-5 inline-flex items-center gap-1.5 rounded-full border border-rose-gold/35 bg-white/60 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-noir transition hover:bg-rose-gold hover:text-white ${i % 2 ? "" : "md:ml-auto"}`}>
                    <Calendar className="h-3 w-3" /> Book this appointment
                  </button>
                </div>
                <div className="hidden md:flex md:items-center md:justify-center">
                  <div className="grid h-10 w-10 place-items-center rounded-full text-white shadow-lg" style={{ background: "var(--gradient-rose)" }}>
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {recs.length > 0 && (
          <section className="mt-24">
            <h2 className="text-[11px] uppercase tracking-[0.3em] text-noir/50">Recommended for your plan · matched on makeup style, budget, timeline &amp; services</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
              {recs.map((s) => (
                <Link key={s.id} to="/marketplace/$salonId" params={{ salonId: s.id }} className="group block overflow-hidden rounded-2xl">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img src={s.image} alt={s.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="mt-3">
                    <p className="font-display text-xl text-noir">{s.name}</p>
                    <p className="text-xs text-noir/60">{s.area} · from ₹{(s.priceFrom/1000).toFixed(0)}k</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-16 text-center">
          <Link to="/bookings" className="btn-luxury"><Heart className="h-3.5 w-3.5" /> View My Bookings</Link>
        </div>
      </div>
    </PageShell>
  );
}
