# Infra: Modos de Operação de Banco (DB vs NO-DB)

O projeto suporta dois modos principais para desenvolvimento e pré-produção.

## 1. NO-DB Mode

Usado para desenvolvimento rápido de UI / fluxo de chat sem dependência de banco.

Variáveis relevantes:

```env
ALLOW_GUEST_NO_DB=1
ENABLE_GUEST_USER_FALLBACK=false
```

Características:

- `ALLOW_GUEST_NO_DB=1` força `getDb()` a retornar `null` e o provider `guest` faz early-return sem tocar no DB.
- Sessões guest recebem IDs sintéticos (`guest-<timestamp>`).
- Não há persistência de chats, mensagens ou usuários.

## 2. DB Mode (LibSQL / Turso / Postgres)

Quando `ALLOW_GUEST_NO_DB!=1` o código tenta inicializar o driver definido em `DB_DRIVER`.

LibSQL local (arquivo):

```env
DB_DRIVER=libsql
LIBSQL_URL=file:./dev.db
```

Turso remoto:

```env
DB_DRIVER=libsql
LIBSQL_URL=libsql://<db>-<org>.turso.io
LIBSQL_AUTH_TOKEN=<token>
```

Postgres (exemplo):

```env
DB_DRIVER=postgres
POSTGRES_URL=postgresql://user:pass@host:5432/dbname
```

## Migração mínima LibSQL

Executar:

```bash
pnpm migrate:libsql
```

Cria a tabela `User` se não existir.

## Fallbacks

- `ENABLE_GUEST_USER_FALLBACK=true` permite retornar usuários guest sintéticos em algumas operações mesmo com falha de DB.
- Recomenda-se manter `false` em pré-produção para detectar problemas reais.

## Rota de Saúde do Banco

Endpoint: `GET /api/health/db`

Resposta (exemplo):

```json
{
    "driver": "libsql",
    "allowGuestNoDb": false,
    "enableGuestFallback": false,
    "mode": "connected",
    "tables": ["User"],
    "timestamp": "2025-09-22T12:00:00.000Z"
}
```

Campos:

- `mode`: `no-db` | `connected` | `error`
- `tables`: lista detectada (heurística leve); vazia em NO-DB ou se introspecção falhar.

Uso rápido:

```bash
curl http://localhost:3000/api/health/db
```

## Fluxo Guest Credentials

1. Se `ALLOW_GUEST_NO_DB=1`: early-return em `auth.ts` cria perfil ephemeral.
2. Caso contrário: import dinâmico de `createGuestUser()` insere linha na tabela `User` (LibSQL) com fallback select.
3. Em erro e `ENABLE_GUEST_USER_FALLBACK=true`: gera guest sintético e loga aviso.

## Scripts Relevantes

```bash
pnpm dev                # modo padrão
pnpm dev:preprod        # usa .env.preprod.local se configurado
pnpm migrate:libsql     # aplica DDL mínima (User)
pnpm db:migrate         # pipeline Drizzle (quando expandido)
```

## Próximos Passos Sugeridos

- Expandir DDL (Chat, Message, Document, Vote) sob Drizzle.
- Adicionar testes e2e para NO-DB vs DB usando Playwright + seeds.
- Endpoint `/api/health/app` agregando versão, build hash, uptime.
- Observabilidade: integrar OpenTelemetry exporter condicional.

<!-- Removido H1 duplicado anterior para evitar múltiplos títulos principais -->
## AP2 - Auto Portal Photovoltaico: Blueprint Técnico

> **Versão 1.0** · Arquitetura baseada em agentes e fluxo de eventos · Protocolo: MCP · Mensageria: NATS · UI: Artifacts/AI SDK UI

## Arquitetura Geral

