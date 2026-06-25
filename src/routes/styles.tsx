import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Store } from "lucide-react";

import { PageShell } from "@/components/aura/PageShell";
import { Petals } from "@/components/aura/Petals";
import { MAKEUP_STYLES } from "@/lib/makeup-styles";
import { SALONS } from "./marketplace";

export const Route = createFileRoute("/styles")({
  head: () => ({ meta: [{ title: "Bridal Makeup Styles — AuraAI Chennai" }] }),
  component: Styles,
});

function Styles() {
  const [i, setI] = useState(0);
  const m = MAKEUP_STYLES[i];

  const next = () => setI((i + 1) % MAKEUP_STYLES.length);
  const prev = () => setI((i - 1 + MAKEUP_STYLES.length) % MAKEUP_STYLES.length);

  // Real numbers pulled from the marketplace, so the hero never drifts out of sync
  // with what salons actually offer for this style.
  const matching = useMemo(() => SALONS.filter((s) => s.makeupStyles.includes(m.name)), [m.name]);
  const priceRange = useMemo(() => {
    if (matching.length === 0) return null;
    const prices = matching.map((s) => s.priceFrom).sort((a, b) => a - b);
    const lo = prices[0], hi = prices[prices.length - 1];
    const fmt = (n: number) => `₹${Math.round(n / 1000)}k`;
    return lo === hi ? fmt(lo) : `${fmt(lo)} – ${fmt(hi)}`;
  }, [matching]);

  return (
    <PageShell className="overflow-hidden">
      <div className="relative h-screen min-h-[680px] w-full">
        <AnimatePresence mode="wait">
          <motion.div key={m.id}
            initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0"
          >
            {/* The makeup style fills the hero as a background image — no empty
                letterboxing — with gradients keeping copy legible. */}
            <img src={m.image} alt={m.name} className="h-full w-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-r from-noir/80 via-noir/35 to-noir/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-noir/75 via-transparent to-noir/30" />
          </motion.div>
        </AnimatePresence>

        <Petals count={12} opacity={0.4} />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
          <AnimatePresence mode="wait">
            <motion.div key={m.id + "txt"}
              initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 40, filter: "blur(8px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl text-white"
            >
              <span className="font-display text-7xl font-light text-rose-gold-soft/70">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2 text-[11px] uppercase tracking-[0.32em] text-rose-gold-soft">Bridal Makeup Style</p>
              <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">{m.name}</h1>
              <p className="mt-6 max-w-md text-base font-light leading-relaxed text-white/85">{m.description}</p>

              <div className="mt-6 space-y-2 text-sm text-white/85">
                <p className="flex items-center gap-2"><Store className="h-3.5 w-3.5 text-rose-gold-soft" /> {matching.length} salon{matching.length === 1 ? "" : "s"} specializing in this look</p>
                {priceRange && (
                  <p className="flex items-center gap-2"><span className="font-display text-base text-rose-gold-soft">₹</span> {priceRange}</p>
                )}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/planner" className="btn-luxury">
                  Plan This Look <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link to="/marketplace" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-md transition hover:bg-white/20">
                  View matching salons
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-3">
                <button onClick={prev} aria-label="Previous" className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-xl transition hover:bg-white/20"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={next} aria-label="Next" className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-xl transition hover:bg-white/20"><ChevronRight className="h-4 w-4" /></button>
                <div className="ml-4 flex items-center gap-2">
                  {MAKEUP_STYLES.map((_, k) => (
                    <button key={k} onClick={() => setI(k)}
                      className={`h-1 rounded-full transition-all ${k === i ? "w-10 bg-rose-gold-soft" : "w-4 bg-white/30 hover:bg-white/60"}`} />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 space-y-3 md:block">
          {MAKEUP_STYLES.map((style, k) => (
            <button key={style.id} onClick={() => setI(k)}
              className={`block text-right transition ${k === i ? "text-white" : "text-white/45 hover:text-white/75"}`}>
              <span className="font-display text-xs italic">{String(k + 1).padStart(2, "0")}</span>
              <span className="ml-2 text-[10px] uppercase tracking-[0.28em]">{style.short}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Full makeup style catalogue */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.32em] text-rose-gold">Find Your Finish</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight text-noir md:text-5xl">
            Every Bridal Makeup <em className="font-light italic text-gradient-rose">Style</em>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm font-light text-noir/65">
            Choose the finish that matches your wedding day — every salon in the marketplace is tagged by the styles they specialize in.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MAKEUP_STYLES.map((style, k) => (
            <motion.button key={style.id} onClick={() => setI(k)}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: k * 0.06 }}
              className={`group relative overflow-hidden rounded-3xl text-left transition ${k === i ? "ring-2 ring-rose-gold" : ""}`}
            >
              {/* aspect-[2/3] exactly matches the source images, so object-cover shows
                  the complete bridal appearance with zero cropping. */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-noir/5">
                <img src={style.image} alt={style.name} loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-[1.2s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-noir/88 via-noir/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="font-display text-xl leading-tight">{style.name}</h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-white/80">{style.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-[10px] uppercase tracking-[0.2em] backdrop-blur-md transition group-hover:bg-white/30">
                    View this style <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-4 text-center">
          <Link to="/marketplace" className="btn-luxury">
            <Sparkles className="h-3.5 w-3.5" /> Browse All Salons
          </Link>
          <Link to="/planner" className="btn-ghost-luxury">Build My Bridal Journey</Link>
        </div>
      </section>
    </PageShell>
  );
}
