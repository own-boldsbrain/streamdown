# VizCodeBlock - Componente de Bloco de Código Avançado

O componente `VizCodeBlock` é uma extensão avançada do componente `CodeBlock` da biblioteca Streamdown, oferecendo funcionalidades interativas como destaque de linhas, linking de linhas e execução inline de código.

## Funcionalidades

- **Destaque de Linhas**: Permite destacar linhas específicas do código
- **Linking de Linhas**: Permite clicar em linhas para seleção interativa
- **Execução Inline**: Suporte para executar código diretamente na interface
- **Numeração de Linhas**: Exibe números de linha opcionais
- **Controles Avançados**: Botões de execução e controles personalizáveis

## Instalação e Uso

```tsx
import { VizCodeBlock } from "streamdown/lib/viz/viz-code-block";

function MeuComponente() {
  const handleExecute = async (code: string, language: string) => {
    // Implementar lógica de execução aqui
    return "Resultado da execução";
  };

  const handleLineClick = (lineNumber: number, content: string) => {
    console.log(`Linha ${lineNumber} clicada:`, content);
  };

  return (
    <VizCodeBlock
      code={`function hello() {\n  console.log("Hello World!");\n}`}
      language="javascript"
      highlightLines={[1, 2]}
      enableLineLinking={true}
      enableExecution={true}
      showLineNumbers={true}
      onExecute={handleExecute}
      onLineClick={handleLineClick}
    />
  );
}
```

## Propriedades

### Propriedades Principais

| Propriedade | Tipo | Descrição | Padrão |
|-------------|------|-----------|---------|
| `code` | `string` | O código fonte a ser exibido | - |
| `language` | `BundledLanguage` | Linguagem de programação para highlighting | - |
| `highlightLines` | `number[]` | Array de números de linhas para destacar | `[]` |
| `enableLineLinking` | `boolean` | Habilita clique interativo nas linhas | `false` |
| `enableExecution` | `boolean` | Habilita botão de execução | `false` |
| `showLineNumbers` | `boolean` | Exibe números de linha | `false` |
| `executeButtonText` | `string` | Texto do botão de execução | `"Run"` |

### Callbacks

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `onLineClick` | `(lineNumber: number, content: string) => void` | Chamado quando uma linha é clicada |
| `onExecute` | `(code: string, language: BundledLanguage) => Promise<string>` | Chamado para executar o código |

### Outras Propriedades

Todas as outras propriedades do componente `CodeBlock` são suportadas através de `...props`.

## Exemplos de Uso

### Destaque de Linhas

```tsx
<VizCodeBlock
  code={`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`}
  language="javascript"
  highlightLines={[1, 2, 4]} // Destaca linhas específicas
  showLineNumbers={true}
/>
```

### Linking Interativo de Linhas

```tsx
const [selectedLine, setSelectedLine] = useState<number | null>(null);

<VizCodeBlock
  code={`const data = [1, 2, 3];
data.map(x => x * 2);
console.log(data);`}
  language="javascript"
  enableLineLinking={true}
  onLineClick={(lineNumber, content) => {
    setSelectedLine(lineNumber);
    console.log(`Linha ${lineNumber}: ${content}`);
  }}
  showLineNumbers={true}
/>
```

### Execução Inline

```tsx
const handleExecute = async (code: string, language: string) => {
  try {
    // Simular execução de código
    if (language === "javascript") {
      // Aqui você poderia integrar com um serviço de execução
      return "Código executado com sucesso!";
    }
    return "Execução não suportada para esta linguagem";
  } catch (error) {
    return `Erro: ${error.message}`;
  }
};

<VizCodeBlock
  code={`console.log("Hello, World!");`}
  language="javascript"
  enableExecution={true}
  onExecute={handleExecute}
  executeButtonText="Executar"
/>
```

### Configuração Completa

```tsx
<VizCodeBlock
  code={`def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n - 1) + calculate_fibonacci(n - 2)

print(calculate_fibonacci(10))`}
  language="python"
  highlightLines={[1, 2, 3, 6]}
  enableLineLinking={true}
  enableExecution={true}
  showLineNumbers={true}
  onExecute={async (code, lang) => {
    // Implementar execução Python
    return "55";
  }}
  onLineClick={(line, content) => {
    console.log(`Debug: linha ${line} = "${content}"`);
  }}
  executeButtonText="Run Python"
  className="my-custom-class"
/>
```

## Estados Visuais

### Destaque de Linhas

- Linhas destacadas recebem fundo amarelo claro (`bg-yellow-200`) no tema claro
- Linhas destacadas recebem fundo amarelo escuro (`bg-yellow-900/30`) no tema escuro

### Seleção de Linhas

- Linhas selecionadas recebem fundo azul claro (`bg-blue-200`) no tema claro
- Linhas selecionadas recebem fundo azul escuro (`bg-blue-900/30`) no tema escuro

### Hover

- Linhas clicáveis mostram efeito hover (`hover:bg-muted/50`) quando `enableLineLinking` está ativo

## Integração com Streamdown

O `VizCodeBlock` é totalmente compatível com o ecossistema Streamdown:

- Utiliza o mesmo sistema de highlighting Shiki
- Suporta todos os temas claro/escuro
- Mantém consistência visual com outros componentes
- Utiliza o utilitário `cn` para composição de classes CSS

## Considerações de Performance

- O processamento de código é memoizado para evitar recálculos desnecessários
- Eventos de clique são adicionados/removidos adequadamente para evitar memory leaks
- O componente utiliza `React.memo` para otimização de re-renders

## Acessibilidade

- Botões incluem atributos `title` e `type` apropriados
- Estados desabilitados são indicados visualmente e funcionalmente
- Contraste de cores adequado para diferentes temas
- Navegação por teclado suportada nos controles

## Limitações

- A execução inline requer implementação customizada do callback `onExecute`
- O linking de linhas funciona apenas quando o código é processado como HTML (não funciona com todos os temas Shiki)
- Eventos de clique são delegados ao nível do documento para melhor performance, mas podem conflitar com outros handlers
