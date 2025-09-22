"use client";

import { Loader2, Mic, Square, XCircle } from "lucide-react";
import {
  type HTMLAttributes,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../utils";

// Constantes para configuração da gravação
const AUDIO_CONSTRAINTS = {
  sampleRate: 44_100,
  channelCount: 1,
  echoCancellation: true,
  noiseSuppression: true,
} as const;

const MAX_RECORDING_TIME = 300_000; // 5 minutos em ms
const WAVEFORM_BARS_COUNT = 20;
const WAVEFORM_DEFAULT_HEIGHT = 0.1;
const FFT_SIZE = 256;
const AUDIO_DATA_INTERVAL = 100; // ms
const REALTIME_THRESHOLD = 100; // ms
const CONVERSION_TO_SECONDS = 1000;
const CONVERSION_TO_MINUTES = 60;
const TIME_PADDING = 2;
const MIN_BAR_HEIGHT = 2;
const AMPLITUDE_NORMALIZATION_FACTOR = 255;
const AMPLITUDE_HIGH_THRESHOLD = 0.5;
const BAR_HEIGHT_MULTIPLIER = 100;
const DECIMAL_PLACES = 3;

// Constantes para classes de altura
const HEIGHT_THRESHOLDS = {
  LOW: 20,
  MEDIUM_LOW: 40,
  MEDIUM: 60,
  MEDIUM_HIGH: 80,
} as const;

const HEIGHT_CLASSES = {
  TINY: "h-1",
  SMALL: "h-2",
  MEDIUM: "h-3",
  LARGE: "h-4",
  EXTRA_LARGE: "h-5",
} as const;

// Função helper para calcular classe de altura baseada na amplitude
const getHeightClass = (heightPercent: number): string => {
  if (heightPercent < HEIGHT_THRESHOLDS.LOW) {
    return HEIGHT_CLASSES.TINY;
  }
  if (heightPercent < HEIGHT_THRESHOLDS.MEDIUM_LOW) {
    return HEIGHT_CLASSES.SMALL;
  }
  if (heightPercent < HEIGHT_THRESHOLDS.MEDIUM) {
    return HEIGHT_CLASSES.MEDIUM;
  }
  if (heightPercent < HEIGHT_THRESHOLDS.MEDIUM_HIGH) {
    return HEIGHT_CLASSES.LARGE;
  }
  return HEIGHT_CLASSES.EXTRA_LARGE;
};

// Classes CSS organizadas
const styles = {
  container: "flex items-center gap-2 p-2 bg-background border rounded-lg",
  button:
    "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
  recordButton: "bg-red-500 hover:bg-red-600 text-white",
  stopButton: "bg-gray-500 hover:bg-gray-600 text-white",
  disabledButton: "bg-gray-300 cursor-not-allowed text-gray-500",
  waveform:
    "flex-1 h-8 bg-muted rounded flex items-end justify-center gap-1 px-2",
  bar: "bg-current rounded-sm transition-all duration-75 flex-1 min-h-[2px]",
  barHigh: "bg-red-500",
  barLow: "bg-gray-400",
  barHeight: "transition-all duration-75",
  timeDisplay:
    "text-sm font-mono text-muted-foreground min-w-[60px] text-center",
  status: "text-xs text-muted-foreground",
  errorText: "text-red-500 flex items-center gap-1",
  recordingText: "flex items-center gap-1",
  loaderIcon: "w-3 h-3 animate-spin",
  icon: "w-4 h-4",
  smallIcon: "w-3 h-3",
};

// Interface para as propriedades do componente
interface ChatMicRecorderProps extends HTMLAttributes<HTMLDivElement> {
  // Callback chamado quando a gravação é finalizada
  onRecordingComplete?: (audioBlob: Blob, duration: number) => void;
  // Callback chamado durante a gravação para updates em tempo real
  onRecordingData?: (audioBlob: Blob) => void;
  // Se deve enviar dados em tempo real durante a gravação
  enableRealtimeData?: boolean;
  // Intervalo para envio de dados em tempo real (ms)
  realtimeInterval?: number;
  // Se o componente está desabilitado
  disabled?: boolean;
  // Texto personalizado para o status de gravação
  recordingText?: string;
  // Máximo tempo de gravação em segundos
  maxRecordingTime?: number;
}

// Hook personalizado para gerenciar a gravação de áudio
function useAudioRecorder({
  onRecordingComplete,
  onRecordingData,
  enableRealtimeData,
  realtimeInterval = 1000,
  maxRecordingTime = MAX_RECORDING_TIME,
}: Pick<
  ChatMicRecorderProps,
  | "onRecordingComplete"
  | "onRecordingData"
  | "enableRealtimeData"
  | "realtimeInterval"
> & { maxRecordingTime: number }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const startTimeRef = useRef<number>(0);

  // Inicializar waveform com dados vazios
  useEffect(() => {
    setWaveformData(
      new Array(WAVEFORM_BARS_COUNT).fill(WAVEFORM_DEFAULT_HEIGHT)
    );
  }, []);

  // Parar gravação
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsRecording(false);
  }, [isRecording]);

  // Função para analisar o áudio e gerar waveform
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) {
      return;
    }

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateWaveform = () => {
      if (!analyserRef.current) {
        return;
      }
      analyserRef.current.getByteFrequencyData(dataArray);

      // Calcular a amplitude média
      const average =
        dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      const normalizedAmplitude = average / AMPLITUDE_NORMALIZATION_FACTOR;

      setWaveformData((prev) => {
        const newData = [...prev.slice(1), normalizedAmplitude];
        return newData;
      });

      animationFrameRef.current = requestAnimationFrame(updateWaveform);
    };

    updateWaveform();
  }, []);

  // Iniciar gravação
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      chunksRef.current = [];

      // Solicitar permissão para acessar o microfone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: AUDIO_CONSTRAINTS,
      });

      streamRef.current = stream;

      // Configurar analyser para waveform
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyserRef.current = analyser;

      // Criar MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4",
      });

      mediaRecorderRef.current = mediaRecorder;

      // Configurar event listeners
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType,
        });

        const duration = Date.now() - startTimeRef.current;
        onRecordingComplete?.(audioBlob, duration);

        // Limpar recursos
        for (const track of stream.getTracks()) {
          track.stop();
        }
        setIsRecording(false);
        setRecordingTime(0);
      };

      // Iniciar gravação
      mediaRecorder.start(AUDIO_DATA_INTERVAL);
      startTimeRef.current = Date.now();
      setIsRecording(true);

      // Iniciar análise de waveform
      analyzeAudio();

      // Configurar limite de tempo
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        setRecordingTime(elapsed);

        if (elapsed >= maxRecordingTime) {
          stopRecording();
        }

        // Enviar dados em tempo real se habilitado
        if (
          enableRealtimeData &&
          elapsed % realtimeInterval < REALTIME_THRESHOLD
        ) {
          const currentBlob = new Blob(chunksRef.current, {
            type: mediaRecorder.mimeType,
          });
          onRecordingData?.(currentBlob);
        }
      }, AUDIO_DATA_INTERVAL);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao acessar microfone"
      );
      setIsRecording(false);
    }
  }, [
    analyzeAudio,
    onRecordingComplete,
    onRecordingData,
    enableRealtimeData,
    realtimeInterval,
    maxRecordingTime,
    stopRecording,
  ]);

  // Limpar recursos quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) {
          track.stop();
        }
      }
    };
  }, []);

  return {
    isRecording,
    recordingTime,
    waveformData,
    error,
    startRecording,
    stopRecording,
  };
}

