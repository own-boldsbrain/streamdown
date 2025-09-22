"use client";

import { InfoIcon } from "lucide-react";
import {
  type HTMLAttributes,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../utils";

// Constantes para dimensões e espaçamento
const TOOLTIP_SPACING = 8; // Espaçamento em pixels entre o container e o tooltip
const TOOLTIP_MIN_WIDTH = 200; // Largura mínima do tooltip em pixels

// Interface para as propriedades do componente
interface VizMathLatexProps extends HTMLAttributes<HTMLDivElement> {
  formula: string;
  displayMode?: boolean;
  tooltip?: string;
  errorColor?: string;
  renderingOptions?: Record<string, unknown>;
}

// Estilos para o tooltip
const tooltipStyles = {
  tooltip:
    "absolute bg-background border max-w-xs p-2 rounded shadow-md text-sm z-50",
  icon: "inline-flex items-center ml-1 text-muted-foreground",
};

// Componente para exibir fórmulas LaTeX com tooltips explicativos
export const VizMathLatex = memo(
  ({
    formula,
    displayMode = false,
    tooltip,
    errorColor = "currentColor",
    renderingOptions = {},
    className,
    ...props
  }: VizMathLatexProps) => {
    const [renderedFormula, setRenderedFormula] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({
      bottom: 0,
      left: 0,
    });
    const tooltipRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLSpanElement>(null);

    // Renderiza a fórmula LaTeX usando KaTeX
    const renderFormula = useCallback(async () => {
      try {
        // Carrega o KaTeX dinamicamente
        const katex = (await import("katex")).default;

        const options = {
          displayMode,
          throwOnError: false,
          errorColor,
          ...renderingOptions,
        };

        // Renderiza a fórmula
        const html = katex.renderToString(formula, options);
        setRenderedFormula(html);
        setError(null);
      } catch (err) {
        // biome-ignore lint/complexity/noUselessCatch: "Repassamos o erro"
        throw err;
      }
    }, [formula, displayMode, errorColor, renderingOptions]);

    useEffect(() => {
      renderFormula().catch((err) => {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      });
    }, [renderFormula]);

    // Posiciona o tooltip
    useEffect(() => {
      if (showTooltip && tooltipRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();

        // Calcula posicionamento
        const bottom = containerRect.height + TOOLTIP_SPACING;
        const left = 0; // Alinhamos à esquerda para evitar problemas de posicionamento

        setTooltipPosition({ bottom, left });
      }
    }, [showTooltip]);

    // Handlers para tooltip
    const handleShowTooltip = useCallback(() => {
      if (tooltip) {
        setShowTooltip(true);
      }
    }, [tooltip]);

    const handleHideTooltip = useCallback(() => {
      setShowTooltip(false);
    }, []);

    // Utilizamos um span que é semanticamente correto para conteúdo inline
    return (
      <span
        className={cn(
          "relative inline-block",
          displayMode ? "my-4 block" : "mx-1",
          tooltip ? "cursor-help" : "cursor-default",
          className
        )}
        data-display-mode={displayMode}
        data-math-latex
        onMouseEnter={handleShowTooltip}
        onMouseLeave={handleHideTooltip}
        ref={containerRef}
        {...props}
      >
        {error ? (
          <span className="text-red-500">Erro: {error}</span>
        ) : (
          // biome-ignore lint/security/noDangerouslySetInnerHtml: "Este é um uso seguro porque o KaTeX sanitiza a entrada"
          <span dangerouslySetInnerHTML={{ __html: renderedFormula }} />
        )}

        {tooltip && (
          <>
            <span className={tooltipStyles.icon}>
              <InfoIcon size={14} />
            </span>

            {showTooltip && (
              <div
                className={tooltipStyles.tooltip}
                ref={tooltipRef}
                role="tooltip"
                style={{
                  bottom: `${tooltipPosition.bottom}px`,
                  left: `${tooltipPosition.left}px`,
                  minWidth: `${TOOLTIP_MIN_WIDTH}px`,
                }}
              >
                {tooltip}
              </div>
            )}
          </>
        )}
      </span>
    );
  }
);

VizMathLatex.displayName = "VizMathLatex";

// Componente para exibir fórmulas inline ($...$)
export const VizMathLatexInline = memo(
  (props: Omit<VizMathLatexProps, "displayMode">) => (
    <VizMathLatex {...props} displayMode={false} />
  )
);

VizMathLatexInline.displayName = "VizMathLatexInline";

// Componente para exibir fórmulas em bloco ($$...$$)
export const VizMathLatexBlock = memo(
  (props: Omit<VizMathLatexProps, "displayMode">) => (
    <VizMathLatex {...props} displayMode={true} />
  )
);

VizMathLatexBlock.displayName = "VizMathLatexBlock";
