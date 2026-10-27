export type FormationRole = 'Capitão' | 'Navegador' | 'Combatente' | 'Suporte' | 'Especialista';

export type SkillKind = 'active' | 'passive';

export type PassiveEffect =
  | 'captain'
  | 'execution'
  | 'evasion'
  | 'critical'
  | 'cook'
  | 'doctor'
  | 'control'
  | 'armor'
  | 'tempo'
  | 'tideguard';

export type RarityId = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export type ItemRarity = 'common' | 'uncommon' | 'rare';

export type TerrainId = 'ruins' | 'mangrove' | 'storm' | 'snow' | 'desert';

export type Direction = 'down' | 'up' | 'side';

export interface ActiveSkill {
  name: string;
  description: string;
  kind: 'active';
  cooldown: number;
  staminaCost: number;
  multiplier: number;
}

export interface PassiveSkill {
  name: string;
  description: string;
  kind: 'passive';
  effect: PassiveEffect;
}

export type Skill = ActiveSkill | PassiveSkill;

export interface CrewJob {
  name: string;
  formationRole: FormationRole;
  icon: string;
  description: string;
}

export interface ItemDefinition {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  rarity: ItemRarity;
}

export interface InventoryEntry extends ItemDefinition {
  quantity: number;
}

export interface EssenceDefinition {
  itemId: string;
  name: string;
  icon: string;
  characterId: string;
}

export interface RarityDefinition {
  id: RarityId;
  name: string;
  color: string;
  label: string;
  chance: number;
  icon: string;
}

export interface ChestDefinition {
  id: string;
  name: string;
  subtitle: string;
  keyId: string;
  keyName: string;
  keyIcon: string;
  softPityStart: number;
  hardPity: number;
  mythicIncrease: number;
  featuredIds: string[];
  selectionMode: 'all' | 'featured-guarantee' | 'featured-rate-up';
  status: 'active' | 'upcoming';
}

export interface IslandDefinition {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  reward: number;
  enemy: string;
  enemies: number;
  terrain: TerrainId;
  essence?: EssenceDefinition;
  levelMin?: number;
  levelMax?: number;
}

export interface DifficultyInfo {
  id: 'easy' | 'medium' | 'hard';
  label: string;
}

export interface Vec2 {
  x: number;
  y: number;
}

export interface CharacterSeed {
  id: string;
  jobId: string;
  name: string;
  role: string;
  icon: string;
  level: number;
  power: number;
  tags: string[];
  color: string;
  skills: Skill[];
  rarity?: RarityId;
}
