"use client";

import { memo, useState } from "react";
import { VizUseObject } from "./viz-object-stream";

// Constantes para tempos de simulação
const DELAY = {
  INITIAL: 500,
  STEP_1: 1000,
  STEP_2: 1000,
  STEP_3: 1000,
  STEP_4: 1000,
  ERROR: 2000,
};

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
  const [object, setObject] = useState<Record<string, unknown> | undefined>(undefined);
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
    }, DELAY.INITIAL);
    
    setTimeout(() => {
      setObject({
        content: "Análise de dados do usuário",
        results: []
      });
    }, DELAY.INITIAL + DELAY.STEP_1);
    
    setTimeout(() => {
      setObject({
        content: "Análise de dados do usuário",
        results: [
          { id: 1, name: "Resultado 1", score: 0.92 }
        ]
      });
    }, DELAY.INITIAL + DELAY.STEP_1 + DELAY.STEP_2);
    
    setTimeout(() => {
      setObject({
        content: "Análise de dados do usuário",
        results: [
          { id: 1, name: "Resultado 1", score: 0.92 },
          { id: 2, name: "Resultado 2", score: 0.87 }
        ]
      });
    }, DELAY.INITIAL + DELAY.STEP_1 + DELAY.STEP_2 + DELAY.STEP_3);
    
    setTimeout(() => {
      setObject({
        content: "Análise de dados do usuário",
        results: [
          { id: 1, name: "Resultado 1", score: 0.92 },
          { id: 2, name: "Resultado 2", score: 0.87 },
          { id: 3, name: "Resultado 3", score: 0.76 }
        ],
        metadata: {
          timestamp: new Date().toISOString(),
          source: "Simulação"
        }
      });
      setIsLoading(false);
    }, DELAY.INITIAL + DELAY.STEP_1 + DELAY.STEP_2 + DELAY.STEP_3 + DELAY.STEP_4);
  };
  
  // Simulação de erro
  const mockGenerateError = () => {
    setIsLoading(true);
    setError(undefined);
    setObject({});
    
    setTimeout(() => {
      setObject({ content: "Tentando processar..." });
    }, DELAY.INITIAL);
    
    setTimeout(() => {
      setError(new Error("Falha na geração do objeto: Timeout da API"));
      setIsLoading(false);
    }, DELAY.INITIAL + DELAY.ERROR);
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
    clear
  };
};

// Exemplo de uso do componente VizUseObject
export const VizObjectStreamExample = memo(() => {
  const mockUseObject = createMockUseObject();
  const hasContent = !!(mockUseObject.object || mockUseObject.error);
  
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
          disabled={!hasContent}
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