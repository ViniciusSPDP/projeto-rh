const bcrypt = require('bcryptjs')

// Simulando um hash gerado anteriormente (como no gerarHash.js)
const senhaOriginal = 'minhaSenha123'
const senhaIncorreta = 'abc'
const hashSalvoNoBanco = bcrypt.hashSync(senhaOriginal, 10)

console.log('Hash armazenado:', hashSalvoNoBanco)

// Função para testar login
function autenticar(emailDigitado, senhaDigitada) {
  const emailCorreto = 'teste@email.com'
  const senhaCorretaHash = hashSalvoNoBanco

  if (emailDigitado !== emailCorreto) {
    console.log('❌ Email incorreto' + senhaDigitada + " " + senhaCorretaHash)
    return false
  }

  const senhaConfere = bcrypt.compareSync(senhaDigitada, senhaCorretaHash)

  if (!senhaConfere) {
    console.log('❌ Senha incorreta' + senhaDigitada + " " + senhaCorretaHash)
    return false
  }

  console.log('✅ Login bem-sucedido' + senhaDigitada + " " + senhaCorretaHash)
  return true
}

// Testando
autenticar('teste@email.com', '123')     // ✅
autenticar('teste@email.com', 'abc')     // ❌
autenticar('errado@email.com', '123')    // ❌
autenticar('teste@email.com', '123')     // ✅
