import type { CharacterSeed, PassiveEffect, Skill } from '../types/game';

export const MAX_CHARACTER_LEVEL = 100;
export const BOOST_MAX_LEVEL = 50;

export class Character {
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
  rarity?: string;
  maxHp = 0;
  attack = 0;
  defense = 0;
  maxStamina = 0;
  stamina = 0;
  staminaRegen = 0;
  experience = 0;
  experienceToLevel = 0;
  skillReadyAt: number[] = [0, 0, 0];
  boostLevel = 0;

  constructor(seed: CharacterSeed) {
    this.id = seed.id;
    this.jobId = seed.jobId;
    this.name = seed.name;
    this.role = seed.role;
    this.icon = seed.icon;
    this.level = seed.level;
    this.power = seed.power;
    this.tags = seed.tags;
    this.color = seed.color;
    this.skills = seed.skills;
    this.rarity = seed.rarity;
  }

  applyStatSeed(maxHp: number, attack: number, defense: number, maxStamina: number, staminaRegen: number): void {
    this.maxHp = maxHp;
    this.attack = attack;
    this.defense = defense;
    this.maxStamina = maxStamina;
    this.stamina = maxStamina;
    this.staminaRegen = staminaRegen;
    this.experience = 0;
    this.experienceToLevel = 120 + this.level * 12;
    this.skillReadyAt = [0, 0, 0];
    this.boostLevel = 0;
  }

  get computedMaxHp(): number {
    return this.maxHp + (this.level - 1) * 4 + this.boostLevel * (8 + Math.floor(this.level * 0.4));
  }

  get computedAttack(): number {
    return this.attack + Math.floor((this.level - 1) * 1.35) + this.boostLevel * (1 + Math.floor(this.level / 8));
  }

  get computedDefense(): number {
    return this.defense + Math.floor((this.level - 1) * 0.35) + Math.floor(this.boostLevel * (0.35 + this.level * 0.04));
  }

  get skillRank(): number {
    return 1 + Math.floor((this.level - 1) / 6);
  }

  skillDamageMultiplier(skill: { multiplier: number }): number {
    return skill.multiplier * (1 + (this.skillRank - 1) * 0.11 + this.boostLevel * 0.006);
  }

  passiveEffect(): PassiveEffect | undefined {
    const passive = this.skills.at(-1);
    return passive?.kind === 'passive' ? passive.effect : undefined;
  }

  grantExperience(amount: number): boolean {
    if (this.level >= MAX_CHARACTER_LEVEL) {
      this.level = MAX_CHARACTER_LEVEL;
      this.experience = 0;
      return false;
    }
    let leveledUp = false;
    this.experience += amount;
    while (this.level < MAX_CHARACTER_LEVEL && this.experience >= this.experienceToLevel) {
      this.experience -= this.experienceToLevel;
      this.level += 1;
      if (this.level >= MAX_CHARACTER_LEVEL) {
        this.experience = 0;
        this.experienceToLevel = 0;
      } else {
        this.experienceToLevel = Math.floor(this.experienceToLevel * 1.14);
      }
      this.stamina = this.maxStamina;
      leveledUp = true;
    }
    return leveledUp;
  }

  static boostEssenceCost(targetBoostLevel: number): number | null {
    if (targetBoostLevel < 1 || targetBoostLevel > BOOST_MAX_LEVEL) return null;
    const step = targetBoostLevel - 1;
    return 8 + step * 2 + Math.floor(step ** 2 * 0.18);
  }

  boostUpgradeCost(): number | null {
    return Character.boostEssenceCost(this.boostLevel + 1);
  }

  applyBoost(): boolean {
    if (this.boostLevel >= BOOST_MAX_LEVEL) return false;
    this.boostLevel += 1;
    return true;
  }
}

export function characterMaxHp(character: Character | { maxHp: number; level: number; boostLevel?: number }): number {
  if (character instanceof Character) return character.computedMaxHp;
  const boost = character.boostLevel || 0;
  return character.maxHp + (character.level - 1) * 4 + boost * (8 + Math.floor(character.level * 0.4));
}

export function characterAttack(character: Character | { attack: number; level: number; boostLevel?: number }): number {
  if (character instanceof Character) return character.computedAttack;
  const boost = character.boostLevel || 0;
  return character.attack + Math.floor((character.level - 1) * 1.35) + boost * (1 + Math.floor(character.level / 8));
}

export function characterDefense(character: Character | { defense: number; level: number; boostLevel?: number }): number {
  if (character instanceof Character) return character.computedDefense;
  const boost = character.boostLevel || 0;
  return character.defense + Math.floor((character.level - 1) * 0.35) + Math.floor(boost * (0.35 + character.level * 0.04));
}

export function skillRank(character: Character | { level: number }): number {
  if (character instanceof Character) return character.skillRank;
  return 1 + Math.floor((character.level - 1) / 6);
}

export function skillDamageMultiplier(
  character: Character | { level: number; boostLevel?: number },
  skill: { multiplier: number },
): number {
  if (character instanceof Character) return character.skillDamageMultiplier(skill);
  const boost = character.boostLevel || 0;
  const rank = skillRank(character);
  return skill.multiplier * (1 + (rank - 1) * 0.11 + boost * 0.006);
}

export function grantExperience(
  character: Character | {
    level: number;
    experience: number;
    experienceToLevel: number;
    stamina: number;
    maxStamina: number;
  },
  amount: number,
): boolean {
  if (character instanceof Character) return character.grantExperience(amount);
  if (character.level >= MAX_CHARACTER_LEVEL) {
    character.level = MAX_CHARACTER_LEVEL;
    character.experience = 0;
    return false;
  }
  let leveledUp = false;
  character.experience += amount;
  while (character.level < MAX_CHARACTER_LEVEL && character.experience >= character.experienceToLevel) {
    character.experience -= character.experienceToLevel;
    character.level += 1;
    if (character.level >= MAX_CHARACTER_LEVEL) {
      character.experience = 0;
      character.experienceToLevel = 0;
    } else {
      character.experienceToLevel = Math.floor(character.experienceToLevel * 1.14);
    }
    character.stamina = character.maxStamina;
    leveledUp = true;
  }
  return leveledUp;
}
