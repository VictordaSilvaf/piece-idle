import assert from 'node:assert/strict';
import test from 'node:test';
import { crewAverageLevel, enemyDamage, enemyMaxHp, islandDifficulty } from '../src/domain/islands.js';
import { BOOST_MAX_LEVEL, applyBoost, boostEssenceCost, boostUpgradeCost, essenceDropChance } from '../src/domain/boost.js';
import { characterAttack, characterMaxHp, grantExperience, MAX_CHARACTER_LEVEL } from '../src/domain/progression.js';

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

test('escala dano dos inimigos pelo nível da ilha', () => {
  assert.ok(enemyDamage({ terrain: 'mangrove', levelMin: 20 }, 0) > enemyDamage({ terrain: 'mangrove', levelMin: 1 }, 0));
});

test('calcula a média de nível da formação', () => {
  assert.equal(crewAverageLevel([{ level: 10 }, { level: 20 }]), 15);
});

test('boost é limitado, aumenta atributos e possui custo progressivo por nível', () => {
  const character = { level: 20, maxHp: 100, attack: 20, defense: 5, boostLevel: 0 };
  const initialCost = boostUpgradeCost(character);
  assert.equal(applyBoost(character), true);
  assert.equal(characterMaxHp(character), 192);
  assert.equal(characterAttack(character), 48);
  assert.ok(boostUpgradeCost(character) > initialCost);
  assert.equal(boostEssenceCost(0), null);
  assert.equal(boostEssenceCost(BOOST_MAX_LEVEL + 1), null);
  assert.equal(boostEssenceCost(1), 8);
  assert.equal(boostEssenceCost(BOOST_MAX_LEVEL), 538);
  character.boostLevel = BOOST_MAX_LEVEL;
  assert.equal(applyBoost(character), false);
});

test('chance de essência cresce por ilha e possui teto', () => {
  assert.ok(essenceDropChance(40) > essenceDropChance(1));
  assert.equal(essenceDropChance(1000), .08);
});

test('nível de personagem não ultrapassa o máximo de 100', () => {
  const character = { level: 99, experience: 100, experienceToLevel: 100, stamina: 0, maxStamina: 100 };
  assert.equal(grantExperience(character, 10_000), true);
  assert.equal(character.level, MAX_CHARACTER_LEVEL);
  assert.equal(character.experience, 0);
  assert.equal(character.experienceToLevel, 0);
  assert.equal(grantExperience(character, 500), false);
  assert.equal(character.level, MAX_CHARACTER_LEVEL);
});
