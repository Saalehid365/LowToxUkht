// The family intake form, defined once and used by the web form, the PDF,
// the email and the dashboard. Edit questions here and every place updates.

export type Field =
  | { id: string; label: string; kind: "text" | "email" | "tel" | "date" | "textarea"; required?: boolean; placeholder?: string }
  | { id: string; label: string; kind: "choice"; options: string[]; required?: boolean }
  | { id: string; label: string; kind: "checks"; options: string[]; max?: number; required?: "all" };

export type Group = { title?: string; intro?: string; fields: Field[] };

export type Section = {
  id: string;
  title: string;
  intro?: string;
  groups: Group[];
  notes?: { title?: string; items?: string[]; paragraphs?: string[] };
};

export const intakePackage = {
  name: "Family Wellness Consultation Package",
  sessions: [
    { name: "Initial consultation", length: "60 minutes", focus: "Understanding your child and family, your goals, and a personalised starting plan" },
    { name: "Follow-up session 1", length: "30 minutes", focus: "Reviewing progress, adjusting the plan, answering questions" },
    { name: "Follow-up session 2", length: "30 minutes", focus: "Final review, long-term routine and next steps" },
  ],
  spacing: "Suggested spacing: follow-ups around 2 to 3 weeks apart, so there is time to try changes gently.",
};

export const intakeProducts = [
  "Magnesium body butter",
  "Magnesium oil spray",
  "Sea moss gel",
  "Frankincense products",
  "Qist al Hindi",
  "Shilajit resin",
  "None yet",
];

