/**
 * YelloMessage - Componente para exibir mensagens no estilo da Yello Solar Hub com o tom "Marrento Certo"
 */

import * as React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { YelloButton } from "@/components/yello-ui";
import { cn } from "@/lib/utils";
import { type ButtonProps } from "@/components/ui/button";

type YelloMessageProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  message: string;
  buttonText?: string;
  buttonAction?: () => void;
  buttonProps?: ButtonProps;
  variant?: "primary" | "alert" | "success" | "info";
  icon?: React.ReactNode;
};

export function YelloMessage({
  title,
  message,
  buttonText,
  buttonAction,
  buttonProps,
  variant = "primary",
  icon,
  className,
  ...props
}: YelloMessageProps) {
  const variantStyles = {
    primary: {
      title: "text-yello-primary font-bold",
      border: "border-yello-primary/20",
      button: "bg-yello-primary text-background"
    },
    alert: {
      title: "text-red-500 font-bold",
      border: "border-red-200",
      button: "bg-red-500 text-white"
    },
    success: {
      title: "text-emerald-600 font-bold",
      border: "border-emerald-200",
      button: "bg-emerald-600 text-white"
    },
    info: {
      title: "text-blue-600 font-bold",
      border: "border-blue-200",
      button: "bg-blue-600 text-white"
    }
  };

  return (
    <Card 
      variant="glass" 
      className={cn("overflow-hidden", className)}
      {...props}
    >
      <CardHeader className="pb-2">
        <CardTitle className={cn("flex items-center gap-2 text-xl", variantStyles[variant].title)}>
          {icon && <span className="text-inherit">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90">{message}</p>
      </CardContent>
      {buttonText && (
        <CardFooter>
          <YelloButton
            onClick={buttonAction}
            className="w-full font-medium"
            {...buttonProps}
          >
            {buttonText}
          </YelloButton>
        </CardFooter>
      )}
    </Card>
  );
}

export function ComplianceMessage({ 
  isCompliant,
  nextReviewDate,
  ...props
}: { 
  isCompliant: boolean;
  nextReviewDate?: string;
} & Omit<YelloMessageProps, 'title' | 'message' | 'variant'>) {
  return (
    <YelloMessage
      icon={isCompliant ? "✅" : "⚠️"}
      message={
        isCompliant
          ? `Sistema em compliance com a Lei 14.300. ${nextReviewDate ? `Próxima revisão em ${nextReviewDate}.` : ""}`
          : "Precisamos ajustar alguns detalhes para compliance com a Lei 14.300."
      }
      title={isCompliant ? "Compliance na régua." : "Ajuste necessário."}
      variant={isCompliant ? "success" : "alert"}
      {...props}
    />
  );
}

export function WhatsAppPreviewMessage({
  header = "Simulação pronta. ☀️",
  body = "Conta {{conta_mes}}. {{kit_nome}} derruba ~{{economia_pct}}% e paga em ~{{payback_anos}} anos. Quer o PDF?",
  footer = "Responda SAIR para parar.",
  ctaText = "Abrir proposta",
  ctaUrl = "#",
  className,
  ...props
}: {
  header?: string;
  body?: string;
  footer?: string;
  ctaText?: string;
  ctaUrl?: string;
  className?: string;
}) {
  return (
    <div 
      className={cn(
        "rounded-lg bg-[#DCF8C6] p-4 text-[#303030] border border-[#25D366]/20",
        className
      )}
      {...props}
    >
      <div className="space-y-3">
        <p className="font-bold">{header}</p>
        <p className="whitespace-pre-line">{body}</p>
        <div className="border border-[#25D366]/30 rounded-md py-2 px-3 bg-white/50 text-center">
          <a 
            className="text-[#075E54] font-medium" 
            href={ctaUrl}
          >
            {ctaText}
          </a>
        </div>
        <p className="text-xs text-[#303030]/70">{footer}</p>
      </div>
    </div>
  );
}

export function PreSizingCard({
  kWp,
  paybackAnos,
  className,
  ...props
}: {
  kWp: number | string;
  paybackAnos: number | string;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card
      variant="glass"
      className={cn("overflow-hidden", className)}
      {...props}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-yello-accent">
          Tamanho do kit: {kWp} kWp
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="font-medium">Payback: ~{paybackAnos} anos. Sem firula.</p>
          <div className="flex justify-between items-center mt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Potência</p>
              <p className="font-bold text-lg">{kWp} kWp</p>
            </div>
            <div className="h-10 border-r border-border"></div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Retorno</p>
              <p className="font-bold text-lg">~{paybackAnos} anos</p>
            </div>
            <div className="h-10 border-r border-border"></div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Economia</p>
              <p className="font-bold text-lg">💸</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <YelloButton className="w-full">
          Ver detalhes
        </YelloButton>
      </CardFooter>
    </Card>
  );
}