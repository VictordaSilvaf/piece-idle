import assert from 'node:assert/strict';
import test from 'node:test';
import { MathUtils } from '../src/core/math';

test('clamp mantém valores dentro dos limites', () => {
  assert.equal(MathUtils.clamp(-2, 0, 10), 0);
  assert.equal(MathUtils.clamp(12, 0, 10), 10);
  assert.equal(MathUtils.clamp(5, 0, 10), 5);
});

test('distance calcula distância euclidiana', () => {
  assert.equal(MathUtils.distance({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
});

test('normalizeVector preserva direção e informa magnitude', () => {
  const vector = MathUtils.normalizeVector(3, 4);
  assert.equal(vector.length, 5);
  assert.equal(vector.x, 0.6);
  assert.equal(vector.y, 0.8);
});
