export const BOOST_MAX_LEVEL = 50;

export function essenceDropChance(islandLevel) {
  return Math.min(.08, (.09 + Math.max(1, islandLevel) * .002) * .25);
}

export function boostEssenceCost(targetBoostLevel) {
  if (targetBoostLevel < 1 || targetBoostLevel > BOOST_MAX_LEVEL) return null;
  const step = targetBoostLevel - 1;
  return 8 + step * 2 + Math.floor(step ** 2 * .18);
}

export function boostUpgradeCost(character) {
  return boostEssenceCost((character.boostLevel || 0) + 1);
}

export function applyBoost(character) {
  if ((character.boostLevel || 0) >= BOOST_MAX_LEVEL) return false;
  character.boostLevel = (character.boostLevel || 0) + 1;
  return true;
}
