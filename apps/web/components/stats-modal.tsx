'use client';

import { useEffect, useState } from 'react';
import { urlsApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { formatDate, formatRelativeTime, hostnameOf } from '@/lib/format';
import type { ShortUrl, UrlStats } from '@/lib/types';
import { ClicksChart } from './clicks-chart';

export function StatsModal({ url, onClose }: { url: ShortUrl; onClose: () => void }) {
  const { token } = useAuth();
  const [stats, setStats] = useState<UrlStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    urlsApi
      .stats(url.id, token)
      .then(setStats)
      .finally(() => setIsLoading(false));
  }, [url.id, token]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="card max-h-[85vh] w-full max-w-lg overflow-y-auto p-6 sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-terracotta-500">Estatísticas</p>
            <h2 className="truncate font-display text-xl font-semibold text-ink">{url.shortUrl.replace(/^https?:\/\//, '')}</h2>
            <p className="truncate text-sm text-ink-muted">{url.originalUrl}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-muted transition hover:bg-cream-200"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="mt-8 animate-pulse text-sm text-ink-muted">Carregando estatísticas…</div>
        ) : stats ? (
          <div className="mt-6 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-cream-200/60 p-4">
                <p className="text-2xl font-semibold text-ink">{stats.clicksCount}</p>
                <p className="text-xs text-ink-muted">cliques no total</p>
              </div>
              <div className="rounded-2xl bg-cream-200/60 p-4">
                <p className="text-2xl font-semibold text-ink">{formatDate(stats.createdAt)}</p>
                <p className="text-xs text-ink-muted">criado em</p>
              </div>
            </div>

            <ClicksChart clicks={stats.recentClicks} />

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted">Últimos acessos</p>
              {stats.recentClicks.length === 0 ? (
                <p className="rounded-2xl bg-cream-200/50 p-4 text-sm text-ink-muted">
                  Ainda não há cliques por aqui. Compartilhe o link! 🚀
                </p>
              ) : (
                <ul className="flex flex-col divide-y divide-cream-300/70">
                  {stats.recentClicks.slice(0, 10).map((click, index) => (
                    <li key={`${click.createdAt}-${index}`} className="flex items-center justify-between py-2.5 text-sm">
                      <span className="text-ink-muted">
                        {click.referrer ? `via ${hostnameOf(click.referrer)}` : 'acesso direto'}
                      </span>
                      <span className="text-ink-faint">{formatRelativeTime(click.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-8 text-sm text-terracotta-600">Não foi possível carregar as estatísticas agora.</p>
        )}
      </div>
    </div>
  );
}
