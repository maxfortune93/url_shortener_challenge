'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/format';
import type { ShortUrl } from '@/lib/types';
import { ChartIcon, TrashIcon } from './icons';
import { CopyButton } from './copy-button';
import { QrCode } from './qr-code';

interface UrlCardProps {
  url: ShortUrl;
  onDelete: (id: string) => Promise<void>;
  onShowStats: (url: ShortUrl) => void;
}

export function UrlCard({ url, onDelete, onShowStats }: UrlCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isExpired = url.expiresAt ? new Date(url.expiresAt).getTime() < Date.now() : false;

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(url.id);
  };

  return (
    <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <QrCode value={url.shortUrl} size={56} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <a
              href={url.shortUrl}
              target="_blank"
              rel="noreferrer"
              className="truncate font-display text-lg font-semibold text-ink hover:text-forest-500"
            >
              {url.shortUrl.replace(/^https?:\/\//, '')}
            </a>
            {isExpired && (
              <span className="shrink-0 rounded-full bg-forest-100 px-2 py-0.5 text-[11px] font-medium text-forest-600">
                expirado
              </span>
            )}
          </div>
          <p className="truncate text-sm text-ink-muted" title={url.originalUrl}>
            {url.originalUrl}
          </p>
          <p className="mt-0.5 text-xs text-ink-faint">criado em {formatDate(url.createdAt)}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 pl-[72px] sm:pl-0">
        <button
          onClick={() => onShowStats(url)}
          className="flex items-center gap-1.5 rounded-xl bg-forest-100 px-3 py-2 text-sm font-medium text-forest-600 transition hover:bg-forest-100/70"
        >
          <ChartIcon className="h-4 w-4" />
          {url.clicksCount}
        </button>
        <CopyButton value={url.shortUrl} />

        {confirming ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl bg-forest-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-forest-600"
            >
              {isDeleting ? '...' : 'Confirmar'}
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-ink-muted transition hover:bg-cream-200"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-muted transition hover:bg-forest-50 hover:text-forest-500"
            aria-label="Excluir link"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
