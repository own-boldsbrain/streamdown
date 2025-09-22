"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = Record<string, string | number>;

export function AreaShadcn({
  data,
  height = 260,
  valueFormatter = (v: number) => Intl.NumberFormat("pt-BR").format(v),
  xKey = "date",
  yKey = "Geração",
}: {
  data: Point[];
  height?: number;
  valueFormatter?: (v: number) => string;
  xKey?: string;
  yKey?: string;
}) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart
          data={data}
          margin={{ left: 12, right: 12, top: 8, bottom: 8 }}
        >
          {/* GRID */}
          <CartesianGrid strokeOpacity={0.2} vertical={false} />

          {/* EIXOS */}
          <XAxis
            axisLine={false}
            dataKey={xKey as string}
            minTickGap={24}
            tick={{ fill: "rgb(var(--ysh-muted))" }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "rgb(var(--ysh-muted))" }}
            tickFormatter={valueFormatter}
            tickLine={false}
            width={48}
          />

          {/* GRADIENTE Geist/YSH */}
          <defs>
            <linearGradient id="yshGradient" x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="5%"
                stopColor="rgb(var(--ysh-chart-start))"
                stopOpacity={0.9}
              />
              <stop
                offset="95%"
                stopColor="rgb(var(--ysh-chart-end))"
                stopOpacity={0.15}
              />
            </linearGradient>
          </defs>

          {/* ÁREA */}
          <Area
            activeDot={{ r: 4 }}
            dataKey={yKey as string}
            fill="url(#yshGradient)"
            stroke="rgb(var(--ysh-chart-start))"
            strokeWidth={2}
            type="monotone"
          />

          {/* TOOLTIP minimal shadcn-like */}
          <Tooltip
            content={({ active, payload, label }) => {
              if (!(active && payload?.length)) return null;
              const p = payload[0];
              return (
                <div className="rounded-md border bg-white/95 p-2 shadow-sm backdrop-blur dark:bg-black/75">
                  <div className="text-neutral-500 text-xs">{label}</div>
                  <div className="font-medium text-neutral-900 text-sm dark:text-neutral-100">
                    {valueFormatter(Number(p.value))}
                  </div>
                </div>
              );
            }}
            cursor={{ strokeOpacity: 0.1 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
