"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize, 
  Printer, 
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  onOpen
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
    setScale(prevScale => Math.min(prevScale + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prevRotation => (prevRotation + 90) % 360);
  };

  const handleDownload = () => {
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
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
    const input = form.elements.namedItem('page') as HTMLInputElement;
    const pageNumber = parseInt(input.value, 10);
    
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (previewMode) {
    return (
      <Card className={cn("cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all", className)} onClick={onOpen}>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-medium text-sm">Documento PDF</span>
            <span className="text-xs text-muted-foreground truncate max-w-[150px]">
              {url.split('/').pop() || 'documento.pdf'}
            </span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Download className="h-4 w-4 mr-2" />
            <Maximize className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("flex flex-col border rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="bg-muted p-2 border-b flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handlePrevPage} disabled={currentPage <= 1 || isLoading}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Página anterior</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <form onSubmit={goToPage} className="flex items-center space-x-1">
            <Input
              type="number"
              name="page"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => setCurrentPage(parseInt(e.target.value, 10) || 1)}
              className="w-14 h-8 text-center"
              disabled={isLoading}
            />
            <span className="text-sm text-muted-foreground">/ {totalPages}</span>
          </form>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleNextPage} disabled={currentPage >= totalPages || isLoading}>
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
                <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={isLoading}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Diminuir zoom</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <span className="text-sm min-w-[40px] text-center">{Math.round(scale * 100)}%</span>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={isLoading}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Aumentar zoom</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleRotate} disabled={isLoading}>
                  <RotateCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Girar página</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleDownload} disabled={isLoading}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Baixar PDF</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handlePrint} disabled={isLoading}>
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
        ref={containerRef}
        className="relative flex-1 overflow-auto bg-gray-100 min-h-[500px] flex items-center justify-center"
      >
        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : (
          <div 
            className="my-4 mx-auto bg-white shadow-lg overflow-hidden"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease',
              width: '8.5in',
              height: '11in',
            }}
          >
            <iframe 
              src={`${url}#page=${currentPage}`} 
              className="w-full h-full border-0"
              title="PDF Viewer"
            />
          </div>
        )}
      </div>
      
      {/* Status bar */}
      <div className="bg-muted border-t p-1 px-3 text-xs text-muted-foreground flex items-center justify-between">
        <span>Documento: {url.split('/').pop() || 'documento.pdf'}</span>
        <span>Página {currentPage} de {totalPages}</span>
      </div>
    </div>
  );
};

export default PDFViewer;