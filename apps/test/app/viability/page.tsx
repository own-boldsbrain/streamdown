"use client";

import { Streamdown } from "streamdown";
import { AreaShadcn } from "@/components/charts/AreaShadcn";
import { DonutShadcn } from "@/components/charts/DonutShadcn";
import { KpiCards } from "@/components/KpiCards";

const viabilityData = {
  summary: {
    annual_ac_kwh: 7920,
    specific_yield_kwh_per_kwp: 1571,
    performance_ratio: 0.81,
  },
  economics: {
    saving_anual_rs: 8078.4,
    saving_liquido_anual_rs: 7678.4,
    roi_simples_perc: 34.9,
    payback_anos: 2.87,
    tir_perc: 31.8,
    vpl_rs_taxa10: 36_500.0,
  },
  system: {
    array_kwp: 5.04,
    tarifa_media_rs_kwh: 1.02,
  },
};

const monthlyGeneration = [
  { date: "Jan", Geração: 735 },
  { date: "Fev", Geração: 698 },
  { date: "Mar", Geração: 690 },
  { date: "Abr", Geração: 642 },
  { date: "Mai", Geração: 601 },
  { date: "Jun", Geração: 580 },
  { date: "Jul", Geração: 598 },
  { date: "Ago", Geração: 629 },
  { date: "Set", Geração: 670 },
  { date: "Out", Geração: 689 },
  { date: "Nov", Geração: 702 },
  { date: "Dez", Geração: 724 },
];

const losses = [
  { name: "Inversor", value: 3.8 },
  { name: "Sujidade", value: 2.9 },
  { name: "Temperatura", value: 8.2 },
  { name: "Cabeamento", value: 1.5 },
  { name: "Mismatch", value: 2.1 },
];

const kpis = [
  {
    label: "Geração anual",
    value: `${viabilityData.summary.annual_ac_kwh.toLocaleString("pt-BR")} kWh`,
    help: "Produção esperada em 12 meses",
  },
  {
    label: "Produtividade específica",
    value: `${viabilityData.summary.specific_yield_kwh_per_kwp.toLocaleString("pt-BR")} kWh/kWp·ano`,
    help: "Energia por kWp instalado",
  },
  {
    label: "Performance Ratio",
    value: `${viabilityData.summary.performance_ratio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    help: "Índice de desempenho 0-1",
  },
  {
    label: "Payback",
    value: `${viabilityData.economics.payback_anos.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} anos`,
    help: "Tempo para retorno do investimento",
  },
];

const explanation = `
# Estudo de Viabilidade Solar

## Resumo do Sistema

Este sistema fotovoltaico de **${viabilityData.system.array_kwp.toFixed(2)} kWp** deve gerar aproximadamente **${viabilityData.summary.annual_ac_kwh.toLocaleString("pt-BR")} kWh por ano**, resultando em uma economia anual bruta de **R$ ${viabilityData.economics.saving_anual_rs.toLocaleString("pt-BR")}** considerando a tarifa atual de **R$ ${viabilityData.system.tarifa_media_rs_kwh.toLocaleString("pt-BR")}/kWh**.

## Desempenho Técnico

O sistema apresenta um **Performance Ratio (PR)** de **${(viabilityData.summary.performance_ratio * 100).toFixed(1)}%**, considerado muito bom para as condições locais. A produtividade específica de **${viabilityData.summary.specific_yield_kwh_per_kwp.toLocaleString("pt-BR")} kWh/kWp·ano** está dentro do esperado para a região.

## Análise Financeira

- **ROI simples**: ${viabilityData.economics.roi_simples_perc.toFixed(1)}% ao ano
- **Payback**: ${viabilityData.economics.payback_anos.toFixed(2)} anos
- **TIR**: ${viabilityData.economics.tir_perc.toFixed(1)}% ao ano
- **VPL (10% a.a.)**: R$ ${viabilityData.economics.vpl_rs_taxa10.toLocaleString("pt-BR")}

## Próximos Passos

1. Confirmação do dimensionamento com visita técnica
2. Verificação da estrutura do telhado
3. Elaboração de proposta comercial detalhada
4. Agendamento de instalação

`;

export default function Page() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-6">
      <h1 className="mb-2 font-bold text-3xl">Viabilidade Solar</h1>

      <KpiCards items={kpis} />

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-3 font-medium text-lg">Geração Mensal Estimada</h2>
          <AreaShadcn
            data={monthlyGeneration}
            valueFormatter={(v) => `${v.toLocaleString("pt-BR")} kWh`}
            yKey="Geração"
          />
        </div>
        <div>
          <h2 className="mb-3 font-medium text-lg">Composição de Perdas</h2>
          <DonutShadcn
            data={losses}
            valueFormatter={(v) => `${v.toLocaleString("pt-BR")}%`}
          />
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
        <Streamdown>{explanation}</Streamdown>
      </div>
    </main>
  );
}
