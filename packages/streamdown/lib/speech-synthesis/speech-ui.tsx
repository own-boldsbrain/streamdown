import type { ChangeEvent } from "react";
import { cn } from "../utils";

// Tipos de controles
export type ControlsProps = {
  isPlaying: boolean;
  isPaused: boolean;
  isTextAvailable: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  compact?: boolean;
};

// Tipo do indicador de estado
export type StatusIndicatorProps = {
  isPlaying: boolean;
  isPaused: boolean;
};

// Tipo para controles de configuração
export type SettingsControlProps = {
  label: string;
  id: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  formatValue: (value: number) => string;
  compact?: boolean;
};

// Componente para o indicador de status
export function SpeechStatusIndicator({
  isPlaying,
  isPaused,
}: StatusIndicatorProps) {
  // Determinar texto e classe com base no estado
  let statusText = "Pronto";
  let statusClass = "bg-gray-400";
  let statusState = "stopped";
  let ariaStatusText = "Parado";

  if (isPlaying) {
    statusText = "Reproduzindo";
    statusClass = "animate-pulse bg-green-500";
    statusState = "playing";
    ariaStatusText = "Reproduzindo";
  } else if (isPaused) {
    statusText = "Pausado";
    statusClass = "bg-yellow-500";
    statusState = "paused";
    ariaStatusText = "Pausado";
  }

  return (
    <div
      aria-live="polite"
      className="flex items-center gap-2"
      data-state={statusState}
    >
      <span className="sr-only">{ariaStatusText}</span>
      <div
        className={cn("flex h-2 w-2 rounded-full", statusClass)}
        data-speech-status
      />
      <span className="text-muted-foreground text-xs">{statusText}</span>
    </div>
  );
}

// Componente para os controles de reprodução
export function SpeechControls({
  isPlaying,
  isPaused,
  isTextAvailable,
  onPlay,
  onPause,
  onStop,
  compact,
}: ControlsProps) {
  // Determinar ícone e texto com base no estado
  let playIcon = "▶️";
  let playLabel = "Reproduzir";

  if (isPlaying) {
    playIcon = "⏸️";
    playLabel = "Pausar";
  } else if (isPaused) {
    playIcon = "▶️";
    playLabel = "Continuar";
  }

  const stopIcon = "⏹️";
  const isStopDisabled = !(isPlaying || isPaused);

  return (
    <div className="flex items-center gap-2">
      <button
        aria-label={playLabel}
        className={cn(
          "inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          isPlaying ? "bg-accent text-accent-foreground" : ""
        )}
        disabled={!isTextAvailable}
        onClick={isPlaying ? onPause : onPlay}
        title={playLabel}
        type="button"
      >
        <span aria-hidden="true">{playIcon}</span>
        {!compact && <span className="ml-1">{playLabel}</span>}
      </button>

      <button
        aria-label="Parar"
        className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        disabled={isStopDisabled}
        onClick={onStop}
        title="Parar"
        type="button"
      >
        <span aria-hidden="true">{stopIcon}</span>
        {!compact && <span className="ml-1">Parar</span>}
      </button>
    </div>
  );
}

// Componente para um controle de configuração
export function SettingControl({
  label,
  id,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  compact,
}: SettingsControlProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        className={cn("font-medium text-sm", compact ? "sr-only" : "")}
        htmlFor={id}
      >
        {label}:
      </label>
      <input
        aria-label={`Ajustar ${label.toLowerCase()}`}
        className="h-2 w-24 appearance-none rounded-md bg-border [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground"
        id={id}
        max={max}
        min={min}
        onChange={onChange}
        step={step}
        title={`${label}: ${formatValue(value)}`}
        type="range"
        value={value}
      />
      <span aria-hidden="true" className="text-muted-foreground text-xs">
        {formatValue(value)}
      </span>
    </div>
  );
}
