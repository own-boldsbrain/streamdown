"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Datum = Record<string, string | number>;

export function BarStackedShadcn({
  data,
  stacks = ["Geração", "Consumo"],
  colors = ["rgb(var(--ysh-chart-start))", "rgb(var(--ysh-chart-end))"],
  height = 260,
  valueFormatter = (v: number) => v.toLocaleString("pt-BR"),
  xKey = "date",
  stackId = "energy",
}: {
  data: Datum[];
  stacks?: string[];
  colors?: string[];
  height?: number;
  valueFormatter?: (v: number) => string;
  xKey?: string;
  stackId?: string;
}) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer height="100%" width="100%">
        <BarChart
          data={data}
          margin={{ left: 12, right: 12, top: 8, bottom: 8 }}
        >
          <CartesianGrid strokeOpacity={0.2} vertical={false} />
          <XAxis
            axisLine={false}
            dataKey={xKey}
            tick={{ fill: "rgb(var(--ysh-muted))" }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "rgb(var(--ysh-muted))" }}
            tickFormatter={(v) => valueFormatter(Number(v))}
            tickLine={false}
            width={48}
          />
          <Legend />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!(active && payload?.length)) return null;
              return (
                <div className="rounded-md border bg-white/95 p-2 shadow-sm backdrop-blur dark:bg-black/75">
                  <div className="text-neutral-500 text-xs">{label}</div>
                  {payload.map((p) => (
                    <div
                      className="font-medium text-sm"
                      key={p.dataKey as string}
                    >
                      {p.dataKey as string}: {valueFormatter(Number(p.value))}
                    </div>
                  ))}
                </div>
              );
            }}
            cursor={{ fillOpacity: 0.06 }}
          />
          {stacks.map((key, i) => (
            <Bar
              dataKey={key}
              fill={colors[i % colors.length]}
              key={key}
              radius={[4, 4, 0, 0]}
              stackId={stackId}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
