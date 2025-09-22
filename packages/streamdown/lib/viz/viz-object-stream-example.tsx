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
    }, 500);
    
    setTimeout(() => {
      setObject({
        content: "Análise de dados do usuário",
        results: []
      });
    }, 1500);
    
    setTimeout(() => {
      setObject({
        content: "Análise de dados do usuário",
        results: [
          { id: 1, name: "Resultado 1", score: 0.92 }
        ]
      });
    }, 2500);
    
    setTimeout(() => {
      setObject({
        content: "Análise de dados do usuário",
        results: [
          { id: 1, name: "Resultado 1", score: 0.92 },
          { id: 2, name: "Resultado 2", score: 0.87 }
        ]
      });
    }, 3500);
    
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
    clear
  };
};

// Exemplo de uso do componente VizUseObject
export const VizObjectStreamExample = memo(() => {
  const mockUseObject = createMockUseObject();
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Demonstração de Streaming de Objeto</h2>
      <p className="text-muted-foreground">
        Este exemplo demonstra a visualização de um objeto JSON que é recebido em streaming,
        similar ao comportamento do hook <code>experimental_useObject</code>.
      </p>
      
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="px-3 py-1.5 bg-primary text-white rounded hover:bg-primary/90"
          onClick={() => mockUseObject.submit()}
          disabled={mockUseObject.isLoading}
        >
          Gerar Objeto
        </button>
        
        <button
          type="button"
          className="px-3 py-1.5 bg-destructive text-white rounded hover:bg-destructive/90"
          onClick={() => mockUseObject.submitWithError()}
          disabled={mockUseObject.isLoading}
        >
          Simular Erro
        </button>
        
        <button
          type="button"
          className="px-3 py-1.5 border rounded hover:bg-muted"
          onClick={() => mockUseObject.clear()}
          disabled={!mockUseObject.object && !mockUseObject.error}
        >
          Limpar
        </button>
      </div>
      
      <VizUseObject
        useObjectResult={mockUseObject}
        schema={mockSchema}
        className="mt-4"
      />
    </div>
  );
});

VizObjectStreamExample.displayName = "VizObjectStreamExample";