// Componente principal
export const ChatMicRecorder = memo(
  ({
    onRecordingComplete,
    onRecordingData,
    enableRealtimeData = false,
    realtimeInterval = 1000,
    disabled = false,
    recordingText = "Gravando...",
    maxRecordingTime = 300, // segundos
    className,
    ...props
  }: ChatMicRecorderProps) => {
    const {
      isRecording,
      recordingTime,
      waveformData,
      error,
      startRecording,
      stopRecording,
    } = useAudioRecorder({
      onRecordingComplete,
      onRecordingData,
      enableRealtimeData,
      realtimeInterval,
      maxRecordingTime: maxRecordingTime * CONVERSION_TO_SECONDS,
    });

    // Formatar tempo de gravação
    const formatTime = useCallback((ms: number) => {
      const seconds = Math.floor(ms / CONVERSION_TO_SECONDS);
      const minutes = Math.floor(seconds / CONVERSION_TO_MINUTES);
      const remainingSeconds = seconds % CONVERSION_TO_MINUTES;
      return `${minutes}:${remainingSeconds.toString().padStart(TIME_PADDING, "0")}`;
    }, []);

    // Handler para o botão de gravação
    const handleRecordClick = useCallback(() => {
      if (disabled) {
        return;
      }

      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }, [disabled, isRecording, startRecording, stopRecording]);

    // Renderizar status baseado no estado
    const renderStatus = () => {
      if (error) {
        return (
          <span className={styles.errorText}>
            <XCircle className={styles.smallIcon} />
            Erro
          </span>
        );
      }

      if (isRecording) {
        return (
          <span className={styles.recordingText}>
            <Loader2 className={styles.loaderIcon} />
            {recordingText}
          </span>
        );
      }

      if (disabled) {
        return "Desabilitado";
      }

      return "Pronto para gravar";
    };

    return (
      <div className={cn(styles.container, className)} {...props}>
        {/* Botão de gravação/parada */}
        <button
          className={cn(
            styles.button,
            isRecording ? styles.stopButton : styles.recordButton,
            disabled && styles.disabledButton
          )}
          disabled={disabled}
          onClick={handleRecordClick}
          title={isRecording ? "Parar gravação" : "Iniciar gravação"}
          type="button"
        >
          {isRecording ? (
            <Square className={styles.icon} />
          ) : (
            <Mic className={styles.icon} />
          )}
        </button>

        {/* Waveform visual */}
        {isRecording && (
          <div className={styles.waveform}>
            {waveformData.map((amplitude, index) => {
              // Calcular altura baseada na amplitude
              const heightPercent = Math.max(
                MIN_BAR_HEIGHT,
                amplitude * BAR_HEIGHT_MULTIPLIER
              );
              const heightClass = getHeightClass(heightPercent);

              return (
                <div
                  className={cn(
                    styles.bar,
                    styles.barHeight,
                    heightClass,
                    amplitude > AMPLITUDE_HIGH_THRESHOLD
                      ? styles.barHigh
                      : styles.barLow
                  )}
                  key={`bar-${amplitude.toFixed(DECIMAL_PLACES)}-${index}`}
                />
              );
            })}
          </div>
        )}

        {/* Display de tempo */}
        {isRecording && (
          <div className={styles.timeDisplay}>{formatTime(recordingTime)}</div>
        )}

        {/* Status */}
        <div className={styles.status}>{renderStatus()}</div>
      </div>
    );
  }
);

ChatMicRecorder.displayName = "ChatMicRecorder";
