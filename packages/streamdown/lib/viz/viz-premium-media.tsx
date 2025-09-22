"use client";

import type { HTMLAttributes } from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../utils";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Download,
  FileText,
  Video,
  Music,
  AlertCircle,
} from "lucide-react";

// Constantes para números mágicos
const PROGRESS_BAR_MAX_WIDTH_PERCENT = 100;

// Tipos de mídia suportados
type MediaType = "video" | "audio" | "pdf";

// Interface para propriedades do componente
interface VizPremiumMediaProps extends Omit<HTMLAttributes<HTMLDivElement>, "onError"> {
  src: string;
  type: MediaType;
  title?: string;
  poster?: string; // Para vídeos
  autoPlay?: boolean;
  controls?: boolean;
  downloadable?: boolean;
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
  onError?: (error: Error) => void;
}

// Classes CSS para estilização
const mediaClasses = {
  container: "relative rounded-lg border bg-background overflow-hidden",
  mediaWrapper: "relative bg-muted",
  video: "w-full h-full object-contain",
  audio: "w-full",
  pdfContainer: "flex flex-col items-center justify-center min-h-[400px] p-8",
  pdfViewer: "w-full h-full min-h-[600px] border rounded",
  controls: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4",
  controlsBar: "flex items-center justify-between text-white",
  playButton: "p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors",
  volumeButton: "p-2 rounded-full hover:bg-white/20 transition-colors",
  downloadButton: "p-2 rounded-full hover:bg-white/20 transition-colors",
  progressBar: "flex-1 mx-4 h-1 bg-white/30 rounded-full cursor-pointer",
  progressFill: "h-full bg-white rounded-full transition-all",
  timeDisplay: "text-sm font-mono",
  errorContainer: "flex flex-col items-center justify-center min-h-[200px] p-8 text-center",
  errorIcon: "h-12 w-12 text-red-500 mb-4",
  errorTitle: "text-lg font-semibold text-red-500 mb-2",
  errorMessage: "text-muted-foreground",
  loadingContainer: "flex items-center justify-center min-h-[200px]",
  loadingSpinner: "h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent",
  title: "absolute top-4 left-4 text-white text-lg font-semibold drop-shadow-lg",
};

