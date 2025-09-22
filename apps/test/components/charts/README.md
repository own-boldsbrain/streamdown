# Componentes de Visualização de Dados para Streamdown

Este módulo oferece componentes de visualização de dados para projetos Streamdown, incluindo gráficos e cards de KPIs. Disponibilizamos duas implementações: **shadcn/ui + Recharts** e **Tremor**.

## Instalação

```bash
# Para instalar Recharts v2 (recomendado para compatibilidade com shadcn/ui)
pnpm add recharts@^2.12.0

# Para instalar Tremor
pnpm add @tremor/react
```

## Tokens de Cores

Adicione estes tokens de cores ao seu arquivo `globals.css` para garantir consistência visual:

```css
:root {
  /* Variáveis para gráficos Geist/YSH */
  --ysh-chart-start: 0 112 243;   /* #0070F3 (azul Geist) */
  --ysh-chart-end: 121 40 202;    /* #7928CA (roxo Geist) */
  --ysh-foreground: 23 23 23;     /* texto */
  --ysh-muted: 115 115 115;       /* labels/grades */
}

.dark {
  /* Variáveis para gráficos Geist/YSH no tema escuro */
  --ysh-chart-start: 51 153 255;   /* #3399FF (azul Geist mais claro) */
  --ysh-chart-end: 170 90 255;     /* #AA5AFF (roxo Geist mais claro) */
  --ysh-foreground: 250 250 250;   /* texto */
  --ysh-muted: 180 180 180;        /* labels/grades */
}
```

## Componentes Disponíveis

### shadcn/ui + Recharts

- `AreaShadcn`: Gráfico de área com gradiente
- `LineShadcn`: Gráfico de linha com suporte a múltiplas séries
- `BarStackedShadcn`: Gráfico de barras empilhadas
- `DonutShadcn`: Gráfico de rosca/donut
- `KpiCards`: Cards para exibição de KPIs

### Tremor

- `AreaTremor`: Gráfico de área com tema Tremor
- `LineTremor`: Gráfico de linha com tema Tremor
- `BarTremor`: Gráfico de barras empilhadas com tema Tremor
- `DonutTremor`: Gráfico de rosca/donut com tema Tremor
- `KpiCardsTremor`: Cards para exibição de KPIs com tema Tremor

## Exemplos de Uso

### Gráfico de Área (shadcn + Recharts)

```tsx
import { AreaShadcn } from "@/components/charts/AreaShadcn";

const data = [
  { date: "Jan", Geração: 320 },
  { date: "Fev", Geração: 420 },
  { date: "Mar", Geração: 390 },
  // ...
];

<AreaShadcn
  data={data}
  yKey="Geração"
  valueFormatter={(v) => `${v.toLocaleString("pt-BR")} kWh`}
/>
```

### Gráfico de Linha com Múltiplas Séries (shadcn + Recharts)

```tsx
import { LineShadcn } from "@/components/charts/LineShadcn";

const data = [
  { date: "Jan", Geração: 320, Consumo: 410 },
  { date: "Fev", Geração: 420, Consumo: 430 },
  // ...
];

<LineShadcn
  data={data}
  series={[
    { dataKey: "Geração", name: "Geração (kWh)" },
    { dataKey: "Consumo", name: "Consumo (kWh)" },
  ]}
  valueFormatter={(v) => `${v.toLocaleString("pt-BR")} kWh`}
/>
```

### Cards de KPIs

```tsx
import { KpiCards } from "@/components/KpiCards";

const kpis = [
  { label: "Geração anual", value: "7.920 kWh", help: "Estimativa PVLIB/ModelChain" },
  { label: "PR", value: "0,81", delta: "+0,02 vs. ref", help: "Índice de desempenho" },
  { label: "Payback", value: "2,9 anos", help: "Economia cumulativa = CAPEX" },
  { label: "ROI simples", value: "34,9% a.a.", help: "Economia ÷ CAPEX" },
];

<KpiCards items={kpis} />
```

### Gráficos Tremor

```tsx
import { AreaTremor } from "@/components/charts/AreaTremor";
import { BarTremor } from "@/components/charts/BarTremor";

// Área
<AreaTremor
  data={data}
  categories={["Geração"]}
  valueFormatter={(v) => `${v.toLocaleString("pt-BR")} kWh`}
  title="Geração Mensal"
/>

// Barras
<BarTremor
  data={data}
  categories={["Geração", "Consumo"]}
  valueFormatter={(v) => `${v.toLocaleString("pt-BR")} kWh`}
  title="Energia por Mês"
/>
```

## Integração com Streamdown

Estes componentes podem ser facilmente integrados em páginas que também utilizam o Streamdown:

```tsx
import { Streamdown } from "streamdown";
import { AreaShadcn } from "@/components/charts/AreaShadcn";
import { KpiCards } from "@/components/KpiCards";

const explanation = `
# Título em Markdown
Conteúdo em markdown com **formatação** e _estilo_.
`;

<div>
  <KpiCards items={kpis} />
  <AreaShadcn data={data} yKey="Geração" />
  <div className="prose dark:prose-invert">
    <Streamdown>{explanation}</Streamdown>
  </div>
</div>
```

## Páginas de Demonstração

- `/charts-demo`: Demonstração de todos os componentes de visualização
- `/viability`: Exemplo de integração com Streamdown em um relatório de viabilidade solar

## Boas Práticas

1. Mantenha a consistência semântica de cores (azul/roxo para Geração, cinza/âmbar para Consumo)
2. Formate valores adequadamente (kWh, R$, %)
3. Use tooltips para exibir informações detalhadas
4. Ajuste o tamanho dos gráficos conforme necessário (via `height`)
5. Utilize `valueFormatter` para personalizar a exibição de valores
