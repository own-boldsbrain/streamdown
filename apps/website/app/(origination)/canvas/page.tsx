"use client";

import { useMemo, useState } from "react";
import { AgentCard } from "@/components/canvas/AgentCard";
import { CanvasShell } from "@/components/canvas/CanvasShell";
import { FlowViewer } from "@/components/canvas/FlowViewer";
import { ShortcutMenu } from "@/components/canvas/ShortcutMenu";
import {
  type Version,
  VersionHistoryTimeline,
} from "@/components/canvas/VersionHistoryTimeline";
import {
  type ToolId,
  VerticalToolbar,
} from "@/components/canvas/VerticalToolbar";

const DATA = {
  version: "1.2.0",
  domain: "origination-viabilidade",
  agents: [
    {
      id: "solar.viability.agent",
      title: "Agente de Viabilidade Solar",
      type: "reasoning",
      mission: "Analisar viabilidade técnica e econômica de projetos solares",
      capabilities: [
        "Análise de irradiação solar",
        "Dimensionamento de sistemas fotovoltaicos",
        "Cálculo de retorno de investimento",
        "Análise de sombreamento",
        "Verificação de conformidade com normas ANEEL",
      ],
      tools: [
        "solar_irradiance_calculator",
        "pv_system_designer",
        "roi_calculator",
        "shadow_analyzer",
      ],
      events: {
        publishes: ["viability_report_ready", "technical_constraints_detected"],
        consumes: ["lead_data_captured", "tariff_data_updated"],
      },
      dependencies: ["aneel.tariffs.agent"],
    },
    {
      id: "aneel.tariffs.agent",
      title: "Agente de Tarifas ANEEL",
      type: "data",
      mission: "Fornecer dados atualizados sobre tarifas e regulações da ANEEL",
      capabilities: [
        "Consulta a tarifas atuais B1, B2 e A4",
        "Monitoramento de mudanças regulatórias",
        "Cálculo de compensação por geração distribuída",
        "Verificação de bandeiras tarifárias",
      ],
      tools: [
        "aneel_tariff_fetcher",
        "regulation_monitor",
        "distributed_generation_calculator",
      ],
      events: {
        publishes: ["tariff_data_updated", "regulation_changed"],
        consumes: ["utility_data_requested"],
      },
      dependencies: ["aneel.utilities.agent"],
    },
    {
      id: "aneel.kpis.agent",
      title: "Agente de KPIs ANEEL",
      type: "analysis",
      mission:
        "Monitorar e analisar indicadores de desempenho das distribuidoras",
      capabilities: [
        "Análise de DEC/FEC",
        "Monitoramento de qualidade de fornecimento",
        "Benchmark entre distribuidoras",
        "Geração de relatórios comparativos",
      ],
      tools: ["dec_fec_analyzer", "quality_monitor", "distributor_benchmarker"],
      events: {
        publishes: ["kpi_report_ready", "quality_alert_triggered"],
        consumes: ["utility_data_requested"],
      },
      dependencies: ["aneel.utilities.agent"],
    },
    {
      id: "aneel.utilities.agent",
      title: "Agente de Distribuidoras",
      type: "data",
      mission: "Gerenciar informações sobre distribuidoras de energia",
      capabilities: [
        "Mapeamento de áreas de concessão",
        "Informações de contato e requisitos",
        "Histórico de desempenho regulatório",
        "Requisitos técnicos de conexão",
      ],
      tools: [
        "concession_area_mapper",
        "utility_contact_finder",
        "connection_requirements_checker",
      ],
      events: {
        publishes: ["utility_data_ready"],
        consumes: ["utility_data_requested", "lead_data_captured"],
      },
      dependencies: [],
    },
  ],
  mcp_manifests: {
    "solar.viability.agent": {
      id: "solar.viability.agent",
      name: "Solar Viability Agent",
      description:
        "Agente para análise de viabilidade técnica/econômica de sistemas solares",
      version: "1.0.0",
      tools: [
        {
          name: "solar_irradiance_calculator",
          summary:
            "Calcula a irradiação solar em kWh/m²/dia para uma localização específica",
        },
        {
          name: "pv_system_designer",
          summary:
            "Dimensiona sistema fotovoltaico baseado em consumo e área disponível",
        },
        {
          name: "roi_calculator",
          summary:
            "Calcula retorno financeiro considerando tarifas e condições locais",
        },
        {
          name: "shadow_analyzer",
          summary: "Analisa impacto de sombreamento na produção energética",
        },
      ],
      runtime: {
        type: "python3.9",
        entrypoint: "main.py",
      },
    },
    "aneel.tariffs.agent": {
      id: "aneel.tariffs.agent",
      name: "ANEEL Tariffs Agent",
      description:
        "Agente para consulta e análise de tarifas de energia da ANEEL",
      version: "1.0.0",
      tools: [
        {
          name: "aneel_tariff_fetcher",
          summary:
            "Obtém tarifas atualizadas da ANEEL por classe e distribuidora",
        },
        {
          name: "regulation_monitor",
          summary: "Monitora mudanças regulatórias relevantes para GD",
        },
        {
          name: "distributed_generation_calculator",
          summary: "Calcula compensação de energia conforme normas vigentes",
        },
      ],
      runtime: {
        type: "node16",
        entrypoint: "index.js",
      },
    },
  },
  wiring_examples: [
    {
      flow: "Avaliação inicial de viabilidade",
      call_sequence: [
        {
          tool: "concession_area_mapper",
          from: "lead_capture",
        },
        {
          tool: "aneel_tariff_fetcher",
          from: "viability_agent",
        },
        {
          tool: "solar_irradiance_calculator",
          from: "viability_agent",
        },
        {
          tool: "pv_system_designer",
          from: "viability_agent",
        },
        {
          tool: "roi_calculator",
          from: "viability_agent",
        },
      ],
    },
    {
      flow: "Benchmark de distribuidora",
      call_sequence: [
        {
          tool: "utility_contact_finder",
          from: "customer_service",
        },
        {
          tool: "dec_fec_analyzer",
          from: "kpi_agent",
        },
        {
          tool: "distributor_benchmarker",
          from: "kpi_agent",
        },
      ],
    },
  ],
};

