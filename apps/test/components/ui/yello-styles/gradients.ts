/**
 * Utilitários de gradiente da Yello
 * 
 * Este arquivo contém utilitários para aplicar o degradê característico 
 * da marca Yello em componentes UI.
 */

import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";

// Classes CSS para o stroke thin degradê da Yello
export const yellowGradientStroke = "border border-transparent bg-clip-border [background-image:linear-gradient(to_right,#FF6B00,#FF2564,#D500D5,#9A00E9)]";
export const yellowGradientBg = "bg-gradient-to-r from-[#FF6B00] via-[#FF2564] via-[#D500D5] to-[#9A00E9]";

// Aplicar stroke thin degradê ao redor do elemento
export function withYelloStroke(extraClasses?: ClassValue) {
  return cn(yellowGradientStroke, extraClasses);
}

// Aplicar background degradê ao elemento
export function withYelloBg(extraClasses?: ClassValue) {
  return cn(yellowGradientBg, extraClasses);
}

// Aplicar stroke degradê animado ao elemento
export function withYelloAnimatedStroke(extraClasses?: ClassValue) {
  return cn(
    yellowGradientStroke,
    "relative before:absolute before:inset-0 before:rounded-[inherit] before:[background-image:linear-gradient(to_right,#FF6B00,#FF2564,#D500D5,#9A00E9,#FF6B00)] before:animate-gradient-x before:bg-[length:500%_100%]",
    extraClasses
  );
}