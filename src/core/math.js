export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function distance(first, second) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

export function normalizeVector(x, y) {
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length, length };
}
