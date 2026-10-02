import type { Metadata } from 'next';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/lib/toast-context';
import { Navbar } from '@/components/navbar';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['opsz'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Curtinho — encurtador de links com carinho',
  description: 'Encurte, personalize e acompanhe seus links em um só lugar, com um visual bem aconchegante.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body className="min-h-screen font-sans">
        <AuthProvider>
          <ToastProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <footer className="border-t border-cream-300/70 px-6 py-8 text-center text-sm text-ink-muted">
                Feito com 💚 por Marouane — projeto de portfólio.
              </footer>
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
