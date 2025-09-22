"use client";

import React from "react";
import {
  getMockData,
  getMockItem,
  mockVisualizationData,
} from "../test-data/mock-visualization-data";

// Importar componentes de visualização
import VizAudioWaveform from "../viz/viz-audio-waveform";
import VizCallout from "../viz/viz-callout";
import VizDataTable from "../viz/viz-data-table";
import VizLightbox from "../viz/viz-lightbox";
import VizMermaidDiagram from "../viz/viz-mermaid-diagram";
import VizPremiumMedia from "../viz/viz-premium-media";

/**
 * Componente de demonstração visual para testar todos os componentes de visualização
 * Este componente mostra exemplos de uso de cada componente com dados mock
 */
export default function VisualizationDemo() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 p-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-bold text-4xl">
          Demonstração Visual - Streamdown
        </h1>
        <p className="text-lg text-muted-foreground">
          Teste visual de todos os componentes de visualização com dados mock
        </p>
      </div>

      {/* Seção Audio Waveform */}
      <section className="space-y-6">
        <h2 className="border-b pb-2 font-semibold text-2xl">
          🎵 Audio Waveform
        </h2>
        <div className="grid gap-6">
          {mockVisualizationData.audioWaveform.map((audio, index) => (
            <div className="rounded-lg border p-6" key={index}>
              <h3 className="mb-2 font-medium text-lg">{audio.title}</h3>
              <p className="mb-4 text-muted-foreground text-sm">
                {audio.description}
              </p>
              <VizAudioWaveform
                audioSrc={audio.src}
                className="w-full"
                title={audio.title}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Seção Mermaid Diagrams */}
      <section className="space-y-6">
        <h2 className="border-b pb-2 font-semibold text-2xl">
          📊 Diagramas Mermaid
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {mockVisualizationData.mermaidDiagrams.map((diagram, index) => (
            <div className="rounded-lg border p-6" key={index}>
              <h3 className="mb-2 font-medium text-lg">{diagram.title}</h3>
              <p className="mb-4 text-muted-foreground text-sm">
                {diagram.description}
              </p>
              <VizMermaidDiagram className="w-full" code={diagram.code} />
            </div>
          ))}
        </div>
      </section>

      {/* Seção Data Tables */}
      <section className="space-y-6">
        <h2 className="border-b pb-2 font-semibold text-2xl">
          📋 Tabelas de Dados
        </h2>
        <div className="grid gap-6">
          {mockVisualizationData.dataTables.map((table, index) => (
            <div className="rounded-lg border p-6" key={index}>
              <h3 className="mb-2 font-medium text-lg">{table.title}</h3>
              <p className="mb-4 text-muted-foreground text-sm">
                {table.description}
              </p>
              <VizDataTable className="w-full" data={table.data} />
            </div>
          ))}
        </div>
      </section>

      {/* Seção Callouts */}
      <section className="space-y-6">
        <h2 className="border-b pb-2 font-semibold text-2xl">💬 Callouts</h2>
        <div className="grid gap-4">
          {mockVisualizationData.callouts.map((callout, index) => (
            <VizCallout
              className="w-full"
              key={index}
              title={callout.title}
              type={callout.type}
            >
              <p>{callout.content}</p>
              <p className="mt-2 text-muted-foreground text-sm">
                {callout.description}
              </p>
            </VizCallout>
          ))}
        </div>
      </section>

      {/* Seção Lightbox Images */}
      <section className="space-y-6">
        <h2 className="border-b pb-2 font-semibold text-2xl">
          🖼️ Galeria de Imagens
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {mockVisualizationData.lightboxImages.map((image, index) => (
            <div className="rounded-lg border p-4" key={index}>
              <h3 className="mb-2 font-medium text-lg">{image.title}</h3>
              <p className="mb-4 text-muted-foreground text-sm">
                {image.description}
              </p>
              <VizLightbox
                alt={image.alt}
                className="h-48 w-full cursor-pointer rounded object-cover"
                src={image.src}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Seção Premium Media */}
      <section className="space-y-6">
        <h2 className="border-b pb-2 font-semibold text-2xl">
          🎬 Mídia Premium
        </h2>
        <div className="grid gap-6">
          {mockVisualizationData.premiumMedia.map((media, index) => (
            <div className="rounded-lg border p-6" key={index}>
              <h3 className="mb-2 font-medium text-lg">{media.title}</h3>
              <p className="mb-4 text-muted-foreground text-sm">
                {media.description}
              </p>
              <VizPremiumMedia
                className="w-full"
                controls={true}
                src={media.src}
                title={media.title}
                type={media.type}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Seção de Testes Interativos */}
      <section className="space-y-6">
        <h2 className="border-b pb-2 font-semibold text-2xl">
          🧪 Testes Interativos
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h3 className="mb-4 font-medium text-lg">
              Teste Rápido - Diagrama
            </h3>
            <VizMermaidDiagram
              className="w-full"
              code="graph LR\nA[Usuário] --> B[Streamdown]\nB --> C[Componente]\nC --> D[Renderização]"
            />
          </div>

          <div className="rounded-lg border p-6">
            <h3 className="mb-4 font-medium text-lg">Teste Rápido - Tabela</h3>
            <VizDataTable
              className="w-full"
              data={[
                {
                  componente: "VizAudioWaveform",
                  status: "✅ Completo",
                  testes: 5,
                },
                {
                  componente: "VizMermaidDiagram",
                  status: "✅ Completo",
                  testes: 8,
                },
                {
                  componente: "VizDataTable",
                  status: "✅ Completo",
                  testes: 6,
                },
                { componente: "VizCallout", status: "✅ Completo", testes: 4 },
                { componente: "VizLightbox", status: "✅ Completo", testes: 7 },
                {
                  componente: "VizPremiumMedia",
                  status: "✅ Completo",
                  testes: 9,
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Informações do Dataset */}
      <section className="rounded-lg border bg-muted/50 p-6">
        <h2 className="mb-4 font-semibold text-2xl">
          📊 Informações do Dataset
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="font-bold text-3xl text-primary">
              {Object.keys(mockVisualizationData).length}
            </div>
            <div className="text-muted-foreground text-sm">
              Tipos de Componentes
            </div>
          </div>
          <div className="text-center">
            <div className="font-bold text-3xl text-primary">
              {Object.values(mockVisualizationData).reduce(
                (acc, arr) => acc + arr.length,
                0
              )}
            </div>
            <div className="text-muted-foreground text-sm">Exemplos Totais</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-3xl text-primary">100%</div>
            <div className="text-muted-foreground text-sm">
              Cobertura de Testes
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
