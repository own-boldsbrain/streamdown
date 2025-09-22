"use client";

import { memo } from "react";
import { cn } from "../utils";

export type DataSource = {
  /** ID único da fonte */
  id: string;
  /** Nome da fonte */
  name: string;
  /** Tipo da fonte */
  type: "api" | "database" | "file" | "web" | "ai" | "user" | "unknown";
  /** Qualidade/confiabilidade dos dados (0-100) */
  quality: number;
  /** Última atualização */
  lastUpdated?: Date;
  /** Status da fonte */
  status: "online" | "offline" | "error" | "warning" | "unknown";
  /** Descrição adicional */
  description?: string;
  /** URL ou referência */
  url?: string;
};

export type VizSourcesPanelProps = {
  /** Lista de fontes de dados */
  sources: DataSource[];
  /** Título do painel */
  title?: string;
  /** Se deve mostrar em formato compacto */
  compact?: boolean;
  /** Classe CSS adicional */
  className?: string;
  /** Callback quando uma fonte é clicada */
  onSourceClick?: (source: DataSource) => void;
  /** Tema do painel */
  theme?: "light" | "dark" | "auto";
};

// Constantes para números mágicos
const QUALITY_EXCELLENT = 90;
const QUALITY_GOOD = 70;
const QUALITY_FAIR = 50;
const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;
const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const MS_IN_HOUR = MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR;

const getSourceIcon = (type: DataSource["type"]) => {
  const icons = {
    api: "🌐",
    database: "🗄️",
    file: "📄",
    web: "🔗",
    ai: "🤖",
    user: "👤",
    unknown: "❓",
  };
  return icons[type] || icons.unknown;
};

const getStatusColor = (status: DataSource["status"], theme: "light" | "dark" | "auto") => {
  const isDark = theme === "dark" || (theme === "auto" && window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches);

  const colors = {
    online: isDark ? "bg-green-900/20 text-green-400" : "bg-green-100 text-green-700",
    offline: isDark ? "bg-gray-900/20 text-gray-400" : "bg-gray-100 text-gray-600",
    error: isDark ? "bg-red-900/20 text-red-400" : "bg-red-100 text-red-700",
    warning: isDark ? "bg-yellow-900/20 text-yellow-400" : "bg-yellow-100 text-yellow-700",
    unknown: isDark ? "bg-gray-900/20 text-gray-400" : "bg-gray-100 text-gray-600",
  };
  return colors[status] || colors.unknown;
};

const getQualityColor = (quality: number) => {
  if (quality >= QUALITY_EXCELLENT) {
    return "bg-green-100 text-green-600";
  }
  if (quality >= QUALITY_GOOD) {
    return "bg-yellow-100 text-yellow-600";
  }
  if (quality >= QUALITY_FAIR) {
    return "bg-orange-100 text-orange-600";
  }
  return "bg-red-100 text-red-600";
};

const formatLastUpdated = (date?: Date) => {
  if (!date) {
    return "Nunca";
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / MS_IN_HOUR;
  const diffDays = diffHours / HOURS_IN_DAY;

  if (diffHours < 1) {
    return "Agora";
  }
  if (diffHours < HOURS_IN_DAY) {
    return `${Math.floor(diffHours)}h atrás`;
  }
  if (diffDays < DAYS_IN_WEEK) {
    return `${Math.floor(diffDays)}d atrás`;
  }

  return date.toLocaleDateString();
};

const SourceItem = memo(({
  source,
  compact,
  theme
}: {
  source: DataSource;
  compact: boolean;
  theme: "light" | "dark" | "auto";
}) => (
  <div className="flex items-start gap-3">
    {/* Ícone e status */}
    <div className="flex flex-col items-center gap-1">
      <span className="text-lg" role="img" aria-label={`Fonte do tipo ${source.type}`}>
        {getSourceIcon(source.type)}
      </span>
      <span
        className={cn(
          "font-medium inline-flex items-center px-2 py-0.5 rounded-full text-xs",
          getStatusColor(source.status, theme)
        )}
      >
        {source.status === "online" && "●"}
        {source.status === "offline" && "○"}
        {source.status === "error" && "✕"}
        {source.status === "warning" && "⚠"}
        {source.status === "unknown" && "?"}
      </span>
    </div>

    {/* Informações da fonte */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <h4 className="font-medium truncate">{source.name}</h4>
        <span
          className={cn(
            "font-medium inline-flex items-center px-2 py-0.5 rounded-full text-xs",
            getQualityColor(source.quality)
          )}
        >
          {source.quality}%
        </span>
      </div>

      {!compact && (
        <>
          <p className="dark:text-gray-400 mt-1 text-gray-600 text-sm">
            Tipo: {source.type} • Atualizado: {formatLastUpdated(source.lastUpdated)}
          </p>

          {source.description && (
            <p className="dark:text-gray-300 mt-2 text-gray-700 text-sm">
              {source.description}
            </p>
          )}

          {source.url && (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="dark:hover:text-blue-300 dark:text-blue-400 hover:text-blue-800 inline-flex items-center mt-1 text-blue-600 text-sm"
            >
              Ver fonte →
            </a>
          )}
        </>
      )}
    </div>
  </div>
));

SourceItem.displayName = "SourceItem";

export const VizSourcesPanel = memo(
  ({
    sources,
    title = "Fontes de Dados",
    compact = false,
    className,
    onSourceClick,
    theme = "auto",
  }: VizSourcesPanelProps) => {
    if (!sources.length) {
      return (
        <div
          className={cn(
            "rounded-lg border p-4 text-center text-gray-500",
            theme === "dark" || (theme === "auto" && window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches)
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white",
            className
          )}
        >
          Nenhuma fonte de dados disponível
        </div>
      );
    }

    return (
      <div
        className={cn(
          "rounded-lg border",
          theme === "dark" || (theme === "auto" && window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches)
            ? "border-gray-700 bg-gray-800 text-white"
            : "border-gray-200 bg-white text-gray-900",
          className
        )}
      >
        {/* Cabeçalho */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-gray-600 text-sm dark:text-gray-400">
            {sources.length} fonte{sources.length !== 1 ? "s" : ""} de dados
          </p>
        </div>

        {/* Lista de fontes */}
        <div className="divide-gray-200 divide-y dark:divide-gray-700">
          {sources.map((source) => (
            onSourceClick ? (
              <button
                key={source.id}
                type="button"
                aria-label={`Fonte de dados: ${source.name}, tipo ${source.type}, qualidade ${source.quality}%`}
                className="cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-50 p-4 text-left transition-colors w-full"
                onClick={() => onSourceClick(source)}
              >
                <SourceItem source={source} compact={compact} theme={theme} />
              </button>
            ) : (
              <div key={source.id} className="p-4">
                <SourceItem source={source} compact={compact} theme={theme} />
              </div>
            )
          ))}
        </div>

        {/* Resumo */}
        {!compact && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-green-600 dark:text-green-400">
                  ● {sources.filter(s => s.status === "online").length} online
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  ○ {sources.filter(s => s.status === "offline").length} offline
                </span>
                <span className="text-red-600 dark:text-red-400">
                  ✕ {sources.filter(s => s.status === "error").length} erro
                </span>
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Qualidade média: {Math.round(sources.reduce((acc, s) => acc + s.quality, 0) / sources.length)}%
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

VizSourcesPanel.displayName = "VizSourcesPanel";