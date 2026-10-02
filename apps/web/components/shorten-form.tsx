'use client';

import { useState } from 'react';
import { ApiError, urlsApi } from '@/lib/api';
import type { ShortUrl } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { ResultCard } from './result-card';

interface ShortenFormProps {
  onCreated?: (url: ShortUrl) => void;
  compact?: boolean;
}

export function ShortenForm({ onCreated, compact }: ShortenFormProps) {
  const { token } = useAuth();
  const [originalUrl, setOriginalUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [showCustomAlias, setShowCustomAlias] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShortUrl | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const created = await urlsApi.create(
        {
          originalUrl,
          slug: slug.trim() || undefined,
        },
        token,
      );
      setResult(created);
      setOriginalUrl('');
      setSlug('');
      setShowCustomAlias(false);
      onCreated?.(created);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível encurtar o link agora.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className={compact ? 'card flex flex-col gap-3 p-5' : 'card flex flex-col gap-4 p-6 sm:p-8'}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="url"
            required
            placeholder="Cole aqui o link que você quer encurtar"
            value={originalUrl}
            onChange={(event) => setOriginalUrl(event.target.value)}
            className="input-field flex-1"
          />
          <button type="submit" disabled={isSubmitting} className="btn-primary whitespace-nowrap">
            {isSubmitting ? 'Encurtando…' : 'Encurtar'}
          </button>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowCustomAlias((value) => !value)}
            className="text-sm font-medium text-forest-500 transition hover:text-forest-600"
          >
            {showCustomAlias ? '− usar um apelido personalizado' : '+ usar um apelido personalizado'}
          </button>
          {showCustomAlias && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-ink-muted">.../</span>
              <input
                type="text"
                placeholder="meu-link-favorito"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                pattern="[a-zA-Z0-9-_]+"
                minLength={3}
                maxLength={32}
                className="input-field max-w-[220px] py-2"
              />
            </div>
          )}
        </div>

        {error && <p className="text-sm font-medium text-forest-600">{error}</p>}
      </form>

      {result && !compact && (
        <div className="mt-5 animate-fade-up">
          <ResultCard url={result} />
        </div>
      )}
    </div>
  );
}
