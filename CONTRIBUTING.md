# Contribuindo para o Streamdown

Obrigado pelo seu interesse em contribuir para o Streamdown! Acolhemos contribuições da comunidade.

## Primeiros Passos

### Pré-requisitos

- Node.js 18 ou superior
- pnpm 9.0.0 (especificado no campo packageManager)

### Configuração

1. Faça um fork do repositório
2. Clone seu fork:
   ```bash
   git clone https://github.com/seu-usuario/streamdown.git
   cd streamdown
   ```
3. Instale as dependências:
   ```bash
   pnpm install
   ```
4. Execute os testes para garantir que tudo esteja funcionando:
   ```bash
   pnpm test
   ```

## Fluxo de Desenvolvimento

### Estrutura do Projeto

Este é um monorepo gerenciado com Turbo. O pacote principal está localizado em:

- `packages/streamdown/` - A biblioteca de componentes React principal do Streamdown

### Scripts Disponíveis

- `pnpm dev` - Iniciar modo de desenvolvimento
- `pnpm build` - Compilar todos os pacotes
- `pnpm test` - Executar testes
- `pnpm test:coverage` - Executar testes com cobertura
- `pnpm test:ui` - Executar testes com interface
- `pnpm lint` - Executar linting
- `pnpm format` - Formatar código com Prettier
- `pnpm check-types` - Verificação de tipos

### Fazendo Alterações

1. Crie um novo branch para sua funcionalidade ou correção:
   ```bash
   git checkout -b feature/nome-da-sua-funcionalidade
   ```

2. Faça suas alterações e garanta que:
   - Todos os testes passem (`pnpm test`)
   - O código esteja devidamente formatado (`pnpm format`)
   - A verificação de tipos passe (`pnpm check-types`)
   - O linting passe (`pnpm lint`)

3. Escreva ou atualize testes para suas alterações

4. Crie um changeset para suas alterações:
   ```bash
   pnpm changeset
   ```
   - Selecione o(s) pacote(s) afetado(s)
   - Escolha o bump de versão apropriado (patch/minor/major)
   - Escreva uma descrição concisa das alterações

## Diretrizes de Commit

Seguimos conventional commits para um histórico claro de commits:

- `feat:` Novas funcionalidades
- `fix:` Correções de bugs
- `docs:` Alterações na documentação
- `style:` Alterações de estilo de código (formatação, etc)
- `refactor:` Alterações de código que não corrigem bugs nem adicionam funcionalidades
- `test:` Adicionando ou atualizando testes
- `chore:` Tarefas de manutenção

Exemplos:
```
feat: adicionar suporte para temas personalizados de blocos de código
fix: resolver problema de parsing de markdown com listas aninhadas
docs: atualizar README com novos exemplos de API
```

## Processo de Pull Request

1. Garanta que seu PR:
   - Tenha um título claro e descritivo
   - Inclua um changeset (execute `pnpm changeset` se não fez)
   - Passe em todas as verificações de CI
   - Inclua testes para novas funcionalidades
   - Atualize a documentação se necessário

2. A Descrição do PR deve incluir:
   - Quais alterações foram feitas
   - Por que essas alterações foram necessárias
   - Qualquer alteração que quebra compatibilidade
   - Screenshots/demos para alterações de UI

3. Vincule issues relacionadas usando palavras-chave como `Fixes #123` ou `Closes #456`

## Testes

### Executando Testes

```bash
# Executar todos os testes
pnpm test

# Executar testes com cobertura
pnpm test:coverage

# Executar testes com UI
pnpm test:ui

# Executar testes em modo watch (no diretório do pacote)
cd packages/streamdown
pnpm vitest
```

### Escrevendo Testes

- Os testes estão localizados em `packages/streamdown/__tests__/`
- Use nomes de teste descritivos
- Teste tanto casos de sucesso quanto de erro
- Garanta boa cobertura para novas funcionalidades

## Processo de Release

Os releases são automatizados através do GitHub Actions e changesets:

1. Quando PRs com changesets são mesclados na `main`, um PR "Version Packages" é criado automaticamente
2. Este PR atualiza versões de pacotes e changelogs
3. Quando o PR Version Packages é mesclado, os pacotes são publicados automaticamente no npm

## Estilo de Código

- Usamos TypeScript para segurança de tipos
- Siga o estilo de código existente no projeto
- Use nomes significativos para variáveis e funções
- Adicione comentários para lógica complexa
- Mantenha funções pequenas e focadas

## Obtendo Ajuda

- Abra uma issue para bugs ou solicitações de funcionalidades
- Participe das discussões no GitHub Discussions
- Verifique issues existentes antes de criar novas

## Licença

Ao contribuir para o Streamdown, você concorda que suas contribuições serão licenciadas sob a Licença Apache-2.0.