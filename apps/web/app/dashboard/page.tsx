'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ShortenForm } from '@/components/shorten-form';
import { StatsModal } from '@/components/stats-modal';
import { UrlCard } from '@/components/url-card';
import { LinkIcon } from '@/components/icons';
import { urlsApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import type { ShortUrl } from '@/lib/types';

export default function DashboardPage() {
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [isLoadingUrls, setIsLoadingUrls] = useState(true);
  const [statsTarget, setStatsTarget] = useState<ShortUrl | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace('/login');
    }
  }, [isAuthLoading, user, router]);

  useEffect(() => {
    if (!token) return;
    urlsApi
      .list(token)
      .then(setUrls)
      .finally(() => setIsLoadingUrls(false));
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!token) return;
    await urlsApi.remove(id, token);
    setUrls((current) => current.filter((url) => url.id !== id));
    notify('Link removido.');
  };

  if (isAuthLoading || !user) {
    return <div className="flex min-h-[60vh] items-center justify-center text-ink-muted">Carregando…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink">Seus links</h1>
        <p className="mt-1 text-ink-muted">Crie, compartilhe e acompanhe o desempenho de cada link.</p>
      </div>

      <ShortenForm compact onCreated={(url) => setUrls((current) => [url, ...current])} />

      <div className="mt-10 flex flex-col gap-3">
        {isLoadingUrls ? (
          <div className="animate-pulse text-sm text-ink-muted">Carregando seus links…</div>
        ) : urls.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 p-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-terracotta-500">
              <LinkIcon className="h-6 w-6" />
            </span>
            <p className="font-display text-lg font-semibold text-ink">Nada por aqui ainda</p>
            <p className="max-w-sm text-sm text-ink-muted">
              Encurte o seu primeiro link acima e ele vai aparecer nesta lista, com cliques e tudo.
            </p>
          </div>
        ) : (
          urls.map((url) => (
            <UrlCard key={url.id} url={url} onDelete={handleDelete} onShowStats={setStatsTarget} />
          ))
        )}
      </div>

      {statsTarget && <StatsModal url={statsTarget} onClose={() => setStatsTarget(null)} />}
    </div>
  );
}
