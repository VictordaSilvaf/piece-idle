import { BOOST_MAX_LEVEL, Character } from './character';

export { BOOST_MAX_LEVEL };

export class BoostSystem {
  static essenceDropChance(islandLevel: number): number {
    return Math.min(0.08, (0.09 + Math.max(1, islandLevel) * 0.002) * 0.25);
  }

  static essenceCost(targetBoostLevel: number): number | null {
    return Character.boostEssenceCost(targetBoostLevel);
  }

  static upgradeCost(character: Character | { boostLevel?: number }): number | null {
    if (character instanceof Character) return character.boostUpgradeCost();
    return Character.boostEssenceCost((character.boostLevel || 0) + 1);
  }

  static apply(character: Character | { boostLevel?: number }): boolean {
    if (character instanceof Character) return character.applyBoost();
    if ((character.boostLevel || 0) >= BOOST_MAX_LEVEL) return false;
    character.boostLevel = (character.boostLevel || 0) + 1;
    return true;
  }
}

export function essenceDropChance(islandLevel: number): number {
  return BoostSystem.essenceDropChance(islandLevel);
}

export function boostEssenceCost(targetBoostLevel: number): number | null {
  return BoostSystem.essenceCost(targetBoostLevel);
}

export function boostUpgradeCost(character: Character | { boostLevel?: number }): number | null {
  return BoostSystem.upgradeCost(character);
}

export function applyBoost(character: Character | { boostLevel?: number }): boolean {
  return BoostSystem.apply(character);
}
