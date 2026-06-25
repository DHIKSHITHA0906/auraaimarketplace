import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin, Star, ArrowLeft, Calendar, Clock, Sparkles, Check, Phone, Heart } from "lucide-react";

import salon1 from "@/assets/salon-1.jpg";
import salon3 from "@/assets/salon-3.jpg";
import styleMin from "@/assets/style-minimalist.jpg";
import stylePalace from "@/assets/style-palace.jpg";
import styleBeach from "@/assets/style-beach.jpg";
import styleMandapam from "@/assets/style-mandapam.jpg";
import styleBrahmin from "@/assets/style-brahmin.jpg";
import styleChettinad from "@/assets/style-chettinad.jpg";
import styleTraditionalTamil from "@/assets/makeup-styles/style-traditional-tamil.jpg";
import styleTraditionalTamilAlt from "@/assets/makeup-styles/style-traditional-tamil-alt.jpg";
import styleSoftDewy from "@/assets/makeup-styles/style-soft-dewy.jpg";
import styleHdGlam from "@/assets/makeup-styles/style-hd-glam.jpg";
import styleRoyalGrand from "@/assets/makeup-styles/style-royal-grand.jpg";
import styleMinimalNoMakeup from "@/assets/makeup-styles/style-minimal-no-makeup.jpg";
import styleMinimalNoMakeupAlt from "@/assets/makeup-styles/style-minimal-no-makeup-alt.jpg";
import styleMatteBridal from "@/assets/makeup-styles/style-matte-bridal.jpg";
import styleReceptionEvening from "@/assets/makeup-styles/style-reception-evening.jpg";
import { PageShell, Eyebrow } from "@/components/aura/PageShell";
import { useBookings, useWishlist } from "@/lib/aura-store";

type Service = { name: string; duration: string; price: string; priceValue: number };
type SalonDetail = {
  name: string; area: string; rating: number; reviews: number; tagline: string; phone: string;
  about: string; gallery: string[]; services: Service[]; slots: string[];
  /** Makeup style specializations — mirrors Salon.makeupStyles in marketplace.tsx */
  makeupStyles?: string[];
};

