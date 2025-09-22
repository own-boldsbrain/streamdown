"use client";

import { Card, DonutChart, Title } from "@tremor/react";

type Slice = { name: string; value: number };

export function DonutTremor({
  data,
  category = "value",
  index = "name",
  colors = ["blue", "violet", "fuchsia", "emerald", "amber"],
  title = "Composição de perdas",
  valueFormatter = (v: number) => `${v.toLocaleString("pt-BR")} kWh`,
}: {
  data: Slice[];
  category?: string;
  index?: string;
  colors?: string[];
  title?: string;
  valueFormatter?: (v: number) => string;
}) {
  return (
    <Card className="w-full">
      <Title>{title}</Title>
      <DonutChart
        category={category}
        colors={colors}
        data={data}
        index={index}
        showLabel
        showTooltip
        valueFormatter={(v) => valueFormatter(Number(v))}
      />
    </Card>
  );
}
