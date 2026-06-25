import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Search, MapPin, Star, SlidersHorizontal, Heart, ArrowUpRight, Phone, Sparkles } from "lucide-react";

import { PageShell, Eyebrow } from "@/components/aura/PageShell";
import { useWishlist, useProfile } from "@/lib/aura-store";
import { SALONS, CHENNAI_AREAS, ALL_SERVICES, ALL_MAKEUP_STYLES, type Salon } from "./marketplace";

export const Route = createFileRoute("/marketplace/")({
  head: () => ({
    meta: [
      { title: "Bridal Salon Marketplace — AuraAI Chennai" },
      { name: "description", content: "Discover and book Chennai's most-loved bridal salons across T Nagar, Adyar, Mylapore, Velachery and more." },
    ],
  }),
  component: Marketplace,
});

const SERVICES = ["All", ...ALL_SERVICES];
const MAKEUP_STYLE_OPTIONS = ["All", ...ALL_MAKEUP_STYLES];
const AREAS = ["All", ...CHENNAI_AREAS];

function Marketplace() {
  const { profile } = useProfile();
  const [q, setQ] = useState("");
  const [service, setService] = useState("All");
  const [makeupStyle, setMakeupStyle] = useState("All");
  const [area, setArea] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [maxBudget, setMaxBudget] = useState(100000);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const wishlist = useWishlist();

  const filtered = useMemo(() => {
    const list = SALONS.filter((s) => {
      if (q && !`${s.name} ${s.tagline} ${s.area} ${s.services.join(" ")} ${s.makeupStyles.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (service !== "All" && !s.services.includes(service)) return false;
      if (makeupStyle !== "All" && !s.makeupStyles.includes(makeupStyle)) return false;
      if (area !== "All" && s.area !== area) return false;
      if (s.rating < minRating) return false;
      if (s.priceFrom > maxBudget) return false;
      if (showSavedOnly && !wishlist.has(s.id)) return false;
      return true;
    });
    if (profile.area) {
      list.sort((a, b) => Number(b.area === profile.area) - Number(a.area === profile.area));
    }
    return list;
  }, [q, service, makeupStyle, area, minRating, maxBudget, showSavedOnly, wishlist, profile.area]);

  const featured = SALONS.filter((s) => s.featured);

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-6 pt-28 pb-10">
        <Eyebrow>Chennai · The Marketplace</Eyebrow>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-display text-5xl tracking-tight text-noir md:text-7xl">
            Chennai's finest, <em className="font-light italic text-gradient-rose">curated for you</em>
          </h1>
          <p className="max-w-sm text-sm font-light text-noir/70">
            Hand-verified bridal salons across T Nagar, Adyar, Mylapore, Velachery and beyond. Book online or call directly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <h2 className="mb-5 text-[11px] uppercase tracking-[0.3em] text-noir/50">Featured This Season</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((s, i) => <FeaturedCard key={s.id} salon={s} delay={i * 0.1} />)}
        </div>
      </section>

      <section className="sticky top-4 z-30 mx-auto max-w-7xl px-6">
        <div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-3">
          <div className="flex flex-1 min-w-[220px] items-center gap-2 px-3">
            <Search className="h-4 w-4 text-noir/40" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, service or area…"
              className="w-full bg-transparent py-2 text-sm text-noir placeholder:text-noir/40 focus:outline-none"
            />
          </div>
          <Select label="Service" value={service} onChange={setService} options={SERVICES} />
          <Select label="Makeup Style" value={makeupStyle} onChange={setMakeupStyle} options={MAKEUP_STYLE_OPTIONS} />
          <Select label="Area" value={area} onChange={setArea} options={AREAS} />
          <BudgetSelect value={maxBudget} onChange={setMaxBudget} />
          <RatingSelect value={minRating} onChange={setMinRating} />
          <button type="button" onClick={() => setShowSavedOnly((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] transition ${showSavedOnly ? "bg-rose-gold text-white" : "bg-white/50 text-noir/60 hover:bg-white"}`}>
            <Heart className="h-3 w-3" fill={showSavedOnly ? "currentColor" : "none"} /> Saved
          </button>
          <div className="hidden items-center gap-1 px-2 text-[11px] uppercase tracking-[0.2em] text-noir/40 md:flex">
            <SlidersHorizontal className="h-3 w-3" /> {filtered.length} results
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-10 pb-32">
        <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s, i) => <SalonCard key={s.id} salon={s} delay={i * 0.04} />)}
        </motion.div>

        {filtered.length === 0 && (
          <div className="py-24 text-center text-sm text-noir/55">
            {showSavedOnly
              ? "No saved salons yet — tap the heart on any salon to save it."
              : "No salons match — soften your filters to reveal more."}
          </div>
        )}
      </section>
    </PageShell>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex items-center gap-2 rounded-xl bg-white/50 px-3 py-2 text-xs">
      <span className="uppercase tracking-[0.18em] text-noir/40">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent text-sm font-medium text-noir focus:outline-none">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
function BudgetSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const opts = [{ v: 25000, l: "Up to ₹25k" }, { v: 40000, l: "Up to ₹40k" }, { v: 60000, l: "Up to ₹60k" }, { v: 100000, l: "Any" }];
  return (
    <label className="flex items-center gap-2 rounded-xl bg-white/50 px-3 py-2 text-xs">
      <span className="uppercase tracking-[0.18em] text-noir/40">Budget</span>
      <select value={value} onChange={(e) => onChange(Number(e.target.value))} className="bg-transparent text-sm font-medium text-noir focus:outline-none">
        {opts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </label>
  );
}
function RatingSelect({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-xl bg-white/50 px-3 py-2 text-xs">
      <span className="uppercase tracking-[0.18em] text-noir/40">Rating</span>
      <select value={value} onChange={(e) => onChange(Number(e.target.value))} className="bg-transparent text-sm font-medium text-noir focus:outline-none">
        <option value={0}>Any</option>
        <option value={4.5}>4.5+</option>
        <option value={4.7}>4.7+</option>
        <option value={4.9}>4.9+</option>
      </select>
    </label>
  );
}

function FeaturedCard({ salon, delay }: { salon: Salon; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative h-[420px] overflow-hidden rounded-3xl"
    >
      <Link to="/marketplace/$salonId" params={{ salonId: salon.id }} className="absolute inset-0">
        <img src={salon.image} alt={salon.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/35 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
          <span className="text-[10px] uppercase tracking-[0.32em] text-rose-gold-soft">Featured · {salon.area}</span>
          <h3 className="mt-3 font-display text-4xl tracking-tight">{salon.name}</h3>
          <p className="mt-2 max-w-sm text-sm text-white/80">{salon.tagline}</p>
          {salon.makeupStyles.length > 0 && (
            <p className="mt-3 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-white/85">
              <Sparkles className="h-3 w-3 text-rose-gold-soft" /> {salon.makeupStyles[0]}
            </p>
          )}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 fill-rose-gold-soft text-rose-gold-soft" />
              <span className="font-medium">{salon.rating}</span>
              <span className="text-white/60">· ₹{(salon.priceFrom/1000).toFixed(0)}k onwards</span>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-[11px] uppercase tracking-[0.2em] backdrop-blur-md transition group-hover:bg-white/30">
              Discover <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SalonCard({ salon, delay }: { salon: Salon; delay: number }) {
  const wishlist = useWishlist();
  const saved = wishlist.has(salon.id);
  return (
    <motion.article layout
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link to="/marketplace/$salonId" params={{ salonId: salon.id }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <img src={salon.image} alt={salon.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
          <button type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); wishlist.toggle(salon.id); }}
            className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur-md transition ${saved ? "bg-rose-gold text-white" : "bg-white/75 text-rose-gold hover:bg-white"}`}
            aria-label={saved ? "Remove from saved" : "Save salon"}>
            <Heart className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl text-noir">{salon.name}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-noir/60">
              <MapPin className="h-3 w-3" /> {salon.area}<span className="px-1">·</span>from ₹{(salon.priceFrom/1000).toFixed(0)}k
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm text-noir">
            <Star className="h-3.5 w-3.5 fill-rose-gold text-rose-gold" /> {salon.rating}
          </div>
        </div>
        <p className="mt-2 line-clamp-1 text-xs text-noir/60">{salon.tagline}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {salon.services.slice(0, 3).map((sv) => (
            <span key={sv} className="rounded-full bg-rose-gold/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-rose-gold">{sv}</span>
          ))}
        </div>
        {salon.makeupStyles.length > 0 && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            <Sparkles className="h-2.5 w-2.5 shrink-0 text-noir/40" />
            {salon.makeupStyles.map((ms) => (
              <span key={ms} className="rounded-full border border-rose-gold/25 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-noir/55">{ms}</span>
            ))}
          </div>
        )}
      </Link>
      <div className="mt-3 flex gap-2">
        <Link to="/marketplace/$salonId" params={{ salonId: salon.id }}
          className="flex-1 rounded-full bg-rose-gold px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-white transition hover:opacity-90">
          Book Now
        </Link>
        <a href={`tel:${salon.phone.replace(/\s/g, "")}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-rose-gold/35 bg-white/60 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-noir transition hover:bg-white">
          <Phone className="h-3 w-3" /> Call
        </a>
      </div>
    </motion.article>
  );
}
