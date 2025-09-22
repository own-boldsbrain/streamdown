"use client";

import { useState } from "react";
import { VizCodeBlock } from "./viz-code-block";

const EXECUTION_DELAY_MS = 1000;
const FIBONACCI_INPUT = 10;
const FIBONACCI_RESULT = 55;
const FIBONACCI_FUNCTION_LINE = 1;
const FIBONACCI_BASE_CASE_LINE = 2;
const FIBONACCI_RECURSIVE_LINE = 3;
const FIBONACCI_CALL_LINE = 6;

const HIGHLIGHTED_JS_LINES = [
  FIBONACCI_FUNCTION_LINE,
  FIBONACCI_BASE_CASE_LINE,
  FIBONACCI_CALL_LINE,
];
const HIGHLIGHTED_PY_LINES = [
  FIBONACCI_FUNCTION_LINE,
  FIBONACCI_BASE_CASE_LINE,
  FIBONACCI_RECURSIVE_LINE,
  FIBONACCI_CALL_LINE,
];

const sampleCode = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(${FIBONACCI_INPUT})); // Should output ${FIBONACCI_RESULT}`;

const samplePythonCode = `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(${FIBONACCI_INPUT}))  # Should output ${FIBONACCI_RESULT}`;

export default function VizCodeBlockExample() {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  const handleExecute = async (
    code: string,
    language: string
  ): Promise<string> => {
    // Simulate code execution - in a real app, this would call an API
    await new Promise((resolve) => setTimeout(resolve, EXECUTION_DELAY_MS));

    if (
      language === "javascript" &&
      code.includes(`fibonacci(${FIBONACCI_INPUT})`)
    ) {
      return FIBONACCI_RESULT.toString();
    }

    return "Code executed successfully";
  };

  const handleLineClick = (lineNumber: number) => {
    setSelectedLine(lineNumber);
    // Log removed for production
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="font-bold text-2xl">VizCodeBlock Examples</h1>

      {/* Basic example with line highlighting */}
      <div>
        <h2 className="mb-4 font-semibold text-lg">Line Highlighting</h2>
        <VizCodeBlock
          code={sampleCode}
          highlightLines={HIGHLIGHTED_JS_LINES}
          language="javascript"
          showLineNumbers={true}
        />
      </div>

      {/* Line linking example */}
      <div>
        <h2 className="mb-4 font-semibold text-lg">Line Linking</h2>
        <p className="mb-2 text-muted-foreground text-sm">
          Click on any line to select it. Selected line:{" "}
          {selectedLine || "None"}
        </p>
        <VizCodeBlock
          code={sampleCode}
          enableLineLinking={true}
          language="javascript"
          onLineClick={handleLineClick}
          showLineNumbers={true}
        />
      </div>

      {/* Inline execution example */}
      <div>
        <h2 className="mb-4 font-semibold text-lg">Inline Execution</h2>
        <VizCodeBlock
          code={sampleCode}
          enableExecution={true}
          executeButtonText="Execute JS"
          language="javascript"
          onExecute={handleExecute}
        />
      </div>

      {/* Python example with all features */}
      <div>
        <h2 className="mb-4 font-semibold text-lg">Python with All Features</h2>
        <VizCodeBlock
          code={samplePythonCode}
          enableExecution={true}
          enableLineLinking={true}
          executeButtonText="Run Python"
          highlightLines={HIGHLIGHTED_PY_LINES}
          language="python"
          onExecute={handleExecute}
          onLineClick={handleLineClick}
          showLineNumbers={true}
        />
      </div>
    </div>
  );
}
