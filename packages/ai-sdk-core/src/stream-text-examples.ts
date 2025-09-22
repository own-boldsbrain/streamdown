import { streamText } from "./stream-text-new.js";

// Constants for calculations
const PROJECT_LIFETIME_YEARS = 25;
const PERCENTAGE_MULTIPLIER = 100;
const ELECTRICITY_TARIFF = 0.85;
const SOLAR_DISCOUNT = 0.85;

// Example integration with Streamdown and chart components
export async function generateViabilityReport() {
  const STREAMING_DELAY = 50;

  const result = await streamText({
    model: {
      // Mock model implementation - would be replaced with actual AI SDK model
      doStream: async (_options: unknown) => {
        // Simulate streaming response
        const stream = new ReadableStream({
          start(controller) {
            // Simulate streaming text generation
            const text = `Análise de Viabilidade Energética

Com base nos dados fornecidos, aqui está a análise completa:

## Resumo Executivo
O projeto apresenta viabilidade técnica e econômica satisfatória para implementação de sistema fotovoltaico.

## Análise Técnica
- Capacidade instalada: 100 kWp
- Geração anual estimada: 150.000 kWh
- Fator de capacidade: 17.2%

## Análise Econômica
- Investimento inicial: R$ 500.000
- Payback: 6.2 anos
- TIR (Taxa Interna de Retorno): 14.8%
- VPL (Valor Presente Líquido): R$ 1.200.000

## Recomendações
Recomendamos a implementação do projeto com as seguintes considerações...`;

            // Stream text in chunks
            const chunks = text.split(" ");
            let index = 0;

            const sendChunk = () => {
              if (index < chunks.length) {
                const chunk = `${chunks[index]} `;
                controller.enqueue({
                  type: "text-delta",
                  textDelta: chunk,
                });
                index++;
                setTimeout(sendChunk, STREAMING_DELAY); // Simulate streaming delay
              } else {
                controller.enqueue({
                  type: "finish",
                  finishReason: "stop",
                  usage: {
                    promptTokens: 150,
                    completionTokens: 300,
                    totalTokens: 450,
                  },
                });
                controller.close();
              }
            };

            sendChunk();
          },
        });

        return {
          stream,
          warnings: [],
        };
      },
    } as unknown as any, // Type assertion for mock model
    system: `Você é um analista especializado em viabilidade de projetos de energia solar fotovoltaica.
Forneça análises técnicas e econômicas detalhadas baseadas em dados fornecidos.`,
    prompt: `Analise a viabilidade do seguinte projeto solar:
- Localização: São Paulo, SP
- Consumo mensal: 15.000 kWh
- Tarifa atual: R$ 0,85/kWh
- Área disponível: 500 m²
- Orçamento disponível: R$ 600.000

Forneça uma análise completa incluindo payback, TIR e recomendações.`,
  });

  return result;
}

// Example usage with chart data generation
export async function generateChartData() {
  const result = await streamText({
    model: {
      doStream: async (_options: unknown) => {
        const stream = new ReadableStream({
          start(controller) {
            // Generate mock chart data
            const data = {
              energiaMensal: [
                { mes: "Jan", geracao: 12_000, consumo: 15_000 },
                { mes: "Fev", geracao: 11_800, consumo: 14_800 },
                { mes: "Mar", geracao: 13_500, consumo: 15_200 },
                { mes: "Abr", geracao: 14_200, consumo: 15_100 },
                { mes: "Mai", geracao: 13_800, consumo: 14_900 },
                { mes: "Jun", geracao: 12_900, consumo: 14_600 },
              ],
              perdas: [
                { categoria: "Inversor", valor: 3.2 },
                { categoria: "Cabos", valor: 1.8 },
                { categoria: "Painéis", valor: 2.1 },
                { categoria: "Outros", valor: 1.5 },
              ],
            };

            const jsonData = JSON.stringify(data, null, 2);

            controller.enqueue({
              type: "text-delta",
              textDelta: jsonData,
            });

            controller.enqueue({
              type: "finish",
              finishReason: "stop",
              usage: {
                promptTokens: 100,
                completionTokens: 200,
                totalTokens: 300,
              },
            });

            controller.close();
          },
        });

        return { stream, warnings: [] };
      },
    } as any, // Type assertion for mock model
    prompt: `Gere dados de exemplo para gráficos de energia solar incluindo:
- Geração mensal vs consumo (6 meses)
- Distribuição de perdas do sistema (%)

Formato: JSON válido`,
  });

  return result;
}

// Integration example with KPI calculations
export function calculateKPIs(
  generationData: Array<{ geracao: number }>,
  consumptionData: Array<{ consumo: number }>
) {
  const totalGeneration = generationData.reduce(
    (sum, item) => sum + item.geracao,
    0
  );
  const totalConsumption = consumptionData.reduce(
    (sum, item) => sum + item.consumo,
    0
  );
  const selfSufficiency =
    (totalGeneration / totalConsumption) * PERCENTAGE_MULTIPLIER;

  const initialInvestment = 500_000; // R$
  const annualSavings = totalConsumption * ELECTRICITY_TARIFF * SOLAR_DISCOUNT; // tarifa * desconto
  const paybackYears = initialInvestment / annualSavings;

  return {
    roi:
      ((annualSavings * PROJECT_LIFETIME_YEARS) / initialInvestment) *
      PERCENTAGE_MULTIPLIER, // 25 anos
    payback: paybackYears,
    selfSufficiency,
    totalSavings: annualSavings * PROJECT_LIFETIME_YEARS,
  };
}
