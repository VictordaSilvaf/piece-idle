import { Character } from '../domain/character';
import { characterRarities } from './recruitment';
import type { ActiveSkill, PassiveSkill, Skill } from '../types/game';

const skillProfiles = [
  { cooldown: 1700, staminaCost: 18, multiplier: 1.55 },
  { cooldown: 2900, staminaCost: 28, multiplier: 2.05 },
  { cooldown: 4400, staminaCost: 40, multiplier: 2.65 },
];

function makeSkills(
  active: Array<[string, string]>,
  passive: Omit<PassiveSkill, 'kind'>,
): Skill[] {
  const actives: ActiveSkill[] = active.map(([name, description], index) => ({
    name,
    description,
    kind: 'active',
    ...skillProfiles[index],
  }));
  return [...actives, { ...passive, kind: 'passive' }];
}

const characterStatSeeds: Record<string, [number, number, number, number, number]> = {
  luffy: [108, 24, 7, 100, 13],
  zoro: [122, 27, 9, 82, 9],
  nami: [82, 20, 4, 112, 15],
  usopp: [78, 22, 4, 106, 12],
  sanji: [98, 25, 6, 94, 12],
  chopper: [112, 18, 8, 120, 16],
  robin: [88, 23, 5, 102, 12],
  franky: [132, 24, 11, 78, 8],
  brook: [86, 21, 5, 110, 14],
  jinbe: [128, 26, 10, 88, 10],
};

