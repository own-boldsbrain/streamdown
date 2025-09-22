"use client";

import { AreaChart, Card, Title } from "@tremor/react";

type Point = { date: string; [key: string]: string | number };

export function AreaTremor({
  data,
  categories = ["Geração"],
  colors = ["blue"], // pode trocar por ["violet"] etc.
  height = "h-64",
  valueFormatter = (v: number) => `${v.toLocaleString("pt-BR")} kWh`,
  title = "Área – Geração",
}: {
  data: Point[];
  categories?: string[];
  colors?: string[];
  height?: string;
  valueFormatter?: (v: number) => string;
  title?: string;
}) {
  return (
    <Card className="w-full">
      <Title>{title}</Title>
      <AreaChart
        categories={categories}
        className={height}
        colors={colors}
        curveType="natural"
        data={data}
        index="date"
        showGridLines
        showLegend
        startEndOnly
        valueFormatter={(v) => valueFormatter(Number(v))}
      />
    </Card>
  );
}
