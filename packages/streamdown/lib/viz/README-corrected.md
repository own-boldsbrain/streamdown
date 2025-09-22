# VizObjectStream - Componente para Visualização de Objetos JSON em Streaming

O componente `VizObjectStream` é parte da biblioteca Streamdown e oferece uma forma elegante de visualizar objetos JSON que são transmitidos em streaming, especialmente quando usados com o hook `experimental_useObject` do AI SDK.

## Componentes Disponíveis

### `VizObjectStream`

Componente base para visualização de objetos JSON em streaming.

```tsx
import { VizObjectStream } from "streamdown/lib/viz/viz-object-stream";

<VizObjectStream
  object={meuObjeto}
  isLoading={true}
  error={erro}
  isComplete={false}
  schema="z.object({ ... })"
  onReset={() => {}}
  showControls={true}
/>
```

### `VizUseObject`

Wrapper para facilitar o uso com o hook `experimental_useObject` do AI SDK.

```tsx
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { VizUseObject } from "streamdown/lib/viz/viz-object-stream";
import { z } from "zod";

function MeuComponente() {
  const objetoResult = useObject({
    api: "/api/minha-api",
    schema: z.object({ content: z.string() }),
  });

  return (
    <VizUseObject
      useObjectResult={objetoResult}
      showSchema={true}
    />
  );
}
```

## Propriedades

### VizObjectStream

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `object` | `T \| undefined` | O objeto JSON atual, que pode estar incompleto durante o streaming |
| `isLoading` | `boolean` | Indica se está carregando/recebendo dados |
| `error` | `Error \| unknown` | Erro ocorrido durante a geração (se houver) |
| `isComplete` | `boolean` | Indica se a geração foi concluída |
| `schema` | `string` | Representação em string do esquema (opcional) |
| `onReset` | `() => void` | Função para reiniciar ou limpar o objeto |
| `showControls` | `boolean` | Se deve mostrar o cabeçalho com controles |

### VizUseObject

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `useObjectResult` | `{ object, error, isLoading, submit, stop, clear }` | Resultado do hook `experimental_useObject` |
| `showSchema` | `boolean` | Se deve mostrar o esquema no rodapé |

## Integração com experimental_useObject

O componente `VizUseObject` foi projetado especificamente para trabalhar com o hook `experimental_useObject` do AI SDK, facilitando a visualização de objetos JSON que são transmitidos em streaming por uma API.

### Exemplo completo de integração

```tsx
"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { VizUseObject } from "streamdown/lib/viz/viz-object-stream";
import { z } from "zod";

// Definindo um esquema com Zod
const meuEsquema = z.object({
  titulo: z.string(),
  itens: z.array(
    z.object({
      id: z.number(),
      nome: z.string(),
      completo: z.boolean()
    })
  ),
  metadata: z.object({
    timestamp: z.string(),
    autor: z.string()
  })
});

export default function MinhaAplicacao() {
  const { object, error, isLoading, submit, stop, clear } = useObject({
    api: "/api/gerar-objeto",
    schema: meuEsquema,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Visualização de Objeto em Streaming</h2>
      
      <div className="flex gap-2">
        <button
          onClick={() => submit({ prompt: "Gerar novo objeto" })}
          disabled={isLoading}
          className="px-3 py-1.5 bg-primary text-white rounded hover:bg-primary/90"
        >
          Gerar Objeto
        </button>
        
        <button
          onClick={stop}
          disabled={!isLoading}
          className="px-3 py-1.5 bg-secondary text-white rounded hover:bg-secondary/90"
        >
          Parar
        </button>
        
        <button
          onClick={clear}
          disabled={!object && !error}
          className="px-3 py-1.5 border rounded hover:bg-muted"
        >
          Limpar
        </button>
      </div>
      
      <VizUseObject
        useObjectResult={{ object, error, isLoading, submit, stop, clear }}
        showSchema={true}
        className="border rounded-md"
      />
    </div>
  );
}
```

## Características

- **Visualização em tempo real**: Exibe o objeto JSON à medida que é recebido em streaming
- **Tratamento de erros**: Exibe mensagens de erro de forma amigável
- **Estados de carregamento**: Indica visualmente quando está carregando dados
- **Botão de reset**: Permite reiniciar a visualização
- **Visualização de esquema**: Mostra o esquema de validação do objeto
- **Animação de atualização**: Animação sutil quando o objeto é atualizado
- **Personalização**: Permite personalizar a aparência através de classes CSS

## Estilos e Temas

O componente utiliza o utilitário `cn` da biblioteca Streamdown para combinar classes CSS, permitindo personalização fácil. Ele também respeita os temas claro e escuro automaticamente.

## Acessibilidade

- Utiliza contraste de cores adequado
- Fornece textos alternativos para elementos visuais
- Suporta navegação por teclado
