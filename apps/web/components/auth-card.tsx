export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center bg-warm-glow px-6 py-16">
      <div className="card w-full max-w-md p-8 sm:p-10">
        <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
        <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
