"use client";

import { AreaShadcn } from "@/components/charts/AreaShadcn";
import { AreaTremor } from "@/components/charts/AreaTremor";
import { BarStackedShadcn } from "@/components/charts/BarStackedShadcn";
import { BarTremor } from "@/components/charts/BarTremor";
import { DonutShadcn } from "@/components/charts/DonutShadcn";
import { DonutTremor } from "@/components/charts/DonutTremor";
import { LineShadcn } from "@/components/charts/LineShadcn";
import { LineTremor } from "@/components/charts/LineTremor";
import { KpiCards } from "@/components/KpiCards";
import { KpiCardsTremor } from "@/components/KpiCardsTremor";

const energiaMensal = [
  { date: "Jan", Geração: 320, Consumo: 410 },
  { date: "Fev", Geração: 420, Consumo: 430 },
  { date: "Mar", Geração: 390, Consumo: 445 },
  { date: "Abr", Geração: 510, Consumo: 470 },
  { date: "Mai", Geração: 620, Consumo: 500 },
  { date: "Jun", Geração: 580, Consumo: 520 },
];

const perdas = [
  { name: "Inversor", value: 6.0 },
  { name: "Soiling", value: 3.0 },
  { name: "Mismatch", value: 2.0 },
  { name: "DC wiring", value: 2.0 },
  { name: "AC wiring", value: 1.0 },
];

const kpis = [
  {
    label: "Geração anual (kWh)",
    value: "7.920",
    help: "Estimativa PVLIB/ModelChain",
  },
  {
    label: "PR",
    value: "0,81",
    delta: "+0,02 vs. ref",
    help: "Índice de desempenho",
  },
  { label: "Payback", value: "2,9 anos", help: "Economia cumulativa = CAPEX" },
  { label: "ROI simples", value: "34,9% a.a.", help: "Economia ÷ CAPEX" },
];

export default function Page() {
  return (
    <main className="flex flex-col gap-8 p-6">
      <h1 className="mb-6 font-bold text-3xl">Demonstração de Gráficos</h1>

      {/* KPI CARDS */}
      <section>
        <h2 className="mb-4 font-semibold text-xl">
          KPI Cards (shadcn estilo)
        </h2>
        <KpiCards items={kpis} />
      </section>

      {/* SHADCN + RECHARTS */}
      <section>
        <h2 className="mb-4 font-semibold text-xl">
          Gráficos com shadcn + Recharts
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-3 font-medium text-neutral-500 text-sm">
              Área — shadcn + Recharts
            </h3>
            <AreaShadcn
              data={energiaMensal}
              valueFormatter={(v) => `${v.toLocaleString("pt-BR")} kWh`}
              yKey="Geração"
            />
          </div>
          <div>
            <h3 className="mb-3 font-medium text-neutral-500 text-sm">
              Linha — shadcn + Recharts
            </h3>
            <LineShadcn
              data={energiaMensal}
              series={[
                { dataKey: "Geração", name: "Geração (kWh)" },
                { dataKey: "Consumo", name: "Consumo (kWh)" },
              ]}
              valueFormatter={(v) => `${v.toLocaleString("pt-BR")} kWh`}
            />
          </div>
          <div>
            <h3 className="mb-3 font-medium text-neutral-500 text-sm">
              Barras (stack) — shadcn + Recharts
            </h3>
            <BarStackedShadcn
              data={energiaMensal}
              stacks={["Geração", "Consumo"]}
              valueFormatter={(v) => `${v.toLocaleString("pt-BR")} kWh`}
            />
          </div>
          <div>
            <h3 className="mb-3 font-medium text-neutral-500 text-sm">
              Donut — shadcn + Recharts
            </h3>
            <DonutShadcn
              data={perdas}
              valueFormatter={(v) => `${v.toLocaleString("pt-BR")}%`}
            />
          </div>
        </div>
      </section>

      {/* TREMOR */}
      <section>
        <h2 className="mb-4 font-semibold text-xl">
          KPI Cards (Tremor estilo)
        </h2>
        <KpiCardsTremor items={kpis} />
      </section>

      <section>
        <h2 className="mb-4 font-semibold text-xl">Gráficos com Tremor</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <AreaTremor
            categories={["Geração"]}
            data={energiaMensal}
            title="Área — Tremor"
            valueFormatter={(v) => `${v.toLocaleString("pt-BR")} kWh`}
          />
          <LineTremor
            categories={["Geração", "Consumo"]}
            data={energiaMensal}
            title="Linha — Tremor"
            valueFormatter={(v) => `${v.toLocaleString("pt-BR")} kWh`}
          />
          <BarTremor
            categories={["Geração", "Consumo"]}
            data={energiaMensal}
            title="Barras (stack) — Tremor"
            valueFormatter={(v) => `${v.toLocaleString("pt-BR")} kWh`}
          />
          <DonutTremor
            data={perdas}
            title="Donut — Tremor"
            valueFormatter={(v) => `${v.toLocaleString("pt-BR")}%`}
          />
        </div>
      </section>
    </main>
  );
}
