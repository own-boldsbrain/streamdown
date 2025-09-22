"use client";

import React from "react";
import { mockVisualizationData, getMockData, getMockItem } from "../test-data/mock-visualization-data";

// Importar componentes de visualização
import VizAudioWaveform from "../viz/viz-audio-waveform";
import VizMermaidDiagram from "../viz/viz-mermaid-diagram";
import VizDataTable from "../viz/viz-data-table";
import VizCallout from "../viz/viz-callout";
import VizLightbox from "../viz/viz-lightbox";
import VizPremiumMedia from "../viz/viz-premium-media";

/**
 * Componente de demonstração visual para testar todos os componentes de visualização
 * Este componente mostra exemplos de uso de cada componente com dados mock
 */
export default function VisualizationDemo() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 p-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Demonstração Visual - Streamdown</h1>
        <p className="text-lg text-muted-foreground">
          Teste visual de todos os componentes de visualização com dados mock
        </p>
      </div>

      {/* Seção Audio Waveform */}
      <section className="space-y-6">
        <h2 className="border-b pb-2 text-2xl font-semibold">🎵 Audio Waveform</h2>
        <div className="grid gap-6">
          {mockVisualizationData.audioWaveform.map((audio, index) => (
            <div key={index} className="border rounded-lg p-6">
              <h3 className="mb-2 text-lg font-medium">{audio.title}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{audio.description}</p>
              <VizAudioWaveform
                audioSrc={audio.src}
                title={audio.title}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Seção Mermaid Diagrams */}
      <section className="space-y-6">
        <h2 className="border-b pb-2 text-2xl font-semibold">📊 Diagramas Mermaid</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {mockVisualizationData.mermaidDiagrams.map((diagram, index) => (
            <div key={index} className="border rounded-lg p-6">
              <h3 className="mb-2 text-lg font-medium">{diagram.title}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{diagram.description}</p>
              <VizMermaidDiagram
                code={diagram.code}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Seção Data Tables */}
      <section className="space-y-6">
        <h2 className="border-b pb-2 text-2xl font-semibold">📋 Tabelas de Dados</h2>
        <div className="grid gap-6">
          {mockVisualizationData.dataTables.map((table, index) => (
            <div key={index} className="border rounded-lg p-6">
              <h3 className="mb-2 text-lg font-medium">{table.title}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{table.description}</p>
              <VizDataTable
                data={table.data}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Seção Callouts */}
      <section className="space-y-6">
        <h2 className="border-b pb-2 text-2xl font-semibold">💬 Callouts</h2>
        <div className="grid gap-4">
          {mockVisualizationData.callouts.map((callout, index) => (
            <VizCallout
              key={index}
              type={callout.type}
              title={callout.title}
              className="w-full"
            >
              <p>{callout.content}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {callout.description}
              </p>
            </VizCallout>
          ))}
        </div>
      </section>

      {/* Seção Lightbox Images */}
      <section className="space-y-6">
        <h2 className="border-b pb-2 text-2xl font-semibold">🖼️ Galeria de Imagens</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {mockVisualizationData.lightboxImages.map((image, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="mb-2 text-lg font-medium">{image.title}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{image.description}</p>
              <VizLightbox
                src={image.src}
                alt={image.alt}
                className="w-full h-48 object-cover rounded cursor-pointer"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Seção Premium Media */}
      <section className="space-y-6">
        <h2 className="border-b pb-2 text-2xl font-semibold">🎬 Mídia Premium</h2>
        <div className="grid gap-6">
          {mockVisualizationData.premiumMedia.map((media, index) => (
            <div key={index} className="border rounded-lg p-6">
              <h3 className="mb-2 text-lg font-medium">{media.title}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{media.description}</p>
              <VizPremiumMedia
                src={media.src}
                type={media.type}
                title={media.title}
                controls={true}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Seção de Testes Interativos */}
      <section className="space-y-6">
        <h2 className="border-b pb-2 text-2xl font-semibold">🧪 Testes Interativos</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border rounded-lg p-6">
            <h3 className="mb-4 text-lg font-medium">Teste Rápido - Diagrama</h3>
            <VizMermaidDiagram
              code="graph LR\nA[Usuário] --> B[Streamdown]\nB --> C[Componente]\nC --> D[Renderização]"
              className="w-full"
            />
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="mb-4 text-lg font-medium">Teste Rápido - Tabela</h3>
            <VizDataTable
              data={[
                { componente: "VizAudioWaveform", status: "✅ Completo", testes: 5 },
                { componente: "VizMermaidDiagram", status: "✅ Completo", testes: 8 },
                { componente: "VizDataTable", status: "✅ Completo", testes: 6 },
                { componente: "VizCallout", status: "✅ Completo", testes: 4 },
                { componente: "VizLightbox", status: "✅ Completo", testes: 7 },
                { componente: "VizPremiumMedia", status: "✅ Completo", testes: 9 }
              ]}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Informações do Dataset */}
      <section className="rounded-lg border bg-muted/50 p-6">
        <h2 className="mb-4 text-2xl font-semibold">📊 Informações do Dataset</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {Object.keys(mockVisualizationData).length}
            </div>
            <div className="text-sm text-muted-foreground">Tipos de Componentes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {Object.values(mockVisualizationData).reduce((acc, arr) => acc + arr.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Exemplos Totais</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">Cobertura de Testes</div>
          </div>
        </div>
      </section>
    </div>
  );
}