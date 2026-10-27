import type { DifficultyInfo, IslandDefinition } from '../types/game';

export class IslandBalancer {
  static crewAverageLevel(crew: Array<{ level: number }>): number {
    if (!crew.length) return 1;
    return crew.reduce((total, member) => total + member.level, 0) / crew.length;
  }

  static difficulty(island: Pick<IslandDefinition, 'levelMin'>, averageLevel: number): DifficultyInfo {
    const gap = (island.levelMin || 0) - averageLevel;
    if (gap <= 0) return { id: 'easy', label: 'Adequada' };
    if (gap <= 8) return { id: 'medium', label: 'Desafiadora' };
    return { id: 'hard', label: 'Perigosa' };
  }

  static enemyMaxHp(island: Pick<IslandDefinition, 'terrain' | 'levelMin'>, index: number): number {
    const baseHp = island.terrain === 'storm' ? 160 : 110;
    return Math.round((baseHp + index * 18) * (1 + (island.levelMin || 1) * 0.18));
  }

  static enemyDamage(island: Pick<IslandDefinition, 'terrain' | 'levelMin'>, index: number): number {
    const baseDamage = island.terrain === 'storm' ? 7 : 5;
    const levelMultiplier = 1 + Math.max(0, (island.levelMin || 1) - 1) * 0.115;
    return Math.round((baseDamage + index * 1.35) * levelMultiplier);
  }
}

export const crewAverageLevel = IslandBalancer.crewAverageLevel.bind(IslandBalancer);
export const islandDifficulty = IslandBalancer.difficulty.bind(IslandBalancer);
export const enemyMaxHp = IslandBalancer.enemyMaxHp.bind(IslandBalancer);
export const enemyDamage = IslandBalancer.enemyDamage.bind(IslandBalancer);
