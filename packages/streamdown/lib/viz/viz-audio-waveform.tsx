"use client";

import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  memo,
} from "react";
import { cn } from "../utils";

// Constantes para porcentagens e valores de renderização
const PERCENT_100 = 100;
const MAX_BYTE_VALUE = 255;
const DEFAULT_MAX_DURATION = 100;

// Tipos para os componentes de UI
type ButtonProps = {
  className?: string;
  size?: "sm" | "default";
  variant?: "default" | "outline" | "ghost";
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
};

type SliderProps = {
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number[];
  onValueChange?: (value: number[]) => void;
  disabled?: boolean;
  "aria-label"?: string;
};

// Componentes UI simplificados para o pacote streamdown
const Button = memo(({ 
  className, 
  size = "default", 
  variant = "default", 
  children, 
  ...props 
}: ButtonProps) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      size === "sm" && "h-8 px-3 text-xs",
      size === "default" && "h-10 px-4 py-2",
      variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
      variant === "outline" && "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
      className
    )}
    type="button"
    {...props}
  >
    {children}
  </button>
));

Button.displayName = "Button";

// Estilos para o slider
const sliderStyles = {
  progressWidth: (value: number) => `${value * PERCENT_100}%`,
  thumbPosition: (value: number) => `${value * PERCENT_100}%`,
};

const Slider = memo(({ onValueChange, value, className, "aria-label": ariaLabel, ...props }: SliderProps) => {
  const currentValue = value && value.length > 0 ? value[0] : 0;
  
  return (
    <div
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      role="group"
      aria-label={ariaLabel}
    >
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute h-full bg-primary"
          style={{ width: sliderStyles.progressWidth(currentValue) }}
        />
      </div>
      <button
        className="absolute block h-5 w-5 rounded-full border-2 border-primary bg-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        style={{ 
          left: sliderStyles.thumbPosition(currentValue),
          transform: "translateX(-50%)" 
        }}
        type="button"
        aria-label={`Ajustar valor para ${Math.round(currentValue * PERCENT_100)}%`}
        onMouseDown={(e) => {
          // Simulação simplificada de interação com o slider
          const container = e.currentTarget.parentElement;
          if (!container) {
            return;
          }
          
          const handleMove = (moveEvent: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const percent = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
            onValueChange?.([percent]);
          };
          
          const handleUp = () => {
            document.removeEventListener("mousemove", handleMove);
            document.removeEventListener("mouseup", handleUp);
          };
          
          document.addEventListener("mousemove", handleMove);
          document.addEventListener("mouseup", handleUp);
        }}
      />
    </div>
  );
});

Slider.displayName = "Slider";

// Constantes para configuração do visualizador
const FFT_SIZE = 1024;
const MIN_DECIBELS = -90;
const MAX_DECIBELS = -10;
const SMOOTHING_TIME_CONSTANT = 0.85;
const CANVAS_HEIGHT = 128;
const BAR_WIDTH = 3;
const BAR_GAP = 1;
const DEFAULT_VOLUME = 0.7;
const SKIP_SECONDS = 5;
const WAVEFORM_COLOR = "rgb(99, 102, 241)"; // Indigo-500
const WAVEFORM_BG_COLOR = "rgba(99, 102, 241, 0.2)"; // Indigo-500 com transparência
const UPDATE_INTERVAL_MS = 50;

interface VizAudioWaveformProps extends HTMLAttributes<HTMLDivElement> {
  audioSrc: string;
  title?: string;
  autoPlay?: boolean;
  onPlaybackComplete?: () => void;
  showControls?: boolean;
}

