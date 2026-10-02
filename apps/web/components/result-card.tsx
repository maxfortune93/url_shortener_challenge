import type { ShortUrl } from '@/lib/types';
import { CopyButton } from './copy-button';
import { QrCode } from './qr-code';

export function ResultCard({ url }: { url: ShortUrl }) {
  return (
    <div className="card flex flex-col gap-4 border-forest-200/70 bg-forest-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-forest-500">Seu link está pronto ✨</p>
        <a
          href={url.shortUrl}
          target="_blank"
          rel="noreferrer"
          className="block truncate font-display text-xl font-semibold text-ink hover:text-forest-500"
        >
          {url.shortUrl.replace(/^https?:\/\//, '')}
        </a>
        <p className="mt-1 truncate text-sm text-ink-muted" title={url.originalUrl}>
          aponta para {url.originalUrl}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <QrCode value={url.shortUrl} />
        <CopyButton value={url.shortUrl} />
      </div>
    </div>
  );
}
