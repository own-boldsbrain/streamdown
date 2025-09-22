"use client";

import {
  mockConnectionStates,
  mockErrors,
  mockKeyboardShortcuts,
  mockTraceEvents,
} from "@/lib/mock-data";

// Esta é uma versão simplificada para demo devido a incompatibilidades nos componentes
export default function LayerComponentsDemo() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 font-bold text-3xl">Demonstração de Dados Mock</h1>
      <p className="mb-4 text-muted-foreground">
        Os dados mock foram criados com sucesso e estão disponíveis para uso nos
        componentes. Esta página é uma representação simplificada dos dados
        disponíveis.
      </p>

      <div className="mb-10 rounded-lg border bg-card p-6">
        <h2 className="mb-4 font-semibold text-2xl">
          Dados Disponíveis para Testes
        </h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            Eventos de rastreamento para <code>CoreTracePanel</code>
          </li>
          <li>
            Logs de auditoria para <code>CoreAuditLogViewer</code>
          </li>
          <li>
            Estados de conexão para <code>CoreConnectionStatus</code>
          </li>
          <li>
            Mensagens de erro para <code>CoreErrorBanner</code>
          </li>
          <li>
            Erros frontend para <code>AnalyticsErrorTracker</code>
          </li>
          <li>
            Parâmetros de IA para <code>ParameterControls</code>
          </li>
          <li>
            Configurações de segurança para <code>SafetyToggles</code>
          </li>
          <li>
            Idiomas e traduções para <code>UILocalization</code>
          </li>
          <li>
            Atalhos de teclado para <code>UIKeyboardShortcuts</code>
          </li>
          <li>
            Configurações de privacidade para <code>UIPrivacyCenter</code>
          </li>
          <li>
            Configurações premium para <code>MonetizationPremiumSettings</code>
          </li>
        </ul>
      </div>

      <h2 className="mb-4 font-semibold text-2xl">Exemplo de Dados</h2>

      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-2 font-medium text-lg">Eventos de Rastreamento</h3>
          <pre className="max-h-60 overflow-auto rounded bg-muted p-2 text-xs">
            {JSON.stringify(mockTraceEvents, null, 2)}
          </pre>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-2 font-medium text-lg">Estados de Conexão</h3>
          <pre className="max-h-60 overflow-auto rounded bg-muted p-2 text-xs">
            {JSON.stringify(mockConnectionStates, null, 2)}
          </pre>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-2 font-medium text-lg">Mensagens de Erro</h3>
          <pre className="max-h-60 overflow-auto rounded bg-muted p-2 text-xs">
            {JSON.stringify(mockErrors, null, 2)}
          </pre>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-2 font-medium text-lg">Atalhos de Teclado</h3>
          <pre className="max-h-60 overflow-auto rounded bg-muted p-2 text-xs">
            {JSON.stringify(mockKeyboardShortcuts, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-10 rounded-lg border bg-yellow-50 p-4 dark:bg-yellow-950">
        <h3 className="mb-2 font-medium text-lg text-yellow-800 dark:text-yellow-300">
          Observações de Desenvolvimento
        </h3>
        <p className="text-yellow-700 dark:text-yellow-400">
          Os dados mock foram criados com sucesso e estão prontos para uso em
          testes visuais. Para usar esses dados nos componentes reais,
          importe-os de <code>@/lib/mock-data</code> e passe-os para os
          componentes adequados.
        </p>
      </div>
    </div>
  );
}
