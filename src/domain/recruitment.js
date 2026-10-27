import { rarities } from '../data/recruitment.js';

export function createRecruitmentState() {
  return { pityByChest: {} };
}

export function chestPity(state, chest) {
  return state.pityByChest[chest.id] || 0;
}

export function mythicChance(state, chest) {
  const pity = chestPity(state, chest);
  const extra = pity >= chest.softPityStart ? (pity - chest.softPityStart + 1) * chest.mythicIncrease : 0;
  return Math.min(100, rarities.mythic.chance + extra);
}

export function rollRecruit(state, chest, characters, random = Math.random) {
  const pity = chestPity(state, chest);
  const guaranteed = pity + 1 >= chest.hardPity;
  const mythicRate = mythicChance(state, chest);
  const roll = random() * 100;
  let rarityId = guaranteed || roll < mythicRate ? 'mythic' : 'common';
  if (!guaranteed && roll >= mythicRate) {
    const remainingRoll = (roll - mythicRate) / (100 - mythicRate) * (100 - rarities.mythic.chance);
    rarityId = remainingRoll < rarities.common.chance ? 'common' : remainingRoll < rarities.common.chance + rarities.rare.chance ? 'rare' : remainingRoll < rarities.common.chance + rarities.rare.chance + rarities.epic.chance ? 'epic' : 'legendary';
  }
  const pool = characters.filter((character) => character.rarity === rarityId);
  const featuredPool = chest.featuredIds?.length ? pool.filter((character) => chest.featuredIds.includes(character.id)) : [];
  const selectionPool = featuredPool.length && chest.selectionMode !== 'all' ? featuredPool : pool;
  const character = selectionPool[Math.floor(random() * selectionPool.length)] || characters.find((unit) => unit.rarity === rarityId) || characters[0];
  state.pityByChest[chest.id] = rarityId === 'mythic' ? 0 : pity + 1;
  return { character, rarity: rarities[rarityId], guaranteed, pityBefore: pity, pityAfter: state.pityByChest[chest.id] };
}
