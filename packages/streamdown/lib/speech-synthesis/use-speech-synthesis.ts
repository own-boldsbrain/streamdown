import { useCallback, useEffect, useState } from "react";

export type SpeechState = {
  isPlaying: boolean;
  isPaused: boolean;
  isEnded: boolean;
  error: string | null;
};

export type SpeechOptions = {
  voice?: SpeechSynthesisVoice | null;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
};

export type UseSpeechSynthesisReturn = {
  speech: SpeechState;
  voices: SpeechSynthesisVoice[];
  supported: boolean;
  speak: (text: string, options?: SpeechOptions) => void;
  cancel: () => void;
  pause: () => void;
  resume: () => void;
  setVoice: (voice: SpeechSynthesisVoice) => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  setVolume: (volume: number) => void;
  setLanguage: (lang: string) => void;
  currentVoice: SpeechSynthesisVoice | null;
  currentRate: number;
  currentPitch: number;
  currentVolume: number;
  currentLanguage: string;
};

/**
 * Hook para gerenciar a síntese de voz usando a Web Speech API
 * @param initialOptions - Opções iniciais para a síntese de voz
 * @returns Objeto com funções e estado para controlar a síntese de voz
 */
export function useSpeechSynthesis(
  initialOptions: SpeechOptions = {}
): UseSpeechSynthesisReturn {
  // Verificar suporte ao navegador
  const [supported, setSupported] = useState<boolean>(false);

  // Estado da síntese de voz
  const [speech, setSpeech] = useState<SpeechState>({
    isPlaying: false,
    isPaused: false,
    isEnded: true,
    error: null,
  });

  // Lista de vozes disponíveis
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Opções atuais
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(
    initialOptions.voice || null
  );
  const [currentRate, setCurrentRate] = useState<number>(
    initialOptions.rate || 1
  );
  const [currentPitch, setCurrentPitch] = useState<number>(
    initialOptions.pitch || 1
  );
  const [currentVolume, setCurrentVolume] = useState<number>(
    initialOptions.volume || 1
  );
  const [currentLanguage, setCurrentLanguage] = useState<string>(
    initialOptions.lang || "en-US"
  );

  // Instância atual de utterance
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  );

  // Verificar suporte à API de síntese de voz
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupported(true);
    }
  }, []);

  // Carregar vozes disponíveis
  useEffect(() => {
    if (!supported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Se não tiver uma voz definida, usar a primeira disponível
      if (!currentVoice && availableVoices.length > 0) {
        setCurrentVoice(availableVoices[0]);
      }
    };

    // Carregar vozes imediatamente (caso já estejam disponíveis)
    loadVoices();

    // Ouvir o evento de mudança de vozes
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [supported, currentVoice]);

  // Configurar listeners para o utterance atual
  useEffect(() => {
    if (!utterance) return;

    const handleStart = () => {
      setSpeech((prev) => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        isEnded: false,
      }));
    };

    const handlePause = () => {
      setSpeech((prev) => ({
        ...prev,
        isPlaying: false,
        isPaused: true,
      }));
    };

    const handleResume = () => {
      setSpeech((prev) => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
      }));
    };

    const handleEnd = () => {
      setSpeech((prev) => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        isEnded: true,
      }));
    };

    const handleError = (event: Event) => {
      setSpeech((prev) => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        isEnded: true,
        error: "Erro na síntese de voz",
      }));
      console.error("Speech Synthesis Error:", event);
    };

    // Adicionar listeners
    utterance.addEventListener("start", handleStart);
    utterance.addEventListener("pause", handlePause);
    utterance.addEventListener("resume", handleResume);
    utterance.addEventListener("end", handleEnd);
    utterance.addEventListener("error", handleError);

    // Limpar listeners quando o componente for desmontado
    return () => {
      utterance.removeEventListener("start", handleStart);
      utterance.removeEventListener("pause", handlePause);
      utterance.removeEventListener("resume", handleResume);
      utterance.removeEventListener("end", handleEnd);
      utterance.removeEventListener("error", handleError);
    };
  }, [utterance]);

  // Função para falar texto
  const speak = useCallback(
    (text: string, options: SpeechOptions = {}) => {
      if (!supported) return;

      // Cancelar fala anterior
      window.speechSynthesis.cancel();

      // Criar nova instância de utterance
      const newUtterance = new SpeechSynthesisUtterance(text);

      // Aplicar opções
      newUtterance.voice = options.voice || currentVoice;
      newUtterance.rate = options.rate || currentRate;
      newUtterance.pitch = options.pitch || currentPitch;
      newUtterance.volume = options.volume || currentVolume;
      newUtterance.lang = options.lang || currentLanguage;

      // Atualizar utterance atual
      setUtterance(newUtterance);

      // Iniciar fala
      window.speechSynthesis.speak(newUtterance);

      // Atualizar estado
      setSpeech({
        isPlaying: true,
        isPaused: false,
        isEnded: false,
        error: null,
      });
    },
    [
      supported,
      currentVoice,
      currentRate,
      currentPitch,
      currentVolume,
      currentLanguage,
    ]
  );

  // Função para pausar a fala
  const pause = useCallback(() => {
    if (!(supported && speech.isPlaying)) return;
    window.speechSynthesis.pause();
  }, [supported, speech.isPlaying]);

  // Função para retomar a fala
  const resume = useCallback(() => {
    if (!(supported && speech.isPaused)) return;
    window.speechSynthesis.resume();
  }, [supported, speech.isPaused]);

  // Função para cancelar a fala
  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeech({
      isPlaying: false,
      isPaused: false,
      isEnded: true,
      error: null,
    });
  }, [supported]);

  // Função para definir a voz
  const setVoice = useCallback(
    (voice: SpeechSynthesisVoice) => {
      setCurrentVoice(voice);
      // Se estiver reproduzindo, aplicar a mudança imediatamente
      if (utterance && speech.isPlaying) {
        cancel();
        speak(utterance.text, { ...utterance, voice });
      }
    },
    [utterance, speech.isPlaying, cancel, speak]
  );

  // Função para definir a taxa de fala
  const setRate = useCallback(
    (rate: number) => {
      setCurrentRate(rate);
      // Se estiver reproduzindo, aplicar a mudança imediatamente
      if (utterance && speech.isPlaying) {
        cancel();
        speak(utterance.text, { ...utterance, rate });
      }
    },
    [utterance, speech.isPlaying, cancel, speak]
  );

  // Função para definir o tom
  const setPitch = useCallback(
    (pitch: number) => {
      setCurrentPitch(pitch);
      // Se estiver reproduzindo, aplicar a mudança imediatamente
      if (utterance && speech.isPlaying) {
        cancel();
        speak(utterance.text, { ...utterance, pitch });
      }
    },
    [utterance, speech.isPlaying, cancel, speak]
  );

  // Função para definir o volume
  const setVolume = useCallback(
    (volume: number) => {
      setCurrentVolume(volume);
      // Se estiver reproduzindo, aplicar a mudança imediatamente
      if (utterance && speech.isPlaying) {
        cancel();
        speak(utterance.text, { ...utterance, volume });
      }
    },
    [utterance, speech.isPlaying, cancel, speak]
  );

  // Função para definir o idioma
  const setLanguage = useCallback(
    (lang: string) => {
      setCurrentLanguage(lang);
      // Se estiver reproduzindo, aplicar a mudança imediatamente
      if (utterance && speech.isPlaying) {
        cancel();
        speak(utterance.text, { ...utterance, lang });
      }
    },
    [utterance, speech.isPlaying, cancel, speak]
  );

  return {
    speech,
    voices,
    supported,
    speak,
    cancel,
    pause,
    resume,
    setVoice,
    setRate,
    setPitch,
    setVolume,
    setLanguage,
    currentVoice,
    currentRate,
    currentPitch,
    currentVolume,
    currentLanguage,
  };
}