```mermaid
flowchart TB
    User(Usuário Final) -->|Interage| UI[Interface do Usuário\nAI SDK UI]
    
    subgraph "Sistema AP2"
        UI <-->|Streaming| Stream[Streaming Handler\nVercel AI SDK]
        Stream <-->|MCP Tools| Agents[Agentes AP2]
        Agents -->|Publica| NATS[Message Broker\nNATS]
        NATS -->|Notifica| Services[Serviços Especializados]
        Services -->|Atualiza| DB[(Banco de Dados)]
        Agents <-->|Consulta/Atualiza| DB
    end
    
    subgraph "Integrações Externas"
        Services <-->|APIs| External[Sistemas Externos\nConcessionárias, CCEE, etc.]
    end
    
    style User fill:#f9f9f9,stroke:#333,stroke-width:2px
    style UI fill:#d4f1f9,stroke:#333,stroke-width:2px
    style Stream fill:#d4f1f9,stroke:#333,stroke-width:2px
    style Agents fill:#e1d5e7,stroke:#333,stroke-width:2px
    style NATS fill:#ffe6cc,stroke:#333,stroke-width:2px
    style Services fill:#d5e8d4,stroke:#333,stroke-width:2px
    style DB fill:#f8cecc,stroke:#333,stroke-width:2px
    style External fill:#f9f9f9,stroke:#333,stroke-width:1px,stroke-dasharray: 5 5
```

## Fluxo da Jornada do Usuário

```mermaid
journey
    title Jornada do Usuário no AP2
    section Fase PRE
        Captação de Leads: 5: Lead Management
        Análise de Consumo: 4: Detection
        Análise Técnica/Financeira: 4: Analysis
        Dimensionamento: 5: Dimensioning
        Proposta Comercial: 5: Recommendation
    section Fase ONGOING
        Projeto Técnico: 4: Engineering
        Contratação: 5: Contract
        Homologação: 3: Homologation
        Cadeia de Suprimentos: 4: Supply Chain
        Instalação: 5: Installation
    section Fase POST
        Monitoramento: 4: OEM Monitoring
        Expansão: 3: Expansion
        Créditos de Carbono: 3: Carbon Credits
        Migração Mercado Livre: 3: ACL
```

## Arquitetura de Agentes

```mermaid
classDiagram
    class AgentBase {
        +slug: string
        +inputSchema: object
        +outputSchema: object
        +tools: Tool[]
        +natsSubjects: string[]
        +uiDefaults: object
        +validateInput()
        +validateOutput()
        +process()
    }
    
    AgentBase <|-- DetectionAgent
    AgentBase <|-- AnalysisAgent
    AgentBase <|-- DimensioningAgent
    AgentBase <|-- RecommendationAgent
    AgentBase <|-- LeadManagementAgent
    AgentBase <|-- EngineeringAgent
    AgentBase <|-- ContractAgent
    AgentBase <|-- HomologationAgent
    AgentBase <|-- SupplyChainAgent
    AgentBase <|-- InstallationAgent
    AgentBase <|-- OEMMonitoringAgent
    AgentBase <|-- ExpansionAgent
    AgentBase <|-- CarbonCreditsAgent
    AgentBase <|-- ACLAgent
    
    class Tool {
        +name: string
        +handler: Function
    }
    
    AgentBase "1" *-- "many" Tool : uses
```

## Estrutura de Mensageria

```mermaid
flowchart LR
    Agent[Agente AP2] -->|Publica| Subject[NATS Subject\nap2.&lt;fase&gt;.&lt;agente&gt;.&lt;evento&gt;.v1]
    
    subgraph "Consumidores"
        Subject -->|Subscrito| UI[Interface do Usuário]
        Subject -->|Subscrito| Logger[Sistema de Logs]
        Subject -->|Subscrito| Analytics[Analytics]
        Subject -->|Subscrito| OtherAgents[Outros Agentes]
    end
    
    style Agent fill:#e1d5e7,stroke:#333,stroke-width:2px
    style Subject fill:#ffe6cc,stroke:#333,stroke-width:2px
    style UI fill:#d4f1f9,stroke:#333,stroke-width:1px
    style Logger fill:#d5e8d4,stroke:#333,stroke-width:1px
    style Analytics fill:#d5e8d4,stroke:#333,stroke-width:1px
    style OtherAgents fill:#e1d5e7,stroke:#333,stroke-width:1px
```

