"use client";

import { CodeBlock, CodeBlockCopyButton } from "@/components/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const streamdownCode = `'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { Streamdown } from 'streamdown';

export default function Page() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');

  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.parts.filter(part => part.type === 'text').map((part, index) => (
            <Streamdown key={index}>{part.text}</Streamdown>
          ))}
        </div>
      ))}

      <form
        onSubmit={e => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
          }
        }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={status !== 'ready'}
          placeholder="Digite algo..."
        />
        <button type="submit" disabled={status !== 'ready'}>
          Enviar
        </button>
      </form>
    </>
  );
}
`;

const elementsCode = `'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { Response } from '@/components/ai-elements/response';

export default function Page() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');

  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.parts.filter(part => part.type === 'text').map((part, index) => (
            <Response key={index}>{part.text}</Response>
          ))}
        </div>
      ))}

      <form
        onSubmit={e => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
          }
        }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={status !== 'ready'}
          placeholder="Digite algo..."
        />
        <button type="submit" disabled={status !== 'ready'}>
          Enviar
        </button>
      </form>
    </>
  );
}
`;

const cssCode = `/*
 * Atualize seu Tailwind globals.css para incluir o 
 * código a seguir. Isso garantirá que os estilos
 * do Streamdown sejam aplicados ao seu projeto.
 * 
 * Certifique-se de que o caminho corresponda à localização
 * da pasta node_modules em seu projeto, ou seja:
 * @source "<caminho-para-node_modules>/node_modules/streamdown/dist/index.js";
 */

@source "../node_modules/streamdown/dist/index.js";`;

export const Implementation = () => (
  <div className="divide-y sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0">
    <div className="space-y-2 px-4 pt-8 pb-16 sm:p-8!">
      <h2 className="font-semibold text-2xl tracking-tight">Visão Geral</h2>
      <p className="text-muted-foreground">
        Formatar Markdown é fácil, mas quando você tokeniza e faz streaming,
        novos desafios surgem.
      </p>
      <p className="text-muted-foreground">
        Com{" "}
        <a
          className="font-medium text-blue-600 underline"
          href="https://ai-sdk.dev/elements"
          rel="noopener noreferrer"
          target="_blank"
        >
          AI Elements
        </a>
        , queríamos uma forma de fazer streaming de Markdown seguro e
        perfeitamente formatado sem ter que se preocupar com os detalhes.
      </p>
      <p className="text-muted-foreground">
        Então construímos o Streamdown, uma substituição direta para
        react-markdown, projetada para streaming alimentado por IA.
      </p>
      <p className="text-muted-foreground">
        Ele alimenta o componente{" "}
        <a
          className="font-medium text-blue-600 underline"
          href="https://ai-sdk.dev/elements/components/response"
          rel="noopener noreferrer"
          target="_blank"
        >
          Response
        </a>{" "}
        do AI Elements, mas você pode instalá-lo como um pacote independente se quiser.
      </p>
    </div>
    <div className="relative bg-background sm:col-span-2">
      <Tabs defaultValue="elements">
        <div className="dark">
          <TabsList className="-translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2 rounded-full">
            <TabsTrigger className="rounded-full" value="elements">
              AI Elements
            </TabsTrigger>
            <TabsTrigger className="rounded-full" value="streamdown">
              Streamdown
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent className="overflow-x-hidden" value="elements">
          <CodeBlock className="p-8" code={elementsCode} language="tsx">
            <CodeBlockCopyButton />
          </CodeBlock>
        </TabsContent>
        <TabsContent className="overflow-x-hidden" value="streamdown">
          <CodeBlock className="p-8" code={streamdownCode} language="tsx">
            <CodeBlockCopyButton />
          </CodeBlock>
        </TabsContent>
      </Tabs>
      <hr />
      <CodeBlock className="p-8" code={cssCode} language="css">
        <CodeBlockCopyButton />
      </CodeBlock>
    </div>
  </div>
);
