import fs from "node:fs";
import path from "node:path";
import { compose } from "../../lib/services/template-composer";
import {
  type Channel,
  Persona,
  type PersonasDoc,
  type Region,
} from "../../lib/types/messaging";

// Variáveis de exemplo para testes
const dummyVariables = {
  persona_nome: "Renata",
  consumo_kWh_mes: "420",
  kit_nome: "Rooftop 5kWp",
  economia_pct: "28",
  payback_anos: "4",
  proposta_id: "abc123",
  contrato_id: "c789",
  link_curto: "https://y.sh/x",
};

// Carregar o JSON de personas
function loadPersonasJson(): PersonasDoc {
  const filePath = path.resolve(
    process.cwd(),
    "lib/personas/personas.regioes.json"
  );
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content) as PersonasDoc;
}

// Cores para output do console
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

async function main() {
  console.log(
    `${colors.bright}=== QA DE TEMPLATES DE MENSAGERIA ====${colors.reset}\n`
  );

  let hasErrors = false;
  let totalTests = 0;
  let passedTests = 0;

  try {
    const doc = loadPersonasJson();
    console.log(
      `${colors.blue}Versão do documento:${colors.reset} ${doc.version}`
    );
    console.log(
      `${colors.blue}Total de personas:${colors.reset} ${doc.personas.length}`
    );

    // Iterar sobre todas as personas
    for (const persona of doc.personas) {
      console.log(
        `\n${colors.bright}Testando persona: ${colors.blue}${persona.id}${colors.reset} (${persona.label})`
      );

      // Iterar sobre todas as regiões
      for (const region of Object.keys(persona.regions) as Region[]) {
        console.log(
          `\n  ${colors.bright}Região: ${colors.yellow}${region}${colors.reset}`
        );

        // Iterar sobre todos os canais
        const channels: Channel[] = ["whatsapp", "telegram", "email", "sms"];

        for (const channel of channels) {
          process.stdout.write(`    Canal ${channel.padEnd(9)}: `);
          totalTests++;

          try {
            // Testar versão marketing (com opt-out)
            const result = compose({
              personaId: persona.id,
              region,
              channel,
              variables: dummyVariables,
              marketing: true,
            });

            if (result.compliance.status === "pass") {
              process.stdout.write(`${colors.green}PASS${colors.reset}`);
              passedTests++;
            } else {
              process.stdout.write(
                `${colors.red}FAIL${colors.reset} - ${result.compliance.errors.join(", ")}`
              );
              hasErrors = true;
            }

            // Mostrar detalhes do conteúdo renderizado
            const renderedInfo = [];

            if (channel === "whatsapp") {
              const bodyLength = result.rendered.body?.length || 0;
              renderedInfo.push(`body: ${bodyLength} chars`);
            } else if (channel === "sms") {
              const smsLength = result.rendered.sms?.length || 0;
              renderedInfo.push(`${smsLength}/160 chars`);
            } else if (channel === "email") {
              const subjLength = result.rendered.subject?.length || 0;
              renderedInfo.push(`subject: ${subjLength}/78 chars`);
            } else if (channel === "telegram") {
              const keyboardCount = Array.isArray(result.raw.keyboard)
                ? result.raw.keyboard.length
                : 0;
              renderedInfo.push(`${keyboardCount} botões`);
            }

            if (renderedInfo.length > 0) {
              process.stdout.write(` (${renderedInfo.join(", ")})`);
            }

            process.stdout.write("\n");
          } catch (error) {
            process.stdout.write(
              `${colors.red}ERRO${colors.reset} - ${error instanceof Error ? error.message : "Erro desconhecido"}\n`
            );
            hasErrors = true;
          }
        }
      }
    }

    // Resumo de resultados
    console.log(`\n${colors.bright}=== RESUMO DOS TESTES ====${colors.reset}`);
    console.log(`${colors.blue}Total de testes:${colors.reset} ${totalTests}`);
    console.log(
      `${colors.green}Testes passados:${colors.reset} ${passedTests}`
    );

    if (hasErrors) {
      console.log(
        `${colors.red}Testes com falha:${colors.reset} ${totalTests - passedTests}`
      );
      process.exit(1);
    } else {
      console.log(
        `${colors.bright}${colors.green}TODOS OS TESTES PASSARAM!${colors.reset}`
      );
      process.exit(0);
    }
  } catch (error) {
    console.error(
      `${colors.red}ERRO CRÍTICO:${colors.reset} ${error instanceof Error ? error.message : "Erro desconhecido"}`
    );
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Erro não tratado:", error);
  process.exit(1);
});
