import { describe, it, expect } from "vitest";
import { parseMarkdownIntoBlocks } from "../lib/parse-blocks";

describe("parseMarkdownIntoBlocks", () => {
  it("should split basic markdown into appropriate blocks", () => {
    const markdown = `# Título
    
Este é um parágrafo.

Este é outro parágrafo.`;

    const blocks = parseMarkdownIntoBlocks(markdown);
    expect(blocks.length).toBe(3);
    expect(blocks[0]).toContain("# Título");
    expect(blocks[1]).toContain("Este é um parágrafo");
    expect(blocks[2]).toContain("Este é outro parágrafo");
  });

  it("should handle code blocks", () => {
    const markdown = `Aqui está um bloco de código:

\`\`\`javascript
const x = 1;
console.log(x);
\`\`\`

Texto após o código.`;

    const blocks = parseMarkdownIntoBlocks(markdown);
    expect(blocks.length).toBe(3);
    expect(blocks[0]).toContain("Aqui está um bloco de código");
    expect(blocks[1]).toContain("```javascript");
    expect(blocks[1]).toContain("console.log(x);");
    expect(blocks[2]).toContain("Texto após o código");
  });

  it("should handle lists", () => {
    const markdown = `Uma lista:

- Item 1
- Item 2
- Item 3

Texto após a lista.`;

    const blocks = parseMarkdownIntoBlocks(markdown);
    expect(blocks.length).toBe(3);
    expect(blocks[0]).toContain("Uma lista");
    expect(blocks[1]).toContain("- Item 1");
    expect(blocks[1]).toContain("- Item 2");
    expect(blocks[1]).toContain("- Item 3");
    expect(blocks[2]).toContain("Texto após a lista");
  });

  it("should handle math blocks", () => {
    const markdown = `Aqui está uma equação:

$$
a^2 + b^2 = c^2
$$

Texto após a equação.`;

    const blocks = parseMarkdownIntoBlocks(markdown);
    expect(blocks.length).toBe(3);
    expect(blocks[0]).toContain("Aqui está uma equação");
    expect(blocks[1]).toContain("$$");
    expect(blocks[1]).toContain("a^2 + b^2 = c^2");
    expect(blocks[2]).toContain("Texto após a equação");
  });

  it("should merge math blocks that are split by the lexer", () => {
    const markdown = `Equação matemática:

$$
\\begin{pmatrix}
x \\\\
y
\\end{pmatrix}
=
$$

Texto após a equação.`;

    const blocks = parseMarkdownIntoBlocks(markdown);
    
    // Deve combinar os blocos com $$ em um único bloco
    const mathBlockIndex = blocks.findIndex(block => block.includes("\\begin{pmatrix}"));
    expect(mathBlockIndex).not.toBe(-1);
    expect(blocks[mathBlockIndex]).toContain("\\begin{pmatrix}");
    expect(blocks[mathBlockIndex]).toContain("\\end{pmatrix}");
    expect(blocks[mathBlockIndex]).toContain("=");
  });

  it("should handle standalone closing delimiter for math blocks", () => {
    const markdown = `Equação matemática:

$$
\\begin{matrix}
1 & 2 & 3 \\\\
4 & 5 & 6 \\\\
7 & 8 & 9
\\end{matrix}
$$

Texto após a equação.`;

    const blocks = parseMarkdownIntoBlocks(markdown);
    
    // Encontra o bloco com a matriz
    const mathBlockIndex = blocks.findIndex(block => block.includes("\\begin{matrix}"));
    expect(mathBlockIndex).not.toBe(-1);
    expect(blocks[mathBlockIndex]).toContain("\\begin{matrix}");
    expect(blocks[mathBlockIndex]).toContain("\\end{matrix}");
    
    // Verifica se o bloco está bem formado (começa e termina com $$)
    expect(blocks[mathBlockIndex].trim().startsWith("$$")).toBe(true);
    expect(blocks[mathBlockIndex].trim().endsWith("$$")).toBe(true);
  });

  it("should handle math blocks with odd number of $$ markers", () => {
    const markdown = `Equação matemática:

$$
a^2 + b^2 = c^2
$$

Outra equação:

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$`;

    const blocks = parseMarkdownIntoBlocks(markdown);
    
    // Verifica se os blocos matemáticos estão separados corretamente
    const mathBlocks = blocks.filter(block => block.includes("$$"));
    expect(mathBlocks.length).toBe(2);
    
    expect(mathBlocks[0]).toContain("a^2 + b^2 = c^2");
    expect(mathBlocks[1]).toContain("x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}");
  });

  it("should handle current block ends with $$ and previous block started with $$ but didn't close", () => {
    const markdown = `Equação matemática:

$$
\\begin{pmatrix}
x \\\\
y
\\end{pmatrix}
$$

Texto após a equação.`;

    const blocks = parseMarkdownIntoBlocks(markdown);
    
    // Verifica se o bloco matemático está completo
    const mathBlockIndex = blocks.findIndex(block => block.includes("\\begin{pmatrix}"));
    expect(mathBlockIndex).not.toBe(-1);
    
    const mathBlock = blocks[mathBlockIndex];
    expect(mathBlock).toContain("\\begin{pmatrix}");
    expect(mathBlock).toContain("\\end{pmatrix}");
    
    // Verifica se começa e termina com $$
    const trimmedBlock = mathBlock.trim();
    expect(trimmedBlock.startsWith("$$")).toBe(true);
    expect(trimmedBlock.endsWith("$$")).toBe(true);
  });

  it("should handle empty markdown", () => {
    const blocks = parseMarkdownIntoBlocks("");
    expect(blocks.length).toBe(0);
  });

  it("should handle complex nested structures", () => {
    const markdown = `# Título

> Uma citação
> Com múltiplas linhas
> E também com **formatação em negrito**

- Lista com *itálico*
- E com \`código inline\`

\`\`\`python
def hello_world():
    print("Hello, world!")
\`\`\``;

    const blocks = parseMarkdownIntoBlocks(markdown);
    expect(blocks.length).toBe(4);
    expect(blocks[0]).toContain("# Título");
    expect(blocks[1]).toContain("> Uma citação");
    expect(blocks[1]).toContain("**formatação em negrito**");
    expect(blocks[2]).toContain("- Lista com *itálico*");
    expect(blocks[2]).toContain("- E com `código inline`");
    expect(blocks[3]).toContain("```python");
    expect(blocks[3]).toContain('print("Hello, world!")');
  });
});