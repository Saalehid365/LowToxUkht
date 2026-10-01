// The sleep journal's questions and answer rules, shared by the journal page,
// the server and the coach's dashboard.

export type SleepEntry = {
  bedtime: string;
  wake: string;
  wakings: number;
  wakeWhat: string[];
  outside: string;
  moved: string;
  sugar: string;
  screens: string;
  routine: string;
  massage: string;
  mumSleep: number;
  notes: string;
};

export type Entries = Record<string, SleepEntry>; // keyed by night, YYYY-MM-DD

export const options = {
  wakeWhat: ["Walked around", "Came to my room", "Wanted food or drink", "Was upset", "Was wide awake"],
  outside: [
    { value: "0", label: "Not at all" },
    { value: "1", label: "Less than 15 mins" },
    { value: "2", label: "15 to 30 mins" },
    { value: "3", label: "More than 30 mins" },
  ],
  moved: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ],
  sugar: [
    { value: "no", label: "No" },
    { value: "yes", label: "Yes" },
  ],
  screens: [
    { value: "1hr+", label: "1 hour or more before bed" },
    { value: "under", label: "Less than 1 hour before bed" },
    { value: "none", label: "They didn't go off" },
  ],
  routine: [
    { value: "yes", label: "All of it" },
    { value: "partly", label: "Some of it" },
    { value: "no", label: "Not tonight" },
  ],
  massage: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ],
};

export const RATE = ["", "Very badly", "Badly", "Okay", "Well", "Really well, alhamdulillah"];
export const OUTSIDE_TEXT = ["not outside", "under 15 mins outside", "15–30 mins outside", "30+ mins outside"];

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
export const NIGHT = /^\d{4}-\d{2}-\d{2}$/;

const pick = (v: unknown, allowed: { value: string }[]) =>
  typeof v === "string" && allowed.some((o) => o.value === v) ? v : "";

// Keeps only known answers in the right shape, whatever the browser sent.
export function cleanEntry(raw: unknown): SleepEntry {
  const e = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const wakings = Math.max(0, Math.min(9, Math.round(Number(e.wakings) || 0)));
  return {
    bedtime: typeof e.bedtime === "string" && TIME.test(e.bedtime) ? e.bedtime : "",
    wake: typeof e.wake === "string" && TIME.test(e.wake) ? e.wake : "",
    wakings,
    wakeWhat: wakings > 0 && Array.isArray(e.wakeWhat) ? options.wakeWhat.filter((o) => (e.wakeWhat as unknown[]).includes(o)) : [],
    outside: pick(e.outside, options.outside),
    moved: pick(e.moved, options.moved),
    sugar: pick(e.sugar, options.sugar),
    screens: pick(e.screens, options.screens),
    routine: pick(e.routine, options.routine),
    massage: pick(e.massage, options.massage),
    mumSleep: Math.max(0, Math.min(5, Math.round(Number(e.mumSleep) || 0))),
    notes: typeof e.notes === "string" ? e.notes.trim().slice(0, 2000) : "",
  };
}

export const labelFor = (field: keyof typeof options, value: string) =>
  field === "wakeWhat" ? value : (options[field] as { value: string; label: string }[]).find((o) => o.value === value)?.label ?? "";