const VizPremiumMedia = memo(
  ({
    src,
    type,
    title,
    poster,
    autoPlay = false,
    controls = true,
    downloadable = false,
    onLoadStart,
    onLoadComplete,
    onError,
    className,
    ...props
  }: VizPremiumMediaProps) => {
    // Estados
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Refs
    const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Função para formatar tempo
    const formatTime = useCallback((time: number) => {
      if (Number.isNaN(time)) {
        return "0:00";
      }
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }, []);

    // Controle de reprodução
    const togglePlayPause = useCallback(() => {
      if (!mediaRef.current) {
        return;
      }

      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
    }, [isPlaying]);

    // Controle de volume
    const toggleMute = useCallback(() => {
      if (!mediaRef.current) {
        return;
      }

      mediaRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }, [isMuted]);

    // Controle de progresso
    const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (!mediaRef.current) {
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;

      mediaRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }, [duration]);

    // Toggle fullscreen
    const toggleFullscreen = useCallback(() => {
      if (!containerRef.current) {
        return;
      }

      if (isFullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      } else if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    }, [isFullscreen]);

    // Download do arquivo
    const handleDownload = useCallback(() => {
      const link = document.createElement("a");
      link.href = src;
      link.download = title || `media.${type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, [src, title, type]);

    // Handlers de eventos da mídia
    const handleLoadedMetadata = useCallback(() => {
      if (mediaRef.current) {
        setDuration(mediaRef.current.duration);
        setIsLoading(false);
        onLoadComplete?.();
      }
    }, [onLoadComplete]);

    const handleTimeUpdate = useCallback(() => {
      if (mediaRef.current) {
        setCurrentTime(mediaRef.current.currentTime);
      }
    }, []);

    const handlePlay = useCallback(() => {
      setIsPlaying(true);
    }, []);

    const handlePause = useCallback(() => {
      setIsPlaying(false);
    }, []);

    const handleVolumeChange = useCallback(() => {
      if (mediaRef.current) {
        setVolume(mediaRef.current.volume);
        setIsMuted(mediaRef.current.muted);
      }
    }, []);

    const handleError = useCallback(() => {
      const errorMessage = "Erro ao carregar mídia";
      setError(errorMessage);
      setIsLoading(false);
      onError?.(new Error(errorMessage));
    }, [onError]);

    // Detectar mudanças de fullscreen
    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };

      document.addEventListener("fullscreenchange", handleFullscreenChange);
      return () => {
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
      };
    }, []);

    // Renderizar conteúdo baseado no tipo
    const renderMediaContent = () => {
      switch (type) {
        case "video":
          return (
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              src={src}
              poster={poster}
              autoPlay={autoPlay}
              className={mediaClasses.video}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onPlay={handlePlay}
              onPause={handlePause}
              onVolumeChange={handleVolumeChange}
              onError={handleError}
              onLoadStart={onLoadStart}
            />
          );

        case "audio":
          return (
            <div className="p-8">
              <audio
                ref={mediaRef as React.RefObject<HTMLAudioElement>}
                src={src}
                autoPlay={autoPlay}
                className={mediaClasses.audio}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onPlay={handlePlay}
                onPause={handlePause}
                onVolumeChange={handleVolumeChange}
                onError={handleError}
                onLoadStart={onLoadStart}
              />
            </div>
          );

        case "pdf":
          return (
            <div className={mediaClasses.pdfContainer}>
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Visualizador PDF</h3>
              <p className="text-muted-foreground text-center mb-4">
                Para visualizar este PDF, faça o download ou abra em um visualizador externo.
              </p>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <Download className="h-4 w-4 inline mr-2" />
                Download PDF
              </button>
            </div>
          );

        default:
          return (
            <div className={mediaClasses.errorContainer}>
              <AlertCircle className={mediaClasses.errorIcon} />
              <h3 className={mediaClasses.errorTitle}>Tipo de mídia não suportado</h3>
              <p className={mediaClasses.errorMessage}>
                O tipo "{type}" não é suportado por este componente.
              </p>
            </div>
          );
      }
    };

    // Renderizar controles
    const renderControls = () => {
      if (!controls || type === "pdf") {
        return null;
      }

      return (
        <div className={mediaClasses.controls}>
          <div className={mediaClasses.controlsBar}>
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlayPause}
                className={mediaClasses.playButton}
                aria-label={isPlaying ? "Pausar" : "Reproduzir"}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className={mediaClasses.volumeButton}
                aria-label={isMuted ? "Ativar som" : "Desativar som"}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>

              <div className={mediaClasses.timeDisplay}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className={mediaClasses.progressBar} onClick={handleProgressClick}>
              <div
                className={mediaClasses.progressFill}
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            <div className="flex items-center gap-2">
              {downloadable && (
                <button
                  onClick={handleDownload}
                  className={mediaClasses.downloadButton}
                  aria-label="Download"
                >
                  <Download className="h-5 w-5" />
                </button>
              )}

              {type === "video" && (
                <button
                  onClick={toggleFullscreen}
                  className={mediaClasses.volumeButton}
                  aria-label="Tela cheia"
                >
                  <Maximize className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      );
    };

    // Renderizar ícone do tipo de mídia
    const renderMediaIcon = () => {
      switch (type) {
        case "video":
          return <Video className="h-6 w-6" />;
        case "audio":
          return <Music className="h-6 w-6" />;
        case "pdf":
          return <FileText className="h-6 w-6" />;
        default:
          return <AlertCircle className="h-6 w-6" />;
      }
    };

    if (error) {
      return (
        <div className={cn(mediaClasses.container, className)} {...props}>
          <div className={mediaClasses.errorContainer}>
            <AlertCircle className={mediaClasses.errorIcon} />
            <h3 className={mediaClasses.errorTitle}>Erro ao carregar mídia</h3>
            <p className={mediaClasses.errorMessage}>{error}</p>
          </div>
        </div>
      );
    }

    return (
      <div
        className={cn(mediaClasses.container, className)}
        ref={containerRef}
        data-testid="viz-premium-media"
        {...props}
      >
        {title && (
          <div className={mediaClasses.title}>
            {renderMediaIcon()}
            <span className="ml-2">{title}</span>
          </div>
        )}

        <div className={mediaClasses.mediaWrapper}>
          {isLoading && type !== "pdf" && (
            <div className={mediaClasses.loadingContainer}>
              <div className={mediaClasses.loadingSpinner} />
            </div>
          )}

          {renderMediaContent()}
          {renderControls()}
        </div>
      </div>
    );
  }
);

VizPremiumMedia.displayName = "VizPremiumMedia";

export default VizPremiumMedia;