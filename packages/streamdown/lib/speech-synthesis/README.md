# Síntese de Voz no Streamdown

Este módulo adiciona suporte à síntese de voz (Text-to-Speech) no Streamdown, permitindo que o conteúdo Markdown seja lido em voz alta diretamente no navegador usando a Web Speech API.

## Características

- 🎤 **Suporte Multi-idioma**: Compatível com todas as vozes disponíveis no navegador
- 🎛️ **Controles Completos**: Play/pause, velocidade e volume ajustáveis
- 🔄 **Estado Visual**: Indicadores visuais de reprodução
- ♿ **Acessibilidade**: Integração total com ARIA para melhor acessibilidade
- 🌐 **Suporte a RTL**: Compatível com idiomas da direita para a esquerda

## Componentes Disponíveis

### 1. Hook `useSpeechSynthesis`

Hook React para acesso direto à API de síntese de voz.

```tsx
const { 
  speak, pause, resume, cancel, isPlaying, isPaused, 
  voices, setVoice, rate, setRate, volume, setVolume 
} = useSpeechSynthesis({ text: "Texto para ler", lang: "pt-BR" });
```

### 2. Componente `SpeechSynthesis`

Componente completo com interface de usuário para síntese de voz.

```tsx
<SpeechSynthesis
  text="Texto para ler"
  lang="pt-BR"
  dir="ltr"
  compact={false}
/>
```

### 3. Componente `MarkdownSpeech`

Componente especializado para extrair texto de conteúdo Markdown (ReactNode).

```tsx
<MarkdownSpeech lang="pt-BR" dir="ltr">
  {markdownContent}
</MarkdownSpeech>
```

### 4. Wrapper `StreamdownWithSpeech`

Versão do Streamdown com síntese de voz integrada.

```tsx
<StreamdownWithSpeech
  enableSpeech={true}
  speechLang="pt-BR"
  dir="ltr"
>
  {markdownContent}
</StreamdownWithSpeech>
```

## Como Usar

### Uso Básico

```tsx
import { StreamdownWithSpeech } from "streamdown";

function MyComponent() {
  return (
    <StreamdownWithSpeech enableSpeech={true} speechLang="pt-BR">
      {"# Título\n\nConteúdo de exemplo para síntese de voz."}
    </StreamdownWithSpeech>
  );
}
```

### Personalização de Componentes de UI

Você também pode usar os componentes de UI individualmente:

```tsx
import { SpeechControls, SpeechStatusIndicator, SettingControl } from "streamdown";
import { useSpeechSynthesis } from "streamdown";

function CustomSpeechUI() {
  const speech = useSpeechSynthesis({ text: "Texto de exemplo" });
  
  return (
    <div>
      <SpeechStatusIndicator isPlaying={speech.isPlaying} isPaused={speech.isPaused} />
      <SpeechControls
        isPlaying={speech.isPlaying}
        isPaused={speech.isPaused}
        onPlay={speech.speak}
        onPause={speech.pause}
        onResume={speech.resume}
        onStop={speech.cancel}
      />
      <SettingControl
        label="Velocidade"
        value={speech.rate}
        min={0.5}
        max={2}
        step={0.1}
        onChange={speech.setRate}
      />
    </div>
  );
}
```

## Requisitos

- Navegador com suporte à Web Speech API
- React ≥ 18.0.0

## Compatibilidade de Navegadores

A Web Speech API é suportada na maioria dos navegadores modernos:

- Chrome/Edge: Suporte completo
- Firefox: Suporte parcial
- Safari: Suporte completo a partir do Safari 14.1
- Opera: Suporte completo

## Acessibilidade

Todos os componentes são construídos com acessibilidade em mente:

- Atributos ARIA adequados
- Navegação por teclado
- Contraste adequado
- Suporte a screen readers