/**
 * AP2 - Utilitários para validação e NATS
 */

import type { AgentContext, ErrorResponse, NatsEvent } from "./common";

/**
 * Gerador de timestamp ISO8601
 */
export const getTimestamp = () => new Date().toISOString();

/**
 * Validador básico para garantir que entradas sigam o schema
 * Na implementação real, usaríamos um validador de JSON Schema como Ajv
 */
export function validateSchema(data: any, schema: any): boolean {
  // Implementação simplificada
  // Em produção, usaria uma biblioteca de validação de schema como Ajv
  if (!data || typeof data !== "object") {
    return false;
  }
  
  // Verificar campos obrigatórios
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in data)) {
        return false;
      }
    }
  }
  
  // Verificar propriedades
  if (schema.properties) {
    for (const [key, propSchema] of Object.entries<any>(schema.properties)) {
      if (key in data) {
        // Verificação simplificada de tipo
        if (propSchema.type === "string" && typeof data[key] !== "string") {
          return false;
        }
        if (propSchema.type === "number" && typeof data[key] !== "number") {
          return false;
        }
        if (propSchema.type === "boolean" && typeof data[key] !== "boolean") {
          return false;
        }
        if (propSchema.type === "object" && (typeof data[key] !== "object" || Array.isArray(data[key]))) {
          return false;
        }
        if (propSchema.type === "array" && !Array.isArray(data[key])) {
          return false;
        }
      }
    }
  }
  
  return true;
}

/**
 * Publica um evento no barramento NATS
 * Em uma implementação real, isso conectaria a um servidor NATS
 */
export async function publishEvent(event: NatsEvent): Promise<void> {
  // Em produção, usaria um cliente NATS real
  console.log(`[NATS] Publicando em ${event.subject}:`, JSON.stringify(event.data));
  // Simular a publicação do evento (para desenvolvimento)
  await Promise.resolve();
}

/**
 * Cria uma resposta de erro padronizada
 */
export function createError(
  agent: string,
  errorCode: string,
  message: string
): ErrorResponse {
  return {
    status: "error",
    agent,
    timestamp: getTimestamp(),
    error_code: errorCode,
    message
  };
}

/**
 * Executa um agente com o contexto fornecido
 */
export async function executeAgent(context: AgentContext): Promise<any> {
  const { config, input } = context;
  
  // Validar entrada
  if (!config.validateInput(input)) {
    return createError(
      config.slug, 
      "INVALID_INPUT", 
      "A entrada não segue o schema esperado"
    );
  }
  
  try {
    // Executar todas as ferramentas do agente
    for (const tool of config.tools) {
      const result = await tool.handler(input);
      
      // Guardar o resultado no contexto para uso por outras ferramentas
      context.output = {
        ...context.output,
        ...result
      };
      
      // Adicionar evento NATS
      const natsSubject = config.natsSubjects.find(s => 
        s.includes(tool.name.split(".")[1])
      );
      
      if (natsSubject) {
        const event: NatsEvent = {
          subject: natsSubject,
          data: result
        };
        
        context.events.push(event);
        await publishEvent(event);
      }
    }
    
    // Validar saída
    const output = {
      status: "ok" as const,
      agent: config.slug,
      timestamp: getTimestamp(),
      ...context.output,
      ui_hints: {
        artifacts: config.uiDefaults?.artifacts || []
      }
    };
    
    if (!config.validateOutput(output)) {
      return createError(
        config.slug,
        "INVALID_OUTPUT",
        "A saída não segue o schema esperado"
      );
    }
    
    return output;
    
  } catch (error: unknown) {
    console.error(`Erro no agente ${config.slug}:`, error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return createError(
      config.slug,
      "EXECUTION_ERROR",
      `Erro ao executar o agente: ${errorMessage}`
    );
  }
}