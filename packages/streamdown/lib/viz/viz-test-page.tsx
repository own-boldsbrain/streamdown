/**
 * Página de teste para visualização dos componentes de visualização do Streamdown
 * Este arquivo pode ser usado em um ambiente Next.js para testar visualmente os componentes
 */
"use client";

import { useState } from "react";
import {
  audioWaveformMocks,
  calloutMocks,
  dataTableMocks,
  lightboxMocks,
  mermaidDiagramMocks,
  premiumMediaMocks,
} from "./mock-data";

import VizAudioWaveform from "./viz-audio-waveform";
import VizCallout from "./viz-callout";
import VizDataTable from "./viz-data-table";
import VizLightbox from "./viz-lightbox";
import VizMermaidDiagram from "./viz-mermaid-diagram";
import VizPremiumMedia from "./viz-premium-media";

// Componentes auxiliares para a página de teste
const TestCard = ({ title, children }) => (
  <div className="mb-8 rounded-lg border p-4 shadow-sm">
    <h2 className="mb-4 font-semibold text-xl">{title}</h2>
    <div className="space-y-6">{children}</div>
  </div>
);

const ComponentExample = ({ title, children }) => (
  <div className="rounded-md border p-4">
    <h3 className="mb-2 font-medium text-lg">{title}</h3>
    <div>{children}</div>
  </div>
);

export default function VizTestPage() {
  // Estados para controlar a seleção de exemplos
  const [selectedAudio, setSelectedAudio] = useState("standard");
  const [selectedDiagram, setSelectedDiagram] = useState("flowchart");
  const [selectedTable, setSelectedTable] = useState("users");
  const [selectedCallout, setSelectedCallout] = useState("note");
  const [selectedLightbox, setSelectedLightbox] = useState("simple");
  const [selectedMedia, setSelectedMedia] = useState("video");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="mb-2 font-bold text-3xl">
          Streamdown - Teste de Componentes de Visualização
        </h1>
        <p className="text-gray-600 text-lg">
          Use esta página para testar visualmente os componentes de visualização
          do Streamdown com diferentes configurações
        </p>
      </header>

      {/* VizAudioWaveform */}
      <TestCard title="VizAudioWaveform">
        <div className="mb-4">
          <label className="mb-2 block font-medium">
            Selecione um exemplo:
          </label>
          <select
            className="w-full max-w-md rounded border p-2"
            onChange={(e) => setSelectedAudio(e.target.value)}
            value={selectedAudio}
          >
            {Object.keys(audioWaveformMocks).map((key) => (
              <option key={key} value={key}>
                {audioWaveformMocks[key].title}
              </option>
            ))}
          </select>
        </div>

        <ComponentExample title={audioWaveformMocks[selectedAudio].title}>
          <VizAudioWaveform {...audioWaveformMocks[selectedAudio]} />
        </ComponentExample>
      </TestCard>

      {/* VizMermaidDiagram */}
      <TestCard title="VizMermaidDiagram">
        <div className="mb-4">
          <label className="mb-2 block font-medium">
            Selecione um diagrama:
          </label>
          <select
            className="w-full max-w-md rounded border p-2"
            onChange={(e) => setSelectedDiagram(e.target.value)}
            value={selectedDiagram}
          >
            {Object.keys(mermaidDiagramMocks).map((key) => (
              <option key={key} value={key}>
                {mermaidDiagramMocks[key].title}
              </option>
            ))}
          </select>
        </div>

        <ComponentExample title={mermaidDiagramMocks[selectedDiagram].title}>
          <VizMermaidDiagram {...mermaidDiagramMocks[selectedDiagram]} />
        </ComponentExample>
      </TestCard>

      {/* VizDataTable */}
      <TestCard title="VizDataTable">
        <div className="mb-4">
          <label className="mb-2 block font-medium">
            Selecione uma tabela:
          </label>
          <select
            className="w-full max-w-md rounded border p-2"
            onChange={(e) => setSelectedTable(e.target.value)}
            value={selectedTable}
          >
            {Object.keys(dataTableMocks).map((key) => (
              <option key={key} value={key}>
                {dataTableMocks[key].title}
              </option>
            ))}
          </select>
        </div>

        <ComponentExample title={dataTableMocks[selectedTable].title}>
          <VizDataTable {...dataTableMocks[selectedTable]} />
        </ComponentExample>
      </TestCard>

      {/* VizCallout */}
      <TestCard title="VizCallout">
        <div className="mb-4">
          <label className="mb-2 block font-medium">
            Selecione um callout:
          </label>
          <select
            className="w-full max-w-md rounded border p-2"
            onChange={(e) => setSelectedCallout(e.target.value)}
            value={selectedCallout}
          >
            {Object.keys(calloutMocks).map((key) => (
              <option key={key} value={key}>
                {calloutMocks[key].title || `Tipo: ${calloutMocks[key].type}`}
              </option>
            ))}
          </select>
        </div>

        <ComponentExample
          title={
            calloutMocks[selectedCallout].title ||
            `Tipo: ${calloutMocks[selectedCallout].type}`
          }
        >
          <VizCallout {...calloutMocks[selectedCallout]} />
        </ComponentExample>
      </TestCard>

      {/* VizLightbox */}
      <TestCard title="VizLightbox">
        <div className="mb-4">
          <label className="mb-2 block font-medium">
            Selecione uma imagem:
          </label>
          <select
            className="w-full max-w-md rounded border p-2"
            onChange={(e) => setSelectedLightbox(e.target.value)}
            value={selectedLightbox}
          >
            {Object.keys(lightboxMocks).map((key) => (
              <option key={key} value={key}>
                {lightboxMocks[key].title}
              </option>
            ))}
          </select>
        </div>

        <ComponentExample title={lightboxMocks[selectedLightbox].title}>
          <div>
            <button
              className="mb-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              onClick={() => setLightboxOpen(true)}
            >
              Abrir Lightbox
            </button>

            {lightboxOpen && (
              <VizLightbox
                {...lightboxMocks[selectedLightbox]}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
              />
            )}

            <div className="mt-4">
              <img
                alt={lightboxMocks[selectedLightbox].alt}
                className="h-auto max-h-60 max-w-full object-contain"
                src={lightboxMocks[selectedLightbox].src}
              />
            </div>
          </div>
        </ComponentExample>
      </TestCard>

      {/* VizPremiumMedia */}
      <TestCard title="VizPremiumMedia">
        <div className="mb-4">
          <label className="mb-2 block font-medium">Selecione uma mídia:</label>
          <select
            className="w-full max-w-md rounded border p-2"
            onChange={(e) => setSelectedMedia(e.target.value)}
            value={selectedMedia}
          >
            {Object.keys(premiumMediaMocks).map((key) => (
              <option key={key} value={key}>
                {premiumMediaMocks[key].title}
              </option>
            ))}
          </select>
        </div>

        <ComponentExample title={premiumMediaMocks[selectedMedia].title}>
          <VizPremiumMedia {...premiumMediaMocks[selectedMedia]} />
        </ComponentExample>
      </TestCard>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>
          Streamdown - Teste de Componentes de Visualização -{" "}
          {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
