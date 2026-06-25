// Central makeup-style catalogue.
// This is the single source of truth for the 7 bridal makeup styles used
// across the Styles page, salon marketplace filters/specializations,
// salon detail pages, and recommendations — keeping images and copy
// consistent everywhere they appear.

import imgTraditional from "@/assets/makeup-styles/style-traditional-tamil.jpg";
import imgSoftDewy from "@/assets/makeup-styles/style-soft-dewy.jpg";
import imgHdGlam from "@/assets/makeup-styles/style-hd-glam.jpg";
import imgRoyalGrand from "@/assets/makeup-styles/style-royal-grand.jpg";
import imgMinimal from "@/assets/makeup-styles/style-minimal-no-makeup.jpg";
import imgReception from "@/assets/makeup-styles/style-reception-evening.jpg";
import imgMatte from "@/assets/makeup-styles/style-matte-bridal.jpg";

export type MakeupStyle = {
  id: string;
  name: string;
  short: string;
  image: string;
  description: string;
};

export const MAKEUP_STYLES: MakeupStyle[] = [
  {
    id: "traditional-tamil",
    name: "Traditional Tamil Bridal Look",
    short: "Traditional Tamil",
    image: imgTraditional,
    description:
      "Classic temple-gold glam with bold kohl eyes, deep maroon lips and layered jasmine — built for Kanjivaram silks and muhurtham rituals.",
  },
  {
    id: "soft-natural-dewy",
    name: "Soft Natural / Dewy Bridal Look",
    short: "Soft Natural / Dewy",
    image: imgSoftDewy,
    description:
      "Luminous, barely-there base with a soft flush and dewy highlight — radiant for daylight ceremonies and pastel silks.",
  },
  {
    id: "hd-glam",
    name: "HD Glam Bridal Look",
    short: "HD Glam",
    image: imgHdGlam,
    description:
      "High-definition airbrush finish with sculpted contour and a statement smoky eye — camera-ready glamour for the big day.",
  },
  {
    id: "royal-grand",
    name: "Royal / Grand Bridal Look",
    short: "Royal / Grand",
    image: imgRoyalGrand,
    description:
      "Opulent, full-glam bridal styling with rich tones and heavy temple jewellery to match — designed for grand mandapam and hotel weddings.",
  },
  {
    id: "minimal-no-makeup",
    name: "Minimal / No-Makeup Bridal Look",
    short: "Minimal / No-Makeup",
    image: imgMinimal,
    description:
      "Skin-first, barely-there styling that lets natural features lead — soft brows, a whisper of colour, and nothing overdone.",
  },
  {
    id: "reception-evening-glam",
    name: "Reception / Evening Glam Look",
    short: "Reception / Evening Glam",
    image: imgReception,
    description:
      "Bold, light-catching glam built for evening receptions — deeper tones, statement liner and jewel-toned drama.",
  },
  {
    id: "matte-bridal",
    name: "Matte Bridal Look",
    short: "Matte Bridal",
    image: imgMatte,
    description:
      "A long-wear, shine-free matte base with soft definition — built to hold through Chennai humidity from morning rituals to night.",
  },
];

export const MAKEUP_STYLE_NAMES = MAKEUP_STYLES.map((m) => m.name);

export function getMakeupStyle(id: string): MakeupStyle | undefined {
  return MAKEUP_STYLES.find((m) => m.id === id);
}

export function getMakeupStyleByName(name: string): MakeupStyle | undefined {
  return MAKEUP_STYLES.find((m) => m.name === name);
}
