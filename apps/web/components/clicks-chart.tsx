'use client';

import { useMemo, useState } from 'react';
import type { Click } from '@/lib/types';

const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

function buildDailyCounts(clicks: Click[]) {
  const days: { key: string; label: string; count: number }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    days.push({ key: day.toISOString().slice(0, 10), label: WEEKDAYS[day.getDay()], count: 0 });
  }

  const byKey = new Map(days.map((day) => [day.key, day]));
  for (const click of clicks) {
    const key = click.createdAt.slice(0, 10);
    const match = byKey.get(key);
    if (match) match.count += 1;
  }

  return days;
}

export function ClicksChart({ clicks }: { clicks: Click[] }) {
  const days = useMemo(() => buildDailyCounts(clicks), [clicks]);
  const max = Math.max(1, ...days.map((day) => day.count));
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-muted">Cliques nos últimos 7 dias</p>
      <div className="relative flex h-28 items-end gap-2.5">
        {days.map((day, index) => (
          <div
            key={day.key}
            className="group relative flex flex-1 flex-col items-center gap-1.5"
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered((current) => (current === index ? null : current))}
          >
            {hovered === index && (
              <div className="absolute -top-8 z-10 whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-xs font-medium text-cream-50 shadow-soft">
                {day.count} {day.count === 1 ? 'clique' : 'cliques'}
              </div>
            )}
            <div
              className="w-full rounded-t-md bg-forest-300 transition-colors group-hover:bg-forest-400"
              style={{ height: `${Math.max(4, (day.count / max) * 80)}px` }}
            />
            <span className="text-[11px] font-medium text-ink-faint">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
