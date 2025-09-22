"use client";

import { CheckCircle, Code2, RefreshCw, XCircle } from "lucide-react";
import {
  type HTMLAttributes,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../utils";

// Constantes para dimensões e espaçamento
const ANIMATION_DURATION = 400; // Duração da animação em ms
const MIN_HEIGHT = 100; // Altura mínima para o componente de visualização
const MAX_HEIGHT = "60vh"; // Altura máxima para o container de JSON

// Classes CSS organizadas em objetos para evitar strings inline
const styles = {
  container: "bg-background border overflow-hidden relative rounded-md",
  header: "bg-muted/20 border-b flex items-center justify-between p-2",
  infoWrapper: "flex gap-2 items-center",
  titleText: "font-medium text-sm",
  resetButton: "hover:bg-muted px-2 py-1 rounded text-xs",
  jsonContainer: "font-mono overflow-auto p-4 text-sm whitespace-pre",
  transitionEffect: "duration-300 transition-colors",
  errorText: "text-red-500",
  waitingText: "italic text-muted-foreground",
  footer: "bg-muted/10 border-t p-2 text-muted-foreground text-xs",
  schemaCode: "bg-muted/20 mt-2 overflow-auto p-2 rounded",
};

// Interface para as propriedades do componente
interface VizObjectStreamProps<T = unknown>
  extends HTMLAttributes<HTMLDivElement> {
  // Objeto atual sendo construído (pode ser parcial durante o streaming)
  object?: T;
  // Esquema para validação (exibido como informação)
  schema?: string;
  // Se está carregando/recebendo dados
  isLoading?: boolean;
  // Função para reiniciar ou limpar o objeto
  onReset?: () => void;
  // Se deve mostrar os controles
  showControls?: boolean;
  // Se ocorreu algum erro na geração
  error?: Error | unknown;
  // Se já finalizou a geração
  isComplete?: boolean;
}

// Componente para exibir a visualização de um objeto JSON em streaming
export const VizObjectStream = memo(
  <T extends Record<string, unknown>>({
    object,
    schema,
    isLoading = false,
    onReset,
    showControls = true,
    error,
    isComplete = false,
    className,
    ...props
  }: VizObjectStreamProps<T>) => {
    const [formattedJson, setFormattedJson] = useState<string>("");
    const [hasAnimation, setHasAnimation] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Formata o objeto JSON para exibição
    const formatObject = useCallback((obj: T | undefined) => {
      if (!obj) {
        return "";
      }
      try {
        return JSON.stringify(obj, null, 2);
      } catch {
        return String(obj);
      }
    }, []);

    // Atualiza o JSON formatado quando o objeto muda
    useEffect(() => {
      const formatted = formatObject(object);
      setFormattedJson(formatted);

      // Adiciona animação apenas em alterações, não na primeira renderização
      if (formatted && containerRef.current) {
        setHasAnimation(true);

        // Remove a animação após a duração definida
        const timer = setTimeout(() => {
          setHasAnimation(false);
        }, ANIMATION_DURATION);

        return () => clearTimeout(timer);
      }
    }, [object, formatObject]);

    // Handler para o botão de reset
    const handleReset = useCallback(() => {
      if (onReset && typeof onReset === "function") {
        onReset();
      }
    }, [onReset]);

    // Renderiza o conteúdo do JSON
    const renderJsonContent = (): ReactNode => {
      if (error) {
        return (
          <div className={styles.errorText}>
            Erro: {error instanceof Error ? error.message : String(error)}
          </div>
        );
      }

      if (formattedJson) {
        return formattedJson;
      }

      return <div className={styles.waitingText}>Aguardando dados...</div>;
    };

    // Função para renderizar o ícone de status correto
    const renderStatusIcon = (): ReactNode => {
      if (isLoading) {
        return <RefreshCw className="animate-spin text-muted-foreground" size={14} />;
      }

      if (isComplete && !error) {
        return <CheckCircle className="text-green-500" size={14} />;
      }

      if (error) {
        return <XCircle className="text-red-500" size={14} />;
      }

      return null;
    };

    return (
      <div
        className={cn(styles.container, className)}
        data-min-height={MIN_HEIGHT}
        data-object-stream
        ref={containerRef}
        {...props}
      >
        {/* Cabeçalho com informações e controles */}
        {showControls && (
          <div className={styles.header}>
            <div className={styles.infoWrapper}>
              <Code2 className="text-muted-foreground" size={16} />
              <span className={styles.titleText}>
                Objeto JSON
                {isLoading && " (streaming...)"}
                {isComplete && " (completo)"}
              </span>

              {renderStatusIcon()}
            </div>

            <div className={styles.infoWrapper}>
              {onReset && (
                <button
                  aria-label="Reiniciar objeto"
                  className={styles.resetButton}
                  onClick={handleReset}
                  type="button"
                >
                  Reiniciar
                </button>
              )}
            </div>
          </div>
        )}

        {/* Exibição do JSON */}
        <div
          className={cn(
            styles.jsonContainer,
            styles.transitionEffect,
            hasAnimation && "bg-primary/5"
          )}
          data-max-height={MAX_HEIGHT}
        >
          {renderJsonContent()}
        </div>

        {/* Rodapé com informações do esquema */}
        {schema && (
          <div className={styles.footer}>
            <details>
              <summary className="cursor-pointer">Esquema de validação</summary>
              <pre className={styles.schemaCode}>{schema}</pre>
            </details>
          </div>
        )}
      </div>
    );
  }
);

VizObjectStream.displayName = "VizObjectStream";

// Componente wrapper para uso com o hook experimental_useObject
export const VizUseObject = memo(
  <T extends Record<string, unknown>, I = unknown>({
    useObjectResult,
    showSchema = true,
    ...props
  }: {
    useObjectResult: {
      object?: T;
      error?: Error | unknown;
      isLoading: boolean;
      submit: (input: I) => void;
      stop: () => void;
      clear: () => void;
    };
    showSchema?: boolean;
  } & Omit<
    VizObjectStreamProps<T>,
    "object" | "isLoading" | "error" | "onReset"
  >) => {
    const { object, error, isLoading, clear } = useObjectResult;
    const isComplete = !isLoading && !!object && !error;

    return (
      <VizObjectStream
        error={error}
        isComplete={isComplete}
        isLoading={isLoading}
        object={object}
        onReset={clear}
        {...props}
      />
    );
  }
);

VizUseObject.displayName = "VizUseObject";

// Exportação de tipos
export type { VizObjectStreamProps };