const characterSeeds = [
  { id: 'luffy', jobId: 'captain', name: 'Monkey D. Luffy', role: 'Capitão', icon: '☀', level: 18, power: 920, tags: ['Capitão', 'Coragem'], color: 'coral', skills: makeSkills([['Gomu Gomu no Pistol', 'Um soco elástico de longo alcance.'], ['Gomu Gomu no Gatling', 'Rajada de golpes de borracha.'], ['Gomu Gomu no Bazooka', 'Impacto duplo que lança o alvo.']], { name: 'Vontade do Capitão', description: 'Aumenta em 8% o dano de toda a tripulação.', effect: 'captain' }) },
  { id: 'zoro', jobId: 'swordsman', name: 'Roronoa Zoro', role: 'Espadachim', icon: '⚔', level: 17, power: 890, tags: ['Lâmina', 'Guardião'], color: 'moss', skills: makeSkills([['Oni Giri', 'Corte de três espadas em avanço.'], ['Tatsumaki', 'Tornado de lâminas que fere ao redor.'], ['Santoryu Ougi: Sanzen Sekai', 'Técnica máxima de três espadas.']], { name: 'Espírito de Espadachim', description: 'Causa 15% mais dano em inimigos abaixo de 40% de vida.', effect: 'execution' }) },
  { id: 'nami', jobId: 'navigator', name: 'Nami', role: 'Navegadora', icon: '⌁', level: 16, power: 710, tags: ['Navegador', 'Cartógrafo'], color: 'sun', skills: makeSkills([['Thunderbolt Tempo', 'Raio disparado pelo Clima-Tact.'], ['Mirage Tempo', 'Miragens confundem o inimigo.'], ['Zeus Breeze Tempo', 'Descarga climática concentrada.']], { name: 'Navegadora Genial', description: 'Dá 12% de chance de a tripulação evitar um ataque.', effect: 'evasion' }) },
  { id: 'usopp', jobId: 'sniper', name: 'Usopp', role: 'Atirador', icon: '◎', level: 15, power: 680, tags: ['Atirador', 'Caçador'], color: 'gold', skills: makeSkills([['Fire Bird Star', 'Projétil explosivo incendiário.'], ['Green Star: Impact Wolf', 'Planta de impacto que persegue o alvo.'], ['Pop Green: Devil', 'Planta carnívora de contenção.']], { name: 'Mira de Sniper', description: '12% de chance de o ataque coletivo causar dano crítico.', effect: 'critical' }) },
  { id: 'sanji', jobId: 'cook', name: 'Sanji', role: 'Cozinheiro', icon: '♨', level: 16, power: 760, tags: ['Cozinheiro', 'Chama'], color: 'blue', skills: makeSkills([['Diable Jambe', 'Chute incendiário que queima o alvo.'], ['Concassé', 'Sequência de chutes de alta velocidade.'], ['Hell Memories', 'Explosão de chutes com chamas.']], { name: 'Cozinheiro dos Chapéus de Palha', description: 'Após cada ataque, restaura vida do aliado mais ferido.', effect: 'cook' }) },
  { id: 'chopper', jobId: 'doctor', name: 'Tony Tony Chopper', role: 'Médico', icon: '✚', level: 14, power: 650, tags: ['Médico', 'Suporte'], color: 'rose', skills: makeSkills([['Heavy Point', 'Forma de força física ampliada.'], ['Guard Point', 'Defesa em forma de fortaleza.'], ['Horn Point', 'Investida com chifres reforçados.']], { name: 'Médico da Tripulação', description: 'Regenera 2 PV por segundo para todos os aliados vivos.', effect: 'doctor' }) },
  { id: 'robin', jobId: 'archaeologist', name: 'Nico Robin', role: 'Arqueóloga', icon: '✦', level: 15, power: 720, tags: ['Cartógrafo', 'Relíquia'], color: 'violet', skills: makeSkills([['Dos Fleur: Clutch', 'Braços extras imobilizam e quebram a guarda.'], ['Mil Fleur: Gigantesco Mano', 'Mãos gigantes esmagam o inimigo.'], ['Cien Fleur: Wing', 'Asas de braços para reposicionamento.']], { name: 'Estratégia de Arqueóloga', description: 'Reduz em 10% a velocidade dos inimigos.', effect: 'control' }) },
  { id: 'franky', jobId: 'shipwright', name: 'Franky', role: 'Carpinteiro Naval', icon: '⚙', level: 14, power: 700, tags: ['Navio', 'Guardião'], color: 'cyan', skills: makeSkills([['Strong Right', 'Braço mecânico propelido por cola.'], ['Coup de Vent', 'Canhão de ar comprimido.'], ['Franky Radical Beam', 'Raio de alta potência.']], { name: 'Corpo Cyborg', description: 'Reduz em 10% o dano recebido pela tripulação.', effect: 'armor' }) },
  { id: 'brook', jobId: 'musician', name: 'Brook', role: 'Músico', icon: '♫', level: 13, power: 610, tags: ['Músico', 'Suporte'], color: 'purple', skills: makeSkills([['Soul Solid', 'Corte congelante da alma.'], ['Three Verse Humming', 'Golpe veloz antes do inimigo perceber.'], ['Party Music', 'Melodia que inspira os aliados.']], { name: 'Yomi Yomi no Mi', description: 'Reduz em 100 ms o intervalo entre ataques coletivos.', effect: 'tempo' }) },
  { id: 'jinbe', jobId: 'helmsman', name: 'Jinbe', role: 'Timoneiro', icon: '≋', level: 16, power: 810, tags: ['Navegador', 'Guardião'], color: 'aqua', skills: makeSkills([['Karatê dos Homens-Peixe', 'Impacto que transmite força pela água do corpo.'], ['Brachial Block', 'Defesa sólida contra golpes pesados.'], ['Vagabond Drill', 'Onda perfurante de água.']], { name: 'Mestre do Mar', description: 'Reduz em mais 8% o dano recebido pela tripulação.', effect: 'tideguard' }) },
];

export function createCharacterRoster(): Character[] {
  return characterSeeds.map((seed) => {
    const character = new Character({ ...seed, rarity: characterRarities[seed.id] });
    const stats = characterStatSeeds[seed.id];
    character.applyStatSeed(...stats);
    return character;
  });
}