const DATA: Record<string, SalonDetail> = {
  "naturals-bridal-tnagar": {
    name: "Naturals Bridal Studio", area: "T Nagar, Chennai", rating: 4.9, reviews: 612, phone: "+91 99999 12345",
    tagline: "Chennai's most-booked bridal atelier — Kanjivaram-ready looks.",
    about: "A T Nagar institution for South Indian brides since 2009. Our master artists are trained in classical kanjivaram draping, temple jewellery styling, and HD airbrush bridal makeup tuned for Chennai's humidity.",
    gallery: [styleTraditionalTamil, styleRoyalGrand, salon3],
    makeupStyles: ["Traditional Tamil Bridal Look", "Royal / Grand Bridal Look"],
    services: [
      { name: "Muhurtham Bridal Look", duration: "4h", price: "₹45,000", priceValue: 45000 },
      { name: "Reception Glam",        duration: "3h", price: "₹32,000", priceValue: 32000 },
      { name: "Pre-Bridal Skincare",   duration: "6 sittings", price: "₹18,000", priceValue: 18000 },
      { name: "Mehendi",               duration: "5h", price: "₹12,000", priceValue: 12000 },
      { name: "Hair Treatment",        duration: "2h", price: "₹6,500",  priceValue: 6500  },
      { name: "Facial",                duration: "1h", price: "₹3,500",  priceValue: 3500  },
      { name: "Trial Session",         duration: "2h", price: "₹8,000",  priceValue: 8000  },
    ],
    slots: ["09:00", "11:30", "14:00", "16:30"],
  },
  "toni-guy-adyar": {
    name: "Toni & Guy · Adyar", area: "Adyar, Chennai", rating: 4.8, reviews: 487, phone: "+91 88888 22345",
    tagline: "Editorial bridal hair & makeup, walking distance from the beach.",
    about: "International salon brand reimagined for the modern Chennai bride. Specialists in sculpted hair couture and contemporary bridal looks.",
    gallery: [styleMin, styleMinimalNoMakeup, salon3],
    makeupStyles: ["Minimal / No-Makeup Bridal Look", "Soft Natural / Dewy Bridal Look"],
    services: [
      { name: "Signature Bridal",    duration: "4h",   price: "₹38,000", priceValue: 38000 },
      { name: "Mehendi",             duration: "2h",   price: "₹14,000", priceValue: 14000 },
      { name: "Bridal Hair Couture", duration: "1.5h", price: "₹9,500",  priceValue: 9500  },
      { name: "Threading",           duration: "20m",  price: "₹400",    priceValue: 400   },
      { name: "Trial Session",       duration: "2h",   price: "₹7,500",  priceValue: 7500  },
    ],
    slots: ["10:00", "12:30", "15:00", "17:30"],
  },
  "green-trends-velachery": {
    name: "Green Trends Bridal", area: "Velachery, Chennai", rating: 4.7, reviews: 533, phone: "+91 77777 33456",
    tagline: "Modern South Indian glam with HD airbrush finish.",
    about: "A Velachery favourite for brides who want camera-ready HD glam without losing their South Indian roots — sculpted contour, statement eyes, and a finish built to last through every ceremony.",
    gallery: [styleHdGlam, salon1, salon3],
    makeupStyles: ["HD Glam Bridal Look"],
    services: [
      { name: "HD Glam Bridal",     duration: "3.5h", price: "₹28,000", priceValue: 28000 },
      { name: "Hair Treatment",     duration: "2h",   price: "₹6,000",  priceValue: 6000  },
      { name: "Mehendi",            duration: "4h",   price: "₹10,000", priceValue: 10000 },
      { name: "Facial",             duration: "1h",   price: "₹3,200",  priceValue: 3200  },
    ],
    slots: ["09:30", "12:00", "15:30"],
  },
  "ojas-anna-nagar": {
    name: "Ojas Salon & Spa", area: "Anna Nagar, Chennai", rating: 4.7, reviews: 298, phone: "+91 99888 44567",
    tagline: "Heritage Tamil bridal looks with luxury skin rituals.",
    about: "Ojas pairs classical Tamil bridal styling with a full luxury skincare cycle — so brides arrive on the day glowing from weeks of preparation, not just a single sitting.",
    gallery: [styleTraditionalTamilAlt, styleBrahmin, salon3],
    makeupStyles: ["Traditional Tamil Bridal Look"],
    services: [
      { name: "Heritage Bridal Look",     duration: "3.5h", price: "₹32,000", priceValue: 32000 },
      { name: "Pre-Bridal Skincare",      duration: "6 sittings", price: "₹16,000", priceValue: 16000 },
      { name: "Facial",                   duration: "1h",   price: "₹3,800",  priceValue: 3800  },
      { name: "Waxing",                   duration: "45m",  price: "₹1,800",  priceValue: 1800  },
    ],
    slots: ["10:00", "13:00", "16:00"],
  },
  "lakme-besant": {
    name: "Lakmé Salon · Besant Nagar", area: "Besant Nagar, Chennai", rating: 4.8, reviews: 421, phone: "+91 98765 55678",
    tagline: "Coastal-bride radiance and luminous airbrush artistry.",
    about: "Steps from the Besant Nagar shore, this atelier specialises in luminous airbrush bases built to hold through coastal humidity — equally suited to a sunlit muhurtham or a jewel-toned reception.",
    gallery: [styleReceptionEvening, styleBeach, salon1],
    makeupStyles: ["Reception / Evening Glam Look", "HD Glam Bridal Look"],
    services: [
      { name: "Reception Glam",      duration: "3h",   price: "₹35,000", priceValue: 35000 },
      { name: "Bridal Hair Couture", duration: "1.5h", price: "₹8,500",  priceValue: 8500  },
      { name: "Tan Removal",         duration: "1h",   price: "₹2,500",  priceValue: 2500  },
      { name: "Facial",              duration: "1h",   price: "₹3,500",  priceValue: 3500  },
    ],
    slots: ["10:30", "13:30", "16:30"],
  },
  "bodycraft-nungambakkam": {
    name: "Bodycraft Bridal", area: "Nungambakkam, Chennai", rating: 4.6, reviews: 256, phone: "+91 90000 66789",
    tagline: "Intimate by-appointment studio in the heart of Chennai.",
    about: "A quiet, by-appointment-only studio for brides who want a long-wear matte finish that holds through a full day of ceremonies without a single touch-up.",
    gallery: [styleMatteBridal, salon1, salon3],
    makeupStyles: ["Matte Bridal Look"],
    services: [
      { name: "Mehendi",        duration: "4h",  price: "₹10,000", priceValue: 10000 },
      { name: "Hair Treatment", duration: "2h",  price: "₹6,000",  priceValue: 6000  },
      { name: "Manicure",       duration: "45m", price: "₹1,200",  priceValue: 1200  },
      { name: "Pedicure",       duration: "1h",  price: "₹1,500",  priceValue: 1500  },
    ],
    slots: ["10:00", "13:00", "16:00"],
  },
  "vasanths-mylapore": {
    name: "Vasanth's Bridal House", area: "Mylapore, Chennai", rating: 4.9, reviews: 720, phone: "+91 98410 12121",
    tagline: "Traditional Tamil bridal looks since 1998.",
    about: "Mylapore's most storied bridal house — three decades of classical Tamil bridal styling, full temple-jewellery draping, and a master-artist team trained in heirloom techniques.",
    gallery: [styleRoyalGrand, styleMandapam, styleTraditionalTamil],
    makeupStyles: ["Traditional Tamil Bridal Look", "Royal / Grand Bridal Look"],
    services: [
      { name: "Muhurtham Bridal Look", duration: "4.5h", price: "₹55,000", priceValue: 55000 },
      { name: "Reception Glam",        duration: "3h",   price: "₹38,000", priceValue: 38000 },
      { name: "Mehendi",               duration: "5h",   price: "₹15,000", priceValue: 15000 },
      { name: "Pre-Bridal Skincare",   duration: "6 sittings", price: "₹20,000", priceValue: 20000 },
      { name: "Trial Session",         duration: "2h",   price: "₹9,000",  priceValue: 9000  },
    ],
    slots: ["08:30", "11:00", "14:00", "17:00"],
  },
  "yuvi-makeover-porur": {
    name: "Yuvi Makeover Studio", area: "Porur, Chennai", rating: 4.5, reviews: 184, phone: "+91 99529 88877",
    tagline: "Budget-friendly bridal artistry without compromise.",
    about: "Yuvi proves a soft, dewy bridal look doesn't need a luxury price tag — natural-finish bases, a soft flush, and honest pricing for the budget-conscious bride.",
    gallery: [styleSoftDewy, salon1, salon3],
    makeupStyles: ["Soft Natural / Dewy Bridal Look"],
    services: [
      { name: "Soft Glam Bridal", duration: "3h",  price: "₹18,000", priceValue: 18000 },
      { name: "Hair Treatment",   duration: "1.5h", price: "₹4,500", priceValue: 4500  },
      { name: "Bleaching",        duration: "30m", price: "₹800",   priceValue: 800   },
      { name: "Threading",        duration: "20m", price: "₹350",   priceValue: 350   },
    ],
    slots: ["09:00", "12:00", "15:00"],
  },
  "page-3-alwarpet": {
    name: "Page 3 Luxury Bridal", area: "Alwarpet, Chennai", rating: 4.9, reviews: 389, phone: "+91 90031 55501",
    tagline: "Celebrity-favourite atelier for ITC & Leela weddings.",
    about: "Chennai's celebrity-favourite bridal atelier — full royal-grade styling, on-site teams for ITC Grand Chola and Leela Palace weddings, and a master artist roster that's dressed Chennai society for a decade.",
    gallery: [stylePalace, styleRoyalGrand, styleHdGlam],
    makeupStyles: ["Royal / Grand Bridal Look", "HD Glam Bridal Look"],
    services: [
      { name: "Royal Grand Bridal",   duration: "5h",   price: "₹75,000",  priceValue: 75000  },
      { name: "Reception Glam",       duration: "3h",   price: "₹50,000",  priceValue: 50000  },
      { name: "Pre-Bridal Skincare",  duration: "8 sittings", price: "₹35,000", priceValue: 35000 },
      { name: "Facial",               duration: "1h",   price: "₹6,000",   priceValue: 6000   },
      { name: "Trial Session",        duration: "2h",   price: "₹15,000",  priceValue: 15000  },
    ],
    slots: ["09:00", "12:30", "16:00"],
  },
  "kalyans-tambaram": {
    name: "Kalyan's Bridal Mirror", area: "Tambaram, Chennai", rating: 4.6, reviews: 211, phone: "+91 90422 33344",
    tagline: "South-suburb favourite — full bridal package under ₹30k.",
    about: "A long-wear matte bridal specialist for South Chennai brides — full coverage that holds through humidity, photographs, and a long wedding day, all in one honestly-priced package.",
    gallery: [styleMatteBridal, styleChettinad, salon3],
    makeupStyles: ["Matte Bridal Look"],
    services: [
      { name: "Matte Bridal Look", duration: "3h",  price: "₹24,000", priceValue: 24000 },
      { name: "Mehendi",           duration: "4h",  price: "₹9,000",  priceValue: 9000  },
      { name: "Hair Treatment",    duration: "1.5h", price: "₹5,000", priceValue: 5000  },
      { name: "Waxing",            duration: "45m", price: "₹1,500", priceValue: 1500  },
    ],
    slots: ["09:30", "12:30", "15:30"],
  },
  "shahnaz-egmore": {
    name: "Shahnaz Herbals Bridal", area: "Egmore, Chennai", rating: 4.7, reviews: 305, phone: "+91 98403 22255",
    tagline: "Ayurvedic pre-bridal skincare specialists.",
    about: "Shahnaz Herbals builds a skin-first bridal journey — Ayurvedic pre-bridal rituals leading into a soft, dewy or minimal bridal finish that lets natural skin lead on the day.",
    gallery: [styleSoftDewy, styleMinimalNoMakeupAlt, salon3],
    makeupStyles: ["Soft Natural / Dewy Bridal Look", "Minimal / No-Makeup Bridal Look"],
    services: [
      { name: "Pre-Bridal Skincare", duration: "8 sittings", price: "₹22,000", priceValue: 22000 },
      { name: "Facial",              duration: "1h",  price: "₹3,000", priceValue: 3000 },
      { name: "Bleaching",           duration: "30m", price: "₹700",  priceValue: 700  },
      { name: "Hair Treatment",      duration: "1.5h", price: "₹4,800", priceValue: 4800 },
    ],
    slots: ["10:00", "13:00", "16:00"],
  },
  "ola-omr": {
    name: "OLA Bridal Couture · OMR", area: "OMR, Chennai", rating: 4.7, reviews: 162, phone: "+91 99524 77711",
    tagline: "Tech-corridor brides — early-morning muhurtham specialists.",
    about: "Built for OMR's early-morning muhurthams — a minimal, skin-first bridal finish that looks effortless at sunrise and holds through a full ceremony day.",
    gallery: [styleMinimalNoMakeupAlt, styleMinimalNoMakeup, salon1],
    makeupStyles: ["Minimal / No-Makeup Bridal Look"],
    services: [
      { name: "Minimal Bridal Look", duration: "2.5h", price: "₹30,000", priceValue: 30000 },
      { name: "Hair Treatment",      duration: "1.5h", price: "₹5,500",  priceValue: 5500  },
      { name: "Mehendi",             duration: "4h",   price: "₹11,000", priceValue: 11000 },
      { name: "Threading",           duration: "20m",  price: "₹400",    priceValue: 400   },
    ],
    slots: ["07:00", "09:30", "12:00"],
  },
  "javeds-kilpauk": {
    name: "Javed Habib · Kilpauk", area: "Kilpauk, Chennai", rating: 4.6, reviews: 198, phone: "+91 99623 44488",
    tagline: "Reliable chain studio with consistent bridal output.",
    about: "Consistent, dependable bridal output from a trusted chain studio — strong for evening receptions and jewel-toned glam looks that photograph well after dark.",
    gallery: [styleReceptionEvening, salon1, salon3],
    makeupStyles: ["Reception / Evening Glam Look"],
    services: [
      { name: "Evening Glam Bridal", duration: "3h",  price: "₹28,000", priceValue: 28000 },
      { name: "Hair Treatment",      duration: "1.5h", price: "₹5,000", priceValue: 5000  },
      { name: "Manicure",            duration: "45m", price: "₹1,200", priceValue: 1200  },
      { name: "Pedicure",            duration: "1h",  price: "₹1,500", priceValue: 1500  },
    ],
    slots: ["10:00", "12:30", "15:00"],
  },
};

