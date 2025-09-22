'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CoreTracePanel } from '@/components/core-trace-panel'
import { CoreAuditLogViewer } from '@/components/core-audit-log-viewer'
import { CoreConnectionStatus } from '@/components/core-connection-status'
import { CoreErrorBanner } from '@/components/core-error-banner'
import { MonetizationPremiumSupport } from '@/components/monetization-premium-support'
import { AnalyticsErrorTracker } from '@/components/analytics-error-tracker'
import { ParameterControls } from '@/components/ui-parameter-controls'
import { SafetyToggles } from '@/components/ui-safety-toggles'
import { UILocalization } from '@/components/ui-localization'
import { ScreenReaderRegion } from '@/components/ui-screen-reader-region'
import { UIKeyboardShortcuts } from '@/components/ui-keyboard-shortcuts'
import { UIThemeSwitcher } from '@/components/ui-theme-switcher'
import { UIPrivacyCenter } from '@/components/ui-privacy-center'
import { MonetizationPremiumSettings } from '@/components/monetization-premium-settings'
import { 
  mockTraceEvents, 
  mockAuditLogs, 
  mockConnectionStates, 
  mockErrors, 
  mockFrontendErrors,
  mockAIParameters,
  mockSafetySettings,
  mockLocales,
  mockTranslations,
  mockKeyboardShortcuts,
  mockPrivacySettings,
  mockPremiumSettings
} from '@/lib/mock-data'
import { useState } from 'react'

export default function LayerComponentsDemo() {
  const [connectionState, setConnectionState] = useState<{status: 'connected' | 'connecting' | 'disconnected' | 'error', latency: number | null}>(mockConnectionStates[0] as any)
  const [currentError, setCurrentError] = useState<Error>({ message: mockErrors[0].message } as Error)
  const [currentAnnouncement, setCurrentAnnouncement] = useState<string>('')
  
  // Função para demonstrar a mudança de estado da conexão
  const cycleConnectionState = () => {
    const currentIndex = mockConnectionStates.findIndex(state => 
      state.status === connectionState.status && state.latency === connectionState.latency
    )
    const nextIndex = (currentIndex + 1) % mockConnectionStates.length
    setConnectionState(mockConnectionStates[nextIndex])
  }
  
  // Função para demonstrar a mudança de erros
  const cycleError = () => {
    const nextIndex = (mockErrors.findIndex(err => err.message === currentError.message) + 1) % mockErrors.length
    setCurrentError({ message: mockErrors[nextIndex].message } as Error)
  }
  
  // Função para adicionar anúncios ao leitor de tela
  const updateAnnouncement = () => {
    const announcements = [
      "Nova mensagem recebida",
      "Processando sua solicitação",
      "Conteúdo atualizado",
      "Erro encontrado na solicitação",
      "Carregamento concluído"
    ]
    const randomAnnouncement = announcements[Math.floor(Math.random() * announcements.length)]
    setCurrentAnnouncement(randomAnnouncement)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Demonstração dos Componentes das Camadas 6-7</h1>
      
      <Tabs defaultValue="layer6" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="layer6">Camada 6: Observabilidade & Confiança</TabsTrigger>
          <TabsTrigger value="layer7">Camada 7: Preferências & Acessibilidade</TabsTrigger>
        </TabsList>
        
        <TabsContent value="layer6" className="space-y-8">
          <section className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4">CoreTracePanel</h2>
            <CoreTracePanel events={mockTraceEvents} />
          </section>
          
          <section className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4">CoreAuditLogViewer</h2>
            <CoreAuditLogViewer logs={mockAuditLogs} />
          </section>
          
          <section className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4">CoreConnectionStatus</h2>
            <div className="flex items-center gap-4">
              <CoreConnectionStatus status={connectionState.status} />
              <button 
                onClick={cycleConnectionState}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Mudar estado da conexão
              </button>
            </div>
          </section>
          
          <section className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4">CoreErrorBanner</h2>
            <div className="space-y-4">
              <CoreErrorBanner 
                error={currentError}
                onDismiss={() => console.log('Error dismissed')}
                onRetry={() => console.log('Retry requested')}
              />
              <button 
                onClick={cycleError}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Próximo erro
              </button>
            </div>
          </section>
          
          <section className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4">MonetizationPremiumSupport</h2>
            <MonetizationPremiumSupport isPremium={true} />
          </section>
          
          <section className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4">AnalyticsErrorTracker</h2>
            <AnalyticsErrorTracker errors={mockFrontendErrors} />
          </section>
        </TabsContent>
        
        <TabsContent value="layer7" className="space-y-8">
          <section className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4">ParameterControls</h2>
            <ParameterControls 
              parameters={mockAIParameters}
              onChange={(params: any) => console.log('Parameters changed:', params)}
            />
          </section>
          
          <section className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4">SafetyToggles</h2>
            <SafetyToggles 
              settings={mockSafetySettings}
              onChange={(settings: any) => console.log('Safety settings changed:', settings)}
            />
          </section>
          
          <section className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4">UILocalization</h2>
            <UILocalization 
              locales={mockLocales}
              translations={mockTranslations}
              currentLocale="pt-br"
              onLocaleChange={(locale: string) => console.log('Locale changed:', locale)}
            />
          </section>
          
          <section className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4">ScreenReaderRegion</h2>
            <div className="space-y-4">
              <ScreenReaderRegion announcement={currentAnnouncement} />
              <div className="flex flex-col gap-2">
                <button 
                  onClick={updateAnnouncement}
                  className="bg-primary px-4 py-2 rounded-md text-primary-foreground"
                >
                  Adicionar anúncio para leitores de tela
                </button>
                <p className="text-muted-foreground text-sm">
                  Anúncio atual: {currentAnnouncement || "(nenhum)"}
                </p>
              </div>
            </div>
          </section>
          
          <section className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4">UIKeyboardShortcuts</h2>
            <UIKeyboardShortcuts shortcuts={mockKeyboardShortcuts} />
          </section>
          
          <section className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4">UIThemeSwitcher</h2>
            <UIThemeSwitcher />
          </section>
          
          <section className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4">UIPrivacyCenter</h2>
            <UIPrivacyCenter 
              settings={mockPrivacySettings}
              onChange={(settings: any) => console.log('Privacy settings changed:', settings)}
            />
          </section>
          
          <section className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-4">MonetizationPremiumSettings</h2>
            <MonetizationPremiumSettings 
              settings={mockPremiumSettings}
              onUpdate={(settings) => console.log('Premium settings updated:', settings)}
            />
          </section>
        </TabsContent>
      </Tabs>
    </div>
  )
}