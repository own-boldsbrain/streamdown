"use client";

import { Chat } from "@/components/chat";

export default function ChatDemoPage() {
  const handleSendMessage = async (message: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock AI responses with different types of content
    const responses = [
      `Olá! Você disse: "${message}"

Aqui vai uma resposta com **Markdown**:

- Item 1
- Item 2
- Item 3

E uma equação: $E = mc^2$

\`\`\`javascript
console.log("Código de exemplo");
\`\`\`

O que mais você gostaria de saber?`,

      `Interessante pergunta sobre "${message}".

Vou te mostrar um diagrama Mermaid:

\`\`\`mermaid
graph TD
    A[Usuário] --> B[Chat Interface]
    B --> C[Streamdown]
    C --> D[Renderização Markdown]
    D --> E[Resposta IA]
\`\`\`

Esta é a arquitetura do nosso chat!`,

      `Sobre "${message}", aqui vai uma tabela:

| Recurso | Status | Descrição |
|---------|--------|-----------|
| Markdown | ✅ | Suportado |
| Código | ✅ | Syntax highlight |
| Matemática | ✅ | KaTeX rendering |
| Mermaid | ✅ | Diagramas |

Experimente enviar uma mensagem com código ou fórmulas!`,

      `Resposta simulada para: "${message}"

💡 **Dica**: Este chat usa Streamdown para renderizar conteúdo rico, incluindo:
- **Negrito** e *itálico*
- \`código inline\`
- Blocos de código
- Equações matemáticas
- Diagramas Mermaid

Tente enviar uma mensagem com algum desses elementos!`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF6B00] via-[#FF2564] via-[#D500D5] to-[#9A00E9] bg-clip-text text-transparent mb-4">
            Chat IA Conversacional
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interface multimodal hiper interativa com Streamdown para renderização de conteúdo rico,
            incluindo Markdown, código, matemática e diagramas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Chat
              onSendMessage={handleSendMessage}
              placeholder="Digite sua mensagem ou experimente Markdown, código, fórmulas..."
              className="h-[700px]"
            />
          </div>

          <div className="space-y-4">
            <div className="bg-card p-6 rounded-xl border shadow-sm">
              <h3 className="font-semibold mb-3">Funcionalidades</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✅ Renderização Markdown em tempo real</li>
                <li>✅ Syntax highlighting para código</li>
                <li>✅ Equações matemáticas com KaTeX</li>
                <li>✅ Diagramas Mermaid interativos</li>
                <li>✅ Streaming de respostas</li>
                <li>✅ Interface responsiva</li>
                <li>✅ Gradientes Yello da marca</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-sm">
              <h3 className="font-semibold mb-3">Experimente</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-xs text-muted-foreground mb-1">MARKDOWN</p>
                  <code className="bg-muted px-2 py-1 rounded text-xs">
                    **negrito** *itálico* `código`
                  </code>
                </div>
                <div>
                  <p className="font-medium mb-1 text-muted-foreground text-xs">CÓDIGO</p>
                  <code className="bg-muted block px-2 py-1 rounded text-xs">
                    {`\`\`\`javascript
console.log("Olá!");`}
                  </code>
                </div>
                <div>
                  <p className="font-medium mb-1 text-muted-foreground text-xs">MATEMÁTICA</p>
                  <code className="bg-muted px-2 py-1 rounded text-xs">
                    $E = mc^2$
                  </code>
                </div>
                <div>
                  <p className="font-medium mb-1 text-muted-foreground text-xs">DIAGRAMA</p>
                  <code className="bg-muted block px-2 py-1 rounded text-xs">
                    {`\`\`\`mermaid
graph TD
A-->B`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}