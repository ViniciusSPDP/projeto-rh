// app/configuracoes/templates-whatsapp/VariaveisDisponiveis.tsx

'use client'

import { useState } from 'react'
import { Info, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'

interface Variavel {
  nome: string
  descricao: string
  exemplo: string
}

interface GrupoVariaveis {
  titulo: string
  icone: string
  variaveis: Variavel[]
}

// CORREÇÃO: Definir como um Record (objeto) em vez de array
const gruposVariaveis: Record<string, GrupoVariaveis> = {
  candidato: {
    titulo: 'Dados do Candidato',
    icone: '👤',
    variaveis: [
      { nome: 'nomeCandidato', descricao: 'Nome completo do candidato', exemplo: 'João Silva' },
      { nome: 'cpfCandidato', descricao: 'CPF do candidato', exemplo: '123.456.789-00' },
      { nome: 'rgCandidato', descricao: 'RG do candidato', exemplo: '12.345.678-9' },
      { nome: 'emailCandidato', descricao: 'E-mail do candidato', exemplo: 'joao.silva@email.com' },
      { nome: 'telefoneCandidato', descricao: 'Telefone principal', exemplo: '(11) 98765-4321' },
      { nome: 'datanascimentoCandidato', descricao: 'Data de nascimento', exemplo: '01/01/1990' },
      { nome: 'sexoCandidato', descricao: 'Sexo do candidato', exemplo: 'Masculino' },
      { nome: 'estadocivilCandidato', descricao: 'Estado civil', exemplo: 'Solteiro' },
      { nome: 'escolaridadeCandidato', descricao: 'Escolaridade', exemplo: 'Ensino Superior Completo' },
      { nome: 'situacaoCandidato', descricao: 'Situação atual do candidato', exemplo: 'Em processo' },
    ]
  },
  endereco: {
    titulo: 'Endereço do Candidato',
    icone: '📍',
    variaveis: [
      { nome: 'cepCandidato', descricao: 'CEP', exemplo: '01234-567' },
      { nome: 'ruaCandidato', descricao: 'Nome da rua', exemplo: 'Rua das Flores' },
      { nome: 'numeroCandidato', descricao: 'Número', exemplo: '123' },
      { nome: 'bairroCandidato', descricao: 'Bairro', exemplo: 'Centro' },
      { nome: 'cidadeCandidato', descricao: 'Cidade', exemplo: 'São Paulo' },
      { nome: 'estadoCandidato', descricao: 'Estado', exemplo: 'SP' },
    ]
  },
  experiencia: {
    titulo: 'Experiência Profissional',
    icone: '💼',
    variaveis: [
      { nome: 'empresaCandidato', descricao: 'Última empresa', exemplo: 'ABC Tecnologia' },
      { nome: 'empresa2Candidato', descricao: 'Penúltima empresa', exemplo: 'XYZ Consultoria' },
      { nome: 'empresa3Candidato', descricao: 'Antepenúltima empresa', exemplo: 'Tech Solutions' },
    ]
  },
  vaga: {
    titulo: 'Dados da Vaga',
    icone: '📋',
    variaveis: [
      { nome: 'titulo', descricao: 'Título da vaga', exemplo: 'Analista de RH' },
      { nome: 'descricao', descricao: 'Descrição da vaga', exemplo: 'Vaga para atuar no setor de RH...' },
      { nome: 'status', descricao: 'Status da vaga', exemplo: 'Aberta' },
    ]
  },
  processo: {
    titulo: 'Processo Seletivo',
    icone: '📊',
    variaveis: [
      { nome: 'etapa', descricao: 'Etapa atual do candidato', exemplo: 'Entrevista' },
      { nome: 'vagainteresseCandidato', descricao: 'Vaga de interesse', exemplo: 'Analista de RH' },
    ]
  }
}

export default function VariaveisDisponiveis() {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['candidato', 'vaga'])
  const [copiedVar, setCopiedVar] = useState<string>('')

  const toggleGroup = (grupo: string) => {
    setExpandedGroups(prev =>
      prev.includes(grupo)
        ? prev.filter(g => g !== grupo)
        : [...prev, grupo]
    )
  }

  const copyVariable = (varName: string) => {
    navigator.clipboard.writeText(`{{${varName}}}`)
    setCopiedVar(varName)
    setTimeout(() => setCopiedVar(''), 2000)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
        <div>
          <h3 className="text-lg font-medium text-gray-800">Variáveis Disponíveis</h3>
          <p className="text-sm text-gray-600 mt-1">
            Use estas variáveis em suas mensagens. Elas serão substituídas automaticamente pelos dados reais.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(gruposVariaveis).map(([key, grupo]) => (
          <div key={key} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleGroup(key)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{grupo.icone}</span>
                <span className="font-medium text-gray-800">{grupo.titulo}</span>
                <span className="text-sm text-gray-500">
                  ({grupo.variaveis.length} variáveis)
                </span>
              </div>
              {expandedGroups.includes(key) ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {expandedGroups.includes(key) && (
              <div className="border-t bg-gray-50 p-4">
                <div className="space-y-2">
                  {grupo.variaveis.map((variavel) => (
                    <div
                      key={variavel.nome}
                      className="flex items-start justify-between p-3 bg-white rounded-lg border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-blue-600">
                            {`{{${variavel.nome}}}`}
                          </code>
                          <button
                            onClick={() => copyVariable(variavel.nome)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Copiar variável"
                          >
                            {copiedVar === variavel.nome ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3 text-gray-400" />
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{variavel.descricao}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Exemplo: {variavel.exemplo}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Dica:</strong> Clique no ícone de copiar para adicionar a variável à área de transferência.
          Cole no campo de mensagem onde desejar que o valor apareça.
        </p>
      </div>
    </div>
  )
}