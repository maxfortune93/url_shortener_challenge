'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthCard } from '@/components/auth-card';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';

export default function LoginPage() {
  const { login } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      notify('Bem-vindo de volta!');
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível entrar agora.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard title="Que bom te ver de novo" subtitle="Entre com sua conta para acessar seus links.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="input-field"
            placeholder="voce@email.com"
          />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input-field"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm font-medium text-forest-600">{error}</p>}
        <button type="submit" disabled={isSubmitting} className="btn-primary mt-2 w-full">
          {isSubmitting ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-muted">
        Ainda não tem conta?{' '}
        <Link href="/register" className="font-medium text-forest-500 hover:text-forest-600">
          Criar conta
        </Link>
      </p>
    </AuthCard>
  );
}
