// scripts/setup-directories.js
// Execute este script depois do build: node scripts/setup-directories.js

const fs = require('fs');
const path = require('path');

const directories = [
  'public/uploads',
  'public/uploads/curriculos'
];

console.log('🚀 Configurando estrutura de diretórios...');

directories.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Diretório criado: ${dir}`);
  } else {
    console.log(`ℹ️  Diretório já existe: ${dir}`);
  }
});

// Criar arquivo .gitkeep para manter as pastas no git
directories.forEach(dir => {
  const gitkeepPath = path.join(process.cwd(), dir, '.gitkeep');
  if (!fs.existsSync(gitkeepPath)) {
    fs.writeFileSync(gitkeepPath, '# Manter esta pasta no git\n');
    console.log(`📝 Criado .gitkeep em: ${dir}`);
  }
});

// Criar arquivo de teste para verificar se está funcionando
const testFile = path.join(process.cwd(), 'public/uploads/curriculos', 'test.txt');
fs.writeFileSync(testFile, 'Arquivo de teste - pode deletar\n');
console.log('📄 Arquivo de teste criado');

console.log('✨ Configuração concluída!');
console.log('\n📋 Próximos passos:');
console.log('1. Execute: npm run build');
console.log('2. Execute: npm start');
console.log('3. Teste o upload de um PDF');
console.log('4. Verifique se o preview funciona');
console.log('\n🔍 Para debug, verifique os logs no console do navegador e do servidor.');