"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../utils";

export type ChatTTSPlayerProps = {
  /** Texto a ser sintetizado */
  text: string;
  /** Idioma do texto */
  lang?: string;
  /** Velocidade de fala (0.5 - 2.0) */
  rate?: number;
  /** Volume (0.0 - 1.0) */
  volume?: number;
  /** Voz específica a usar */
  voice?: SpeechSynthesisVoice;
  /** Classe CSS adicional */
  className?: string;
  /** Se deve iniciar automaticamente */
  autoPlay?: boolean;
  /** Callback quando a síntese começa */
  onStart?: () => void;
  /** Callback quando a síntese termina */
  onEnd?: () => void;
  /** Callback quando há erro */
  onError?: (error: SpeechSynthesisErrorEvent) => void;
  /** Se deve mostrar controles */
  showControls?: boolean;
  /** Tamanho do player */
  size?: "sm" | "md" | "lg";
  /** Tema do player */
  theme?: "light" | "dark" | "auto";
};

export const ChatTTSPlayer = memo(
  ({
    text,
    lang = "pt-BR",
    rate = 1.0,
    volume = 1.0,
    voice,
    className,
    autoPlay = false,
    onStart,
    onEnd,
    onError,
    showControls = true,
    size = "md",
    theme = "auto",
  }: ChatTTSPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Verificar suporte à síntese de voz
    useEffect(() => {
      setIsSupported("speechSynthesis" in window);
    }, []);

    // Carregar vozes disponíveis
    useEffect(() => {
      if (!isSupported) {
        return;
      }

      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      speechSynthesis.addEventListener("voiceschanged", loadVoices);

      return () => {
        speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      };
    }, [isSupported]);

    // Configurar utterance
    useEffect(() => {
      if (!isSupported) {
        return;
      }

      if (!text.trim()) {
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.volume = volume;

      if (voice) {
        utterance.voice = voice;
      } else {
        // Selecionar voz padrão para o idioma
        const defaultVoice = voices.find(v => v.lang.startsWith(lang.split("-")[0]));
        if (defaultVoice) {
          utterance.voice = defaultVoice;
        }
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        onStart?.();
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        onEnd?.();
      };

      utterance.onerror = (error) => {
        setIsPlaying(false);
        setIsPaused(false);
        onError?.(error);
      };

      utterance.onpause = () => {
        setIsPaused(true);
      };

      utterance.onresume = () => {
        setIsPaused(false);
      };

      utteranceRef.current = utterance;

      return () => {
        if (utteranceRef.current) {
          speechSynthesis.cancel();
        }
      };
    }, [text, lang, rate, volume, voice, voices, isSupported, onStart, onEnd, onError]);

    // Auto-play
    useEffect(() => {
      if (autoPlay && utteranceRef.current && !isPlaying) {
        speechSynthesis.speak(utteranceRef.current);
      }
    }, [autoPlay, isPlaying]);

    const handlePlay = useCallback(() => {
      if (utteranceRef.current) {
        speechSynthesis.speak(utteranceRef.current);
      }
    }, []);

    const handlePause = useCallback(() => {
      speechSynthesis.pause();
    }, []);

    const handleResume = useCallback(() => {
      speechSynthesis.resume();
    }, []);

    const handleStop = useCallback(() => {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }, []);

    // Não renderizar se não há texto
    if (!text.trim()) {
      return null;
    }

    // Não renderizar se não é suportado
    if (!isSupported) {
      return null;
    }

    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
    };

    const iconSizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const renderPlayButton = () => (
      <button
        onClick={handlePlay}
        className={cn(
          "flex items-center justify-center rounded-md transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
          theme === "dark" || (theme === "auto" && window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches)
            ? "hover:bg-gray-700"
            : "hover:bg-gray-100",
          sizeClasses[size]
        )}
        aria-label="Reproduzir texto"
        type="button"
      >
        <svg
          className={iconSizeClasses[size]}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );

    const renderPauseButton = () => (
      <button
        onClick={handlePause}
        className={cn(
          "flex items-center justify-center rounded-md transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
          theme === "dark" || (theme === "auto" && window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches)
            ? "hover:bg-gray-700"
            : "hover:bg-gray-100",
          sizeClasses[size]
        )}
        aria-label="Pausar reprodução"
        type="button"
      >
        <svg
          className={iconSizeClasses[size]}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );

    const renderResumeButton = () => (
      <button
        onClick={handleResume}
        className={cn(
          "flex items-center justify-center rounded-md transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
          theme === "dark" || (theme === "auto" && window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches)
            ? "hover:bg-gray-700"
            : "hover:bg-gray-100",
          sizeClasses[size]
        )}
        aria-label="Continuar reprodução"
        type="button"
      >
        <svg
          className={iconSizeClasses[size]}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );

    const renderStopButton = () => (
      <button
        onClick={handleStop}
        className={cn(
          "flex items-center justify-center rounded-md transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500",
          theme === "dark" || (theme === "auto" && window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches)
            ? "hover:bg-gray-700"
            : "hover:bg-gray-100",
          sizeClasses[size]
        )}
        aria-label="Parar reprodução"
        type="button"
      >
        <svg
          className={iconSizeClasses[size]}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );

    return (
      <section
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border p-2 transition-colors",
          theme === "dark" || (theme === "auto" && window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches)
            ? "border-gray-600 bg-gray-800 text-white"
            : "border-gray-300 bg-white text-gray-900",
          className
        )}
        aria-label="Player de texto para fala"
      >
        {showControls && (
          <>
            {isPlaying ? (
              isPaused ? renderResumeButton() : renderPauseButton()
            ) : (
              renderPlayButton()
            )}
            {renderStopButton()}
          </>
        )}

        {/* Indicador de status */}
        <div className="flex items-center gap-1 text-xs">
          {isPlaying && !isPaused && (
            <div className="flex gap-0.5">
              <div className="h-1 w-1 animate-pulse rounded-full bg-green-500" />
              <div className="h-1 w-1 animate-pulse animation-delay-100 rounded-full bg-green-500" />
              <div className="h-1 w-1 animate-pulse animation-delay-200 rounded-full bg-green-500" />
            </div>
          )}
          {isPaused && (
            <div className="h-1 w-1 rounded-full bg-yellow-500" />
          )}
        </div>
      </section>
    );
  }
);

ChatTTSPlayer.displayName = "ChatTTSPlayer";