import { rarities } from '../data/recruitment';
import type { ChestDefinition, RarityDefinition, RarityId } from '../types/game';

export interface Recruitable {
  id: string;
  rarity?: string;
}

export interface RecruitResult {
  character: Recruitable;
  rarity: RarityDefinition;
  guaranteed: boolean;
  pityBefore: number;
  pityAfter: number;
}

export class RecruitmentSystem {
  pityByChest: Record<string, number>;

  constructor(pityByChest: Record<string, number> = {}) {
    this.pityByChest = pityByChest;
  }

  pity(chest: ChestDefinition): number {
    return this.pityByChest[chest.id] || 0;
  }

  mythicChance(chest: ChestDefinition): number {
    const pity = this.pity(chest);
    const extra = pity >= chest.softPityStart ? (pity - chest.softPityStart + 1) * chest.mythicIncrease : 0;
    return Math.min(100, rarities.mythic.chance + extra);
  }

  roll(chest: ChestDefinition, characters: Recruitable[], random: () => number = Math.random): RecruitResult {
    const pity = this.pity(chest);
    const guaranteed = pity + 1 >= chest.hardPity;
    const mythicRate = this.mythicChance(chest);
    const rollValue = random() * 100;
    let rarityId: RarityId = guaranteed || rollValue < mythicRate ? 'mythic' : 'common';
    if (!guaranteed && rollValue >= mythicRate) {
      const remainingRoll = ((rollValue - mythicRate) / (100 - mythicRate)) * (100 - rarities.mythic.chance);
      rarityId =
        remainingRoll < rarities.common.chance
          ? 'common'
          : remainingRoll < rarities.common.chance + rarities.rare.chance
            ? 'rare'
            : remainingRoll < rarities.common.chance + rarities.rare.chance + rarities.epic.chance
              ? 'epic'
              : 'legendary';
    }
    const pool = characters.filter((character) => character.rarity === rarityId);
    const featuredPool = chest.featuredIds?.length
      ? pool.filter((character) => chest.featuredIds.includes(character.id))
      : [];
    const selectionPool = featuredPool.length && chest.selectionMode !== 'all' ? featuredPool : pool;
    const character =
      selectionPool[Math.floor(random() * selectionPool.length)] ||
      characters.find((unit) => unit.rarity === rarityId) ||
      characters[0];
    this.pityByChest[chest.id] = rarityId === 'mythic' ? 0 : pity + 1;
    return {
      character,
      rarity: rarities[rarityId],
      guaranteed,
      pityBefore: pity,
      pityAfter: this.pityByChest[chest.id],
    };
  }
}

export function createRecruitmentState(): RecruitmentSystem {
  return new RecruitmentSystem();
}

export function chestPity(state: RecruitmentSystem, chest: ChestDefinition): number {
  return state.pity(chest);
}

export function mythicChance(state: RecruitmentSystem, chest: ChestDefinition): number {
  return state.mythicChance(chest);
}

export function rollRecruit(
  state: RecruitmentSystem,
  chest: ChestDefinition,
  characters: Recruitable[],
  random: () => number = Math.random,
): RecruitResult {
  return state.roll(chest, characters, random);
}