const VizAudioWaveform = memo(
  ({
    audioSrc,
    title,
    autoPlay = false,
    onPlaybackComplete,
    showControls = true,
    className,
    ...props
  }: VizAudioWaveformProps) => {
    // Refs
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const updateTimerRef = useRef<number | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    // Estados
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(DEFAULT_VOLUME);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);

    // Formatar o tempo em MM:SS
    const formatTime = useCallback((time: number) => {
      if (Number.isNaN(time)) {
        return "00:00";
      }
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }, []);

    // Inicializa o áudio e o analisador
    const initAudio = useCallback(() => {
      if (!audioRef.current) return;

      try {
        // Cria o contexto de áudio
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        // Cria o nó de análise
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = FFT_SIZE;
        analyser.minDecibels = MIN_DECIBELS;
        analyser.maxDecibels = MAX_DECIBELS;
        analyser.smoothingTimeConstant = SMOOTHING_TIME_CONSTANT;
        analyserRef.current = analyser;

        // Cria o nó de ganho para controle de volume
        const gainNode = audioContext.createGain();
        gainNode.gain.value = volume;
        gainNodeRef.current = gainNode;

        // Conecta o elemento de áudio ao analisador
        const source = audioContext.createMediaElementSource(audioRef.current);
        sourceNodeRef.current = source;

        // Conecta source -> gain -> analyser -> destination
        source.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(audioContext.destination);

        // Inicializa o array de frequência
        const bufferLength = analyser.frequencyBinCount;
        setFrequencyData(new Uint8Array(bufferLength));

        // Inicia a renderização do canvas se o áudio deve iniciar automaticamente
        if (autoPlay) {
          audioRef.current.play().catch((error) => {
            console.error("Erro ao reproduzir áudio automaticamente:", error);
          });
        }

        // Inicia a animação
        startVisualization();
      } catch (error) {
        console.error("Erro ao inicializar o áudio:", error);
      }
    }, [autoPlay, volume]);

    // Renderiza a forma de onda no canvas
    const drawWaveform = useCallback(() => {
      if (!canvasRef.current || !analyserRef.current || !frequencyData) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Atualiza os dados de frequência
      analyserRef.current.getByteFrequencyData(frequencyData);

      // Limpa o canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Desenha o fundo com um gradiente
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, WAVEFORM_COLOR);
      gradient.addColorStop(1, WAVEFORM_BG_COLOR);

      // Calcula quantas barras cabem no canvas
      const numBars = Math.floor(canvas.width / (BAR_WIDTH + BAR_GAP));
      const dataStep = Math.ceil(frequencyData.length / numBars);

      // Desenha as barras
      for (let i = 0; i < numBars; i++) {
        // Calcula a média dos valores de frequência para esta barra
        let sum = 0;
        const dataIndex = i * dataStep;
        
        for (let j = 0; j < dataStep && dataIndex + j < frequencyData.length; j++) {
          sum += frequencyData[dataIndex + j];
        }
        
        const average = sum / dataStep;
        
        // Normaliza para a altura do canvas
        const barHeight = (average / 255) * canvas.height;
        
        // Posição x da barra
        const x = i * (BAR_WIDTH + BAR_GAP);
        
        // Desenha a barra a partir do centro
        const y = (canvas.height - barHeight) / 2;
        
        // Desenha a barra superior
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, BAR_WIDTH, barHeight);
      }

      // Solicita o próximo frame se estiver tocando
      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(drawWaveform);
      }
    }, [frequencyData, isPlaying]);

    // Inicia a visualização
    const startVisualization = useCallback(() => {
      if (!analyserRef.current || !frequencyData) return;

      // Cancela qualquer animação anterior
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Inicia a nova animação
      animationFrameRef.current = requestAnimationFrame(drawWaveform);
    }, [drawWaveform, frequencyData]);

    // Atualiza o tempo atual
    const updateTime = useCallback(() => {
      if (!audioRef.current) return;
      
      setCurrentTime(audioRef.current.currentTime);
    }, []);

    // Controles de reprodução
    const togglePlayPause = useCallback(() => {
      if (!audioRef.current || !audioContextRef.current) return;

      // Retoma o contexto de áudio se estiver suspenso
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

      if (isPlaying) {
        audioRef.current.pause();
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

        if (updateTimerRef.current) {
          clearInterval(updateTimerRef.current);
          updateTimerRef.current = null;
        }
      } else {
        audioRef.current.play();
        startVisualization();
        updateTimerRef.current = window.setInterval(updateTime, UPDATE_INTERVAL_MS);
      }

      setIsPlaying(!isPlaying);
    }, [isPlaying, startVisualization, updateTime]);

    // Controle de volume
    const handleVolumeChange = useCallback((value: number[]) => {
      const newVolume = value[0];
      setVolume(newVolume);
      
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = newVolume;
      }
      
      if (newVolume === 0) {
        setIsMuted(true);
      } else {
        setIsMuted(false);
      }
    }, []);

    // Controle de mudo
    const toggleMute = useCallback(() => {
      if (!gainNodeRef.current) return;
      
      if (isMuted) {
        gainNodeRef.current.gain.value = volume;
        setIsMuted(false);
      } else {
        gainNodeRef.current.gain.value = 0;
        setIsMuted(true);
      }
    }, [isMuted, volume]);

    // Controle de barra de progresso
    const handleSeek = useCallback((value: number[]) => {
      const seekTime = value[0];
      if (audioRef.current) {
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
      }
    }, []);

    // Controles de avanço e retrocesso
    const handleSkipBackward = useCallback(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = Math.max(
          0,
          audioRef.current.currentTime - SKIP_SECONDS
        );
      }
    }, []);

    const handleSkipForward = useCallback(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = Math.min(
          audioRef.current.duration,
          audioRef.current.currentTime + SKIP_SECONDS
        );
      }
    }, []);

    // Efeito para configurar o canvas
    useEffect(() => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // Define o tamanho real do canvas considerando o DPR
      canvas.width = rect.width * dpr;
      canvas.height = CANVAS_HEIGHT * dpr;
      
      // Ajusta o estilo CSS para manter as dimensões visuais
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${CANVAS_HEIGHT}px`;
      
      // Ajusta o contexto para o DPR
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    }, []);

    // Efeito para configurar o áudio
    useEffect(() => {
      const audio = new Audio(audioSrc);
      audioRef.current = audio;
      
      const handleCanPlay = () => {
        setIsLoaded(true);
      };
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        
        if (updateTimerRef.current) {
          clearInterval(updateTimerRef.current);
          updateTimerRef.current = null;
        }
        
        if (onPlaybackComplete) {
          onPlaybackComplete();
        }
      };
      
      // Adiciona os listeners
      audio.addEventListener("canplay", handleCanPlay);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("ended", handleEnded);
      
      // Inicializa o áudio quando estiver pronto
      audio.addEventListener("canplaythrough", initAudio, { once: true });
      
      // Cleanup
      return () => {
        audio.pause();
        audio.removeEventListener("canplay", handleCanPlay);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("canplaythrough", initAudio);
        
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        
        if (updateTimerRef.current) {
          clearInterval(updateTimerRef.current);
        }
        
        // Limpa os nós de áudio
        if (sourceNodeRef.current) {
          sourceNodeRef.current.disconnect();
        }
        
        if (analyserRef.current) {
          analyserRef.current.disconnect();
        }
        
        if (gainNodeRef.current) {
          gainNodeRef.current.disconnect();
        }
        
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };
    }, [audioSrc, initAudio, onPlaybackComplete]);

    return (
      <div 
        className={cn(
          "rounded-lg border bg-background p-4 shadow-sm",
          className
        )}
        data-testid="viz-audio-waveform"
        {...props}
      >
        {/* Cabeçalho com título opcional */}
        {title && (
          <div className="mb-3">
            <h3 className="text-sm font-semibold">{title}</h3>
          </div>
        )}

        {/* Canvas para visualização da forma de onda */}
        <div className="mb-4 overflow-hidden rounded-md bg-muted/30">
          <canvas 
            className="w-full"
            height={CANVAS_HEIGHT}
            ref={canvasRef}
          />
        </div>

        {/* Controles do player (condicionais) */}
        {showControls && (
          <div className="flex flex-col gap-2">
            {/* Progresso e tempo */}
            <div className="flex items-center gap-2 text-xs">
              <span className="w-10 text-muted-foreground">
                {formatTime(currentTime)}
              </span>
              <Slider
                aria-label="Progresso da reprodução"
                className="flex-1"
                disabled={!isLoaded}
                max={duration || 100}
                min={0}
                onValueChange={handleSeek}
                step={0.1}
                value={[currentTime]}
              />
              <span className="w-10 text-right text-muted-foreground">
                {formatTime(duration)}
              </span>
            </div>

            {/* Botões de controle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  aria-label="Voltar 5 segundos"
                  className="h-8 w-8 rounded-full p-0"
                  disabled={!isLoaded}
                  onClick={handleSkipBackward}
                  size="sm"
                  variant="outline"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                <Button
                  aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                  className="h-9 w-9 rounded-full p-0"
                  disabled={!isLoaded}
                  onClick={togglePlayPause}
                  size="sm"
                  variant={isPlaying ? "outline" : "default"}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  aria-label="Avançar 5 segundos"
                  className="h-8 w-8 rounded-full p-0"
                  disabled={!isLoaded}
                  onClick={handleSkipForward}
                  size="sm"
                  variant="outline"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <Button
                  aria-label={isMuted ? "Ativar som" : "Desativar som"}
                  className="h-8 w-8 rounded-full p-0"
                  onClick={toggleMute}
                  size="sm"
                  variant="outline"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>

                <Slider
                  aria-label="Volume"
                  className="w-24"
                  max={1}
                  min={0}
                  onValueChange={handleVolumeChange}
                  step={0.01}
                  value={[isMuted ? 0 : volume]}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

VizAudioWaveform.displayName = "VizAudioWaveform";

export default VizAudioWaveform;