'use client';

import { useState } from 'react';
import { useToast } from '@/lib/toast-context';
import { CheckIcon, CopyIcon } from './icons';

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const { notify } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      notify('Link copiado!');
      setTimeout(() => setCopied(false), 1800);
    } catch {
      notify('Não foi possível copiar automaticamente.', 'error');
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={
        className ??
        'inline-flex items-center gap-1.5 rounded-xl bg-ink px-3 py-2 text-sm font-medium text-cream-50 transition hover:bg-ink/90'
      }
    >
      {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
}
