"use client";

import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Star,
  StarHalf,
  StarOff,
} from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import type {
  Source,
  SourceFilter,
  SourceSort,
  SourcesListProps,
} from "../types";
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

// Componente para barra de filtros
const FilterBar = memo(
  ({
    filter,
    onFilterChange,
    sort,
    onSortChange,
  }: {
    filter: SourceFilter;
    onFilterChange: (filter: SourceFilter) => void;
    sort: SourceSort;
    onSortChange: (sort: SourceSort) => void;
  }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = useCallback(
      (value: string) => {
        setSearchTerm(value);
        onFilterChange({ ...filter, author: value || undefined });
      },
      [filter, onFilterChange]
    );

    const handleReliabilityFilter = useCallback(
      (reliability: Source["reliability"]) => {
        const currentReliabilities = filter.reliability || [];
        const newReliabilities = currentReliabilities.includes(reliability)
          ? currentReliabilities.filter((r) => r !== reliability)
          : [...currentReliabilities, reliability];

        onFilterChange({
          ...filter,
          reliability:
            newReliabilities.length > 0 ? newReliabilities : undefined,
        });
      },
      [filter, onFilterChange]
    );

    const handleSortChange = useCallback(
      (field: SourceSort["field"]) => {
        const newDirection =
          sort.field === field && sort.direction === "asc" ? "desc" : "asc";
        onSortChange({ field, direction: newDirection });
      },
      [sort, onSortChange]
    );

    return (
      <div className="border-b bg-muted/30 p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Barra de pesquisa */}
          <div className="relative max-w-sm flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full rounded-md border bg-background py-2 pr-3 pl-9 text-sm"
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar por autor..."
              type="text"
              value={searchTerm}
            />
          </div>

          {/* Filtros de confiabilidade */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">Confiabilidade:</span>
            {(["high", "medium", "low"] as const).map((reliability) => (
              <button
                className={cn(
                  "rounded px-2 py-1 font-medium text-xs transition-colors",
                  filter.reliability?.includes(reliability)
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
                key={reliability}
                onClick={() => handleReliabilityFilter(reliability)}
                type="button"
              >
                {reliability === "high" && "Alta"}
                {reliability === "medium" && "Média"}
                {reliability === "low" && "Baixa"}
              </button>
            ))}
          </div>

          {/* Ordenação */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">Ordenar:</span>
            {[
              { field: "title" as const, label: "Título" },
              { field: "author" as const, label: "Autor" },
              { field: "date" as const, label: "Data" },
              { field: "relevance" as const, label: "Relevância" },
              { field: "reliability" as const, label: "Confiabilidade" },
            ].map(({ field, label }) => (
              <button
                className={cn(
                  "flex items-center gap-1 rounded px-2 py-1 font-medium text-xs transition-colors",
                  sort.field === field
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
                key={field}
                onClick={() => handleSortChange(field)}
                type="button"
              >
                {label}
                {sort.field === field &&
                  (sort.direction === "asc" ? (
                    <SortAsc className="h-3 w-3" />
                  ) : (
                    <SortDesc className="h-3 w-3" />
                  ))}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

FilterBar.displayName = "FilterBar";

// Componente para item da fonte
const SourceItem = memo(
  ({
    source,
    onClick,
    showMetadata = true,
    showRelevance = true,
    showReliability = true,
  }: {
    source: Source;
    onClick?: (source: Source) => void;
    showMetadata?: boolean;
    showRelevance?: boolean;
    showReliability?: boolean;
  }) => {
    const relevancePercentage = Math.round(source.relevance);
    const citationCount = source.citations.length;

    return (
      <div
        className="cursor-pointer rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
        onClick={() => onClick?.(source)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.(source);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* Título e link */}
            <div className="flex items-start gap-2">
              <h4 className="flex-1 font-semibold text-sm leading-tight">
                {source.title}
              </h4>
              {source.url && (
                <a
                  className="text-muted-foreground transition-colors hover:text-blue-600"
                  href={source.url}
                  onClick={(e) => e.stopPropagation()}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            {/* Metadados */}
            {showMetadata && (
              <div className="mt-2 space-y-1 text-muted-foreground text-xs">
                {source.author && (
                  <div>
                    Autor:{" "}
                    <span className="font-medium text-foreground">
                      {source.author}
                    </span>
                  </div>
                )}
                {source.date && (
                  <div>
                    Data:{" "}
                    <span className="font-medium text-foreground">
                      {new Date(source.date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div>
                  Citações:{" "}
                  <span className="font-medium text-foreground">
                    {citationCount}
                  </span>
                </div>
              </div>
            )}

            {/* Descrição */}
            {source.description && (
              <p className="mt-2 line-clamp-2 text-muted-foreground text-xs">
                {source.description}
              </p>
            )}
          </div>

          {/* Indicadores */}
          <div className="flex flex-col items-end gap-2">
            {showRelevance && (
              <div className="text-right">
                <div className="font-medium text-green-600 text-xs">
                  {relevancePercentage}%
                </div>
                <div className="text-muted-foreground text-xs">relevante</div>
              </div>
            )}

            {showReliability && (
              <ReliabilityStars reliability={source.reliability} />
            )}
          </div>
        </div>
      </div>
    );
  }
);

SourceItem.displayName = "SourceItem";

// Componente principal da lista de fontes
const VizSourcesList = memo(
  ({
    sources,
    expanded = false,
    onToggle,
    onSourceClick,
    onFilter,
    onSort,
    showMetadata = true,
    showRelevance = true,
    showReliability = true,
    className,
    ...props
  }: SourcesListProps & React.HTMLAttributes<HTMLDivElement>) => {
    const [internalExpanded, setInternalExpanded] = useState(expanded);
    const [filter, setFilter] = useState<SourceFilter>({});
    const [sort, setSort] = useState<SourceSort>({
      field: "relevance",
      direction: "desc",
    });

    const isExpanded = onToggle ? expanded : internalExpanded;

    const handleToggle = useCallback(() => {
      if (onToggle) {
        onToggle();
      } else {
        setInternalExpanded(!internalExpanded);
      }
    }, [onToggle, internalExpanded]);

    const handleFilterChange = useCallback(
      (newFilter: SourceFilter) => {
        setFilter(newFilter);
        onFilter?.(newFilter);
      },
      [onFilter]
    );

    const handleSortChange = useCallback(
      (newSort: SourceSort) => {
        setSort(newSort);
        onSort?.(newSort);
      },
      [onSort]
    );

    // Filtrar e ordenar fontes
    const filteredAndSortedSources = useMemo(() => {
      const filtered = sources.filter((source) => {
        // Filtro por autor
        if (
          filter.author &&
          !source.author?.toLowerCase().includes(filter.author.toLowerCase())
        ) {
          return false;
        }

        // Filtro por confiabilidade
        if (
          filter.reliability &&
          filter.reliability.length > 0 &&
          !filter.reliability.includes(source.reliability)
        ) {
          return false;
        }

        // Filtro por relevância
        if (
          filter.relevanceMin !== undefined &&
          source.relevance < filter.relevanceMin
        ) {
          return false;
        }
        if (
          filter.relevanceMax !== undefined &&
          source.relevance > filter.relevanceMax
        ) {
          return false;
        }

        // Filtro por data
        if (
          filter.dateFrom &&
          source.date &&
          new Date(source.date) < new Date(filter.dateFrom)
        ) {
          return false;
        }
        if (
          filter.dateTo &&
          source.date &&
          new Date(source.date) > new Date(filter.dateTo)
        ) {
          return false;
        }

        return true;
      });

      // Ordenação
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sort.field) {
          case "title":
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case "author":
            aValue = a.author?.toLowerCase() || "";
            bValue = b.author?.toLowerCase() || "";
            break;
          case "date":
            aValue = a.date ? new Date(a.date).getTime() : 0;
            bValue = b.date ? new Date(b.date).getTime() : 0;
            break;
          case "relevance":
            aValue = a.relevance;
            bValue = b.relevance;
            break;
          case "reliability": {
            const reliabilityOrder = { high: 3, medium: 2, low: 1, unknown: 0 };
            aValue = reliabilityOrder[a.reliability];
            bValue = reliabilityOrder[b.reliability];
            break;
          }
          default:
            return 0;
        }

        if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
        return 0;
      });

      return filtered;
    }, [sources, filter, sort]);

    return (
      <div
        className={cn("rounded-lg border bg-background", className)}
        data-testid="viz-sources-list"
        {...props}
      >
        {/* Cabeçalho */}
        <div
          className="flex cursor-pointer items-center justify-between p-4 hover:bg-accent/50"
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggle();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Fontes ({sources.length})</h3>
            {filteredAndSortedSources.length !== sources.length && (
              <span className="text-muted-foreground text-sm">
                ({filteredAndSortedSources.length} filtradas)
              </span>
            )}
          </div>
          <button
            className="text-muted-foreground transition-colors hover:text-foreground"
            type="button"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Conteúdo expansível */}
        {isExpanded && (
          <>
            {/* Barra de filtros */}
            <FilterBar
              filter={filter}
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              sort={sort}
            />

            {/* Lista de fontes */}
            <div className="max-h-96 overflow-y-auto p-3">
              {filteredAndSortedSources.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <p>Nenhuma fonte encontrada com os filtros aplicados.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAndSortedSources.map((source) => (
                    <SourceItem
                      key={source.id}
                      onClick={onSourceClick}
                      showMetadata={showMetadata}
                      showRelevance={showRelevance}
                      showReliability={showReliability}
                      source={source}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
);

VizSourcesList.displayName = "VizSourcesList";

export default VizSourcesList;
