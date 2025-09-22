"use client";

import { useState } from "react";
import { Streamdown } from "@/packages/streamdown";

export default function StreamdownIntegrationDemo() {
  const [report, setReport] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);
    setReport("");

    // Simulação de streaming - em produção, use o streamText real
    const mockReport = #
    Relatório;
    de;
    Viabilidade;
    Energética;

    #
    #
    Análise;
    Executiva;

    Com;
    base;
    nos;
    dados;
    analisados, o;
    projeto;
    de;
    energia;
    solar;
    apresenta ** viabilidade;
    técnica;
    e;
    econômica;
    excelente ** para;
    implementação.

#
    #
    #
    Principais;
    Indicadores

- **Payback**
    : 4.2 anos
- **ROI Anual**: 23.8%
- **Economia Projetada**: R$ 45.000/ano
- **Redução de CO₂**: 2.3 toneladas/ano

## Dados de Produção Mensal

A análise mostra produção consistente ao longo
    do ano, com picos
    esperados;
    nos;
    meses;
    de;
    maior;
    irradiação;
    solar.

#
    #
    Distribuição;
    de;
    Perdas;

    As;
    perdas;
    identificadas;
    estão;
    dentro;
    dos;
    parâmetros;
    aceitáveis, com;
    margem;
    para;
    otimização;
    futura.

    --- * Relatório;
    gerado;
    automaticamente;
    em *;

    // Simular streaming chunk por chunk
    const chunks = mockReport.split(" ");
    let currentText = "";

    for (const chunk of chunks) {
      currentText += chunk + " ";
      setReport(currentText);
      await new Promise((resolve) => setTimeout(resolve, 50)); // 50ms delay
    }

    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-4xl text-transparent">
            Demo: Streamdown + AI Streaming
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Demonstração da integração entre streaming de texto de IA e
            renderização Markdown em tempo real com componentes visuais
            avançados.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isGenerating}
            onClick={generateReport}
          >
            {isGenerating
              ? "Gerando Relatório..."
              : "Gerar Relatório de Viabilidade"}
          </button>
        </div>

        <div className="rounded-lg border bg-card shadow-lg">
          <div className="border-b p-6">
            <h2 className="font-semibold text-xl">Relatório em Tempo Real</h2>
            <p className="mt-1 text-muted-foreground text-sm">
              O conteúdo é renderizado conforme chega do streaming da IA
            </p>
          </div>

          <div className="p-6">
            {report ? (
              <Streamdown className="max-w-none">{report}</Streamdown>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <p>
                  Clique no botão acima para gerar um relatório de viabilidade
                  energética
                </p>
                <p className="mt-2 text-sm">
                  O conteúdo será renderizado em tempo real usando Streamdown
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-3 font-semibold text-lg">
              Funcionalidades Demonstradas
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• Streaming de texto em tempo real</li>
              <li>• Renderização Markdown progressiva</li>
              <li>• Suporte a componentes visuais</li>
              <li>• Integração com dados dinâmicos</li>
              <li>• Otimização para performance</li>
            </ul>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-3 font-semibold text-lg">Próximos Passos</h3>
            <ul className="space-y-2 text-sm">
              <li>• Integração com streamText real</li>
              <li>• Adição de gráficos interativos</li>
              <li>• Suporte a ferramentas de IA</li>
              <li>• Persistência de relatórios</li>
              <li>• Exportação em múltiplos formatos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
