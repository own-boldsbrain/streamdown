"use client";

import { Card, Flex, Metric, Text } from "@tremor/react";
import type { KPI } from "./KpiCards";

export function KpiCardsTremor({ items }: { items: KPI[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((k) => (
        <Card className="w-full" key={k.label}>
          <Text>{k.label}</Text>
          <Metric>{k.value}</Metric>
          {k.delta ? <Text className="mt-1">Δ {k.delta}</Text> : null}
          {k.help ? (
            <Flex className="mt-2">
              <Text className="text-neutral-500 text-xs">{k.help}</Text>
            </Flex>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
