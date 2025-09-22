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
import VizCallout, { type CalloutType } from "./viz-callout";
import VizDataTable from "./viz-data-table";
import VizLightbox from "./viz-lightbox";
import VizMermaidDiagram from "./viz-mermaid-diagram";
import VizPremiumMedia, { type MediaType } from "./viz-premium-media";
import type { FC, ReactNode } from "react";

// Componentes auxiliares para a página de teste
const TestCard: FC<{ title: string; children: ReactNode }> = ({
  title,
  children,
}) => (
  <div className="mb-8 rounded-lg border p-4 shadow-sm">
    <h2 className="mb-4 font-semibold text-xl">{title}</h2>
    <div className="space-y-6">{children}</div>
  </div>
);

const ComponentExample: FC<{ title: string; children: ReactNode }> = ({
  title,
  children,
}) => (
  <div className="rounded-md border p-4">
    <h3 className="mb-2 font-medium text-lg">{title}</h3>
    <div>{children}</div>
  </div>
);

export default function VizTestPage() {
  // Estados para controlar a seleção de exemplos
  const [selectedAudio, setSelectedAudio] = useState<
    keyof typeof audioWaveformMocks
  >("standard");
  const [selectedDiagram, setSelectedDiagram] = useState<
    keyof typeof mermaidDiagramMocks
  >("flowchart");
  const [selectedTable, setSelectedTable] = useState<
    keyof typeof dataTableMocks
  >("users");
  const [selectedCallout, setSelectedCallout] = useState<
    keyof typeof calloutMocks
  >("note");
  const [selectedLightbox, setSelectedLightbox] = useState<
    keyof typeof lightboxMocks
  >("simple");
  const [selectedMedia, setSelectedMedia] = useState<
    keyof typeof premiumMediaMocks
  >("video");
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
          <label htmlFor="audio-select" className="mb-2 block font-medium">
            Selecione um exemplo:
          </label>
          <select
            id="audio-select"
            className="w-full max-w-md rounded border p-2"
            onChange={(e) =>
              setSelectedAudio(e.target.value as keyof typeof audioWaveformMocks)
            }
            value={selectedAudio}
          >
            {Object.keys(audioWaveformMocks).map((key) => (
              <option key={key} value={key}>
                {audioWaveformMocks[key as keyof typeof audioWaveformMocks].title}
              </option>
            ))}
          </select>
        </div>

        <ComponentExample
          title={audioWaveformMocks[selectedAudio].title}
        >
          <VizAudioWaveform
            {...audioWaveformMocks[selectedAudio]}
            audioSrc={audioWaveformMocks[selectedAudio].src}
          />
        </ComponentExample>
      </TestCard>

      {/* VizMermaidDiagram */}
      <TestCard title="VizMermaidDiagram">
        <div className="mb-4">
          <label htmlFor="diagram-select" className="mb-2 block font-medium">
            Selecione um diagrama:
          </label>
          <select
            id="diagram-select"
            className="w-full max-w-md rounded border p-2"
            onChange={(e) =>
              setSelectedDiagram(
                e.target.value as keyof typeof mermaidDiagramMocks,
              )
            }
            value={selectedDiagram}
          >
            {Object.keys(mermaidDiagramMocks).map((key) => (
              <option key={key} value={key}>
                {
                  mermaidDiagramMocks[
                    key as keyof typeof mermaidDiagramMocks
                  ].title
                }
              </option>
            ))}
          </select>
        </div>

        <ComponentExample
          title={mermaidDiagramMocks[selectedDiagram].title}
        >
          <VizMermaidDiagram {...mermaidDiagramMocks[selectedDiagram]} />
        </ComponentExample>
      </TestCard>

      {/* VizDataTable */}
      <TestCard title="VizDataTable">
        <div className="mb-4">
          <label htmlFor="table-select" className="mb-2 block font-medium">
            Selecione uma tabela:
          </label>
          <select
            id="table-select"
            className="w-full max-w-md rounded border p-2"
            onChange={(e) =>
              setSelectedTable(e.target.value as keyof typeof dataTableMocks)
            }
            value={selectedTable}
          >
            {Object.keys(dataTableMocks).map((key) => (
              <option key={key} value={key}>
                {dataTableMocks[key as keyof typeof dataTableMocks].title}
              </option>
            ))}
          </select>
        </div>

        <ComponentExample
          title={dataTableMocks[selectedTable].title}
        >
          <VizDataTable
            {...(dataTableMocks[selectedTable] as any)}
          />
        </ComponentExample>
      </TestCard>

      {/* VizCallout */}
      <TestCard title="VizCallout">
        <div className="mb-4">
          <label htmlFor="callout-select" className="mb-2 block font-medium">
            Selecione um callout:
          </label>
          <select
            id="callout-select"
            className="w-full max-w-md rounded border p-2"
            onChange={(e) =>
              setSelectedCallout(e.target.value as keyof typeof calloutMocks)
            }
            value={selectedCallout}
          >
            {Object.keys(calloutMocks).map((key) => {
              const mock = calloutMocks[key as keyof typeof calloutMocks];
              return (
                <option key={key} value={key}>
                  {mock.title || `Tipo: ${mock.type}`}
                </option>
              );
            })}
          </select>
        </div>

        <ComponentExample
          title={
            calloutMocks[selectedCallout].title ||
            `Tipo: ${calloutMocks[selectedCallout].type}`
          }
        >
          <VizCallout
            type={calloutMocks[selectedCallout].type as CalloutType}
            title={calloutMocks[selectedCallout].title}
          >
            {calloutMocks[selectedCallout].children}
          </VizCallout>
        </ComponentExample>
      </TestCard>

      {/* VizLightbox */}
      <TestCard title="VizLightbox">
        <div className="mb-4">
          <label htmlFor="lightbox-select" className="mb-2 block font-medium">
            Selecione uma imagem:
          </label>
          <select
            id="lightbox-select"
            className="w-full max-w-md rounded border p-2"
            onChange={(e) =>
              setSelectedLightbox(e.target.value as keyof typeof lightboxMocks)
            }
            value={selectedLightbox}
          >
            {Object.keys(lightboxMocks).map((key) => (
              <option key={key} value={key}>
                {lightboxMocks[key as keyof typeof lightboxMocks].title}
              </option>
            ))}
          </select>
        </div>

        <ComponentExample
          title={lightboxMocks[selectedLightbox].title}
        >
          <div>
            <button
              type="button"
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={lightboxMocks[selectedLightbox].alt}
                className="h-auto max-h-60 max-w-full object-contain"
                width={300}
                height={200}
                src={lightboxMocks[selectedLightbox].src}
              />
            </div>
          </div>
        </ComponentExample>
      </TestCard>

      {/* VizPremiumMedia */}
      <TestCard title="VizPremiumMedia">
        <div className="mb-4">
          <label htmlFor="media-select" className="mb-2 block font-medium">
            Selecione uma mídia:
          </label>
          <select
            id="media-select"
            className="w-full max-w-md rounded border p-2"
            onChange={(e) =>
              setSelectedMedia(e.target.value as keyof typeof premiumMediaMocks)
            }
            value={selectedMedia}
          >
            {Object.keys(premiumMediaMocks).map((key) => (
              <option key={key} value={key}>
                {premiumMediaMocks[key as keyof typeof premiumMediaMocks].title}
              </option>
            ))}
          </select>
        </div>

        <ComponentExample
          title={premiumMediaMocks[selectedMedia].title}
        >
          <VizPremiumMedia
            {...premiumMediaMocks[selectedMedia]}
            type={premiumMediaMocks[selectedMedia].type as MediaType}
          />
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
