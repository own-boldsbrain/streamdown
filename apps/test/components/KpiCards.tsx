"use client";

export type KPI = {
  label: string;
  value: string;
  delta?: string;
  help?: string;
};

export function KpiCards({ items }: { items: KPI[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((k) => (
        <div
          className="rounded-lg border bg-white p-4 shadow-sm dark:bg-neutral-900"
          key={k.label}
        >
          <div className="text-neutral-500 text-sm">{k.label}</div>
          <div className="mt-1 font-semibold text-2xl">{k.value}</div>
          {k.delta ? (
            <div className="mt-1 text-neutral-500 text-xs">Δ {k.delta}</div>
          ) : null}
          {k.help ? (
            <div className="mt-2 text-neutral-400 text-xs">{k.help}</div>
          ) : null}
        </div>
      ))}
    </section>
  );
}
