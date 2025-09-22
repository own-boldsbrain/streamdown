# Exemplo de Uso da Síntese de Voz com Streamdown

Este documento mostra como utilizar a funcionalidade de síntese de voz integrada ao Streamdown.

## Uso Básico

```tsx
import { Streamdown, MarkdownSpeech } from "streamdown";

function ExemploBasico() {
  const markdown = "# Olá Mundo\n\nEste é um exemplo de síntese de voz com Markdown.";
  
  return (
    <div className="relative">
      <div className="absolute right-0 top-0 z-10">
        <MarkdownSpeech lang="pt-BR" dir="ltr">
          {markdown}
        </MarkdownSpeech>
      </div>
      <Streamdown>{markdown}</Streamdown>
    </div>
  );
}
```

## Usando o Componente Integrado

```tsx
import { StreamdownWithSpeech } from "streamdown";

function ExemploIntegrado() {
  const markdown = "# Olá Mundo\n\nEste é um exemplo mais simples usando o componente integrado.";
  
  return (
    <StreamdownWithSpeech 
      enableSpeech={true} 
      speechLang="pt-BR" 
      dir="ltr"
    >
      {markdown}
    </StreamdownWithSpeech>
  );
}
```

## Personalização dos Controles

```tsx
import { useSpeechSynthesis, SpeechControls, SettingControl } from "streamdown";

function ControlesPersonalizados() {
  const { 
    speak, pause, resume, cancel, isPlaying, isPaused, 
    voices, setVoice, rate, setRate, volume, setVolume 
  } = useSpeechSynthesis({
    text: "Este é um exemplo com controles personalizados",
    lang: "pt-BR"
  });
  
  return (
    <div className="flex flex-col gap-4 p-4 border rounded">
      <h2>Controles Personalizados</h2>
      
      {/* Status de reprodução */}
      <div>
        Status: {isPlaying ? "Reproduzindo" : isPaused ? "Pausado" : "Parado"}
      </div>
      
      {/* Controles básicos */}
      <div className="flex gap-2">
        <button onClick={speak} disabled={isPlaying && !isPaused}>
          Reproduzir
        </button>
        <button onClick={pause} disabled={!isPlaying || isPaused}>
          Pausar
        </button>
        <button onClick={resume} disabled={!isPaused}>
          Continuar
        </button>
        <button onClick={cancel} disabled={!isPlaying && !isPaused}>
          Parar
        </button>
      </div>
      
      {/* Seleção de voz */}
      <div className="flex flex-col gap-2">
        <label htmlFor="voice-select">Voz:</label>
        <select 
          id="voice-select"
          onChange={(e) => {
            const voice = voices.find(v => v.name === e.target.value);
            if (voice) setVoice(voice);
          }}
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>
      
      {/* Controles de configuração */}
      <div className="flex gap-4">
        <div>
          <label htmlFor="rate-control">Velocidade: {rate}</label>
          <input
            id="rate-control"
            type="range"
            min={0.5}
            max={2}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
          />
        </div>
        
        <div>
          <label htmlFor="volume-control">Volume: {volume}</label>
          <input
            id="volume-control"
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
```

## Suporte a RTL

O componente oferece suporte completo a idiomas RTL (direita para esquerda) como árabe e hebraico.

```tsx
import { StreamdownWithSpeech } from "streamdown";

function ExemploRTL() {
  const markdownArabic = "# مرحبا بالعالم\n\nهذا مثال للنص العربي مع دعم من اليمين إلى اليسار.";
  
  return (
    <StreamdownWithSpeech 
      enableSpeech={true} 
      speechLang="ar-SA" 
      dir="rtl"
    >
      {markdownArabic}
    </StreamdownWithSpeech>
  );
}
```

## Notas Importantes

1. A Web Speech API não está disponível em todos os navegadores e dispositivos.
2. A qualidade da síntese de voz e as vozes disponíveis dependem do sistema operacional do usuário.
3. Para suporte RTL adequado, certifique-se de definir a propriedade `dir="rtl"`.
4. Alguns navegadores podem exigir interação do usuário antes de permitir a síntese de voz.