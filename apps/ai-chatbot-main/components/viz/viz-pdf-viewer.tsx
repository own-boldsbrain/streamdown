"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize,
  Printer,
  RotateCw,
  Search,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface PDFViewerProps {
  url: string;
  className?: string;
  previewMode?: boolean;
  onOpen?: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  url,
  className,
  previewMode = false,
  onOpen,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfDocumentRef = useRef<any>(null);

  // Simula o carregamento para fins de demonstração
  useEffect(() => {
    if (previewMode) return;

    const timer = setTimeout(() => {
      setIsLoading(false);
      setTotalPages(Math.floor(Math.random() * 20) + 5); // Simulação de número de páginas
    }, 1500);

    return () => clearTimeout(timer);
  }, [previewMode, url]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  const handleDownload = () => {
    window.open(url, "_blank");
  };

  const handlePrint = () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  };

  const goToPage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("page") as HTMLInputElement;
    const pageNumber = Number.parseInt(input.value, 10);

    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (previewMode) {
    return (
      <Card
        className={cn(
          "cursor-pointer transition-all hover:ring-2 hover:ring-primary/50",
          className
        )}
        onClick={onOpen}
      >
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex flex-col">
            <span className="font-medium text-sm">Documento PDF</span>
            <span className="max-w-[150px] truncate text-muted-foreground text-xs">
              {url.split("/").pop() || "documento.pdf"}
            </span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Download className="mr-2 h-4 w-4" />
            <Maximize className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted p-2">
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={currentPage <= 1 || isLoading}
                  onClick={handlePrevPage}
                  size="icon"
                  variant="outline"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Página anterior</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <form className="flex items-center space-x-1" onSubmit={goToPage}>
            <Input
              className="h-8 w-14 text-center"
              disabled={isLoading}
              max={totalPages}
              min={1}
              name="page"
              onChange={(e) =>
                setCurrentPage(Number.parseInt(e.target.value, 10) || 1)
              }
              type="number"
              value={currentPage}
            />
            <span className="text-muted-foreground text-sm">
              / {totalPages}
            </span>
          </form>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={currentPage >= totalPages || isLoading}
                  onClick={handleNextPage}
                  size="icon"
                  variant="outline"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Próxima página</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={isLoading}
                  onClick={handleZoomOut}
                  size="icon"
                  variant="outline"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Diminuir zoom</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span className="min-w-[40px] text-center text-sm">
            {Math.round(scale * 100)}%
          </span>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={isLoading}
                  onClick={handleZoomIn}
                  size="icon"
                  variant="outline"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Aumentar zoom</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={isLoading}
                  onClick={handleRotate}
                  size="icon"
                  variant="outline"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Girar página</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={isLoading}
                  onClick={handleDownload}
                  size="icon"
                  variant="outline"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Baixar PDF</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={isLoading}
                  onClick={handlePrint}
                  size="icon"
                  variant="outline"
                >
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Imprimir</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* PDF Container */}
      <div
        className="relative flex min-h-[500px] flex-1 items-center justify-center overflow-auto bg-gray-100"
        ref={containerRef}
      >
        {isLoading ? (
          <div className="space-y-4 p-8">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : (
          <div
            className="mx-auto my-4 overflow-hidden bg-white shadow-lg"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transformOrigin: "center center",
              transition: "transform 0.2s ease",
              width: "8.5in",
              height: "11in",
            }}
          >
            <iframe
              className="h-full w-full border-0"
              src={`${url}#page=${currentPage}`}
              title="PDF Viewer"
            />
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between border-t bg-muted p-1 px-3 text-muted-foreground text-xs">
        <span>Documento: {url.split("/").pop() || "documento.pdf"}</span>
        <span>
          Página {currentPage} de {totalPages}
        </span>
      </div>
    </div>
  );
};

export default PDFViewer;
