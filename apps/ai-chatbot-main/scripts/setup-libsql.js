// scripts/setup-libsql.js

const fs = require('node:fs');
const path = require('node:path');
const { exec } = require('node:child_process');
const dotenv = require('dotenv');

// Carrega variáveis de ambiente do .env.local
dotenv.config({ path: '.env.local' });

// Verifica se estamos usando LibSQL
const DB_DRIVER = process.env.DB_DRIVER || 'postgres';
if (DB_DRIVER !== 'libsql') {
  console.log('🚫 Este script é apenas para configuração do LibSQL. Configure DB_DRIVER=libsql no .env.local');
  process.exit(1);
}

// Determina o caminho do banco de dados LibSQL
const LIBSQL_URL = process.env.LIBSQL_URL || 'file:./data/streamdown.db';
let dbPath = './data/streamdown.db';

// Extrai o caminho do arquivo se estiver usando uma URL file:
if (LIBSQL_URL.startsWith('file:')) {
  dbPath = LIBSQL_URL.replace('file:', '');
}

// Cria o diretório data se não existir
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  console.log(`📁 Criando diretório ${dataDir}...`);
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log('🔄 Configurando banco de dados LibSQL...');

// Executa migração Drizzle para SQLite/LibSQL
console.log('🔄 Executando migrações do banco de dados...');
exec('npx drizzle-kit generate', (err, stdout) => {
  if (err) {
    console.error('❌ Erro ao gerar migrações:', err);
    return;
  }
  
  console.log('✅ Migrações geradas com sucesso.');
  console.log(stdout);
  
  // Aplica as migrações ao banco de dados
  console.log('🔄 Aplicando migrações ao banco de dados...');
  exec('npx drizzle-kit push:sqlite', (pushErr, pushStdout) => {
    if (pushErr) {
      console.error('❌ Erro ao aplicar migrações:', pushErr);
      return;
    }
    
    console.log('✅ Migrações aplicadas com sucesso.');
    console.log(pushStdout);
    
    console.log('🎉 Banco de dados LibSQL configurado e pronto para uso!');
    console.log(`📊 Localização do banco: ${dbPath}`);
  });
});