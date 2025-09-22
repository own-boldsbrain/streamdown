import { Lexer } from "marked";

// Helpers for math block detection and processing
const isMathDelimiter = (text: string): boolean => {
  return text.trim() === "$$";
};

const startsWithMathDelimiter = (text: string): boolean => {
  return text.trimStart().startsWith("$$");
};

const endsWithMathDelimiter = (text: string): boolean => {
  return text.trimEnd().endsWith("$$");
};

const containsLatexEnvironment = (text: string): boolean => {
  return (
    text.includes("\\begin{") ||
    text.includes("\\end{") ||
    // Comandos LaTeX comuns
    text.includes("\\frac") ||
    text.includes("\\sum") ||
    text.includes("\\int") ||
    text.includes("\\sqrt") ||
    text.includes("\\mathbf") ||
    text.includes("\\mathcal") ||
    text.includes("\\text") ||
    text.includes("\\limits") ||
    // Ambientes matemáticos comuns
    text.includes("\\matrix") ||
    text.includes("\\pmatrix") ||
    text.includes("\\bmatrix") ||
    text.includes("\\cases") ||
    text.includes("\\align")
  );
};

const hasIncompleteLatexEnvironment = (text: string): boolean => {
  const beginCount = (text.match(/\\begin\{/g) || []).length;
  const endCount = (text.match(/\\end\{/g) || []).length;
  
  return beginCount > endCount;
};

const shouldMergeWithPrevious = (current: string, previous: string): boolean => {
  // Se o bloco atual é um delimitador $$ e o anterior começou com $$ mas não terminou com $$
  if (isMathDelimiter(current) && startsWithMathDelimiter(previous) && !endsWithMathDelimiter(previous)) {
    return true;
  }
  
  // Se o bloco atual contém comandos LaTeX e o anterior tem ambiente LaTeX incompleto
  if (containsLatexEnvironment(current) && hasIncompleteLatexEnvironment(previous)) {
    return true;
  }
  
  return false;
};

// Função auxiliar para verificar se devemos mesclar blocos com base em delimitadores matemáticos
const shouldMergeStandaloneMathDelimiter = (
  current: string,
  previous: string
): boolean => {
  if (!isMathDelimiter(current)) {
    return false;
  }
  
  // Check if the previous block starts with $$ but doesn't end with $$
  const prevStartsWith$$ = previous.trimStart().startsWith("$$");
  const prevDollarCount = (previous.match(/\$\$/g) || []).length;

  // If previous block has odd number of $$ and starts with $$, they should be merged
  return prevStartsWith$$ && prevDollarCount % 2 === 1;
};

// Função auxiliar para verificar se devemos mesclar blocos com base em conteúdo matemático
const shouldMergeMathContent = (
  current: string,
  previous: string
): boolean => {
  if (!current.trimEnd().endsWith("$$")) {
    return false;
  }
  
  const prevStartsWith$$ = previous.trimStart().startsWith("$$");
  const prevDollarCount = (previous.match(/\$\$/g) || []).length;
  const currDollarCount = (current.match(/\$\$/g) || []).length;

  // If previous block has unclosed math (odd $$) and current block ends with $$
  // AND current block doesn't start with $$, it's likely a continuation
  return (
    prevStartsWith$$ &&
    prevDollarCount % 2 === 1 &&
    !current.trimStart().startsWith("$$") &&
    currDollarCount === 1
  );
};

export const parseMarkdownIntoBlocks = (markdown: string): string[] => {
  const tokens = Lexer.lex(markdown, { gfm: true });
  const blocks = tokens.map((token) => token.raw);

  // Post-process to merge consecutive blocks that are part of the same math block
  const mergedBlocks: string[] = [];

  for (const currentBlock of blocks) {
    if (mergedBlocks.length === 0) {
      // Primeiro bloco, apenas adiciona
      mergedBlocks.push(currentBlock);
      continue;
    }
    
    const previousBlock = mergedBlocks.at(-1);
    if (!previousBlock) {
      continue;
    }
    
    // Verifica se deve mesclar usando a função shouldMergeWithPrevious ou funções específicas
    if (
      shouldMergeWithPrevious(currentBlock, previousBlock) ||
      shouldMergeStandaloneMathDelimiter(currentBlock, previousBlock) ||
      shouldMergeMathContent(currentBlock, previousBlock)
    ) {
      mergedBlocks[mergedBlocks.length - 1] = previousBlock + currentBlock;
      continue;
    }

    // Se não precisa mesclar, adiciona como um novo bloco
    mergedBlocks.push(currentBlock);
  }

  return mergedBlocks;
};
