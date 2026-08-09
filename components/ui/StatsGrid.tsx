export type Stat = { label: string; value: string };

export function StatsGrid({
  stats,
  className,
}: {
  stats: Stat[];
  className?: string;
}) {
  if (stats.length === 0) return null;

  return (
    <dl className={`grid grid-cols-2 gap-6 sm:grid-cols-4 ${className ?? ""}`}>
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className="text-xs uppercase tracking-widest text-muted">
            {stat.label}
          </dt>
          <dd className="mt-1 text-2xl font-semibold text-foreground">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
