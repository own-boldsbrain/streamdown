"use client";

import type { HTMLAttributes } from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../utils";

// Constantes para configuração e renderização
const DEFAULT_THEME = "default";
const RENDER_TIMEOUT = 50;
const ERROR_BG_COLOR = "rgba(255, 0, 0, 0.05)";
const DIAGRAM_SCALE = 1;
const RANDOM_ID_BASE = 36;
const RANDOM_ID_START = 2;
const RANDOM_ID_LENGTH = 11;

// Classes CSS personalizadas
const errorClasses = {
  container: "rounded-md p-4 text-red-500 text-sm w-full",
  preMain: "mt-2 overflow-x-auto whitespace-pre-wrap",
  preCode:
    "border-dashed border-red-200 border-t mt-4 overflow-x-auto pt-4 text-red-400 text-xs whitespace-pre-wrap",
};

const diagramClasses = {
  mermaidContainer: "mermaid-diagram max-w-full",
  svgContainer: "flex justify-center",
  loadingContainer: "flex h-32 items-center justify-center w-full",
  loadingSpinner:
    "animate-spin border-2 border-primary border-t-transparent h-6 rounded-full w-6",
};

const captionClasses = "mt-2 text-center text-muted-foreground text-sm";

// Interface para as propriedades do componente
interface VizMermaidDiagramProps extends HTMLAttributes<HTMLDivElement> {
  code: string;
  theme?: "default" | "dark" | "neutral" | "forest";
  caption?: string;
  maxWidth?: number;
}

const VizMermaidDiagram = memo(
  ({
    code,
    theme = DEFAULT_THEME,
    caption,
    maxWidth,
    className,
    ...props
  }: VizMermaidDiagramProps) => {
    const [svg, setSvg] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const renderIdRef = useRef<string>(
      `mermaid-${Math.random().toString(RANDOM_ID_BASE).substring(RANDOM_ID_START, RANDOM_ID_LENGTH)}`
    );

    // Função para renderizar o diagrama Mermaid
    const renderDiagram = useCallback(async () => {
      if (!code.trim()) {
        setError("Código de diagrama vazio");
        return;
      }

      try {
        // Carrega a biblioteca Mermaid dinamicamente
        const mermaid = (await import("mermaid")).default;

        // Inicializa com as configurações
        mermaid.initialize({
          startOnLoad: false,
          theme,
          securityLevel: "strict",
          fontFamily: "inherit",
        });

        // Limpa erros anteriores
        setError(null);

        // Renderiza o diagrama após um pequeno delay para garantir que o DOM está pronto
        setTimeout(async () => {
          try {
            const { svg: renderedSvg } = await mermaid.render(
              renderIdRef.current,
              code
            );
            setSvg(renderedSvg);
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : "Erro ao renderizar o diagrama"
            );
          }
        }, RENDER_TIMEOUT);
      } catch (err) {
        setError(
          err instanceof Error
            ? `Erro ao carregar Mermaid: ${err.message}`
            : "Erro desconhecido ao carregar Mermaid"
        );
      }
    }, [code, theme]);

    // Renderiza o diagrama quando o código ou tema mudam
    useEffect(() => {
      renderDiagram();
    }, [renderDiagram]);

    return (
      <div
        className={cn(
          "flex flex-col items-center overflow-x-auto rounded-md border bg-background p-4",
          className
        )}
        data-testid="viz-mermaid-diagram"
        ref={containerRef}
        {...props}
      >
        {error ? (
          <div className={errorClasses.container}>
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-950/10">
              <p className="font-medium">Erro ao renderizar o diagrama:</p>
              <pre className={errorClasses.preMain}>{error}</pre>
              <pre className={errorClasses.preCode}>{code}</pre>
            </div>
          </div>
        ) : (
          <div className={diagramClasses.mermaidContainer}>
            {svg ? (
              <div
                className={diagramClasses.svgContainer}
                // biome-ignore lint/security/noDangerouslySetInnerHtml: "SVG seguro gerado pelo Mermaid"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            ) : (
              <div className={diagramClasses.loadingContainer}>
                <div className={diagramClasses.loadingSpinner} />
              </div>
            )}
          </div>
        )}

        {caption && <div className={captionClasses}>{caption}</div>}

        {maxWidth && (
          <style jsx>{`
            .mermaid-diagram {
              max-width: ${maxWidth}px;
            }
            .mermaid-diagram svg {
              transform: scale(${DIAGRAM_SCALE});
            }
          `}</style>
        )}
      </div>
    );
  }
);

VizMermaidDiagram.displayName = "VizMermaidDiagram";

export default VizMermaidDiagram;
