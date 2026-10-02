const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 1000 * 60 * 60 * 24 * 365],
  ['month', 1000 * 60 * 60 * 24 * 30],
  ['day', 1000 * 60 * 60 * 24],
  ['hour', 1000 * 60 * 60],
  ['minute', 1000 * 60],
];

const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

export function formatRelativeTime(isoDate: string): string {
  const diff = new Date(isoDate).getTime() - Date.now();
  for (const [unit, ms] of RELATIVE_UNITS) {
    if (Math.abs(diff) >= ms) {
      return rtf.format(Math.round(diff / ms), unit);
    }
  }
  return rtf.format(Math.round(diff / 1000), 'second');
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