export default function Page() {
  const [openCmd, setOpenCmd] = useState(false);
  const [versions] = useState<Version[]>([
    {
      id: "v3",
      label: "V3 — ajustes de Canvas",
      createdAt: new Date().toISOString(),
    },
    {
      id: "v2",
      label: "V2 — agentes ANEEL",
      createdAt: new Date(Date.now() - 3600e3).toISOString(),
    },
    {
      id: "v1",
      label: "V1 — rascunho",
      createdAt: new Date(Date.now() - 7200e3).toISOString(),
    },
  ]);

  const tools = useMemo(
    () => [
      {
        id: "suggest-edits" as ToolId,
        label: "Sugerir edições",
        onClick: () => setOpenCmd(true),
      },
      {
        id: "adjust-length-shorter" as ToolId,
        label: "Encurtar texto",
        onClick: () => setOpenCmd(true),
      },
      {
        id: "adjust-length-longer" as ToolId,
        label: "Alongar texto",
        onClick: () => setOpenCmd(true),
      },
      {
        id: "reading-level" as ToolId,
        label: "Nível de leitura",
        onClick: () => setOpenCmd(true),
      },
      {
        id: "review-code" as ToolId,
        label: "Revisar código",
        onClick: () => setOpenCmd(true),
      },
      {
        id: "fix-bugs" as ToolId,
        label: "Corrigir bugs",
        onClick: () => setOpenCmd(true),
      },
    ],
    []
  );

  const manifests: Record<string, any> = DATA.mcp_manifests || {};
  const agents = DATA.agents as any[];
  const flows = DATA.wiring_examples as any[];

  return (
    <CanvasShell
      left={<VerticalToolbar tools={tools} />}
      onBack={() => history.back()}
      onOpenVersions={() => alert("Abrir histórico de versões")}
      right={
        <VersionHistoryTimeline
          onRestore={(id) => alert(`Restaurar ${id}`)}
          versions={versions}
        />
      }
      title={`Canvas · ${DATA.domain}`}
    >
      <ShortcutMenu
        onAction={(id) => {
          setOpenCmd(false);
          console.log("Ação:", id);
        }}
        onOpenChange={setOpenCmd}
        open={openCmd}
      />

      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
        {agents.map((a) => (
          <AgentCard agent={a} key={a.id} manifest={manifests[a.id]} />
        ))}
      </div>

      <div className="mx-auto mt-6 max-w-6xl">
        <FlowViewer flows={flows} />
      </div>
    </CanvasShell>
  );
}
