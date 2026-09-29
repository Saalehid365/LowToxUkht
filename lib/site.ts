// Everything you are likely to rename or reprice lives here.

export const site = {
  name: "Low Tox Ukht",
  tagline: "Holistic wellness for Muslim women at home",
  email: "hello@lowtoxopt.com",
  location: "Private video and phone sessions, UK and worldwide",
  instagram: "https://instagram.com/",
};

export type Offer = {
  id: string;
  name: string;
  price: string;
  length: string;
  summary: string;
  includes: string[];
  featured?: boolean;
  intake?: boolean; // clients on this offer are asked to fill in the family intake form
};

// Prices are placeholders: set your own before launch.
export const offers: Offer[] = [
  {
    id: "discovery",
    name: "Discovery call",
    price: "Free",
    length: "20 minutes",
    summary: "A relaxed, private chat about where you are and what feels heavy right now. No pressure to book anything.",
    includes: ["Time to be properly heard", "One small change you can make this week", "An honest recommendation on next steps"],
  },
  {
    id: "family",
    name: "Family wellness package",
    price: "£245",
    length: "3 sessions over 6 to 8 weeks",
    summary: "For mums who want calmer days for the whole household, including children with sensory needs.",
    includes: [
      "Family intake form, so no session time is lost",
      "60 minute initial consultation and personal plan",
      "Two 30 minute follow ups, 2 to 3 weeks apart",
      "Written summary or voice note after every session",
      "Product guidance checked for allergies and sensitivities",
    ],
    featured: true,
    intake: true,
  },
  {
    id: "reset",
    name: "Personal reset",
    price: "£95",
    length: "60 minutes and a written plan",
    summary: "One focused session just for you: your energy, your sleep, your home and the products you use every day.",
    includes: [
      "Short questionnaire before we meet",
      "60 minute private video or phone session",
      "Written plan, ranked by impact and budget",
      "One week of WhatsApp follow up",
    ],
  },
];

export const priorities = [
  "Energy and tiredness",
  "Sleep",
  "Stress and overwhelm",
  "A low tox home",
  "Skin care",
  "Family nutrition",
  "Hormones",
  "My child's sensory needs",
];

// Real client words only. The section is hidden until this list has entries.
export const testimonials: { quote: string; name: string; detail: string }[] = [];
