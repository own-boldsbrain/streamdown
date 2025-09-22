/**
 * Página de teste para visualização dos componentes de visualização do Streamdown
 * Este arquivo pode ser usado em um ambiente Next.js para testar visualmente os componentes
 */
"use client";

import { useState } from "react";
import {
  audioWaveformMocks,
  mermaidDiagramMocks,
  dataTableMocks,
  calloutMocks,
  lightboxMocks,
  premiumMediaMocks
} from "./mock-data";

import VizAudioWaveform from "./viz-audio-waveform";
import VizMermaidDiagram from "./viz-mermaid-diagram";
import VizDataTable from "./viz-data-table";
import VizCallout from "./viz-callout";
import VizLightbox from "./viz-lightbox";
import VizPremiumMedia from "./viz-premium-media";

// Componentes auxiliares para a página de teste
const TestCard = ({ title, children }) => (
  <div className="p-4 border rounded-lg mb-8 shadow-sm">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <div className="space-y-6">
      {children}
    </div>
  </div>
);

const ComponentExample = ({ title, children }) => (
  <div className="border p-4 rounded-md">
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <div>
      {children}
    </div>
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
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Streamdown - Teste de Componentes de Visualização</h1>
        <p className="text-lg text-gray-600">
          Use esta página para testar visualmente os componentes de visualização do Streamdown com diferentes configurações
        </p>
      </header>

      {/* VizAudioWaveform */}
      <TestCard title="VizAudioWaveform">
        <div className="mb-4">
          <label className="block mb-2 font-medium">Selecione um exemplo:</label>
          <select 
            className="border rounded p-2 w-full max-w-md"
            value={selectedAudio}
            onChange={(e) => setSelectedAudio(e.target.value)}
          >
            {Object.keys(audioWaveformMocks).map(key => (
              <option key={key} value={key}>{audioWaveformMocks[key].title}</option>
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
          <label className="block mb-2 font-medium">Selecione um diagrama:</label>
          <select 
            className="border rounded p-2 w-full max-w-md"
            value={selectedDiagram}
            onChange={(e) => setSelectedDiagram(e.target.value)}
          >
            {Object.keys(mermaidDiagramMocks).map(key => (
              <option key={key} value={key}>{mermaidDiagramMocks[key].title}</option>
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
          <label className="block mb-2 font-medium">Selecione uma tabela:</label>
          <select 
            className="border rounded p-2 w-full max-w-md"
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
          >
            {Object.keys(dataTableMocks).map(key => (
              <option key={key} value={key}>{dataTableMocks[key].title}</option>
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
          <label className="block mb-2 font-medium">Selecione um callout:</label>
          <select 
            className="border rounded p-2 w-full max-w-md"
            value={selectedCallout}
            onChange={(e) => setSelectedCallout(e.target.value)}
          >
            {Object.keys(calloutMocks).map(key => (
              <option key={key} value={key}>{calloutMocks[key].title || `Tipo: ${calloutMocks[key].type}`}</option>
            ))}
          </select>
        </div>
        
        <ComponentExample title={calloutMocks[selectedCallout].title || `Tipo: ${calloutMocks[selectedCallout].type}`}>
          <VizCallout {...calloutMocks[selectedCallout]} />
        </ComponentExample>
      </TestCard>

      {/* VizLightbox */}
      <TestCard title="VizLightbox">
        <div className="mb-4">
          <label className="block mb-2 font-medium">Selecione uma imagem:</label>
          <select 
            className="border rounded p-2 w-full max-w-md"
            value={selectedLightbox}
            onChange={(e) => setSelectedLightbox(e.target.value)}
          >
            {Object.keys(lightboxMocks).map(key => (
              <option key={key} value={key}>{lightboxMocks[key].title}</option>
            ))}
          </select>
        </div>
        
        <ComponentExample title={lightboxMocks[selectedLightbox].title}>
          <div>
            <button 
              onClick={() => setLightboxOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
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
                src={lightboxMocks[selectedLightbox].src} 
                alt={lightboxMocks[selectedLightbox].alt}
                className="max-w-full h-auto max-h-60 object-contain"
              />
            </div>
          </div>
        </ComponentExample>
      </TestCard>

      {/* VizPremiumMedia */}
      <TestCard title="VizPremiumMedia">
        <div className="mb-4">
          <label className="block mb-2 font-medium">Selecione uma mídia:</label>
          <select 
            className="border rounded p-2 w-full max-w-md"
            value={selectedMedia}
            onChange={(e) => setSelectedMedia(e.target.value)}
          >
            {Object.keys(premiumMediaMocks).map(key => (
              <option key={key} value={key}>{premiumMediaMocks[key].title}</option>
            ))}
          </select>
        </div>
        
        <ComponentExample title={premiumMediaMocks[selectedMedia].title}>
          <VizPremiumMedia {...premiumMediaMocks[selectedMedia]} />
        </ComponentExample>
      </TestCard>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Streamdown - Teste de Componentes de Visualização - {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}