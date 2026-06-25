import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles, MoveRight, LogIn } from "lucide-react";

import heroBride from "@/assets/hero-bride.jpg";
import styleSouth from "@/assets/style-southindian.jpg";
import stylePalace from "@/assets/style-palace.jpg";
import styleMin from "@/assets/style-minimalist.jpg";
import { Petals, LightRays } from "@/components/aura/Petals";
import { PageShell, Eyebrow } from "@/components/aura/PageShell";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AuraAI — Your Bridal Beauty Journey Begins Here" },
      {
        name: "description",
        content:
          "AuraAI — Chennai's AI-powered bridal beauty platform. Plan your wedding timeline, discover trusted Tamil bridal salons, and book every service.",
      },
    ],
  }),
  component: Home,
});

const chapters = [
  {
    n: "I", title: "The Dream",
    body: "Choose your wedding world — temple, kalyana mandapam, palace or coast — and the look begins to take shape.",
    image: styleSouth, to: "/styles" as const, cue: "Explore Styles",
  },
  {
    n: "II", title: "The Planning",
    body: "Aura composes a personalised week-by-week timeline of skincare, hair, mehendi and trials around your date.",
    image: styleMin, to: "/planner" as const, cue: "Build My Plan",
  },
  {
    n: "III", title: "The Day",
    body: "Trusted Chennai ateliers across T Nagar, Adyar, Mylapore — booked for every event from mehendi to muhurtham.",
    image: stylePalace, to: "/marketplace" as const, cue: "Discover Salons",
  },
];

function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const { isAuthenticated } = useAuth();

  return (
    <PageShell>
      {/* Top-right Sign In / Sign Up — visible only when not signed in */}
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed right-5 top-5 z-50 md:right-8 md:top-8"
        >
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-md shadow-lg transition hover:bg-white/25"
          >
            <LogIn className="h-3.5 w-3.5" />
            Sign In / Sign Up
          </Link>
        </motion.div>
      )}

      {/* ===== HERO ===== */}
      <section ref={ref} className="relative h-screen min-h-[680px] w-full overflow-hidden">
        <motion.div style={{ scale, y }} className="absolute inset-0">
          <img
            src={heroBride}
            alt="South Indian Tamil bride in Kanjivaram saree, temple jewellery and jasmine flowers"
            className="h-full w-full object-cover object-[40%_33%]"         />
          {/* Stronger gradients — guarantee text contrast on every screen */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/25" />
        </motion.div>

        <LightRays />
        <Petals count={18} />

        <motion.div
          style={{ opacity }}
          className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl font-display text-[clamp(2.5rem,6vw,5.8rem)] font-medium leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.55)]"
          >
            <span className="block">Your Bridal Beauty</span>
            <span className="mt-2 block font-light text-rose-gold-soft">
              Journey Begins Here
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-8 max-w-xl text-base font-normal leading-relaxed text-white/95 drop-shadow-[0_2px_18px_rgba(0,0,0,0.5)]"
          >
            Plan your timeline, discover Chennai's most-trusted Tamil bridal salons,
            and let Aura — your AI concierge — choreograph every glow from engagement to muhurtham.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.05 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/planner" className="btn-luxury">
              <Sparkles className="h-3.5 w-3.5" />
              Plan My Journey
            </Link>
            <Link to="/marketplace" className="btn-ghost-luxury bg-white/85">
              Explore Salons
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== THE STORY ===== */}
      <section className="relative mx-auto max-w-7xl px-6 py-32">
        <div className="mb-20 text-center">
          <Eyebrow>A Story in Three Chapters</Eyebrow>
          <h2 className="mt-6 font-display text-5xl tracking-tight text-noir md:text-6xl">
            From engagement <em className="font-light italic text-gradient-rose">to aisle</em>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {chapters.map((c, i) => (
            <motion.article
              key={c.n}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-3xl"
            >
              <Link to={c.to} className="block">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={c.image} alt={c.title} loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir/92 via-noir/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                    <div className="font-display text-5xl font-light text-rose-gold-soft">{c.n}</div>
                    <h3 className="mt-3 font-display text-3xl">{c.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/85">{c.body}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-rose-gold-soft transition-all group-hover:gap-3">
                      {c.cue} <MoveRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ===== INVITATION ===== */}
      <section className="relative mx-auto max-w-5xl px-6 pb-28 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="glass relative overflow-hidden rounded-[2.5rem] px-10 py-20"
        >
          <Petals count={10} opacity={0.4} />
          <p className="relative font-display text-4xl italic leading-tight text-noir md:text-5xl">
            "Every great love story <br />
            deserves an equally beautiful prologue."
          </p>
          <div className="relative mt-10">
            <Link to="/planner" className="btn-luxury">
              Begin Your Journey
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </section>no
    </PageShell>
  );
}
