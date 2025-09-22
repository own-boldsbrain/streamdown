"use client";

import { memo, useState } from "react";
import { VizUseObject } from "./viz-object-stream";

// Esquema Zod simulado
const mockSchema = `z.object({
  content: z.string(),
  results: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      score: z.number()
    })
  ),
  metadata: z.object({
    timestamp: z.string(),
    source: z.string()
  })
})`;

// Exemplo de objeto que simula o resultado do hook useObject
const createMockUseObject = () => {
  const [object, setObject] = useState<Record<string, unknown> | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  // Simulação de uma API que retorna um objeto parcial em streaming
  const mockGenerateObject = () => {
    setIsLoading(true);
    setError(undefined);

    // Objeto inicial vazio
    setObject({});

    // Simula o streaming adicionando propriedades progressivamente
    setTimeout(() => {
      setObject({ content: "Carregando dados..." });
    }, 500);

    setTimeout(() => {
      setObject({
        content: "Análise de dados do usuário",
        results: [],
      });
    }, 1500);

    setTimeout(() => {
      setObject({
        content: "Análise de dados do usuário",
        results: [{ id: 1, name: "Resultado 1", score: 0.92 }],
      });
    }, 2500);

    setTimeout(() => {
      setObject({
        content: "Análise de dados do usuário",
        results: [
          { id: 1, name: "Resultado 1", score: 0.92 },
          { id: 2, name: "Resultado 2", score: 0.87 },
        ],
      });
    }, 3500);

    setTimeout(() => {
      setObject({
        content: "Análise de dados do usuário",
        results: [
          { id: 1, name: "Resultado 1", score: 0.92 },
          { id: 2, name: "Resultado 2", score: 0.87 },
          { id: 3, name: "Resultado 3", score: 0.76 },
        ],
        metadata: {
          timestamp: new Date().toISOString(),
          source: "Simulação",
        },
      });

      setIsLoading(false);
    }, 4500);
  };

  // Simulação de erro
  const mockGenerateError = () => {
    setIsLoading(true);
    setError(undefined);
    setObject({});

    setTimeout(() => {
      setObject({ content: "Tentando processar..." });
    }, 500);

    setTimeout(() => {
      setError(new Error("Falha na geração do objeto: Timeout da API"));
      setIsLoading(false);
    }, 2000);
  };

  // Limpa o objeto
  const clear = () => {
    setObject(undefined);
    setError(undefined);
    setIsLoading(false);
  };

  // Retorna a mesma interface que o hook experimental_useObject
  return {
    object,
    error,
    isLoading,
    submit: mockGenerateObject,
    submitWithError: mockGenerateError,
    stop: () => setIsLoading(false),
    clear,
  };
};

// Exemplo de uso do componente VizUseObject
export const VizObjectStreamExample = memo(() => {
  const mockUseObject = createMockUseObject();

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-xl">Demonstração de Streaming de Objeto</h2>
      <p className="text-muted-foreground">
        Este exemplo demonstra a visualização de um objeto JSON que é recebido
        em streaming, similar ao comportamento do hook{" "}
        <code>experimental_useObject</code>.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          className="rounded bg-primary px-3 py-1.5 text-white hover:bg-primary/90"
          disabled={mockUseObject.isLoading}
          onClick={() => mockUseObject.submit()}
          type="button"
        >
          Gerar Objeto
        </button>

        <button
          className="rounded bg-destructive px-3 py-1.5 text-white hover:bg-destructive/90"
          disabled={mockUseObject.isLoading}
          onClick={() => mockUseObject.submitWithError()}
          type="button"
        >
          Simular Erro
        </button>

        <button
          className="rounded border px-3 py-1.5 hover:bg-muted"
          disabled={!(mockUseObject.object || mockUseObject.error)}
          onClick={() => mockUseObject.clear()}
          type="button"
        >
          Limpar
        </button>
      </div>

      <VizUseObject
        className="mt-4"
        schema={mockSchema}
        useObjectResult={mockUseObject}
      />
    </div>
  );
});

VizObjectStreamExample.displayName = "VizObjectStreamExample";
