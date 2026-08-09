import type { Equipment } from "@/lib/generated/prisma/client";
import { FadeIn } from "@/components/animations/FadeIn";

export function EquipmentList({ equipment }: { equipment: Equipment[] }) {
  if (equipment.length === 0) {
    return (
      <FadeIn>
        <p className="text-sm text-muted">Equipment list coming soon.</p>
      </FadeIn>
    );
  }

  const categories = new Map<string, Equipment[]>();
  for (const item of equipment) {
    const key = item.category ?? "Gear";
    const group = categories.get(key) ?? [];
    group.push(item);
    categories.set(key, group);
  }

  return (
    <div className="space-y-6">
      {[...categories.entries()].map(([category, items], index) => (
        <FadeIn key={category} delay={index * 0.05}>
          <h3 className="text-xs uppercase tracking-widest text-muted">
            {category}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {items.map((item) => (
              <span
                key={item.id}
                title={item.description ?? undefined}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-sm text-foreground"
              >
                {item.name}
              </span>
            ))}
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
