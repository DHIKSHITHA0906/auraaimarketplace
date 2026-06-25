import { createFileRoute, Outlet } from "@tanstack/react-router";

import salon1 from "@/assets/salon-1.jpg";
import salon3 from "@/assets/salon-3.jpg";
import styleMin from "@/assets/style-minimalist.jpg";
import stylePalace from "@/assets/style-palace.jpg";
import styleBeach from "@/assets/style-beach.jpg";
import styleTraditionalTamil from "@/assets/makeup-styles/style-traditional-tamil.jpg";
import styleTraditionalTamilAlt from "@/assets/makeup-styles/style-traditional-tamil-alt.jpg";
import styleSoftDewy from "@/assets/makeup-styles/style-soft-dewy.jpg";
import styleHdGlam from "@/assets/makeup-styles/style-hd-glam.jpg";
import styleRoyalGrand from "@/assets/makeup-styles/style-royal-grand.jpg";
import styleMinimalNoMakeupAlt from "@/assets/makeup-styles/style-minimal-no-makeup-alt.jpg";
import styleMatteBridal from "@/assets/makeup-styles/style-matte-bridal.jpg";
import styleReceptionEvening from "@/assets/makeup-styles/style-reception-evening.jpg";
import { MAKEUP_STYLE_NAMES } from "@/lib/makeup-styles";

// /marketplace is a LAYOUT route. It has no UI of its own besides <Outlet />,
// which renders either marketplace.index.tsx ("/marketplace") or
// marketplace.$salonId.tsx ("/marketplace/$salonId") depending on the URL.
export const Route = createFileRoute("/marketplace")({
  component: MarketplaceLayout,
});

function MarketplaceLayout() {
  return <Outlet />;
}

export type Salon = {
  id: string;
  name: string;
  area: string;
  rating: number;
  reviews: number;
  priceFrom: number;
  services: string[];
  /** Makeup style specializations — names from MAKEUP_STYLES in lib/makeup-styles.ts */
  makeupStyles: string[];
  image: string;
  tagline: string;
  phone: string;
  featured?: boolean;
};

export const CHENNAI_AREAS = [
  "T Nagar", "Adyar", "Mylapore", "Anna Nagar", "Velachery",
  "Nungambakkam", "Besant Nagar", "Porur", "Tambaram", "OMR",
  "ECR", "Alwarpet", "Kilpauk", "Egmore",
];

// Re-exported for convenience so callers can build "All" option lists
// without importing from lib/makeup-styles directly.
export const ALL_MAKEUP_STYLES = MAKEUP_STYLE_NAMES;

export const ALL_SERVICES = [
  "Bridal makeup", "Hair styling", "Skincare", "Mehendi", "Pre-wedding treatments",
  "Manicure", "Pedicure", "Threading", "Facial", "Waxing", "Tan Removal", "Bleaching", "Others",
];

