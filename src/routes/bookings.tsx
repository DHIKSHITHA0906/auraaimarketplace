import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Heart, ArrowUpRight, Sparkles, Trash2, Phone } from "lucide-react";

import { PageShell, Eyebrow } from "@/components/aura/PageShell";
import { useBookings, useWishlist, type Booking } from "@/lib/aura-store";
import { SALONS } from "./marketplace";

export const Route = createFileRoute("/bookings")({
  head: () => ({ meta: [{ title: "My Bookings — AuraAI" }] }),
  component: Bookings,
});

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

// Group bookings by date for "wedding schedule" feel
function groupByDate(list: Booking[]) {
  const map = new Map<string, Booking[]>();
  for (const b of list) {
    const k = b.date;
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(b);
  }
  return [...map.entries()].sort(([a], [b]) => +new Date(a) - +new Date(b));
}

function Bookings() {
  const { upcoming, past, remove } = useBookings();
  const wishlist = useWishlist();
  const savedSalons = SALONS.filter((s) => wishlist.has(s.id));
  const hasAny = upcoming.length + past.length > 0;

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-32">
        <Eyebrow>Your Bookings</Eyebrow>
        <h1 className="mt-3 font-display text-5xl tracking-tight text-noir md:text-6xl">
          The journey, <em className="font-light text-gradient-rose not-italic">in motion</em>
        </h1>

        {!hasAny && (
          <div className="mt-16 grid place-items-center rounded-[2rem] border border-dashed border-rose-gold/30 bg-white/40 px-6 py-20 text-center">
            <Sparkles className="h-8 w-8 text-rose-gold/70" />
            <p className="mt-5 font-display text-3xl text-noir">No bookings yet</p>
            <p className="mt-3 max-w-md text-sm text-noir/60">
              Begin with your bridal journey or browse Chennai's most-loved ateliers. Every reservation appears here.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/planner" className="btn-luxury"><Sparkles className="h-3.5 w-3.5" /> Build My Plan</Link>
              <Link to="/marketplace" className="btn-ghost-luxury">Explore Salons <ArrowUpRight className="h-3.5 w-3.5" /></Link>
            </div>
          </div>
        )}

        {upcoming.length > 0 && (
          <section className="mt-14">
            <h2 className="text-[11px] uppercase tracking-[0.3em] text-noir/50">Upcoming Schedule</h2>
            <div className="mt-5 space-y-6">
              {groupByDate(upcoming).map(([date, items]) => (
                <div key={date}>
                  <p className="mb-3 font-display text-xl text-noir">{fmtDate(date)}</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {items.map((b, i) => (
                      <motion.div
                        key={b.id}
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.06 }}
                        className="glass flex gap-5 overflow-hidden rounded-3xl p-5"
                      >
                        {b.salonImage && <img src={b.salonImage} alt={b.salonName} className="h-28 w-28 flex-shrink-0 rounded-2xl object-cover" />}
                        <div className="flex flex-1 flex-col">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-rose-gold">Upcoming · Confirmed</p>
                          <h3 className="mt-1 font-display text-2xl text-noir">{b.service}</h3>
                          <p className="text-sm text-noir/65">{b.salonName}</p>
                          <div className="mt-auto flex flex-wrap items-center gap-3 pt-3 text-xs text-noir/55">
                            <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {b.time}</span>
                            <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {b.area}</span>
                            {b.phone && (
                              <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 text-rose-gold hover:underline">
                                <Phone className="h-3 w-3" /> Call
                              </a>
                            )}
                            <button onClick={() => remove(b.id)} className="ml-auto inline-flex items-center gap-1 text-noir/40 hover:text-rose-gold">
                              <Trash2 className="h-3 w-3" /> Cancel
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className="mt-16">
            <h2 className="text-[11px] uppercase tracking-[0.3em] text-noir/50">Past · Completed</h2>
            <div className="mt-5 divide-y divide-rose-gold/15 rounded-3xl border border-rose-gold/15 bg-white/50">
              {past.map((b) => (
                <div key={b.id} className="flex flex-wrap items-center gap-5 p-5">
                  {b.salonImage && <img src={b.salonImage} alt={b.salonName} className="h-16 w-16 rounded-xl object-cover" />}
                  <div className="flex-1">
                    <p className="font-display text-lg text-noir">{b.service}</p>
                    <p className="text-xs text-noir/55">{b.salonName} · {b.area}</p>
                  </div>
                  <p className="text-xs text-noir/55">{fmtDate(b.date)}</p>
                  <Link to="/marketplace/$salonId" params={{ salonId: b.salonId }}
                    className="text-[11px] uppercase tracking-[0.22em] text-rose-gold hover:underline">
                    Book again
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {(hasAny || savedSalons.length > 0) && (
          <section className="mt-16">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] uppercase tracking-[0.3em] text-noir/50">Saved Ateliers</h2>
              <Heart className="h-4 w-4 text-rose-gold" />
            </div>
            {savedSalons.length === 0 ? (
              <p className="mt-4 text-sm text-noir/55">Tap the heart on any salon in the marketplace to save it for later.</p>
            ) : (
              <div className="mt-5 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
                {savedSalons.map((s) => (
                  <Link key={s.id} to="/marketplace/$salonId" params={{ salonId: s.id }}
                    className="group relative block aspect-[5/6] overflow-hidden rounded-2xl">
                    <img src={s.image} alt={s.name} className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-noir/80 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white">
                      <div>
                        <p className="font-display text-xl">{s.name}</p>
                        <p className="text-[11px] uppercase tracking-[0.22em] opacity-80">{s.area}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </PageShell>
  );
}
