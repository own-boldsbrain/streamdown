"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Slice = { name: string; value: number };

export function DonutShadcn({
  data,
  colors = [
    "rgb(var(--ysh-chart-start))",
    "rgb(var(--ysh-chart-end))",
    "#8b5cf6",
    "#22c55e",
    "#f59e0b",
  ],
  height = 260,
  valueFormatter = (v: number) => v.toLocaleString("pt-BR"),
}: {
  data: Slice[];
  colors?: string[];
  height?: number;
  valueFormatter?: (v: number) => string;
}) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer height="100%" width="100%">
        <PieChart>
          <Legend />
          <Tooltip
            content={({ active, payload }) => {
              if (!(active && payload?.length)) return null;
              const p = payload[0];
              return (
                <div className="rounded-md border bg-white/95 p-2 shadow-sm backdrop-blur dark:bg-black/75">
                  <div className="font-medium text-sm">
                    {p.name}: {valueFormatter(Number(p.value))}
                  </div>
                </div>
              );
            }}
          />
          <Pie
            data={data}
            dataKey="value"
            innerRadius={70}
            nameKey="name"
            outerRadius={100}
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((_, idx) => (
              <Cell fill={colors[idx % colors.length]} key={`c-${idx}`} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
