import Link from 'next/link';
import { ShortenForm } from '@/components/shorten-form';
import { ChartIcon, LinkIcon, SparkleIcon } from '@/components/icons';

const steps = [
  {
    icon: LinkIcon,
    title: 'Cole o seu link',
    description: 'Jogue aquela URL gigante na caixinha e deixa com a gente.',
  },
  {
    icon: SparkleIcon,
    title: 'Deixe com a sua cara',
    description: 'Escolha um apelido personalizado ou use um código gerado automaticamente.',
  },
  {
    icon: ChartIcon,
    title: 'Acompanhe os cliques',
    description: 'Crie uma conta de graça e veja quantas vezes cada link foi acessado.',
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-warm-glow">
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-16 pt-20 text-center sm:pt-28">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-forest-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-forest-500">
          <SparkleIcon className="h-3.5 w-3.5" /> encurtador de links, feito com carinho
        </span>
        <h1 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          Links curtinhos, <span className="text-forest-400">memórias grandes</span>.
        </h1>
        <p className="mt-4 max-w-xl text-balance text-base text-ink-muted sm:text-lg">
          Transforme qualquer URL enorme em um link pequeno, bonito e fácil de compartilhar — e acompanhe cada clique
          num painel só seu.
        </p>

        <div className="mt-10 w-full max-w-2xl">
          <ShortenForm />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="grid gap-5 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card flex flex-col items-start gap-3 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-100 text-forest-500">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
              <p className="text-sm text-ink-muted">{description}</p>
            </div>
          ))}
        </div>

        <div className="card mt-8 flex flex-col items-center gap-3 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Quer guardar e acompanhar seus links?</h2>
            <p className="text-sm text-ink-muted">Crie uma conta gratuita e tenha um painel só com os seus links e estatísticas.</p>
          </div>
          <Link href="/register" className="btn-primary px-6 py-3">
            Criar minha conta
          </Link>
        </div>
      </section>
    </div>
  );
}