export const intakeSections: Section[] = [
  {
    id: "about",
    title: "About you and your child",
    groups: [
      {
        title: "Parent or guardian",
        fields: [
          { id: "parentName", label: "Full name", kind: "text", required: true },
          { id: "relationship", label: "Relationship to child", kind: "text" },
          { id: "phone", label: "Phone / WhatsApp number", kind: "tel", required: true },
          { id: "email", label: "Email address", kind: "email", required: true },
          { id: "town", label: "Town or city", kind: "text" },
          { id: "contactMethod", label: "Preferred contact method", kind: "choice", options: ["WhatsApp", "Email", "Phone"] },
          { id: "heardAbout", label: "How did you hear about us?", kind: "text" },
        ],
      },
      {
        title: "Your child",
        fields: [
          { id: "childName", label: "First name (or the name they like to be called)", kind: "text", required: true },
          { id: "childDob", label: "Date of birth", kind: "date" },
          { id: "childAge", label: "Age", kind: "text" },
          { id: "school", label: "School setting", kind: "choice", options: ["Mainstream", "Specialist", "Home-educated", "Other"] },
          { id: "ehcp", label: "Do they have an EHCP or SEN support?", kind: "choice", options: ["EHCP", "SEN support", "Neither", "Applying or in progress"] },
          { id: "household", label: "Who else lives in the home? (adults, siblings and their ages)", kind: "textarea" },
          { id: "joinSessions", label: "Will your child join any of the sessions?", kind: "choice", options: ["Yes", "No", "Part of a session"] },
        ],
      },
    ],
  },
  {
    id: "health",
    title: "Your child's health background",
    intro: "This section helps make sure any product or lifestyle suggestion is safe for them. Please be as complete as you can here.",
    groups: [
      {
        fields: [
          { id: "diagnosis", label: "When were they diagnosed with autism, and by whom (e.g. CAMHS, paediatrician)?", kind: "textarea" },
          { id: "otherDiagnoses", label: "Any other diagnoses or conditions (e.g. ADHD, epilepsy, anxiety, eczema, asthma)?", kind: "textarea" },
          { id: "medications", label: "Current medications (name and dose)", kind: "textarea" },
          { id: "supplements", label: "Current vitamins, supplements or herbal remedies", kind: "textarea" },
          { id: "allergies", label: "Known allergies (food, nut, plant, fragrance, skin products)", kind: "textarea" },
          { id: "skinReactions", label: "Skin sensitivities or reactions to creams, oils or sprays in the past", kind: "textarea" },
          { id: "professionals", label: "Are they currently seen by a GP, paediatrician, dietitian, OT, SALT or other professional? Please list.", kind: "textarea" },
          { id: "professionalAdvice", label: "Has any professional advised avoiding certain foods, supplements or activities?", kind: "textarea" },
          { id: "puberty", label: "Have they started puberty or periods? (helps with hormonal and skin guidance)", kind: "choice", options: ["Not yet", "Early signs", "Yes"] },
          { id: "healthOther", label: "Anything else about their health you would like me to know", kind: "textarea" },
        ],
      },
    ],
    notes: { paragraphs: ["Please let me know before your session if anything on this list changes."] },
  },
  {
    id: "sensory",
    title: "Sensory needs, communication and routines",
    intro: "Every autistic child experiences the world differently. Knowing their sensory preferences helps choose textures, scents and routines they will actually enjoy.",
    groups: [
      {
        fields: [
          {
            id: "sensory",
            label: "Sensory preferences (tick any that apply)",
            kind: "checks",
            options: [
              "Sensitive to smells or strong scents",
              "Dislikes certain textures on their skin (sticky, oily, cold, wet)",
              "Seeks deep pressure, massage or firm touch",
              "Dislikes being touched unexpectedly",
              "Sensitive to sound or noisy environments",
              "Sensitive to bright or flickering light",
              "Very selective about food tastes or textures",
              "Seeks movement (rocking, spinning, jumping)",
            ],
          },
          { id: "likedScents", label: "Scents they like or find calming", kind: "textarea" },
          { id: "dislikedScents", label: "Scents or textures they strongly dislike", kind: "textarea" },
          { id: "communication", label: "How do they prefer to communicate? (speech, visuals, writing, AAC, other)", kind: "textarea" },
          { id: "calm", label: "What helps them feel calm and safe?", kind: "textarea" },
          { id: "triggers", label: "Common triggers for overwhelm, meltdowns or shutdowns", kind: "textarea" },
          { id: "newThings", label: "How do they feel about trying new things? What helps (e.g. warning, visual steps, choice)?", kind: "textarea" },
          { id: "typicalDay", label: "A typical weekday: wake time, school, after school, bedtime", kind: "textarea" },
          { id: "interests", label: "Their special interests or things they love", kind: "textarea" },
        ],
      },
    ],
  },
  {
    id: "lifestyle",
    title: "Daily lifestyle",
    groups: [
      {
        title: "Food and drink",
        fields: [
          { id: "safeFoods", label: "Foods they eat regularly (their “safe” foods)", kind: "textarea" },
          { id: "avoidedFoods", label: "Foods they refuse or avoid", kind: "textarea" },
          { id: "water", label: "Roughly how much water do they drink a day?", kind: "text" },
          { id: "dietsTried", label: "Any dietary approaches already tried (e.g. gluten-free, dairy-free, less sugar)? What happened?", kind: "textarea" },
        ],
      },
      {
        title: "Sleep",
        fields: [
          { id: "sleepTimes", label: "Usual bedtime and wake time", kind: "text" },
          { id: "sleepTrouble", label: "Do they have trouble falling asleep, staying asleep or waking early?", kind: "textarea" },
          { id: "bedtimeRoutine", label: "Current bedtime routine", kind: "textarea" },
          { id: "screens", label: "Screen use in the hour before bed", kind: "text" },
        ],
      },
      {
        title: "Digestion and body",
        fields: [
          { id: "bowel", label: "Bowel habits (regular, constipation, loose stools, tummy pain)", kind: "textarea" },
          { id: "energy", label: "Energy levels through the day", kind: "textarea" },
          { id: "activity", label: "Physical activity they enjoy, and how often", kind: "textarea" },
          { id: "outdoors", label: "Time spent outdoors on a typical day", kind: "text" },
        ],
      },
      {
        title: "Home environment",
        fields: [
          { id: "cleaningProducts", label: "Main cleaning, laundry and air-freshening products used at home", kind: "textarea" },
          { id: "toiletries", label: "Main toiletries they use (shampoo, soap, lotion, deodorant)", kind: "textarea" },
          { id: "swapsMade", label: "Any low-tox swaps you have already made", kind: "textarea" },
        ],
      },
    ],
  },
  {
    id: "family",
    title: "Your family and our products",
    intro: "The aim is a simple wellness routine the whole family can share, so your child feels included rather than singled out.",
    groups: [
      {
        fields: [
          { id: "familyMembers", label: "Family members who would like to be included (name, age, main wellness goal)", kind: "textarea" },
          { id: "familyHealth", label: "Any health conditions, pregnancy or breastfeeding in the family I should know about?", kind: "textarea" },
          { id: "parentFeeling", label: "How are you, as their parent, feeling day to day? (energy, sleep, stress)", kind: "textarea" },
          { id: "familyRoutines", label: "Family routines that already work well (meals together, prayer times, walks)", kind: "textarea" },
          { id: "products", label: "Products you have used or are curious about (tick any that apply)", kind: "checks", options: intakeProducts },
          { id: "productsUsed", label: "Which products have you already used, and for whom? How did it go?", kind: "textarea" },
          { id: "childProducts", label: "Has your child tried any of our products? How did they react to the texture or scent?", kind: "textarea" },
          { id: "budget", label: "Your monthly budget for family wellness products (optional)", kind: "text" },
        ],
      },
    ],
  },
  {
    id: "goals",
    title: "Your goals",
    groups: [
      {
        fields: [
          {
            id: "focusAreas",
            label: "Areas you would like support with (tick up to three to focus on first)",
            kind: "checks",
            max: 3,
            options: [
              "Better sleep and a calmer bedtime",
              "Calming and self-regulation routines",
              "Skin care suited to sensory needs",
              "Digestion and gut comfort",
              "Nutrition with a limited or selective diet",
              "Lowering toxins in the home",
              "Hormonal and pre-teen changes",
              "A shared family wellness routine",
              "My own wellbeing as a parent",
            ],
          },
          { id: "biggestDifference", label: "What is the one thing that would make the biggest difference to your family right now?", kind: "textarea" },
          { id: "success", label: "What would success look like at the end of your three sessions?", kind: "textarea" },
          { id: "alreadyTried", label: "What have you already tried, and what helped or did not help?", kind: "textarea" },
          { id: "worries", label: "Anything you are worried about or would prefer to avoid?", kind: "textarea" },
        ],
      },
    ],
  },
  {
    id: "sessions",
    title: "Session preferences",
    groups: [
      {
        fields: [
          { id: "format", label: "Preferred format", kind: "choice", options: ["Video call", "Phone", "WhatsApp call"] },
          { id: "bestTimes", label: "Best days and times for your sessions", kind: "textarea" },
          { id: "planFormat", label: "How would you like your plan?", kind: "choice", options: ["Written summary", "Voice note", "Both"] },
          { id: "easier", label: "Anything that would make sessions easier for you or your child?", kind: "textarea" },
        ],
      },
    ],
    notes: {
      title: "Good to know",
      items: [
        "Please arrive a few minutes early so we can start on time.",
        "Follow-up sessions are best booked 2 to 3 weeks apart and used within 3 months of your first session.",
        "Please give at least 24 hours' notice to reschedule. Sessions missed without notice may not be rebooked.",
        "You will receive a short written summary after each session.",
      ],
    },
  },
  {
    id: "consent",
    title: "Disclaimer and consent",
    intro:
      "Consultations offer holistic wellness education and lifestyle guidance from a certified holistic health coach. They are not medical advice, diagnosis or treatment. They do not treat, cure or change autism, and they do not replace care from your GP, paediatrician or other health professionals.",
    notes: {
      paragraphs: [
        "Please keep following any treatment or advice from your child's health professionals. Speak to your GP or pharmacist before introducing any new product or supplement, especially if your child takes medication or has a health condition. Always patch test topical products before regular use, and stop using any product that causes a reaction.",
        "Your data: the information in this form, including health information about your child, is used only to prepare for and deliver your consultations. It is stored securely, never shared without your permission, and handled in line with UK GDPR. You can ask to see or delete your data at any time.",
      ],
    },
    groups: [
      {
        fields: [
          {
            id: "consents",
            label: "Please tick to confirm",
            kind: "checks",
            required: "all",
            options: [
              "I am the parent or legal guardian of the child named in this form.",
              "I understand this consultation is wellness guidance, not medical advice.",
              "I consent to the storing and use of the health information in this form for my consultations.",
              "The information I have given is accurate to the best of my knowledge, and I will share any changes.",
              "I will seek medical help for any urgent or worsening health concerns.",
            ],
          },
          { id: "signature", label: "Type your full name as your signature", kind: "text", required: true },
          { id: "signedDate", label: "Date", kind: "date", required: true },
        ],
      },
    ],
  },
];

