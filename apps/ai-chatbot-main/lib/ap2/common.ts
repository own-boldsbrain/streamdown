/**
 * AP2 - Tipos comuns para os agentes
 */

export type BaseOutputSchema = {
  status: "ok" | "error";
  agent: string;
  timestamp: string;
  reasoning_brief?: string;
  ui_hints?: {
    artifacts?: string[];
  };
}

export type ErrorResponse = BaseOutputSchema & {
  status: "error";
  error_code: string;
  message: string;
}

export type NatsEvent = {
  subject: string;
  data: any;
}

export type ValidateFunction = (input: any) => boolean;

export type ToolDefinition = {
  name: string;
  handler: (input: any) => Promise<any>;
}

export type AgentConfig = {
  slug: string;
  description: string;
  inputSchema: any;
  outputSchema: any;
  validateInput: ValidateFunction;
  validateOutput: ValidateFunction;
  tools: ToolDefinition[];
  natsSubjects: string[];
  uiDefaults?: {
    artifacts?: string[];
  };
}

export type AgentContext = {
  input: any;
  output: any;
  events: NatsEvent[];
  errors: any[];
  config: AgentConfig;
}