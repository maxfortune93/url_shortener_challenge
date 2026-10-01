'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthCard } from '@/components/auth-card';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';

export default function RegisterPage() {
  const { register } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register(email, password, name || undefined);
      notify('Conta criada! Bem-vindo(a).');
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível criar sua conta agora.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard title="Vamos criar sua conta" subtitle="Leva menos de um minuto, prometido.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label" htmlFor="name">
            Nome <span className="text-ink-faint">(opcional)</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="input-field"
            placeholder="Como podemos te chamar?"
          />
        </div>
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
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input-field"
            placeholder="mínimo de 8 caracteres"
          />
        </div>
        {error && <p className="text-sm font-medium text-terracotta-600">{error}</p>}
        <button type="submit" disabled={isSubmitting} className="btn-primary mt-2 w-full">
          {isSubmitting ? 'Criando conta…' : 'Criar conta'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-muted">
        Já tem uma conta?{' '}
        <Link href="/login" className="font-medium text-terracotta-500 hover:text-terracotta-600">
          Entrar
        </Link>
      </p>
    </AuthCard>
  );
}
