export type VariantId = "focus" | "extrovert" | "joy" | "sleep";

export type Variant = {
  id: VariantId;
  name: string;
  tagline: string;
  purpose: string;
  blurbs: string[];
  composition: { ing: string; amt: string; note: string }[];
  when: string;
  gradA: string;
  gradB: string;
  inkOn: string;
  tilt: number;
  accentSticker: { color: string; text: string };
  warning?: string;
};

export const VARIANTS: Variant[] = [
  {
    id: "focus",
    name: "Focus",
    tagline: "deadline brain, on demand",
    purpose: "For Cognitive Clarity, Focus and Calm",
    blurbs: [
      "for the 3pm wall",
      "for the spreadsheet you've been avoiding",
      "for the deep-work block you keep skipping",
    ],
    composition: [
      { ing: "Gotu Kola", amt: "60mg", note: "circulation, focus" },
      { ing: "L-Theanine", amt: "50mg", note: "calm-alert" },
      { ing: "Saffron", amt: "30mg", note: "mood, attention" },
      { ing: "BioPerine", amt: "5mg", note: "absorption" },
    ],
    when: "morning or 30min before deep work",
    gradA: "#0B5DBB",
    gradB: "#00B7A7",
    inkOn: "#fff7ec",
    tilt: -1.2,
    accentSticker: { color: "#FFC107", text: "60s on tongue" },
  },
  {
    id: "extrovert",
    name: "Extrovert",
    tagline: "small-talk on tap",
    purpose: "For Confidence, Energy and Social Vitality",
    blurbs: [
      "for the work happy hour",
      "for the friend-of-a-friend's birthday",
      "for when 'just be yourself' is the problem",
    ],
    composition: [
      { ing: "Ginger", amt: "30mg", note: "warmth, energy" },
      { ing: "Shatavari", amt: "25mg", note: "balance" },
      { ing: "Ashwagandha", amt: "20mg", note: "steady nerves" },
      { ing: "Vitamin B6", amt: "154%", note: "% RDA, energy metabolism" },
    ],
    when: "30–45 min before going out",
    gradA: "#E73C7E",
    gradB: "#FFBA3D",
    inkOn: "#1a0f0a",
    tilt: 1.4,
    accentSticker: { color: "#4B28BE", text: "no water needed" },
  },
  {
    id: "joy",
    name: "Joy",
    tagline: "sunday afternoon, weekday delivery",
    purpose: "For Mood, Calm and Inner Happiness",
    blurbs: [
      "for the monday slump",
      "for grey-sky brain",
      "for when nothing's wrong but nothing's right",
    ],
    composition: [
      { ing: "L-Theanine", amt: "30mg", note: "soft calm" },
      { ing: "Brahmi", amt: "25mg", note: "clarity" },
      { ing: "Ashwagandha", amt: "40mg", note: "mood, stress" },
      { ing: "Jatamansi", amt: "20mg", note: "balance" },
    ],
    when: "anytime, especially mid-afternoon",
    gradA: "#FFC107",
    gradB: "#FF7A1A",
    inkOn: "#1a0f0a",
    tilt: -1.4,
    accentSticker: { color: "#0B5DBB", text: "10 strips" },
  },
  {
    id: "sleep",
    name: "Sleep",
    tagline: "lights out, no lecture",
    purpose: "For Restful Sleep and Relaxed Mind",
    blurbs: [
      "for racing-thought tuesdays",
      "for the 2am ceiling stare",
      "for the night before something big",
    ],
    composition: [
      { ing: "L-Theanine", amt: "25mg", note: "wind-down" },
      { ing: "Brahmi", amt: "20mg", note: "calm" },
      { ing: "Ashwagandha", amt: "20mg", note: "stress" },
      { ing: "Melatonin", amt: "3mg", note: "sleep onset" },
    ],
    when: "30 min before bed",
    gradA: "#4B28BE",
    gradB: "#FFBA3D",
    inkOn: "#fff7ec",
    tilt: 1.2,
    accentSticker: { color: "#E73C7E", text: "fssaI ✓" },
    warning:
      "Contains melatonin. Do not exceed 1 strip per 24 hours. Do not use if operating heavy machinery.",
  },
];

export const PACK_FACTS = [
  "10 strips per box",
  "1.5g total",
  "4 × 2.5 × 1 in",
  "sublingual · no water",
  "fssaI compliant",
  "made by mindcafe",
];

export const DOSAGE =
  "Place one strip on tongue. No water required. Take 1 strip per day, or as directed.";
export const ALLERGEN =
  "Contains plant extracts. Not for medicinal use. Not for children, pregnant women, or those under 18.";
export const BEST_BEFORE =
  "best before 18 months from mfg. store cool & dry.";

export type PropertyStatus = "stocked" | "soon" | "few-left";

export type Property = {
  city: string;
  region: string;
  archetype: string;
  status: PropertyStatus;
  stocks: VariantId[];
};

export const PROPERTIES: Property[] = [
  {
    city: "Zostel Kasol Katagla",
    region: "Himachal Pradesh",
    archetype: "Mountain · Trekking",
    status: "stocked",
    stocks: ["focus", "sleep", "joy"],
  },
  {
    city: "Zostel Old Manali (Goshal Rd)",
    region: "Himachal Pradesh",
    archetype: "Mountain · Party",
    status: "stocked",
    stocks: ["extrovert", "joy", "sleep"],
  },
  {
    city: "Zostel Shoja Jibhi",
    region: "Himachal Pradesh",
    archetype: "Mountain · Offbeat",
    status: "stocked",
    stocks: ["focus", "sleep"],
  },
  {
    city: "Zostel Shangarh",
    region: "Himachal Pradesh",
    archetype: "Mountain · Escape",
    status: "stocked",
    stocks: ["focus", "sleep", "joy"],
  },
  {
    city: "Zostel McLeodganj",
    region: "Himachal Pradesh",
    archetype: "Spiritual · Cultural",
    status: "stocked",
    stocks: ["focus", "joy", "sleep"],
  },
  {
    city: "Zostel Gokarna",
    region: "Karnataka",
    archetype: "Beach · Spiritual",
    status: "stocked",
    stocks: ["joy", "sleep", "focus"],
  },
  {
    city: "Zostel Plus Lonavala",
    region: "Maharashtra",
    archetype: "Weekend · Adventure",
    status: "stocked",
    stocks: ["extrovert", "joy", "focus"],
  },
  {
    city: "Zostel Plus Poombarai Kodaikanal",
    region: "Tamil Nadu",
    archetype: "Mountain · Nature",
    status: "stocked",
    stocks: ["focus", "sleep", "joy"],
  },
];