const DEFAULT: SalonDetail = {
  name: "Bridal Atelier", area: "Chennai", rating: 4.7, reviews: 120, phone: "+91 99999 00000",
  tagline: "A considered space for the modern Chennai bride.",
  about: "An intimate atelier where every detail is composed with intention.",
  gallery: [salon3, salon1, styleMin],
  services: [
    { name: "Bridal Signature", duration: "3h", price: "₹35,000", priceValue: 35000 },
    { name: "Hair Styling",     duration: "1h", price: "₹6,000",  priceValue: 6000  },
    { name: "Mehendi",          duration: "4h", price: "₹10,000", priceValue: 10000 },
    { name: "Facial",           duration: "1h", price: "₹3,000",  priceValue: 3000  },
  ],
  slots: ["10:00", "13:00", "16:00"],
};

export const Route = createFileRoute("/marketplace/$salonId")({
  head: ({ params }) => ({
    meta: [{ title: `${DATA[params.salonId]?.name ?? "Salon"} — AuraAI` }],
  }),
  component: SalonDetails,
});

function todayISO() { return new Date().toISOString().slice(0, 10); }

function SalonDetails() {
  const { salonId } = Route.useParams();
  const s = DATA[salonId] ?? DEFAULT;
  const wishlist = useWishlist();
  const { add } = useBookings();
  const navigate = useNavigate();
  const saved = wishlist.has(salonId);

  const [service, setService] = useState(s.services[0].name);
  const [date, setDate] = useState("");
  const [time, setTime] = useState(s.slots[0]);
  const [confirmed, setConfirmed] = useState(false);

  const reserve = () => {
    if (!date) { alert("Please choose a date for your appointment."); return; }
    const sv = s.services.find((x) => x.name === service);
    add({
      salonId,
      salonName: s.name,
      salonImage: s.gallery[0],
      service,
      date,
      time,
      area: s.area,
      phone: s.phone,
      price: sv?.priceValue,
    });
    setConfirmed(true);
    setTimeout(() => navigate({ to: "/bookings" }), 1100);
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-32">
        <div className="flex items-center justify-between">
          <Link to="/marketplace" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-noir/60 hover:text-rose-gold">
            <ArrowLeft className="h-3 w-3" /> Marketplace
          </Link>
          <button
            onClick={() => wishlist.toggle(salonId)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.22em] transition ${saved ? "border-rose-gold bg-rose-gold text-white" : "border-rose-gold/30 bg-white/60 text-noir hover:bg-white"}`}
          >
            <Heart className="h-3.5 w-3.5" fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : "Save Atelier"}
          </button>
        </div>

        {/* Hero gallery */}
        <div className="mt-6 grid gap-3 md:grid-cols-4 md:grid-rows-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative md:col-span-2 md:row-span-2 aspect-[4/3] overflow-hidden rounded-3xl"
          >
            <img src={s.gallery[0]} alt="" className="h-full w-full object-cover" />
          </motion.div>
          {[s.gallery[1], s.gallery[2], s.gallery[1], s.gallery[2]].map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.08 }}
              className="relative aspect-square overflow-hidden rounded-2xl"
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </motion.div>
          ))}
        </div>

        {/* Body */}
        <div className="mt-12 grid gap-12 md:grid-cols-[1.6fr_1fr]">
          <div>
            <Eyebrow>{s.area}</Eyebrow>
            <h1 className="mt-3 font-display text-5xl tracking-tight text-noir md:text-6xl">{s.name}</h1>
            <p className="mt-4 max-w-xl text-base font-light text-noir/70">{s.tagline}</p>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-noir/70">
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-rose-gold text-rose-gold" /> {s.rating} · {s.reviews} reviews</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {s.area}</span>
              <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 text-rose-gold hover:underline">
                <Phone className="h-4 w-4" /> {s.phone}
              </a>
            </div>

            {!!s.makeupStyles?.length && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] uppercase tracking-[0.22em] text-noir/45">Specializes in</span>
                {s.makeupStyles.map((ms) => (
                  <span key={ms} className="inline-flex items-center gap-1.5 rounded-full border border-rose-gold/30 bg-rose-gold/10 px-3 py-1 text-[11px] text-rose-gold">
                    <Sparkles className="h-3 w-3" /> {ms}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-10">
              <h2 className="text-[11px] uppercase tracking-[0.3em] text-noir/50">The Atelier</h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-noir/75">{s.about}</p>
            </div>

            <div className="mt-12">
              <h2 className="text-[11px] uppercase tracking-[0.3em] text-noir/50">Services</h2>
              <div className="mt-5 divide-y divide-rose-gold/15 rounded-2xl border border-rose-gold/15 bg-white/40">
                {s.services.map((srv) => (
                  <button
                    key={srv.name}
                    onClick={() => setService(srv.name)}
                    className={`flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition ${service === srv.name ? "bg-rose-gold/10" : "hover:bg-white/60"}`}
                  >
                    <div>
                      <p className="font-display text-xl text-noir">{srv.name}</p>
                      <p className="mt-1 text-xs text-noir/55">{srv.duration}</p>
                    </div>
                    <p className="font-medium text-rose-gold">{srv.price}</p>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-noir/40">Tip — book each service on a separate date to space out your prep.</p>
            </div>
          </div>

          {/* Booking */}
          <aside className="md:sticky md:top-24 md:self-start">
            <div className="glass rounded-3xl p-7">
              <Eyebrow>Reserve</Eyebrow>
              <p className="mt-3 font-display text-2xl text-noir">Book an appointment</p>

              {confirmed ? (
                <div className="mt-6 rounded-2xl bg-rose-gold/10 p-5 text-center text-sm text-noir">
                  <Check className="mx-auto h-6 w-6 text-rose-gold" />
                  <p className="mt-2 font-display text-xl">Reserved ✦</p>
                  <p className="mt-1 text-xs text-noir/60">Opening your bookings…</p>
                </div>
              ) : (
                <>
                  <div className="mt-5 space-y-3">
                    <div>
                      <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-noir/50">Service</p>
                      <select value={service} onChange={(e) => setService(e.target.value)} className="w-full rounded-xl border border-rose-gold/25 bg-white/60 px-3 py-2.5 text-sm text-noir focus:outline-none">
                        {s.services.map((sv) => <option key={sv.name}>{sv.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-noir/50">Date</p>
                      <div className="flex items-center gap-2 rounded-xl border border-rose-gold/25 bg-white/60 px-3 py-2.5">
                        <Calendar className="h-4 w-4 text-noir/40" />
                        <input type="date" value={date} min={todayISO()} onChange={(e) => setDate(e.target.value)} className="w-full bg-transparent text-sm text-noir focus:outline-none" />
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-noir/50">Time slot</p>
                      <div className="flex flex-wrap gap-2">
                        {s.slots.map((t) => (
                          <button key={t} type="button" onClick={() => setTime(t)}
                            className={`rounded-full border px-3 py-1.5 text-xs transition ${time === t ? "border-rose-gold bg-rose-gold text-white" : "border-rose-gold/30 bg-white/50 text-noir hover:bg-white"}`}>
                            <Clock className="mr-1 inline h-3 w-3" />{t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={reserve} className="btn-luxury mt-6 w-full justify-center">
                    <Sparkles className="h-3.5 w-3.5" /> Reserve Appointment
                  </button>
                  <a href={`tel:${s.phone.replace(/\s/g, "")}`}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-gold/35 bg-white/60 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-noir transition hover:bg-white">
                    <Phone className="h-3.5 w-3.5" /> Call Salon
                  </a>
                  <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-noir/45">
                    <Check className="h-3 w-3" /> UPI · Card · Free cancellation 48h
                  </p>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
