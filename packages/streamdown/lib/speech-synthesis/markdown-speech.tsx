import { type ReactNode, useMemo } from "react";
import { SpeechSynthesis } from "./speech-synthesis";

export type MarkdownSpeechProps = {
  /** Conteúdo markdown */
  children: ReactNode;
  /** Idioma do texto (formato BCP 47) */
  lang?: string;
  /** Direção do texto */
  dir?: "ltr" | "rtl";
  /** Título para o botão de leitura */
  title?: string;
  /** Classe CSS para personalização */
  className?: string;
};

// Type para representar objeto React com props
type ReactElementWithProps = {
  props: {
    children?: ReactNode;
    dangerouslySetInnerHTML?: {
      __html: string;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

/**
 * Verifica se um nó é um elemento React com props
 */
function isReactElementWithProps(node: object): node is ReactElementWithProps {
  return "props" in node;
}

/**
 * Extrai o texto do ReactNode (usado para síntese de voz)
 */
function getTextFromNode(node: ReactNode): string {
  // Texto direto
  if (typeof node === "string") {
    return node;
  }
  
  // Números
  if (typeof node === "number") {
    return node.toString();
  }
  
  // Arrays (como children múltiplos)
  if (Array.isArray(node)) {
    return node.map(getTextFromNode).join(" ");
  }
  
  // Componentes React com props
  if (
    node !== null && 
    typeof node === "object" && 
    isReactElementWithProps(node) && 
    node.props
  ) {
    // Manipular o children recursivamente
    if (node.props.children) {
      return getTextFromNode(node.props.children);
    }
    
    // Para elementos com HTML (como code, pre)
    if (node.props.dangerouslySetInnerHTML?.__html) {
      return node.props.dangerouslySetInnerHTML.__html.replace(/<[^>]*>/g, "");
    }
  }
  
  return "";
}

/**
 * Componente que adiciona síntese de voz para conteúdo markdown
 */
export function MarkdownSpeech({
  children,
  lang = "pt-BR",
  dir = "ltr",
  title = "Síntese de voz",
  className,
}: MarkdownSpeechProps) {
  // Extrai o texto do markdown (ReactNode)
  const extractedText = useMemo(() => {
    return getTextFromNode(children);
  }, [children]);

  if (!extractedText.trim()) {
    return null;
  }

  return (
    <SpeechSynthesis
      className={className}
      compact
      dir={dir}
      lang={lang}
      text={extractedText}
      title={title}
    />
  );
}