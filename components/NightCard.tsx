import Link from "next/link";
import { labelFor, OUTSIDE_TEXT, RATE, type SleepEntry } from "@/lib/journal";

export const niceNight = (k: string) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};

// One night of a client's sleep journal, as the coach sees it.
export function NightCard({
  night,
  entry: e,
  client,
  updatedAt,
}: {
  night: string;
  entry: SleepEntry;
  client?: { id: string; name: string; childName: string };
  updatedAt?: string;
}) {
  const rows: [string, string][] = [
    ["Bed", e.bedtime],
    ["Up", e.wake],
    ["When she woke", e.wakeWhat.join(", ")],
    ["Outside", e.outside !== "" ? OUTSIDE_TEXT[+e.outside] : ""],
    ["Active", labelFor("moved", e.moved)],
    ["Sugar after lunch", labelFor("sugar", e.sugar)],
    ["Screens off", labelFor("screens", e.screens)],
    ["Bedtime routine", labelFor("routine", e.routine)],
    ["Magnesium massage", labelFor("massage", e.massage)],
    ["Mum's sleep", e.mumSleep ? `${e.mumSleep}/5, ${RATE[e.mumSleep].toLowerCase()}` : ""],
  ];

  return (
    <li className="night">
      {client && (
        <p className="night-client">
          <Link href={`/admin/clients/${client.id}`}>{client.name}</Link>
          {client.childName && <span> for {client.childName}</span>}
          {updatedAt && (
            <span className="night-updated">
              {" "}
              · added{" "}
              {new Date(updatedAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
            </span>
          )}
        </p>
      )}
      <div className="night-head">
        <strong>{niceNight(night)}</strong>
        <span className={e.wakings === 0 ? "night-calm" : "night-woke"}>
          {e.wakings === 0 ? "Slept through" : `Woke ${e.wakings} time${e.wakings > 1 ? "s" : ""}`}
        </span>
      </div>
      <dl>
        {rows
          .filter(([, v]) => v)
          .map(([label, v]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{v}</dd>
            </div>
          ))}
      </dl>
      {e.notes && <p className="night-notes">&ldquo;{e.notes}&rdquo;</p>}
    </li>
  );
}