export const allIntakeFields = intakeSections.flatMap((s) => s.groups.flatMap((g) => g.fields));

export type IntakeAnswers = Record<string, string | string[]>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns an error message per field id. Shared by the browser and the server.
export function validateFields(fields: Field[], a: IntakeAnswers) {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const v = a[f.id];
    if (f.kind === "checks") {
      const list = Array.isArray(v) ? v : [];
      if (f.required === "all" && list.length < f.options.length) errors[f.id] = "Tick every box to confirm.";
      if (f.max && list.length > f.max) errors[f.id] = `Choose up to ${f.max}.`;
      continue;
    }
    const s = typeof v === "string" ? v.trim() : "";
    if (f.required && !s) errors[f.id] = "This is needed so I can prepare for your session.";
    else if (f.kind === "email" && s && !EMAIL.test(s)) errors[f.id] = "Enter an email address like name@example.com.";
  }
  return errors;
}

// Keeps only known fields and valid options, trimmed to sensible lengths.
export function cleanAnswers(raw: unknown): IntakeAnswers {
  const input = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out: IntakeAnswers = {};
  for (const f of allIntakeFields) {
    const v = input[f.id];
    if (f.kind === "checks") {
      out[f.id] = Array.isArray(v) ? f.options.filter((o) => v.includes(o)) : [];
    } else if (f.kind === "choice") {
      out[f.id] = typeof v === "string" && f.options.includes(v) ? v : "";
    } else {
      out[f.id] = typeof v === "string" ? v.trim().slice(0, f.kind === "textarea" ? 4000 : 300) : "";
    }
  }
  return out;
}

export const answerText = (a: IntakeAnswers, id: string) => {
  const v = a[id];
  return Array.isArray(v) ? v.join(", ") : (v ?? "");
};
