import type { Vec2 } from '../types/game';

export class MathUtils {
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  static distance(first: Vec2, second: Vec2): number {
    return Math.hypot(first.x - second.x, first.y - second.y);
  }

  static normalizeVector(x: number, y: number): Vec2 & { length: number } {
    const length = Math.hypot(x, y) || 1;
    return { x: x / length, y: y / length, length };
  }
}

/** @deprecated Prefer MathUtils — kept for API compatibility during migration */
export const clamp = MathUtils.clamp.bind(MathUtils);
export const distance = MathUtils.distance.bind(MathUtils);
export const normalizeVector = MathUtils.normalizeVector.bind(MathUtils);
