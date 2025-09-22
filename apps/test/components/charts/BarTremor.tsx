"use client";

import { BarChart, Card, Title } from "@tremor/react";

type Datum = Record<string, string | number>;

export function BarTremor({
  data,
  index = "date",
  categories = ["Geração", "Consumo"],
  colors = ["blue", "violet"],
  height = "h-64",
  valueFormatter = (v: number) => `${v.toLocaleString("pt-BR")} kWh`,
  title = "Barras – Stack Energia",
}: {
  data: Datum[];
  index?: string;
  categories?: string[];
  colors?: string[];
  height?: string;
  valueFormatter?: (v: number) => string;
  title?: string;
}) {
  return (
    <Card className="w-full">
      <Title>{title}</Title>
      <BarChart
        categories={categories}
        className={height}
        colors={colors}
        data={data}
        index={index}
        showGridLines
        showLegend
        stack
        startEndOnly
        valueFormatter={(v) => valueFormatter(Number(v))}
      />
    </Card>
  );
}
