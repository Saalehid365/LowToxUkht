// Everything you are likely to rename or reprice lives here.

export const site = {
  name: "Low Tox Opt",
  tagline: "Low-tox living, one room at a time",
  email: "hello@lowtoxopt.com",
  location: "Online worldwide · In-home by arrangement",
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
};

export const offers: Offer[] = [
  {
    id: "discovery",
    name: "Discovery call",
    price: "Complimentary",
    length: "20 minutes",
    summary: "A short conversation to hear where you are and whether working together makes sense.",
    includes: ["Your biggest concerns, heard properly", "One swap you can make today", "A clear recommendation on next steps"],
  },
  {
    id: "home-reset",
    name: "Home reset",
    price: "$450",
    length: "90 minutes + written plan",
    summary: "A room-by-room review of the products you use every day, with a swap plan you can follow at your own pace.",
    includes: [
      "Pre-session product questionnaire",
      "90-minute video or in-home consultation",
      "Written swap plan, ranked by impact and cost",
      "Two weeks of email follow-up",
    ],
    featured: true,
  },
  {
    id: "transformation",
    name: "Whole-home transformation",
    price: "$1,450",
    length: "3 sessions over 8 weeks",
    summary: "Deeper support for families, new parents and anyone managing a health condition who wants the whole house done properly.",
    includes: [
      "Everything in Home reset",
      "Kitchen, water and air review",
      "Curated shopping list with brands I trust",
      "Two follow-up sessions to review progress",
      "Priority messaging for eight weeks",
    ],
  },
];

export const priorities = [
  "Cleaning products",
  "Personal care & skincare",
  "Kitchen & cookware",
  "Drinking water",
  "Air quality",
  "Baby & nursery",
  "Laundry",
  "Food & packaging",
];
