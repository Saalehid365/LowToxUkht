"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import s from "@/app/journal/journal.module.css";
import { saveNight, saveChildName, clearJournal } from "@/app/journal/actions";
import { signOut } from "@/app/account/actions";
import { options, RATE, OUTSIDE_TEXT, type Entries, type SleepEntry } from "@/lib/journal";

type Tab = "today" | "progress" | "settings";
type ChipField = "wakeWhat" | "outside" | "moved" | "sugar" | "screens" | "routine" | "massage";
const FIELDS: ChipField[] = ["wakeWhat", "outside", "moved", "sugar", "screens", "routine", "massage"];

// Dates are handled as local calendar days, like the original journal.
const pad = (n: number) => (n < 10 ? "0" : "") + n;
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (d: Date, n: number) => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() + n);
  return x;
};
const parse = (k: string) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const nice = (k: string) => parse(k).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
const short = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const avg = (a: number[]) => (a.length ? a.reduce((t, x) => t + x, 0) / a.length : null);
const fmt = (n: number | null) => (n === null ? "–" : String(Math.round(n * 10) / 10));

function Moon({ kind, size = 21, color = "#FFF7F9" }: { kind: "full" | "half" | "ring" | "none"; size?: number; color?: string }) {
  const r = size / 2 - 1.5;
  const c = size / 2;
  const box = `0 0 ${size} ${size}`;
  if (kind === "full")
    return (
      <svg viewBox={box} aria-hidden="true">
        <circle cx={c} cy={c} r={r} fill={color} />
      </svg>
    );
  if (kind === "half")
    return (
      <svg viewBox={box} aria-hidden="true">
        <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth="1.6" />
        <path d={`M${c} ${c - r} A${r} ${r} 0 0 1 ${c} ${c + r} Z`} fill={color} />
      </svg>
    );
  if (kind === "ring")
    return (
      <svg viewBox={box} aria-hidden="true">
        <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth="1.6" />
      </svg>
    );
  return (
    <svg viewBox={box} aria-hidden="true">
      <circle cx={c} cy={c} r={r - 3} fill="none" stroke={color} strokeOpacity=".55" strokeWidth="1.2" strokeDasharray="2 3" />
    </svg>
  );
}
const moonKind = (e?: SleepEntry) => (!e ? "none" : e.wakings === 0 ? "full" : e.wakings === 1 ? "half" : "ring");

type Form = Omit<SleepEntry, "wakeWhat"> & { wakeWhat: string[] };
const blank: Form = {
  bedtime: "",
  wake: "",
  wakings: 0,
  wakeWhat: [],
  outside: "",
  moved: "",
  sugar: "",
  screens: "",
  routine: "",
  massage: "",
  mumSleep: 0,
  notes: "",
};

