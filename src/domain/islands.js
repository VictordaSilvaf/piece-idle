export function crewAverageLevel(crew) {
  if (!crew.length) return 1;
  return crew.reduce((total, member) => total + member.level, 0) / crew.length;
}

export function islandDifficulty(island, averageLevel) {
  const gap = island.levelMin - averageLevel;
  if (gap <= 0) return { id: 'easy', label: 'Adequada' };
  if (gap <= 8) return { id: 'medium', label: 'Desafiadora' };
  return { id: 'hard', label: 'Perigosa' };
}

export function enemyMaxHp(island, index) {
  const baseHp = island.terrain === 'storm' ? 160 : 110;
  return Math.round((baseHp + index * 18) * (1 + (island.levelMin || 1) * .18));
}

export function enemyDamage(island, index) {
  const baseDamage = island.terrain === 'storm' ? 7 : 5;
  const levelMultiplier = 1 + Math.max(0, (island.levelMin || 1) - 1) * .115;
  return Math.round((baseDamage + index * 1.35) * levelMultiplier);
}
