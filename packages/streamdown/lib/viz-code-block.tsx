"use client";

import { PlayIcon, TerminalIcon } from "lucide-react";
import {
  type ComponentProps,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { BundledLanguage } from "shiki";
import { CodeBlock } from "./code-block";
import { cn } from "./utils";

const LINE_NUMBER_PADDING = 3;

export interface VizCodeBlockProps extends ComponentProps<typeof CodeBlock> {
  /** Enable line highlighting */
  highlightLines?: number[];
  /** Enable line linking */
  enableLineLinking?: boolean;
  /** Enable inline execution */
  enableExecution?: boolean;
  /** Callback when a line is clicked */
  onLineClick?: (lineNumber: number, content: string) => void;
  /** Callback when execution is requested */
  onExecute?: (code: string, language: BundledLanguage) => Promise<string>;
  /** Show line numbers */
  showLineNumbers?: boolean;
  /** Custom execution button text */
  executeButtonText?: string;
}

type ExecutionResult = {
  output: string;
  error?: string;
  isRunning: boolean;
};

export const VizCodeBlock = memo<VizCodeBlockProps>(
  ({
    code,
    language,
    highlightLines = [],
    enableLineLinking = false,
    enableExecution = false,
    onLineClick,
    onExecute,
    showLineNumbers = false,
    executeButtonText = "Run",
    className,
    children,
    ...props
  }) => {
    const [executionResult, setExecutionResult] = useState<ExecutionResult>({
      output: "",
      isRunning: false,
    });
    const [selectedLine, setSelectedLine] = useState<number | null>(null);
    const codeRef = useRef<HTMLDivElement>(null);

    const handleExecute = useCallback(async () => {
      if (!onExecute) {
        return;
      }

      setExecutionResult({ output: "", isRunning: true, error: undefined });

      try {
        const result = await onExecute(code, language);
        setExecutionResult({
          output: result,
          isRunning: false,
        });
      } catch (error) {
        setExecutionResult({
          output: "",
          error: error instanceof Error ? error.message : "Execution failed",
          isRunning: false,
        });
      }
    }, [code, language, onExecute]);

    const handleLineClick = useCallback(
      (lineNumber: number, content: string) => {
        if (enableLineLinking) {
          setSelectedLine(selectedLine === lineNumber ? null : lineNumber);
        }
        onLineClick?.(lineNumber, content);
      },
      [enableLineLinking, selectedLine, onLineClick]
    );

    // Process code with line highlighting and linking
    const processedCode = useMemo(() => {
      if (
        !showLineNumbers &&
        highlightLines.length === 0 &&
        !enableLineLinking
      ) {
        return code;
      }

      const lines = code.split("\n");
      return lines
        .map((line: string, index: number) => {
          const lineNumber = index + 1;
          const isHighlighted = highlightLines.includes(lineNumber);
          const isSelected = selectedLine === lineNumber;

          let processedLine = line;

          if (showLineNumbers) {
            processedLine = `${lineNumber.toString().padStart(LINE_NUMBER_PADDING, " ")} | ${line}`;
          }

          if (isHighlighted || isSelected) {
            const spanClassName = cn(
              "block w-full",
              isHighlighted && "bg-yellow-200 dark:bg-yellow-900/30",
              isSelected && "bg-blue-200 dark:bg-blue-900/30"
            );
            return `<span class="${spanClassName}" data-line="${lineNumber}">${processedLine}</span>`;
          }

          if (enableLineLinking) {
            return `<span class="block w-full cursor-pointer hover:bg-muted/50" data-line="${lineNumber}">${processedLine}</span>`;
          }

          return `<span class="block w-full">${processedLine}</span>`;
        })
        .join("\n");
    }, [
      code,
      highlightLines,
      selectedLine,
      showLineNumbers,
      enableLineLinking,
    ]);

    // Handle click events on code lines
    useEffect(() => {
      const hasLineInteraction = enableLineLinking || onLineClick;
      if (!hasLineInteraction) {
        return;
      }

      const handleClick = (event: Event) => {
        const target = event.target as HTMLElement;
        const lineElement = target.closest("[data-line]") as HTMLElement;

        if (lineElement) {
          const lineNumber = Number.parseInt(
            lineElement.dataset.line || "0",
            10
          );
          const lines = code.split("\n");
          const content = lines[lineNumber - 1] || "";

          if (lineNumber > 0) {
            handleLineClick(lineNumber, content);
          }
        }
      };

      const codeElement = codeRef.current?.querySelector("[data-code-block]");
      if (codeElement) {
        codeElement.addEventListener("click", handleClick);
        return () => codeElement.removeEventListener("click", handleClick);
      }
    }, [code, enableLineLinking, handleLineClick, onLineClick]);

    return (
      <div className={cn("relative", className)}>
        <CodeBlock
          className={cn(
            "cursor-pointer",
            enableLineLinking && "cursor-pointer",
            className
          )}
          code={processedCode}
          language={language}
          {...props}
        >
          {/* Enhanced controls */}
          <div className="flex items-center gap-1">
            {enableExecution && (
              <button
                className={cn(
                  "flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors",
                  "bg-green-600 text-white hover:bg-green-700",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
                disabled={executionResult.isRunning}
                onClick={handleExecute}
                title={executeButtonText}
                type="button"
              >
                {executionResult.isRunning ? (
                  <TerminalIcon className="animate-spin" size={12} />
                ) : (
                  <PlayIcon size={12} />
                )}
                {executeButtonText}
              </button>
            )}
            {children}
          </div>
        </CodeBlock>

        {/* Execution output */}
        {enableExecution &&
          (executionResult.output || executionResult.error) && (
            <div className="mt-2 rounded-lg border bg-muted/30 p-3">
              <div className="mb-2 flex items-center gap-2 font-medium text-muted-foreground text-xs">
                <TerminalIcon size={12} />
                Output
              </div>
              <pre
                className={cn(
                  "whitespace-pre-wrap break-all font-mono text-xs",
                  executionResult.error && "text-red-600 dark:text-red-400"
                )}
              >
                {executionResult.error || executionResult.output}
              </pre>
            </div>
          )}

        {/* Line linking info */}
        {enableLineLinking && selectedLine && (
          <div className="mt-2 text-muted-foreground text-xs">
            Line {selectedLine} selected - Click again to deselect
          </div>
        )}
      </div>
    );
  }
);

VizCodeBlock.displayName = "VizCodeBlock";
