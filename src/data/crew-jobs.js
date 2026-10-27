// Catálogo de cargos usados por tripulações piratas no universo de referência.
// `formationRole` agrupa o cargo para a formação de cinco vagas do jogo.
export const crewJobs = {
  captain: { name: 'Capitão', formationRole: 'Capitão', icon: '★', description: 'Lidera a tripulação e coordena as sinergias.' },
  firstMate: { name: 'Imediato', formationRole: 'Combatente', icon: '◆', description: 'Braço direito do capitão e liderança de combate.' },
  navigator: { name: 'Navegador', formationRole: 'Navegador', icon: '⌁', description: 'Define rotas, leitura do clima e exploração.' },
  helmsman: { name: 'Timoneiro', formationRole: 'Navegador', icon: '≋', description: 'Conduz o navio e protege a rota em alto-mar.' },
  swordsman: { name: 'Espadachim', formationRole: 'Combatente', icon: '⚔', description: 'Especialista em duelo e dano corpo a corpo.' },
  sniper: { name: 'Atirador', formationRole: 'Especialista', icon: '◎', description: 'Combate à distância, precisão e utilidade.' },
  cook: { name: 'Cozinheiro', formationRole: 'Suporte', icon: '♨', description: 'Mantém a tripulação alimentada e recuperada.' },
  doctor: { name: 'Médico', formationRole: 'Suporte', icon: '✚', description: 'Cura, revive e reduz riscos da expedição.' },
  archaeologist: { name: 'Arqueólogo', formationRole: 'Especialista', icon: '✦', description: 'Pesquisa ruínas, relíquias e rotas antigas.' },
  shipwright: { name: 'Carpinteiro Naval', formationRole: 'Especialista', icon: '⚙', description: 'Repara, melhora e protege o navio.' },
  musician: { name: 'Músico', formationRole: 'Suporte', icon: '♫', description: 'Inspira aliados e sustenta o moral.' },
  lookout: { name: 'Vigia', formationRole: 'Navegador', icon: '◉', description: 'Detecta ilhas, ameaças e oportunidades no horizonte.' },
  gunner: { name: 'Artilheiro', formationRole: 'Combatente', icon: '◈', description: 'Opera canhões e defesa de longo alcance.' },
  scholar: { name: 'Erudito', formationRole: 'Especialista', icon: '▤', description: 'Decifra história, idiomas e mecanismos.' },
};

export function getCrewJob(jobId) {
  return crewJobs[jobId];
}
