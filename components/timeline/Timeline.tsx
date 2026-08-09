import { FadeIn } from "@/components/animations/FadeIn";

export type TimelineItem = {
  id: string;
  title: string;
  subtitle?: string | null;
  period: string;
  description?: string | null;
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="space-y-8 border-l border-white/10 pl-6">
      {items.map((item, index) => (
        <FadeIn key={item.id} delay={index * 0.05} className="relative">
          <span className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full bg-cyan" />
          <p className="text-xs uppercase tracking-widest text-muted">
            {item.period}
          </p>
          <h3 className="mt-1 text-lg font-medium text-foreground">
            {item.title}
          </h3>
          {item.subtitle && <p className="text-sm text-muted">{item.subtitle}</p>}
          {item.description && (
            <p className="mt-2 text-sm text-muted">{item.description}</p>
          )}
        </FadeIn>
      ))}
    </div>
  );
}
