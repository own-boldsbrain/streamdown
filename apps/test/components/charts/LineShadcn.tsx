"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Series = { dataKey: string; name?: string };
type Datum = Record<string, string | number>;

export function LineShadcn({
  data,
  series = [{ dataKey: "value", name: "Série" }],
  height = 260,
  valueFormatter = (v: number) => v.toLocaleString("pt-BR"),
  xKey = "date",
}: {
  data: Datum[];
  series?: Series[];
  height?: number;
  valueFormatter?: (v: number) => string;
  xKey?: string;
}) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer height="100%" width="100%">
        <LineChart
          data={data}
          margin={{ left: 12, right: 12, top: 8, bottom: 8 }}
        >
          <CartesianGrid strokeOpacity={0.2} vertical={false} />
          <XAxis
            axisLine={false}
            dataKey={xKey}
            minTickGap={24}
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
                      {p.name ?? p.dataKey}: {valueFormatter(Number(p.value))}
                    </div>
                  ))}
                </div>
              );
            }}
            cursor={{ strokeOpacity: 0.1 }}
          />
          {/* Gradiente para strokes (Geist/YSH) */}
          <defs>
            <linearGradient id="yshStroke" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgb(var(--ysh-chart-start))" />
              <stop offset="100%" stopColor="rgb(var(--ysh-chart-end))" />
            </linearGradient>
          </defs>
          {series.map((s) => (
            <Line
              activeDot={{ r: 4 }}
              dataKey={s.dataKey}
              dot={false}
              key={s.dataKey}
              name={s.name}
              stroke="url(#yshStroke)"
              strokeWidth={2}
              type="monotone"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
