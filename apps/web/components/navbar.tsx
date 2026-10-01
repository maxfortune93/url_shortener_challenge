'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LinkIcon } from './icons';

export function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-cream-300/60 bg-cream-100/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-forest-400 text-white shadow-warm">
            <LinkIcon className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">Curtinho</span>
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          {isLoading ? null : user ? (
            <>
              <Link
                href="/dashboard"
                className={`rounded-xl px-3 py-2 font-medium transition hover:bg-forest-50 ${
                  pathname === '/dashboard' ? 'text-forest-500' : 'text-ink-muted'
                }`}
              >
                Meus links
              </Link>
              <span className="hidden pl-2 pr-1 text-ink-muted sm:inline">Olá, {user.name || user.email.split('@')[0]}</span>
              <button onClick={handleLogout} className="btn-secondary px-4 py-2 text-sm">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-xl px-3 py-2 font-medium text-ink-muted transition hover:bg-forest-50">
                Entrar
              </Link>
              <Link href="/register" className="btn-primary px-4 py-2 text-sm">
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