## Fluxo de Processamento de Agente

```mermaid
sequenceDiagram
    participant U as Usuário
    participant UI as Interface
    participant A as Agente
    participant T as Tools (MCP)
    participant N as NATS
    
    U->>UI: Envia requisição
    UI->>A: Encaminha dados
    A->>A: Valida input (schema)
    A->>T: Executa ferramenta 1
    T-->>A: Retorna resultado 1
    A->>T: Executa ferramenta 2
    T-->>A: Retorna resultado 2
    A->>A: Monta resposta final
    A->>A: Valida output (schema)
    A->>N: Publica evento
    A->>UI: Retorna resposta
    UI->>U: Exibe resultado + artifacts
```

## Componentes de UI (Artifacts)

```mermaid
flowchart TD
    Response[Resposta do Agente] -->|ui_hints.artifacts| RenderUI[Renderização de UI]
    
    RenderUI --> AnomalyReport[AnomalyReport]
    RenderUI --> RiskGauge[RiskGauge]
    RenderUI --> ConsumptionValidation[ConsumptionValidation]
    RenderUI --> FinancingComparison[FinancingComparison]
    RenderUI --> OptimalSize[OptimalSize]
    RenderUI --> PanelLayout[PanelLayout]
    RenderUI --> Proposal[Proposal]
    RenderUI --> Calendar[Calendar]
    RenderUI --> PerformanceKPIs[PerformanceKPIs]
    
    style Response fill:#e1d5e7,stroke:#333,stroke-width:2px
    style RenderUI fill:#d4f1f9,stroke:#333,stroke-width:2px
    style AnomalyReport fill:#d5e8d4,stroke:#333,stroke-width:1px
    style RiskGauge fill:#d5e8d4,stroke:#333,stroke-width:1px
    style ConsumptionValidation fill:#d5e8d4,stroke:#333,stroke-width:1px
    style FinancingComparison fill:#d5e8d4,stroke:#333,stroke-width:1px
    style OptimalSize fill:#d5e8d4,stroke:#333,stroke-width:1px
    style PanelLayout fill:#d5e8d4,stroke:#333,stroke-width:1px
    style Proposal fill:#d5e8d4,stroke:#333,stroke-width:1px
    style Calendar fill:#d5e8d4,stroke:#333,stroke-width:1px
    style PerformanceKPIs fill:#d5e8d4,stroke:#333,stroke-width:1px
```

## Ciclo de Vida Completo do Sistema

```mermaid
stateDiagram-v2
    [*] --> LeadGeneration
    
    state "Fase PRE" as PRE {
        LeadGeneration --> DetectionAnalysis
        DetectionAnalysis --> TechnicalAnalysis
        TechnicalAnalysis --> Dimensioning
        Dimensioning --> Proposal
        Proposal --> ApprovalPRE
    }
    
    state "Fase ONGOING" as ONGOING {
        Engineering --> Contract
        Contract --> Homologation
        Homologation --> SupplyChain
        SupplyChain --> Installation
        Installation --> Commissioning
    }
    
    state "Fase POST" as POST {
        Monitoring --> Expansion
        Expansion --> CarbonCredits
        CarbonCredits --> ACLMigration
        ACLMigration --> [*]
    }
    
    ApprovalPRE --> Engineering
    Commissioning --> Monitoring
```

## Tecnologias Principais

- **Frontend**: Next.js, React, Vercel AI SDK, UI Components
- **Backend**: Node.js, MCP (Model Context Protocol)
- **Mensageria**: NATS
- **Persistência**: Postgres/MongoDB, Redis
- **Integração**: APIs RESTful, GraphQL
- **IA/ML**: LLMs, Análise Preditiva, Reconhecimento de Padrões

## Segurança e Compliance

- Conformidade com LGPD para dados pessoais
- Criptografia end-to-end para comunicações sensíveis
- Validação rigorosa via schemas (input/output)
- Auditoria de todas as operações
- Conformidade com Lei 14.300/2022 e Decreto 11.075/2022 (SINARE)
