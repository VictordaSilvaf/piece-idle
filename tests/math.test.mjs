import assert from 'node:assert/strict';
import test from 'node:test';
import { clamp, distance, normalizeVector } from '../src/core/math.js';

test('clamp mantém valores dentro dos limites', () => {
  assert.equal(clamp(-2, 0, 10), 0);
  assert.equal(clamp(12, 0, 10), 10);
  assert.equal(clamp(5, 0, 10), 5);
});

test('distance calcula distância euclidiana', () => {
  assert.equal(distance({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
});

test('normalizeVector preserva direção e informa magnitude', () => {
  const vector = normalizeVector(3, 4);
  assert.equal(vector.length, 5);
  assert.equal(vector.x, .6);
  assert.equal(vector.y, .8);
});
