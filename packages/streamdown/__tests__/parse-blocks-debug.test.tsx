import { describe, expect, it } from "vitest";
import { parseMarkdownIntoBlocks } from "../lib/parse-blocks";

describe("parseMarkdownIntoBlocks debug", () => {
  it("debug - should examine all block structures", () => {
    // Estrutura básica
    const markdown1 = `# Título
    
Este é um parágrafo.

Este é outro parágrafo.`;

    const blocks1 = parseMarkdownIntoBlocks(markdown1);
    console.log("DEBUG BASIC - Block count:", blocks1.length);
    blocks1.forEach((block, index) => {
      console.log(`DEBUG BASIC - Block ${index}:`, JSON.stringify(block));
    });

    // Blocos de código
    const markdown2 = `Aqui está um bloco de código:

\`\`\`javascript
const x = 1;
console.log(x);
\`\`\`

Texto após o código.`;

    const blocks2 = parseMarkdownIntoBlocks(markdown2);
    console.log("DEBUG CODE - Block count:", blocks2.length);
    blocks2.forEach((block, index) => {
      console.log(`DEBUG CODE - Block ${index}:`, JSON.stringify(block));
    });
    
    // Listas
    const markdown3 = `Uma lista:

- Item 1
- Item 2
- Item 3

Texto após a lista.`;

    const blocks3 = parseMarkdownIntoBlocks(markdown3);
    console.log("DEBUG LIST - Block count:", blocks3.length);
    blocks3.forEach((block, index) => {
      console.log(`DEBUG LIST - Block ${index}:`, JSON.stringify(block));
    });
    
    // Blocos matemáticos
    const markdown4 = `Aqui está uma equação:

$$
a^2 + b^2 = c^2
$$

Texto após a equação.`;

    const blocks4 = parseMarkdownIntoBlocks(markdown4);
    console.log("DEBUG MATH - Block count:", blocks4.length);
    blocks4.forEach((block, index) => {
      console.log(`DEBUG MATH - Block ${index}:`, JSON.stringify(block));
    });
    
    // Estrutura complexa
    const markdown5 = `# Título

> Uma citação
> Com múltiplas linhas
> E também com **formatação em negrito**

- Lista com *itálico*
- E com \`código inline\`

\`\`\`python
def hello_world():
    print("Hello, world!")
\`\`\``;

    const blocks5 = parseMarkdownIntoBlocks(markdown5);
    console.log("DEBUG COMPLEX - Block count:", blocks5.length);
    blocks5.forEach((block, index) => {
      console.log(`DEBUG COMPLEX - Block ${index}:`, JSON.stringify(block));
    });
    
    // Math standalone delimiter
    const markdown6 = `Texto antes

$$

x^2 + y^2 = z^2

$$

Texto depois`;

    const blocks6 = parseMarkdownIntoBlocks(markdown6);
    console.log("DEBUG DELIM - Block count:", blocks6.length);
    blocks6.forEach((block, index) => {
      console.log(`DEBUG DELIM - Block ${index}:`, JSON.stringify(block));
    });
    
    const mathBlock = blocks6.find((block) => block.includes("x^2 + y^2 = z^2"));
    console.log("MATH BLOCK:", mathBlock ? JSON.stringify(mathBlock) : "not found");
    
    // Não fazemos asserções, apenas examinamos a estrutura
    expect(true).toBe(true);
  });
});