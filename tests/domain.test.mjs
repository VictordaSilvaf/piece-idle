import assert from 'node:assert/strict';
import test from 'node:test';
import { crewAverageLevel, enemyMaxHp, islandDifficulty } from '../src/domain/islands.js';

test('classifica ilha pela média da tripulação', () => {
  const island = { levelMin: 20 };
  assert.equal(islandDifficulty(island, 20).id, 'easy');
  assert.equal(islandDifficulty(island, 14).id, 'medium');
  assert.equal(islandDifficulty(island, 10).id, 'hard');
});

test('escala vida dos inimigos pelo nível da ilha', () => {
  const lowLevel = enemyMaxHp({ terrain: 'mangrove', levelMin: 1 }, 0);
  const highLevel = enemyMaxHp({ terrain: 'storm', levelMin: 20 }, 0);
  assert.ok(highLevel > lowLevel);
});

test('calcula a média de nível da formação', () => {
  assert.equal(crewAverageLevel([{ level: 10 }, { level: 20 }]), 15);
});
