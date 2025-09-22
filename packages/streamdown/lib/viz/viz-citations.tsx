"use client";

import { ExternalLink, Info, Star, StarHalf, StarOff } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import type { Citation, CitationsProps, Source } from "../types";
import { cn } from "../utils";

// Componente para exibir estrelas de confiabilidade
const ReliabilityStars = memo(
  ({ reliability }: { reliability: Source["reliability"] }) => {
    const stars = useMemo(() => {
      switch (reliability) {
        case "high":
          return [Star, Star, Star];
        case "medium":
          return [Star, Star, StarHalf];
        case "low":
          return [Star, StarOff];
        default:
          return [StarOff, StarOff, StarOff];
      }
    }, [reliability]);

    return (
      <div className="flex items-center gap-0.5">
        {stars.map((StarIcon, index) => (
          <StarIcon
            className={cn(
              "h-3 w-3",
              StarIcon === Star && "fill-yellow-400 text-yellow-400",
              StarIcon === StarHalf && "fill-yellow-400/50 text-yellow-400",
              StarIcon === StarOff && "text-gray-300"
            )}
            key={`${reliability}-star-${index}`}
          />
        ))}
      </div>
    );
  }
);

ReliabilityStars.displayName = "ReliabilityStars";

// Componente para o popover de fonte
const SourcePopover = memo(
  ({
    source,
    citation,
    onClose,
  }: {
    source: Source;
    citation: Citation;
    onClose: () => void;
  }) => {
    const relevancePercentage = Math.round(source.relevance);

    return (
      <div className="relative">
        <div className="absolute z-50 mt-2 w-80 rounded-lg border bg-popover p-4 shadow-lg">
          <div className="space-y-3">
            {/* Cabeçalho */}
            <div className="flex items-start justify-between">
              <h4 className="font-semibold text-sm leading-tight">
                {source.title}
              </h4>
              <button
                aria-label="Fechar"
                className="text-muted-foreground hover:text-foreground"
                onClick={onClose}
                type="button"
              >
                ×
              </button>
            </div>

            {/* Metadados */}
            <div className="space-y-2 text-xs">
              {source.author && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Autor:</span>
                  <span className="font-medium">{source.author}</span>
                </div>
              )}

              {source.date && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Data:</span>
                  <span>{new Date(source.date).toLocaleDateString()}</span>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Relevância:</span>
                  <span className="font-medium">{relevancePercentage}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Confiabilidade:</span>
                  <ReliabilityStars reliability={source.reliability} />
                </div>
              </div>
            </div>

            {/* Descrição */}
            {source.description && (
              <p className="line-clamp-3 text-muted-foreground text-xs">
                {source.description}
              </p>
            )}

            {/* Citação específica */}
            {citation.text && (
              <div className="rounded bg-muted/50 p-2">
                <p className="text-xs italic">"{citation.text}"</p>
                {citation.page && (
                  <span className="text-muted-foreground text-xs">
                    Página {citation.page}
                  </span>
                )}
              </div>
            )}

            {/* Link para fonte */}
            {source.url && (
              <a
                className="inline-flex items-center gap-1 text-blue-600 text-xs hover:text-blue-800 hover:underline"
                href={source.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                Ver fonte original
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }
);

SourcePopover.displayName = "SourcePopover";

// Componente principal de citações
const VizCitations = memo(
  ({
    citations,
    sources,
    onCitationClick,
    onSourceClick,
    showInline = true,
    showPopover = true,
    className,
    ...props
  }: CitationsProps & React.HTMLAttributes<HTMLDivElement>) => {
    const [activeCitation, setActiveCitation] = useState<string | null>(null);

    // Criar mapa de fontes para acesso rápido
    const sourcesMap = useMemo(() => {
      return sources.reduce(
        (acc, source) => {
          acc[source.id] = source;
          return acc;
        },
        {} as Record<string, Source>
      );
    }, [sources]);

    const handleCitationHover = useCallback(
      (citationId: string) => {
        if (showPopover) {
          setActiveCitation(citationId);
        }
      },
      [showPopover]
    );

    const handleCitationLeave = useCallback(() => {
      setActiveCitation(null);
    }, []);

    const handleCitationClick = useCallback(
      (citation: Citation) => {
        onCitationClick?.(citation);
        const source = sourcesMap[citation.sourceId];
        if (source) {
          onSourceClick?.(source);
        }
      },
      [onCitationClick, onSourceClick, sourcesMap]
    );

    // Renderizar citações inline no texto
    const renderInlineCitations = useCallback(
      (text: string) => {
        if (!showInline || citations.length === 0) {
          return text;
        }

        // Ordenar citações por posição (do fim para o início para não afetar posições)
        const sortedCitations = [...citations].sort(
          (a, b) => b.position - a.position
        );

        let result = text;

        for (const citation of sortedCitations) {
          const source = sourcesMap[citation.sourceId];
          if (!source) continue;

          const citationMarker = (
            <button
              aria-label={`Citação ${citation.id} de ${source.title}`}
              className="relative mr-1 ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-600 text-xs transition-colors hover:bg-blue-200"
              data-testid={`citation-${citation.id}`}
              key={citation.id}
              onClick={() => handleCitationClick(citation)}
              onMouseEnter={() => handleCitationHover(citation.id)}
              onMouseLeave={handleCitationLeave}
            >
              <span className="sr-only">Fonte: {source.title}</span>
              <Info className="h-3 w-3" />

              {/* Popover */}
              {activeCitation === citation.id && showPopover && (
                <SourcePopover
                  citation={citation}
                  onClose={() => setActiveCitation(null)}
                  source={source}
                />
              )}
            </button>
          );

          // Inserir a citação na posição correta
          const before = result.substring(0, citation.position);
          const after = result.substring(citation.position);
          result = before + citationMarker + after;
        }

        return result;
      },
      [
        citations,
        sourcesMap,
        showInline,
        activeCitation,
        showPopover,
        handleCitationHover,
        handleCitationLeave,
        handleCitationClick,
      ]
    );

    return (
      <div
        className={cn("relative", className)}
        data-testid="viz-citations"
        {...props}
      >
        {/* Renderizar conteúdo com citações inline */}
        <div className="prose prose-sm max-w-none">
          {renderInlineCitations("Conteúdo com citações será renderizado aqui")}
        </div>

        {/* Nota explicativa */}
        <div className="mt-4 text-muted-foreground text-xs">
          <p>
            Passe o mouse sobre os indicadores{" "}
            <Info className="inline h-3 w-3" /> para ver detalhes das fontes.
            Clique para acessar a fonte original.
          </p>
        </div>
      </div>
    );
  }
);

VizCitations.displayName = "VizCitations";

export default VizCitations;
