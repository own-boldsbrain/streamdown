"use client";

import {
  Download,
  Mic,
  Pause,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Slider } from "../ui/slider";

// Constantes para configurações do TTS Player
const DEFAULT_VOLUME = 0.7;
const WORD_MIN_DURATION_SEC = 0.2;
const WORD_DURATION_PER_CHAR = 0.06;
const AUDIO_END_BUFFER_SEC = 0.5;
const SKIP_SECONDS = 5;
const DEFAULT_MAX_DURATION = 100;

// Constantes para taxas de reprodução
const PLAYBACK_RATES = {
  VERY_SLOW: 0.5,
  SLOW: 0.75,
  NORMAL: 1.0,
  FAST: 1.25,
  FASTER: 1.5,
  VERY_FAST: 2.0,
};

// Regex para divisão de palavras (definido fora da função)
const WORD_SPLIT_REGEX = /\s+/;

type TTSPlayerProps = {
  url: string;
  text: string;
  voiceName?: string;
  className?: string;
  compact?: boolean;
  highlightText?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onDownload?: () => void;
};

// Map para armazenar timestamps de palavras (simulado)
// Em um cenário real, isso viria do serviço de TTS
type WordTimestamp = {
  word: string;
  start: number;
  end: number;
};

const ChatTTSPlayer: React.FC<TTSPlayerProps> = ({
  url,
  text,
  voiceName = "Voz padrão",
  className,
  compact = false,
  highlightText = true,
  onPlay,
  onPause,
  onEnded,
  onDownload,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(PLAYBACK_RATES.NORMAL);
  const [isLoaded, setIsLoaded] = useState(false);
  const [wordTimestamps, setWordTimestamps] = useState<WordTimestamp[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);

  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>();

  // Simula a geração de timestamps para palavras
  useEffect(() => {
    if (!text) {
      return;
    }

    // Divide o texto em palavras
    const words = text.split(WORD_SPLIT_REGEX);

    // Gera timestamps simulados
    // Em um cenário real, esses dados viriam do serviço de TTS
    const timestamps: WordTimestamp[] = [];
    let currentTimePos = 0;

    for (const word of words) {
      // Simula a duração com base no comprimento da palavra
      const wordDuration = Math.max(
        WORD_MIN_DURATION_SEC,
        word.length * WORD_DURATION_PER_CHAR
      );

      timestamps.push({
        word,
        start: currentTimePos,
        end: currentTimePos + wordDuration,
      });

      currentTimePos += wordDuration;
    }

    setWordTimestamps(timestamps);

    // Ajusta a duração total se ainda não temos o áudio carregado
    if (duration === 0 && timestamps.length > 0) {
      const lastWord = timestamps.at(-1);
      if (lastWord) {
        setDuration(lastWord.end + AUDIO_END_BUFFER_SEC);
      }
    }
  }, [text, duration]);

  // Configura o áudio quando o componente monta
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);

      // Atualiza o índice da palavra atual com base no tempo
      if (wordTimestamps.length > 0) {
        const newIndex = wordTimestamps.findIndex(
          (item) =>
            audio.currentTime >= item.start && audio.currentTime <= item.end
        );

        if (newIndex !== -1 && newIndex !== currentWordIndex) {
          setCurrentWordIndex(newIndex);
        } else {
          const lastWord = wordTimestamps.at(-1);
          if (lastWord && audio.currentTime > lastWord.end) {
            setCurrentWordIndex(-1); // Resetar quando passar da última palavra
          }
        }
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setCurrentWordIndex(-1);
      if (onEnded) {
        onEnded();
      }
    };

    // Adiciona event listeners
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    // Configura volume inicial e taxa de reprodução
    audio.volume = volume;
    audio.playbackRate = playbackRate;

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current || 0);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onEnded, volume, playbackRate, wordTimestamps, currentWordIndex]);

  // Controle de reprodução
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      cancelAnimationFrame(animationRef.current || 0);
      setIsPlaying(false);
      if (onPause) {
        onPause();
      }
    } else {
      audio.play();
      animationRef.current = requestAnimationFrame(updateTime);
      setIsPlaying(true);
      if (onPlay) {
        onPlay();
      }
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
        audioRef.current.currentTime - SKIP_SECONDS
      );
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + SKIP_SECONDS
      );
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (url) {
      // Criar um link de download
      const a = document.createElement("a");
      a.href = url;
      a.download = `tts-audio-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Formata o tempo em MM:SS
  const formatTime = (time: number) => {
    if (Number.isNaN(time)) {
      return "00:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Renderiza o texto com destaque na palavra atual
  const renderHighlightedText = () => {
    if (!highlightText || wordTimestamps.length === 0) {
      return <p className="text-sm">{text}</p>;
    }

    return (
      <p className="text-sm leading-relaxed">
        {wordTimestamps.map((item, i) => (
          <React.Fragment key={`word-${i}-${item.word}`}>
            <span
              className={cn(
                "transition-colors duration-100",
                i === currentWordIndex && isPlaying
                  ? "rounded bg-primary/20 px-0.5 font-medium text-primary-foreground"
                  : ""
              )}
            >
              {item.word}
            </span>
            {i < wordTimestamps.length - 1 ? " " : ""}
          </React.Fragment>
        ))}
      </p>
    );
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className={cn("p-4", compact ? "space-y-2" : "space-y-4")}>
        {/* Header com nome da voz */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mic className="h-4 w-4 text-primary" />
            <p className="font-medium text-xs">{voiceName}</p>
          </div>

          <div className="flex items-center space-x-1">
            {/* Configurações de velocidade */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-7 w-7" size="icon" variant="ghost">
                  <Settings className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className={cn(
                    playbackRate === PLAYBACK_RATES.VERY_SLOW && "bg-primary/10"
                  )}
                  onClick={() =>
                    handlePlaybackRateChange(PLAYBACK_RATES.VERY_SLOW)
                  }
                >
                  Velocidade 0.5x
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn(
                    playbackRate === PLAYBACK_RATES.SLOW && "bg-primary/10"
                  )}
                  onClick={() => handlePlaybackRateChange(PLAYBACK_RATES.SLOW)}
                >
                  Velocidade 0.75x
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn(
                    playbackRate === PLAYBACK_RATES.NORMAL && "bg-primary/10"
                  )}
                  onClick={() =>
                    handlePlaybackRateChange(PLAYBACK_RATES.NORMAL)
                  }
                >
                  Velocidade normal
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn(
                    playbackRate === PLAYBACK_RATES.FAST && "bg-primary/10"
                  )}
                  onClick={() => handlePlaybackRateChange(PLAYBACK_RATES.FAST)}
                >
                  Velocidade 1.25x
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn(
                    playbackRate === PLAYBACK_RATES.FASTER && "bg-primary/10"
                  )}
                  onClick={() =>
                    handlePlaybackRateChange(PLAYBACK_RATES.FASTER)
                  }
                >
                  Velocidade 1.5x
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn(
                    playbackRate === PLAYBACK_RATES.VERY_FAST && "bg-primary/10"
                  )}
                  onClick={() =>
                    handlePlaybackRateChange(PLAYBACK_RATES.VERY_FAST)
                  }
                >
                  Velocidade 2x
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Botão de download */}
            <Button
              className="h-7 w-7"
              onClick={handleDownload}
              size="icon"
              variant="ghost"
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Texto com destaque */}
        <div
          className={cn(
            "max-h-40 overflow-y-auto rounded bg-muted/40 p-3",
            compact && "max-h-20"
          )}
        >
          {renderHighlightedText()}
        </div>

        {/* Controles de áudio */}
        <div className="flex flex-col space-y-2">
          {/* Barra de progresso */}
          <div className="flex items-center space-x-2">
            <span className="w-8 text-right text-muted-foreground text-xs">
              {formatTime(currentTime)}
            </span>
            <Slider
              className="flex-1"
              disabled={!isLoaded}
              max={duration || DEFAULT_MAX_DURATION}
              min={0}
              onValueChange={handleSeek}
              step={0.1}
              value={[currentTime]}
            />
            <span className="w-8 text-muted-foreground text-xs">
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
        <audio preload="metadata" ref={audioRef} src={url}>
          <track kind="captions" label="Português" src="" />
        </audio>
      </CardContent>
    </Card>
  );
};

export default ChatTTSPlayer;
