"use client";

import { useRouter } from "next/navigation";

export function JournalFilter({ clients, current }: { clients: { id: string; name: string }[]; current: string }) {
  const router = useRouter();
  return (
    <label className="filter-select">
      <span className="visually-hidden">Show journals for</span>
      <select value={current} onChange={(e) => router.push(e.target.value ? `/admin/journals?client=${e.target.value}` : "/admin/journals")}>
        <option value="">All clients</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}
