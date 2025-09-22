"use client";

import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// Constantes para visualização de onda de áudio
const NUM_OF_BARS = 40;
const MIN_BAR_HEIGHT = 5;
const MAX_BAR_HEIGHT = 80;
const BAR_WIDTH = 4;
const BAR_GAP = 2;
const ANIMATION_SPEED = 300; // ms

type AudioWaveformProps = {
  url: string;
  title?: string;
  artist?: string;
  className?: string;
  waveColor?: string;
  activeColor?: string;
  compact?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
};

const AudioWaveform: React.FC<AudioWaveformProps> = ({
  url,
  title,
  artist,
  className,
  waveColor = "bg-primary/30",
  activeColor = "bg-primary",
  compact = false,
  onPlay,
  onPause,
  onEnded,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>();

  // Gera dados aleatórios para visualização de onda
  useEffect(() => {
    // Neste exemplo, estamos gerando dados aleatórios para a forma de onda
    // Em um cenário real, você extrairia esses dados do arquivo de áudio
    const generateRandomWaveform = () => {
      const data = [];
      for (let i = 0; i < NUM_OF_BARS; i++) {
        // Cria um padrão mais natural para a forma de onda
        const height =
          MIN_BAR_HEIGHT + Math.random() * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT);
        data.push(height);
      }
      return data;
    };

    setWaveformData(generateRandomWaveform());
  }, [url]);

  // Configura o áudio quando o componente monta
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onEnded) onEnded();
    };

    // Adiciona event listeners
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    // Configura volume inicial
    audio.volume = volume;

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current || 0);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onEnded, volume, url]);

  // Controle de reprodução
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      cancelAnimationFrame(animationRef.current || 0);
      setIsPlaying(false);
      if (onPause) onPause();
    } else {
      audio.play();
      animationRef.current = requestAnimationFrame(updateTime);
      setIsPlaying(true);
      if (onPlay) onPlay();
    }
  };

  const updateTime = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
      animationRef.current = requestAnimationFrame(updateTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    const seekTime = value[0];
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleSkipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        audioRef.current.currentTime - 10
      );
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + 10
      );
    }
  };

  // Formata o tempo em MM:SS
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Calcular qual parte da forma de onda deve estar ativa com base no tempo atual
  const activeBarIndex = Math.floor(
    (currentTime / duration) * waveformData.length
  );

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className={cn("p-4", compact ? "space-y-2" : "space-y-4")}>
        {/* Informações de áudio */}
        {!compact && (title || artist) && (
          <div className="space-y-1">
            {title && <h3 className="truncate font-medium text-sm">{title}</h3>}
            {artist && (
              <p className="truncate text-muted-foreground text-xs">{artist}</p>
            )}
          </div>
        )}

        {/* Forma de onda de áudio */}
        <div
          className={cn(
            "flex h-20 items-end justify-center space-x-[2px]",
            compact && "h-12"
          )}
        >
          {waveformData.map((height, index) => (
            <div
              className={cn(
                "rounded-t-sm transition-all duration-300 ease-in-out",
                index <= activeBarIndex ? activeColor : waveColor
              )}
              key={index}
              style={{
                height: `${height}%`,
                width: BAR_WIDTH,
                minHeight: MIN_BAR_HEIGHT,
                maxHeight: compact ? MAX_BAR_HEIGHT / 2 : MAX_BAR_HEIGHT,
                // Efeito de animação para barras próximas à barra ativa
                transform:
                  isPlaying && Math.abs(index - activeBarIndex) < 5
                    ? `scaleY(${1 + Math.random() * 0.2})`
                    : "scaleY(1)",
              }}
            />
          ))}
        </div>

        {/* Controles de áudio */}
        <div className="flex flex-col space-y-2">
          {/* Barra de progresso */}
          <div className="flex items-center space-x-2">
            <span className="w-10 text-right text-muted-foreground text-xs">
              {formatTime(currentTime)}
            </span>
            <Slider
              className="flex-1"
              disabled={!isLoaded}
              max={duration || 100}
              min={0}
              onValueChange={handleSeek}
              step={0.1}
              value={[currentTime]}
            />
            <span className="w-10 text-muted-foreground text-xs">
              {formatTime(duration)}
            </span>
          </div>

          {/* Botões de controle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                className="h-8 w-8"
                disabled={!isLoaded}
                onClick={handleSkipBackward}
                size="icon"
                variant="ghost"
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                className="h-9 w-9"
                disabled={!isLoaded}
                onClick={togglePlayPause}
                size="icon"
                variant={isPlaying ? "outline" : "default"}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              <Button
                className="h-8 w-8"
                disabled={!isLoaded}
                onClick={handleSkipForward}
                size="icon"
                variant="ghost"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Volume */}
            <div className="flex items-center space-x-2">
              <Button
                className="h-8 w-8"
                onClick={toggleMute}
                size="icon"
                variant="ghost"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>

              <Slider
                className="w-20"
                max={1}
                min={0}
                onValueChange={handleVolumeChange}
                step={0.01}
                value={[isMuted ? 0 : volume]}
              />
            </div>
          </div>
        </div>

        {/* Audio Element (hidden) */}
        <audio preload="metadata" ref={audioRef} src={url} />
      </CardContent>
    </Card>
  );
};

export default AudioWaveform;
