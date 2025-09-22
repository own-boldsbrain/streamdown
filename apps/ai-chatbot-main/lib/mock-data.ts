/**
 * Este arquivo contém dados mock para testes visuais dos componentes
 * das camadas 6 e 7 no navegador.
 */

// Constantes para intervalos de tempo (em milissegundos)
const TIME_INTERVALS = {
  FIVE_SECONDS: 5000,
  FOUR_POINT_FIVE_SECONDS: 4500,
  FOUR_SECONDS: 4000,
  THREE_POINT_FIVE_SECONDS: 3500,
  THREE_SECONDS: 3000,
  ONE_HOUR: 3_600_000,
  ONE_DAY: 86_400_000
}

// Multiplicadores para criar intervalos complexos
const MULTIPLIERS = {
  TWO: 2,
  FIVE: 5
}

// Dados para core-trace-panel.tsx
export const mockTraceEvents = [
  {
    id: 'event-1',
    timestamp: new Date(Date.now() - TIME_INTERVALS.FIVE_SECONDS).toISOString(),
    event: 'session.start',
    details: { sessionId: 'sess_123456', userId: 'user_abc123' }
  },
  {
    id: 'event-2',
    timestamp: new Date(Date.now() - TIME_INTERVALS.FOUR_POINT_FIVE_SECONDS).toISOString(),
    event: 'message.sent',
    details: { messageId: 'msg_123', content: 'Olá, como posso ajudar?' }
  },
  {
    id: 'event-3',
    timestamp: new Date(Date.now() - TIME_INTERVALS.FOUR_SECONDS).toISOString(),
    event: 'llm.request.sent',
    details: { model: 'gpt-4', temperature: 0.7, tokens: 15 }
  },
  {
    id: 'event-4',
    timestamp: new Date(Date.now() - TIME_INTERVALS.THREE_POINT_FIVE_SECONDS).toISOString(),
    event: 'llm.response.received',
    details: { tokens: 245, latencyMs: 1200, success: true }
  },
  {
    id: 'event-5',
    timestamp: new Date(Date.now() - TIME_INTERVALS.THREE_SECONDS).toISOString(),
    event: 'message.received',
    details: { messageId: 'msg_124', content: 'Aqui está sua resposta...' }
  }
]

// Dados para core-audit-log-viewer.tsx
export const mockAuditLogs = [
  {
    id: '1',
    timestamp: new Date(Date.now() - TIME_INTERVALS.ONE_DAY * MULTIPLIERS.TWO).toISOString(),
    userId: 'user_abc123',
    action: 'user.login',
    status: 'success',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - TIME_INTERVALS.ONE_DAY).toISOString(),
    userId: 'user_abc123',
    action: 'message.create',
    status: 'success',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - TIME_INTERVALS.ONE_HOUR * MULTIPLIERS.FIVE).toISOString(),
    userId: 'user_def456',
    action: 'user.password.reset',
    status: 'success',
    ipAddress: '192.168.1.2',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - TIME_INTERVALS.ONE_HOUR * MULTIPLIERS.TWO).toISOString(),
    userId: 'admin_xyz789',
    action: 'system.config.update',
    status: 'success',
    ipAddress: '10.0.0.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    id: '5',
    timestamp: new Date().toISOString(),
    userId: 'user_abc123',
    action: 'subscription.upgrade',
    status: 'success',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
]

// Dados para core-connection-status.tsx
export const mockConnectionStates = [
  { status: 'connected', latency: 120 },
  { status: 'connected', latency: 350 },
  { status: 'unstable', latency: 850 },
  { status: 'disconnected', latency: null },
  { status: 'connecting', latency: null },
  { status: 'connected', latency: 200 }
]

// Dados para core-error-banner.tsx
export const mockErrors = [
  {
    id: 'err-1',
    message: 'Falha na conexão com o servidor. Tente novamente.',
    severity: 'error',
    timestamp: new Date().toISOString()
  },
  {
    id: 'err-2',
    message: 'O modelo de IA está temporariamente indisponível.',
    severity: 'warning',
    timestamp: new Date().toISOString()
  },
  {
    id: 'err-3',
    message: 'Seu token de autenticação expirou. Faça login novamente.',
    severity: 'error',
    timestamp: new Date().toISOString()
  }
]

// Dados para analytics-error-tracker.tsx
export const mockFrontendErrors = [
  {
    message: 'TypeError: Cannot read property "value" of undefined',
    filename: 'app.js',
    lineno: 120,
    colno: 35,
    stack: 'TypeError: Cannot read property...'
  },
  {
    message: 'SyntaxError: Unexpected token <',
    filename: 'main.js',
    lineno: 1,
    colno: 1,
    stack: 'SyntaxError: Unexpected token...'
  },
  {
    message: 'ReferenceError: fetch is not defined',
    filename: 'api.js',
    lineno: 45,
    colno: 10,
    stack: 'ReferenceError: fetch is not defined...'
  }
]

// Dados para ui-parameter-controls.tsx
export const mockAIParameters = {
  temperature: 0.7,
  topP: 0.9,
  frequencyPenalty: 0.5,
  presencePenalty: 0.2,
  maxTokens: 2048
}

// Dados para ui-safety-toggles.tsx
export const mockSafetySettings = {
  hate: true,
  harassment: true,
  sexual: true,
  dangerous: true,
  childHarm: true,
  selfHarm: true
}

// Dados para ui-localization.tsx
export const mockLocales = [
  { value: 'en', label: 'English' },
  { value: 'pt-br', label: 'Português (Brasil)' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ja', label: '日本語' }
]

export const mockTranslations = {
  en: {
    welcome: 'Welcome to our application',
    settings: 'Settings',
    privacy: 'Privacy',
    logout: 'Log out'
  },
  'pt-br': {
    welcome: 'Bem-vindo ao nosso aplicativo',
    settings: 'Configurações',
    privacy: 'Privacidade',
    logout: 'Sair'
  },
  es: {
    welcome: 'Bienvenido a nuestra aplicación',
    settings: 'Configuración',
    privacy: 'Privacidad',
    logout: 'Cerrar sesión'
  }
}

// Dados para ui-keyboard-shortcuts.tsx
export const mockKeyboardShortcuts = [
  { command: 'Criar novo chat', keys: ['Ctrl', 'N'] },
  { command: 'Salvar conversa', keys: ['Ctrl', 'S'] },
  { command: 'Exportar chat', keys: ['Ctrl', 'E'] },
  { command: 'Abrir atalhos de teclado', keys: ['Ctrl', 'K'] },
  { command: 'Alternar sidebar', keys: ['Ctrl', 'B'] },
  { command: 'Foco no campo de mensagem', keys: ['Ctrl', '/'] },
  { command: 'Enviar mensagem', keys: ['Ctrl', 'Enter'] },
  { command: 'Limpar conversa', keys: ['Ctrl', 'L'] }
]

// Dados para ui-privacy-center.tsx
export const mockPrivacySettings = {
  saveHistory: true,
  shareAnonymousData: true,
  thirdPartyIntegrations: false,
  cloudStorage: true,
  allowProfiling: false,
  retentionDays: 30
}

// Dados para monetization-premium-settings.tsx
export const mockPremiumSettings = {
  prioritySupport: true,
  highThroughput: true,
  betaFeatures: false,
  customModels: false,
  maxTokens: 8192,
  advancedAnalytics: true,
  dedicatedCapacity: false,
  customization: true
}