"use client";

import type { HTMLAttributes } from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../utils";
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw, 
  Maximize, 
  Minimize 
} from "lucide-react";

// Constantes para zoom e rotação
const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const ROTATION_STEP = 90;

// Tipos para controlar o modo de exibição e estado
type ViewMode = "contain" | "cover" | "fill" | "custom";

// Interface para propriedades do componente
interface VizLightboxProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  caption?: string;
  isOpen?: boolean;
  onClose?: () => void;
  initialViewMode?: ViewMode;
}

// Classes CSS para estilização
const lightboxClasses = {
  backdrop: "fixed inset-0 z-50 bg-black/80 flex items-center justify-center",
  container: "relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg",
  imageWrapper: "relative flex items-center justify-center h-full w-full transition-transform duration-300",
  image: "max-h-full max-w-full transition-all duration-300 ease-in-out",
  controls: "absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-full bg-black/60 text-white",
  button: "p-2 rounded-full hover:bg-white/20 transition-colors",
  closeButton: "absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-white/20 transition-colors",
  caption: "absolute bottom-16 left-1/2 -translate-x-1/2 p-2 rounded-md bg-black/60 text-white text-sm max-w-md text-center",
};

// Estilos para modos de visualização
const viewModeStyles = {
  contain: "object-contain",
  cover: "object-cover",
  fill: "object-fill",
  custom: "",
};

const VizLightbox = memo(
  ({
    src,
    alt = "Imagem em tela cheia",
    caption,
    isOpen = false,
    onClose,
    initialViewMode = "contain",
    className,
    ...props
  }: VizLightboxProps) => {
    // Estados para controlar o lightbox
    const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    // Função para incrementar o zoom
    const handleZoomIn = useCallback(() => {
      setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
      setViewMode("custom");
    }, []);

    // Função para decrementar o zoom
    const handleZoomOut = useCallback(() => {
      setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
      setViewMode("custom");
    }, []);

    // Função para rotacionar no sentido horário
    const handleRotateClockwise = useCallback(() => {
      setRotation((prev) => (prev + ROTATION_STEP) % 360);
    }, []);

    // Função para rotacionar no sentido anti-horário
    const handleRotateCounterclockwise = useCallback(() => {
      setRotation((prev) => (prev - ROTATION_STEP + 360) % 360);
    }, []);

    // Função para alternar modo de tela cheia
    const handleToggleFullscreen = useCallback(() => {
      if (!containerRef.current) return;

      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen().catch((err) => {
            console.error(`Erro ao entrar em tela cheia: ${err.message}`);
          });
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch((err) => {
            console.error(`Erro ao sair da tela cheia: ${err.message}`);
          });
        }
      }
    }, [isFullscreen]);

    // Função para alternar entre modos de visualização
    const handleToggleViewMode = useCallback(() => {
      const modes: ViewMode[] = ["contain", "cover", "fill", "custom"];
      const currentIndex = modes.indexOf(viewMode);
      const nextIndex = (currentIndex + 1) % (modes.length - 1); // Evita modo 'custom'
      setViewMode(modes[nextIndex]);
      setZoom(1); // Resetar zoom ao trocar o modo
      setRotation(0); // Resetar rotação ao trocar o modo
    }, [viewMode]);

    // Função para fechar o lightbox
    const handleClose = useCallback(() => {
      if (onClose) {
        onClose();
      }
    }, [onClose]);

    // Detectar teclas para navegação
    useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case "Escape":
            handleClose();
            break;
          case "+":
            handleZoomIn();
            break;
          case "-":
            handleZoomOut();
            break;
          case "r":
            handleRotateClockwise();
            break;
          case "R":
            handleRotateCounterclockwise();
            break;
          case "f":
            handleToggleFullscreen();
            break;
          case "m":
            handleToggleViewMode();
            break;
          default:
            break;
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [
      isOpen,
      handleClose,
      handleZoomIn,
      handleZoomOut,
      handleRotateClockwise,
      handleRotateCounterclockwise,
      handleToggleFullscreen,
      handleToggleViewMode,
    ]);

    // Detectar mudanças no status de tela cheia
    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };

      document.addEventListener("fullscreenchange", handleFullscreenChange);
      return () => {
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
      };
    }, []);

    // Se o lightbox não estiver aberto, não renderizamos nada
    if (!isOpen) return null;

    return (
      <div 
        className={lightboxClasses.backdrop}
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-label="Visualizador de imagem"
        data-testid="viz-lightbox"
      >
        <div 
          className={cn(lightboxClasses.container, className)}
          onClick={(e) => e.stopPropagation()}
          ref={containerRef}
          {...props}
        >
          <div className={lightboxClasses.imageWrapper}>
            <img
              src={src}
              alt={alt}
              ref={imageRef}
              className={cn(
                lightboxClasses.image,
                viewMode !== "custom" && viewModeStyles[viewMode]
              )}
              style={{
                transform: `rotate(${rotation}deg) scale(${zoom})`,
              }}
            />
          </div>

          {caption && (
            <div className={lightboxClasses.caption}>
              {caption}
            </div>
          )}

          <button
            className={lightboxClasses.closeButton}
            onClick={handleClose}
            aria-label="Fechar visualizador"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>

          <div className={lightboxClasses.controls}>
            <button
              className={lightboxClasses.button}
              onClick={handleZoomIn}
              aria-label="Aumentar zoom"
              type="button"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              className={lightboxClasses.button}
              onClick={handleZoomOut}
              aria-label="Diminuir zoom"
              type="button"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              className={lightboxClasses.button}
              onClick={handleRotateClockwise}
              aria-label="Rotacionar no sentido horário"
              type="button"
            >
              <RotateCw className="h-5 w-5" />
            </button>
            <button
              className={lightboxClasses.button}
              onClick={handleRotateCounterclockwise}
              aria-label="Rotacionar no sentido anti-horário"
              type="button"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            <button
              className={lightboxClasses.button}
              onClick={handleToggleViewMode}
              aria-label="Alternar modo de visualização"
              type="button"
            >
              <span className="sr-only">Modo: {viewMode}</span>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="12" cy="12" r="5" />
              </svg>
            </button>
            <button
              className={lightboxClasses.button}
              onClick={handleToggleFullscreen}
              aria-label={isFullscreen ? "Sair da tela cheia" : "Entrar em tela cheia"}
              type="button"
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Maximize className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

VizLightbox.displayName = "VizLightbox";

export default VizLightbox;