export function SleepJournal({
  initialEntries,
  initialName,
  brand,
}: {
  initialEntries: Entries;
  initialName: string;
  brand: string;
}) {
  const [now, setNow] = useState<Date | null>(null); // set after load, so dates use the client's own clock
  const [entries, setEntries] = useState<Entries>(initialEntries);
  const [childName, setChildNameState] = useState(initialName);
  const [nameInput, setNameInput] = useState(initialName);
  const [tab, setTab] = useState<Tab>("today");
  const [night, setNight] = useState("");
  const [form, setForm] = useState<Form>(blank);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastOn, setToastOn] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const d = new Date();
    setNow(d);
    const y = iso(addDays(d, -1));
    setNight(y);
    setForm(initialEntries[y] ? { ...initialEntries[y] } : blank);
  }, [initialEntries]);

  const she = () => (childName.trim() ? childName.trim() : "she");
  const isLastNight = (k: string) => now !== null && k === iso(addDays(now, -1));
  const titleFor = (k: string) => (isLastNight(k) ? `How did ${she()} sleep last night?` : `How did ${she()} sleep on ${nice(k)}?`);

  function toast(msg: string) {
    setToastMsg(msg);
    setToastOn(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastOn(false), 2600);
  }

  function loadNight(k: string) {
    setNight(k);
    setForm(entries[k] ? { ...entries[k] } : blank);
  }

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const setWakings = (n: number) => set("wakings", Math.max(0, Math.min(9, n)));

  function toggleChip(field: ChipField, value: string) {
    if (field === "wakeWhat") {
      const cur = form.wakeWhat;
      set("wakeWhat", cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]);
    } else set(field, form[field] === value ? "" : value);
  }

  async function save() {
    if (!night) return toast("Please choose the night first (question 1)");
    setSaving(true);
    const entry = { ...form, wakeWhat: form.wakings === 0 ? [] : form.wakeWhat, notes: form.notes.trim() };
    try {
      const res = await saveNight(night, entry);
      if (!res.ok) return toast(res.error);
      setEntries((e) => ({ ...e, [night]: res.data! }));
      window.scrollTo(0, 0);
      toast(entry.wakings === 0 ? "Saved. A calm night, alhamdulillah 🌙" : "Saved. JazakAllahu khayran 🤍");
    } catch {
      toast("Not saved. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  // Progress
  function windowEntries(from: Date, days: number) {
    const r: SleepEntry[] = [];
    for (let i = 0; i < days; i++) {
      const e = entries[iso(addDays(from, i))];
      if (e) r.push(e);
    }
    return r;
  }
  function weekStats(start: Date) {
    const es = windowEntries(start, 7);
    return {
      logged: es.length,
      calm: es.filter((e) => e.wakings === 0).length,
      avgW: avg(es.map((e) => e.wakings)),
      outside: es.filter((e) => +e.outside >= 2).length,
      routine: es.filter((e) => e.routine === "yes").length,
      sugar: es.filter((e) => e.sugar === "yes").length,
      mum: avg(es.filter((e) => e.mumSleep).map((e) => e.mumSleep)),
      notes: es.map((e) => e.notes).filter(Boolean),
    };
  }

  function insights() {
    const all = Object.values(entries);
    const out: string[] = [];
    const compare = (test: (e: SleepEntry) => boolean, yes: string, no: string) => {
      const a = all.filter(test).map((e) => e.wakings);
      const b = all.filter((e) => !test(e)).map((e) => e.wakings);
      if (a.length >= 2 && b.length >= 2) {
        const x = avg(a)!;
        const y = avg(b)!;
        if (x < y - 0.2) out.push(`🌿 ${yes}, ${she()} woke ${fmt(x)} times on average. ${no}, it was ${fmt(y)}.`);
      }
    };
    compare((e) => +e.outside >= 2, "On days outside for 15+ mins", "On other days");
    compare((e) => e.routine === "yes", "With the full bedtime routine", "Without it");
    compare((e) => e.sugar === "no", "With no sugar after lunch", "With sugar");
    compare((e) => e.screens === "1hr+", "When screens went off an hour before bed", "Otherwise");
    return { list: out, total: all.length };
  }

  function summary() {
    if (!now) return "";
    const start = addDays(now, -7);
    const w = weekStats(start);
    const p = weekStats(addDays(now, -14));
    const lines = [
      `Assalamu alaikum 🌙 Here is ${childName.trim() ? `${childName.trim()}'s` : "our"} sleep week`,
      `Nights ${short(start)} to ${short(addDays(now, -1))}`,
      "",
      `Nights filled in: ${w.logged}/7`,
      `Slept through: ${w.calm} nights`,
      `Woke on average: ${fmt(w.avgW)} times a night${p.avgW !== null ? ` (week before: ${fmt(p.avgW)})` : ""}`,
      `Outside 15+ mins: ${w.outside} days`,
      `Full bedtime routine: ${w.routine} nights`,
      `Sugar after lunch: ${w.sugar} days`,
      `My sleep: ${fmt(w.mum)}/5`,
      "",
      "Night by night:",
    ];
    for (let i = 0; i < 7; i++) {
      const k = iso(addDays(start, i));
      const e = entries[k];
      if (!e) {
        lines.push(`${nice(k)}: not filled in`);
        continue;
      }
      const bits = [e.wakings === 0 ? "slept through" : `woke ${e.wakings}x`];
      if (e.bedtime) bits.push(`bed ${e.bedtime}`);
      if (e.wake) bits.push(`up ${e.wake}`);
      if (e.outside !== "") bits.push(OUTSIDE_TEXT[+e.outside]);
      if (e.wakeWhat.length) bits.push(e.wakeWhat.join(", ").toLowerCase());
      lines.push(`${nice(k)}: ${bits.join(", ")}`);
    }
    if (w.notes.length) lines.push("", "My notes:", ...w.notes.map((n) => `• ${n}`));
    lines.push("", "JazakAllahu khayran 🤍");
    return lines.join("\n");
  }

  async function copyWeek() {
    const t = summary();
    try {
      await navigator.clipboard.writeText(t);
      toast("Copied. Now paste it into WhatsApp");
    } catch {
      const a = document.createElement("textarea");
      a.value = t;
      document.body.appendChild(a);
      a.select();
      try {
        document.execCommand("copy");
        toast("Copied. Now paste it into WhatsApp");
      } catch {
        toast("Copying didn’t work on this phone");
      }
      a.remove();
    }
  }

  async function saveName() {
    const res = await saveChildName(nameInput);
    if (!res.ok) return toast(res.error);
    setChildNameState(nameInput.trim());
    toast("Saved 🤍");
  }

  async function resetAll() {
    if (!confirm("Delete every night in your sleep journal? This can’t be undone.")) return;
    const res = await clearJournal();
    if (!res.ok) return toast(res.error);
    setEntries({});
    setForm(blank);
    toast("All nights deleted");
  }

  function showTab(t: Tab) {
    setTab(t);
  }

  const moons = now
    ? Array.from({ length: 14 }, (_, i) => {
        const k = iso(addDays(now, -(14 - i)));
        return <Moon key={k} kind={moonKind(entries[k])} />;
      })
    : null;

  const chip = (field: ChipField, value: string, label: string) => (
    <button
      key={value}
      type="button"
      aria-pressed={field === "wakeWhat" ? form.wakeWhat.includes(value) : form[field] === value}
      onClick={() => toggleChip(field, value)}
    >
      {label}
    </button>
  );

  return (
    <div className={s.root}>
      <header className={s.hero}>
        <svg className={s.sprig} viewBox="0 0 150 150" aria-hidden="true" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
          <path d="M30 140 C60 100 80 70 120 20" />
          <path d="M52 108 C40 98 34 86 36 74 C48 80 54 92 52 108Z" />
          <path d="M60 98 C74 96 86 88 92 76 C78 74 66 84 60 98Z" />
          <path d="M74 78 C64 66 62 54 66 42 C76 50 78 64 74 78Z" />
          <path d="M84 66 C98 66 108 58 114 46 C100 44 90 52 84 66Z" />
          <path d="M98 44 C92 34 92 24 98 14 C104 24 104 34 98 44Z" />
        </svg>
        <div className={s.heroInner}>
          <div className={s.topbar}>
            <Link href="/account">‹ My account</Link>
            <form action={signOut}>
              <button>Sign out</button>
            </form>
          </div>
          <p className={s.greet}>Assalamu alaikum, mama</p>
          <h1>Sleep Journal</h1>
          <p className={s.brandline}>{brand} coaching</p>
          <div className={s.moons} aria-label="Last 14 nights">
            {moons}
          </div>
          <p className={s.moonsCaption}>Your last 14 nights. 🌕 Slept through · 🌓 Woke once · ⚪ Woke 2+ times</p>
        </div>
      </header>

      <nav className={s.tabs} role="tablist">
        {(
          [
            ["today", "Today"],
            ["progress", "My progress"],
            ["settings", "Settings"],
          ] as const
        ).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => showTab(id)}>
            {label}
          </button>
        ))}
      </nav>

      <main className={s.main}>
        {tab === "today" && (
          <section>
            <div className={s.intro}>
              <h2>Bismillah, let&apos;s begin</h2>
              <p>{night ? titleFor(night) : " "}</p>
              <p style={{ fontSize: ".9rem" }}>Just tap your answers. It takes about a minute.</p>
            </div>

            <div className={s.q}>
              <div className={s.qHead}>
                <span className={s.num}>1</span>
                <label htmlFor="sj-date">
                  <span className={s.qTitle}>Which night is this for?</span>
                  <span className={s.hint}>It&apos;s already set to last night. Only change it if you&apos;re filling in a night you missed.</span>
                </label>
              </div>
              <input
                type="date"
                id="sj-date"
                value={night}
                max={now ? iso(now) : undefined}
                onChange={(e) => e.target.value && loadNight(e.target.value)}
              />
            </div>

            <div className={s.q}>
              <div className={s.qHead}>
                <span className={s.num}>2</span>
                <label htmlFor="sj-bedtime">
                  <span className={s.qTitle}>🌙 What time did {she()} go to bed?</span>
                  <span className={s.hint}>A rough time is fine.</span>
                </label>
              </div>
              <input type="time" id="sj-bedtime" value={form.bedtime} onChange={(e) => set("bedtime", e.target.value)} />
            </div>

            <div className={s.q}>
              <div className={s.qHead}>
                <span className={s.num}>3</span>
                <label htmlFor="sj-wake">
                  <span className={s.qTitle}>☀️ What time did {she()} get up this morning?</span>
                  <span className={s.hint}>When she got up for the day.</span>
                </label>
              </div>
              <input type="time" id="sj-wake" value={form.wake} onChange={(e) => set("wake", e.target.value)} />
            </div>

            <div className={s.q}>
              <div className={s.qHead}>
                <span className={s.num}>4</span>
                <span>
                  <span className={s.qTitle}>How many times did {she()} wake up in the night?</span>
                  <span className={s.hint}>Tap + once for each time she woke.</span>
                </span>
              </div>
              <div className={s.stepper}>
                <button type="button" aria-label="One less" onClick={() => setWakings(form.wakings - 1)}>
                  −
                </button>
                <output aria-live="polite">{form.wakings}</output>
                <button type="button" aria-label="One more" onClick={() => setWakings(form.wakings + 1)}>
                  +
                </button>
              </div>
              <p className={s.stepNote}>
                {form.wakings === 0 ? "Slept through, alhamdulillah 🌙" : form.wakings === 1 ? "Woke once" : `Woke ${form.wakings} times`}
              </p>
            </div>

            {form.wakings > 0 && (
              <div className={s.q}>
                <div className={s.qHead}>
                  <span className={s.num}>4b</span>
                  <span>
                    <span className={s.qTitle}>What did {she()} do when she woke up?</span>
                    <span className={s.hint}>Tap all that apply.</span>
                  </span>
                </div>
                <div className={s.chips}>{options.wakeWhat.map((v) => chip("wakeWhat", v, v))}</div>
              </div>
            )}

            <ChipQ n="5" title={`🌿 How long was ${she()} outside yesterday?`} hint="Walks, the garden, the walk to tuition: it all counts.">
              {options.outside.map((o) => chip("outside", o.value, o.label))}
            </ChipQ>
            <ChipQ n="6" title={`🤸‍♀️ Was ${she()} active yesterday?`} hint="Walking, playing, dancing, swimming, trampoline…">
              {options.moved.map((o) => chip("moved", o.value, o.label))}
            </ChipQ>
            <ChipQ n="7" title={`🍬 Did ${she()} have anything sugary after lunch?`} hint="Sweets, biscuits, cake, juice or fizzy drinks.">
              {options.sugar.map((o) => chip("sugar", o.value, o.label))}
            </ChipQ>
            <ChipQ n="8" title="📱 When did screens go off?" hint="Phone, tablet, TV and games.">
              {options.screens.map((o) => chip("screens", o.value, o.label))}
            </ChipQ>
            <ChipQ n="9" title="🤲 Did you do the bedtime routine?" hint="Wudu, Isha, a warm shower, massage, adhkar or a story.">
              {options.routine.map((o) => chip("routine", o.value, o.label))}
            </ChipQ>
            <ChipQ n="10" title={`💆‍♀️ Did ${she()} have her magnesium massage?`} hint="Body butter on her feet and legs before bed.">
              {options.massage.map((o) => chip("massage", o.value, o.label))}
            </ChipQ>

            <div className={s.q}>
              <div className={s.qHead}>
                <span className={s.num}>11</span>
                <span>
                  <span className={s.qTitle}>💗 And how did you sleep, mama?</span>
                  <span className={s.hint}>Tap a moon. 1 moon = very badly, 5 moons = really well.</span>
                </span>
              </div>
              <div className={s.rating} role="radiogroup" aria-label="Your sleep, 1 to 5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={i === form.mumSleep}
                    aria-label={`${i} out of 5, ${RATE[i]}`}
                    onClick={() => set("mumSleep", form.mumSleep === i ? 0 : i)}
                  >
                    <Moon kind={i <= form.mumSleep ? "full" : "ring"} size={40} color="#B66A7E" />
                  </button>
                ))}
              </div>
              <p className={s.rateLabel}>{form.mumSleep ? RATE[form.mumSleep] : ""}</p>
            </div>

            <div className={s.q}>
              <div className={s.qHead}>
                <span className={s.num}>12</span>
                <label htmlFor="sj-notes">
                  <span className={s.qTitle}>✍️ Anything else you&apos;d like me to know?</span>
                  <span className={s.hint}>Optional. For example: she was unwell, a busy day, or something that helped.</span>
                </label>
              </div>
              <textarea id="sj-notes" placeholder="Write here…" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
            </div>

            <button className={s.save} type="button" onClick={save} disabled={saving || !now}>
              {saving ? "Saving…" : entries[night] ? "Update this night" : isLastNight(night) ? "Save last night" : "Save this night"}
            </button>
            <p className={s.note}>🔒 Your answers are saved privately to your account, so they&apos;re safe if you change phone.</p>
          </section>
        )}

        {tab === "progress" && now && progress()}

        {tab === "settings" && (
          <section>
            <div className={s.panel}>
              <h2>Make it yours</h2>
              <div style={{ marginTop: 12 }}>
                <label htmlFor="sj-child">
                  <span className={s.qTitle}>Your daughter&apos;s first name</span>
                  <span className={s.hint}>Optional. The questions will use her name.</span>
                </label>
                <input
                  type="text"
                  id="sj-child"
                  autoComplete="off"
                  placeholder="Her first name"
                  style={{ marginTop: 10 }}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>
              <button className={s.save} type="button" onClick={saveName}>
                Save name
              </button>
            </div>
            <div className={s.panel}>
              <h2>Start again</h2>
              <p className={s.sub}>This deletes every night in your sleep journal. It can&apos;t be undone.</p>
              <button className={s.btn2} type="button" onClick={resetAll}>
                Delete all my nights
              </button>
            </div>
          </section>
        )}
      </main>

      <div className={`${s.toast}${toastOn ? ` ${s.toastShow}` : ""}`} role="status" aria-live="polite">
        {toastMsg}
      </div>
    </div>
  );

  function progress() {
    const today = now!;
    const start = addDays(today, -7);
    const w = weekStats(start);
    const p = weekStats(addDays(today, -14));
    let trend = "";
    if (w.avgW !== null && p.avgW !== null) {
      const d = w.avgW - p.avgW;
      trend = d < 0 ? `Down from ${fmt(p.avgW)} last week 🌱` : d > 0 ? `Up from ${fmt(p.avgW)} last week` : "Same as last week";
    }
    const ins = insights();

    // 14 night chart
    const W = 340,
      H = 150,
      pl = 8,
      pb = 24,
      n = 14,
      bw = (W - pl * 2) / n;
    const days = Array.from({ length: 14 }, (_, i) => {
      const d = addDays(today, -(14 - i));
      return { d, e: entries[iso(d)] };
    });
    const max = Math.max(1, ...days.map((x) => x.e?.wakings ?? 0));
    const keys = Object.keys(entries).sort().reverse();

    return (
      <section>
        <div className={s.dua}>
          <p>“May Allah grant you both peaceful, restful sleep.”</p>
        </div>

        <div className={s.panel}>
          <h2>This week</h2>
          <p className={s.sub}>
            {short(start)} to {short(addDays(today, -1))}. You filled in {w.logged} of 7 nights.
          </p>
          <div className={s.stats}>
            <div className={s.stat}>
              <b>{w.calm}</b>
              <span>nights {she()} slept through</span>
            </div>
            <div className={s.stat}>
              <b>{fmt(w.avgW)}</b>
              <span>times {she()} woke, on average</span>
              {trend && <span className={s.trend}>{trend}</span>}
            </div>
            <div className={s.stat}>
              <b>{w.outside}</b>
              <span>days outside for 15+ mins</span>
            </div>
            <div className={s.stat}>
              <b>
                {fmt(w.mum)}
                <small style={{ fontSize: "1rem" }}> / 5</small>
              </b>
              <span>how you slept, mama</span>
            </div>
          </div>
          {ins.list.length > 0 ? (
            <>
              <p className={s.sub} style={{ marginTop: 14 }}>
                What seems to help:
              </p>
              {ins.list.map((t) => (
                <div key={t} className={s.insight}>
                  {t}
                </div>
              ))}
            </>
          ) : (
            ins.total < 4 && (
              <p className={s.empty} style={{ marginTop: 12 }}>
                Keep going, mama. After a few more nights, you will see here what helps her sleep, in shaa Allah.
              </p>
            )
          )}
        </div>

        <div className={s.panel}>
          <h2>Night wakings</h2>
          <p className={s.sub}>
            Your last 14 nights. Smaller pink bars mean better nights. A green moon means {she()} slept through, alhamdulillah.
          </p>
          <div className={s.chart}>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Night wakings for the last 14 nights">
              {days.map((x, i) => {
                const cx = pl + i * bw + bw / 2;
                const base = H - pb;
                const h = x.e ? (x.e.wakings / max) * (H - pb - 14) : 0;
                return (
                  <g key={i}>
                    {x.e ? (
                      x.e.wakings === 0 ? (
                        <circle cx={cx} cy={base - 8} r={7} fill="#6F9A7E" />
                      ) : (
                        <>
                          <rect x={cx - bw * 0.3} y={base - h} width={bw * 0.6} height={h} rx={6} fill="#B66A7E" />
                          <text x={cx} y={base - h - 4} textAnchor="middle" fontSize="10" fill="currentColor">
                            {x.e.wakings}
                          </text>
                        </>
                      )
                    ) : (
                      <line x1={cx - 4} x2={cx + 4} y1={base - 2} y2={base - 2} stroke="currentColor" strokeOpacity=".4" strokeWidth="1.5" />
                    )}
                    {i % 2 === 0 && (
                      <text x={cx} y={H - 6} textAnchor="middle" fontSize="9" fill="currentColor" opacity=".7">
                        {x.d.getDate()}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className={s.panel}>
          <h2>Send to your coach</h2>
          <p className={s.sub}>Sends a summary of the last 7 nights. Tap the button, then choose my chat in WhatsApp.</p>
          <a className={`${s.btn2} ${s.btnWa}`} href={`https://wa.me/?text=${encodeURIComponent(summary())}`} target="_blank" rel="noopener">
            Send my week on WhatsApp
          </a>
          <button className={s.btn2} type="button" onClick={copyWeek}>
            Copy my week instead
          </button>
        </div>

        <div className={s.panel}>
          <h2>Your nights</h2>
          <p className={s.sub}>Tap Edit to change a night.</p>
          {keys.length ? (
            keys.map((k) => {
              const e = entries[k];
              return (
                <div key={k} className={s.entry}>
                  <div>
                    {nice(k)}
                    <small>
                      {e.wakings === 0 ? "Slept through 🌙" : `Woke ${e.wakings} time${e.wakings > 1 ? "s" : ""}`}
                      {e.bedtime ? `, bed at ${e.bedtime}` : ""}
                    </small>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      loadNight(k);
                      showTab("today");
                      window.scrollTo(0, 0);
                    }}
                  >
                    Edit
                  </button>
                </div>
              );
            })
          ) : (
            <p className={s.empty}>No nights saved yet. Your first night will show here, in shaa Allah.</p>
          )}
        </div>
      </section>
    );
  }
}

function ChipQ({ n, title, hint, children }: { n: string; title: string; hint: string; children: React.ReactNode }) {
  return (
    <div className={s.q}>
      <div className={s.qHead}>
        <span className={s.num}>{n}</span>
        <span>
          <span className={s.qTitle}>{title}</span>
          <span className={s.hint}>{hint}</span>
        </span>
      </div>
      <div className={s.chips}>{children}</div>
    </div>
  );
}
