import { useEffect, useRef, useState } from "react";
import { cn } from "../utils";
import {
  SettingControl,
  SpeechControls,
  SpeechStatusIndicator,
} from "./speech-ui";
import { useSpeechSynthesis } from "./use-speech-synthesis";

// Constantes para evitar magic numbers
const VOLUME_PERCENT_MULTIPLIER = 100;

/** Propriedades do componente de síntese de voz */
export type SpeechSynthesisProps = {
  /** Texto a ser lido pelo sintetizador de voz */
  text: string;
  /** Classe CSS para personalização visual */
  className?: string;
  /** Idioma padrão para a leitura (formato BCP 47, ex: "pt-BR") */
  lang?: string;
  /** Se os controles devem ser compactos (menos espaço) */
  compact?: boolean;
  /** Posição dos controles - vertical ou horizontal */
  orientation?: "horizontal" | "vertical";
  /** Título para o controle (útil para acessibilidade) */
  title?: string;
  /** Direção do texto */
  dir?: "ltr" | "rtl";
};

/**
 * Limpa o texto de marcações markdown para síntese de voz
 */
const cleanMarkdownText = (input: string): string => {
  // Remover links Markdown [texto](url)
  let cleaned = input.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Remover formatação Markdown comum
  cleaned = cleaned.replace(/(\*\*|__)(.*?)\1/g, "$2"); // Negrito
  cleaned = cleaned.replace(/(\*|_)(.*?)\1/g, "$2"); // Itálico
  cleaned = cleaned.replace(/~~(.*?)~~/g, "$1"); // Tachado
  cleaned = cleaned.replace(/`([^`]+)`/g, "$1"); // Código inline

  // Remover blocos de código
  cleaned = cleaned.replace(/```[\s\S]*?```/g, "Bloco de código");

  // Remover cabeçalhos mantendo o texto
  cleaned = cleaned.replace(/#{1,6}\s+(.+)/g, "$1");

  // Remover tags HTML
  cleaned = cleaned.replace(/<[^>]*>/g, "");

  // Remover caracteres especiais Markdown
  cleaned = cleaned.replace(/[#*_~`>]/g, "");

  // Substitui múltiplos espaços por um único
  cleaned = cleaned.replace(/\s+/g, " ");

  return cleaned.trim();
};

/**
 * Componente de síntese de voz usando a Web Speech API
 */
export function SpeechSynthesis({
  text,
  className,
  lang = "pt-BR",
  compact = false,
  orientation = "horizontal",
  title = "Controles de síntese de voz",
  dir = "ltr",
}: SpeechSynthesisProps) {
  // Estado para rastrear o texto processado para leitura
  const [processedText, setProcessedText] = useState<string>("");

  // Hook para gerenciar a síntese de voz
  const {
    speech,
    voices,
    supported,
    speak,
    cancel,
    pause,
    resume,
    setVoice,
    setRate,
    setVolume,
    currentVoice,
    currentRate,
    currentVolume,
  } = useSpeechSynthesis({ lang });

  // Referência para o container de controles (para acessibilidade)
  const controlsRef = useRef<HTMLDivElement>(null);

  // Processar o texto para remover markdown e elementos HTML
  useEffect(() => {
    if (!text) {
      setProcessedText("");
      return;
    }

    setProcessedText(cleanMarkdownText(text));
  }, [text]);

  // Filtra vozes para o idioma atual
  const filteredVoices = voices.filter((voice) =>
    voice.lang.startsWith(lang.split("-")[0])
  );

  // Se não há vozes para o idioma atual, usar todas as vozes
  const availableVoices = filteredVoices.length > 0 ? filteredVoices : voices;

  // Função para iniciar a leitura
  const handleSpeak = () => {
    if (speech.isPaused) {
      resume();
    } else {
      speak(processedText);
    }

    // Focar nos controles para acessibilidade
    if (controlsRef.current) {
      controlsRef.current.focus();
    }
  };

  // Função para mudar a voz
  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVoice = voices.find((voice) => voice.name === e.target.value);
    if (selectedVoice) {
      setVoice(selectedVoice);
    }
  };

  // Se a API não é suportada, mostrar mensagem
  if (!supported) {
    return (
      <div
        className={cn(
          "rounded-md bg-yellow-50 p-4 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          className
        )}
        dir={dir}
      >
        <p>Síntese de voz não é suportada neste navegador.</p>
      </div>
    );
  }

  return (
    <section
      aria-label={title}
      className={cn(
        "my-4 rounded-md border border-border bg-muted/40 p-4 shadow-sm",
        orientation === "vertical" ? "flex flex-col gap-3" : "space-y-3",
        compact ? "text-sm" : "text-base",
        className
      )}
      data-streamdown="speech-synthesis"
      dir={dir}
      ref={controlsRef}
      tabIndex={-1}
    >
      <div
        className={cn(
          "flex items-center",
          orientation === "vertical" ? "flex-col gap-2" : "gap-4"
        )}
      >
        {/* Status da reprodução */}
        <SpeechStatusIndicator
          isPaused={speech.isPaused}
          isPlaying={speech.isPlaying}
        />

        {/* Controles de reprodução */}
        <SpeechControls
          compact={compact}
          isPaused={speech.isPaused}
          isPlaying={speech.isPlaying}
          isTextAvailable={Boolean(processedText)}
          onPause={pause}
          onPlay={handleSpeak}
          onStop={cancel}
        />

        {/* Controle de velocidade */}
        <SettingControl
          compact={compact}
          formatValue={(value) => `${value.toFixed(1)}x`}
          id="rate-control"
          label="Velocidade"
          max={2}
          min={0.5}
          onChange={(e) => setRate(Number.parseFloat(e.target.value))}
          step={0.1}
          value={currentRate}
        />

        {/* Controle de volume */}
        <SettingControl
          compact={compact}
          formatValue={(value) =>
            `${Math.round(value * VOLUME_PERCENT_MULTIPLIER)}%`
          }
          id="volume-control"
          label="Volume"
          max={1}
          min={0}
          onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
          step={0.1}
          value={currentVolume}
        />
      </div>

      {/* Seletor de voz */}
      {availableVoices.length > 0 && (
        <div
          className={cn(
            "flex flex-wrap items-center gap-2",
            orientation === "vertical" ? "flex-col" : ""
          )}
        >
          <label className="font-medium text-sm" htmlFor="voice-selector">
            Voz:
          </label>
          <select
            aria-label="Selecionar voz para síntese"
            className="rounded-md border border-input bg-background px-3 py-1 text-sm"
            id="voice-selector"
            onChange={handleVoiceChange}
            value={currentVoice?.name || ""}
          >
            {availableVoices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
      )}
    </section>
  );
}