export const SALONS: Salon[] = [
  { id: "naturals-bridal-tnagar", name: "Naturals Bridal Studio", area: "T Nagar", rating: 4.9, reviews: 612, priceFrom: 45000, services: ["Bridal makeup", "Hair styling", "Skincare", "Mehendi", "Facial"], makeupStyles: ["Traditional Tamil Bridal Look", "Royal / Grand Bridal Look"], image: styleTraditionalTamil, tagline: "Chennai's most-booked bridal atelier — Kanjivaram-ready looks.", phone: "+91 99999 12345", featured: true },
  { id: "toni-guy-adyar",         name: "Toni & Guy · Adyar",       area: "Adyar",   rating: 4.8, reviews: 487, priceFrom: 38000, services: ["Bridal makeup", "Hair styling", "Threading"], makeupStyles: ["Minimal / No-Makeup Bridal Look", "Soft Natural / Dewy Bridal Look"], image: styleMin, tagline: "Editorial bridal hair & makeup, walking distance from the beach.", phone: "+91 88888 22345", featured: true },
  { id: "green-trends-velachery", name: "Green Trends Bridal",      area: "Velachery", rating: 4.7, reviews: 533, priceFrom: 28000, services: ["Hair styling", "Skincare", "Mehendi", "Facial"], makeupStyles: ["HD Glam Bridal Look"], image: styleHdGlam, tagline: "Modern South Indian glam with HD airbrush finish.", phone: "+91 77777 33456" },
  { id: "ojas-anna-nagar",        name: "Ojas Salon & Spa",         area: "Anna Nagar", rating: 4.7, reviews: 298, priceFrom: 32000, services: ["Bridal makeup", "Skincare", "Pre-wedding treatments", "Facial", "Waxing"], makeupStyles: ["Traditional Tamil Bridal Look"], image: styleTraditionalTamilAlt, tagline: "Heritage Tamil bridal looks with luxury skin rituals.", phone: "+91 99888 44567" },
  { id: "lakme-besant",           name: "Lakmé Salon · Besant Nagar", area: "Besant Nagar", rating: 4.8, reviews: 421, priceFrom: 35000, services: ["Bridal makeup", "Hair styling", "Skincare", "Tan Removal"], makeupStyles: ["Reception / Evening Glam Look", "HD Glam Bridal Look"], image: styleBeach, tagline: "Coastal-bride radiance and luminous airbrush artistry.", phone: "+91 98765 55678" },
  { id: "bodycraft-nungambakkam", name: "Bodycraft Bridal",         area: "Nungambakkam", rating: 4.6, reviews: 256, priceFrom: 22000, services: ["Mehendi", "Hair styling", "Manicure", "Pedicure"], makeupStyles: ["Matte Bridal Look"], image: salon1, tagline: "Intimate by-appointment studio in the heart of Chennai.", phone: "+91 90000 66789" },
  { id: "vasanths-mylapore",      name: "Vasanth's Bridal House",   area: "Mylapore", rating: 4.9, reviews: 720, priceFrom: 55000, services: ["Bridal makeup", "Hair styling", "Mehendi", "Pre-wedding treatments"], makeupStyles: ["Traditional Tamil Bridal Look", "Royal / Grand Bridal Look"], image: styleRoyalGrand, tagline: "Traditional Tamil bridal looks since 1998.", phone: "+91 98410 12121", featured: true },
  { id: "yuvi-makeover-porur",    name: "Yuvi Makeover Studio",     area: "Porur", rating: 4.5, reviews: 184, priceFrom: 18000, services: ["Bridal makeup", "Hair styling", "Bleaching", "Threading"], makeupStyles: ["Soft Natural / Dewy Bridal Look"], image: styleSoftDewy, tagline: "Budget-friendly bridal artistry without compromise.", phone: "+91 99529 88877" },
  { id: "page-3-alwarpet",        name: "Page 3 Luxury Bridal",     area: "Alwarpet", rating: 4.9, reviews: 389, priceFrom: 75000, services: ["Bridal makeup", "Hair styling", "Skincare", "Pre-wedding treatments", "Facial"], makeupStyles: ["Royal / Grand Bridal Look", "HD Glam Bridal Look"], image: stylePalace, tagline: "Celebrity-favourite atelier for ITC & Leela weddings.", phone: "+91 90031 55501" },
  { id: "kalyans-tambaram",       name: "Kalyan's Bridal Mirror",   area: "Tambaram", rating: 4.6, reviews: 211, priceFrom: 24000, services: ["Bridal makeup", "Mehendi", "Hair styling", "Waxing"], makeupStyles: ["Matte Bridal Look"], image: styleMatteBridal, tagline: "South-suburb favourite — full bridal package under ₹30k.", phone: "+91 90422 33344" },
  { id: "shahnaz-egmore",         name: "Shahnaz Herbals Bridal",   area: "Egmore", rating: 4.7, reviews: 305, priceFrom: 26000, services: ["Skincare", "Pre-wedding treatments", "Hair styling", "Facial", "Bleaching"], makeupStyles: ["Soft Natural / Dewy Bridal Look", "Minimal / No-Makeup Bridal Look"], image: salon3, tagline: "Ayurvedic pre-bridal skincare specialists.", phone: "+91 98403 22255" },
  { id: "ola-omr",                name: "OLA Bridal Couture · OMR", area: "OMR", rating: 4.7, reviews: 162, priceFrom: 30000, services: ["Bridal makeup", "Hair styling", "Mehendi", "Threading"], makeupStyles: ["Minimal / No-Makeup Bridal Look"], image: styleMinimalNoMakeupAlt, tagline: "Tech-corridor brides — early-morning muhurtham specialists.", phone: "+91 99524 77711" },
  { id: "javeds-kilpauk",         name: "Javed Habib · Kilpauk",    area: "Kilpauk", rating: 4.6, reviews: 198, priceFrom: 28000, services: ["Hair styling", "Bridal makeup", "Manicure", "Pedicure"], makeupStyles: ["Reception / Evening Glam Look"], image: styleReceptionEvening, tagline: "Reliable chain studio with consistent bridal output.", phone: "+91 99623 44488" },
];
