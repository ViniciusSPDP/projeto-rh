// src/types/configuracoes.ts (arquivo novo ou existente)

// Esta interface representa a configuração para uma única etapa.
export interface TemplateEtapa {
  ativo: boolean;       // Interruptor individual para esta etapa
  mensagem: string;     // O texto da mensagem (ex: "Olá {nomeCandidato}, você avançou...")
}

// Esta é a configuração completa para a funcionalidade de disparo por etapa.
export interface EtapasConfig {
  disparoPorEtapaAtivado: boolean; // O interruptor GERAL da funcionalidade
  templatesPorEtapa: {
    // A chave do objeto será o nome da etapa (ex: "Triagem", "Entrevista Técnica")
    [nomeDaEtapa: string]: TemplateEtapa;
  };
  delayEntreEnvios: number; // <-- ADICIONE ESTA LINHA
}