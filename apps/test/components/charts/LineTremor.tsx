"use client";

import { Card, LineChart, Title } from "@tremor/react";

type Datum = Record<string, string | number>;

export function LineTremor({
  data,
  index = "date",
  categories = ["Geração"],
  colors = ["blue", "violet"],
  height = "h-64",
  valueFormatter = (v: number) => `${v.toLocaleString("pt-BR")} kWh`,
  title = "Linha – Geração vs. Consumo",
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
      <LineChart
        categories={categories}
        className={height}
        colors={colors}
        curveType="natural"
        data={data}
        index={index}
        showGridLines
        showLegend
        startEndOnly
        valueFormatter={(v) => valueFormatter(Number(v))}
      />
    </Card>
  );
}
