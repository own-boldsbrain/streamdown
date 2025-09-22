"use client";

import { useState } from "react";
import { AnalyticsErrorTracker } from "@/components/analytics-error-tracker";
import { CoreAuditLogViewer } from "@/components/core-audit-log-viewer";
import { CoreConnectionStatus } from "@/components/core-connection-status";
import { CoreErrorBanner } from "@/components/core-error-banner";
import { CoreTracePanel } from "@/components/core-trace-panel";
import { MonetizationPremiumSettings } from "@/components/monetization-premium-settings";
import { MonetizationPremiumSupport } from "@/components/monetization-premium-support";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UIKeyboardShortcuts } from "@/components/ui-keyboard-shortcuts";
import { UILocalization } from "@/components/ui-localization";
import { ParameterControls } from "@/components/ui-parameter-controls";
import { UIPrivacyCenter } from "@/components/ui-privacy-center";
import { SafetyToggles } from "@/components/ui-safety-toggles";
import { ScreenReaderRegion } from "@/components/ui-screen-reader-region";
import { UIThemeSwitcher } from "@/components/ui-theme-switcher";
import {
  mockAIParameters,
  mockAuditLogs,
  mockConnectionStates,
  mockErrors,
  mockFrontendErrors,
  mockKeyboardShortcuts,
  mockLocales,
  mockPremiumSettings,
  mockPrivacySettings,
  mockSafetySettings,
  mockTraceEvents,
  mockTranslations,
} from "@/lib/mock-data";

export default function LayerComponentsDemo() {
  const [connectionState, setConnectionState] = useState<{
    status: "connected" | "connecting" | "disconnected" | "error";
    latency: number | null;
  }>(mockConnectionStates[0] as any);
  const [currentError, setCurrentError] = useState<Error>({
    message: mockErrors[0].message,
  } as Error);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<string>("");

  // Função para demonstrar a mudança de estado da conexão
  const cycleConnectionState = () => {
    const currentIndex = mockConnectionStates.findIndex(
      (state) =>
        state.status === connectionState.status &&
        state.latency === connectionState.latency
    );
    const nextIndex = (currentIndex + 1) % mockConnectionStates.length;
    setConnectionState(mockConnectionStates[nextIndex]);
  };

  // Função para demonstrar a mudança de erros
  const cycleError = () => {
    const nextIndex =
      (mockErrors.findIndex((err) => err.message === currentError.message) +
        1) %
      mockErrors.length;
    setCurrentError({ message: mockErrors[nextIndex].message } as Error);
  };

  // Função para adicionar anúncios ao leitor de tela
  const updateAnnouncement = () => {
    const announcements = [
      "Nova mensagem recebida",
      "Processando sua solicitação",
      "Conteúdo atualizado",
      "Erro encontrado na solicitação",
      "Carregamento concluído",
    ];
    const randomAnnouncement =
      announcements[Math.floor(Math.random() * announcements.length)];
    setCurrentAnnouncement(randomAnnouncement);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-bold text-3xl">
        Demonstração dos Componentes das Camadas 6-7
      </h1>

      <Tabs className="w-full" defaultValue="layer6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="layer6">
            Camada 6: Observabilidade & Confiança
          </TabsTrigger>
          <TabsTrigger value="layer7">
            Camada 7: Preferências & Acessibilidade
          </TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-8" value="layer6">
          <section className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-semibold text-2xl">CoreTracePanel</h2>
            <CoreTracePanel events={mockTraceEvents} />
          </section>

          <section className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-semibold text-2xl">CoreAuditLogViewer</h2>
            <CoreAuditLogViewer logs={mockAuditLogs} />
          </section>

          <section className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-semibold text-2xl">
              CoreConnectionStatus
            </h2>
            <div className="flex items-center gap-4">
              <CoreConnectionStatus status={connectionState.status} />
              <button
                className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
                onClick={cycleConnectionState}
              >
                Mudar estado da conexão
              </button>
            </div>
          </section>

          <section className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-semibold text-2xl">CoreErrorBanner</h2>
            <div className="space-y-4">
              <CoreErrorBanner
                error={currentError}
                onDismiss={() => console.log("Error dismissed")}
                onRetry={() => console.log("Retry requested")}
              />
              <button
                className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
                onClick={cycleError}
              >
                Próximo erro
              </button>
            </div>
          </section>

          <section className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-semibold text-2xl">
              MonetizationPremiumSupport
            </h2>
            <MonetizationPremiumSupport isPremium={true} />
          </section>

          <section className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-semibold text-2xl">
              AnalyticsErrorTracker
            </h2>
            <AnalyticsErrorTracker errors={mockFrontendErrors} />
          </section>
        </TabsContent>

        <TabsContent className="space-y-8" value="layer7">
          <section className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-semibold text-2xl">ParameterControls</h2>
            <ParameterControls
              onChange={(params: any) =>
                console.log("Parameters changed:", params)
              }
              parameters={mockAIParameters}
            />
          </section>

          <section className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-semibold text-2xl">SafetyToggles</h2>
            <SafetyToggles
              onChange={(settings: any) =>
                console.log("Safety settings changed:", settings)
              }
              settings={mockSafetySettings}
            />
          </section>

          <section className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-semibold text-2xl">UILocalization</h2>
            <UILocalization
              currentLocale="pt-br"
              locales={mockLocales}
              onLocaleChange={(locale: string) =>
                console.log("Locale changed:", locale)
              }
              translations={mockTranslations}
            />
          </section>

          <section className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-semibold text-2xl">ScreenReaderRegion</h2>
            <div className="space-y-4">
              <ScreenReaderRegion announcement={currentAnnouncement} />
              <div className="flex flex-col gap-2">
                <button
                  className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
                  onClick={updateAnnouncement}
                >
                  Adicionar anúncio para leitores de tela
                </button>
                <p className="text-muted-foreground text-sm">
                  Anúncio atual: {currentAnnouncement || "(nenhum)"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-semibold text-2xl">UIKeyboardShortcuts</h2>
            <UIKeyboardShortcuts shortcuts={mockKeyboardShortcuts} />
          </section>

          <section className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-semibold text-2xl">UIThemeSwitcher</h2>
            <UIThemeSwitcher />
          </section>

          <section className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-semibold text-2xl">UIPrivacyCenter</h2>
            <UIPrivacyCenter
              onChange={(settings: any) =>
                console.log("Privacy settings changed:", settings)
              }
              settings={mockPrivacySettings}
            />
          </section>

          <section className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-semibold text-2xl">
              MonetizationPremiumSettings
            </h2>
            <MonetizationPremiumSettings
              onUpdate={(settings) =>
                console.log("Premium settings updated:", settings)
              }
              settings={mockPremiumSettings}
            />
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
