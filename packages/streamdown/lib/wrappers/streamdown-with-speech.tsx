import { forwardRef, memo } from "react";
import type { StreamdownProps } from "../../index";
import { Streamdown } from "../../index";
import { MarkdownSpeech } from "../speech-synthesis/markdown-speech";

export type StreamdownWithSpeechProps = StreamdownProps & {
  /** Ativar síntese de voz */
  enableSpeech?: boolean;
  /** Idioma para síntese de voz (formato BCP 47) */
  speechLang?: string;
  /** Direção do texto */
  dir?: "ltr" | "rtl";
  /** Título para o botão de síntese de voz */
  speechTitle?: string;
};

/**
 * Streamdown com suporte a síntese de voz
 */
export const StreamdownWithSpeech = memo(
  forwardRef<HTMLDivElement, StreamdownWithSpeechProps>(
    (
      {
        children,
        enableSpeech = false,
        speechLang = "pt-BR",
        dir = "ltr",
        speechTitle = "Síntese de voz",
        className,
        ...props
      },
      ref
    ) => {
      return (
        <div className="relative" data-streamdown-speech dir={dir} ref={ref}>
          {enableSpeech && (
            <div className="absolute top-0 right-0 z-10">
              <MarkdownSpeech
                className="mt-2"
                dir={dir}
                lang={speechLang}
                title={speechTitle}
              >
                {children}
              </MarkdownSpeech>
            </div>
          )}
          <Streamdown className={className} {...props}>
            {children}
          </Streamdown>
        </div>
      );
    }
  )
);

StreamdownWithSpeech.displayName = "StreamdownWithSpeech";
