import assert from 'node:assert/strict';
import test from 'node:test';
import { IslandBalancer } from '../src/domain/islands';
import { BoostSystem, BOOST_MAX_LEVEL } from '../src/domain/boost';
import { Character, MAX_CHARACTER_LEVEL } from '../src/domain/character';

test('classifica ilha pela média da tripulação', () => {
  const island = { levelMin: 20 };
  assert.equal(IslandBalancer.difficulty(island, 20).id, 'easy');
  assert.equal(IslandBalancer.difficulty(island, 14).id, 'medium');
  assert.equal(IslandBalancer.difficulty(island, 10).id, 'hard');
});

test('escala vida dos inimigos pelo nível da ilha', () => {
  const lowLevel = IslandBalancer.enemyMaxHp({ terrain: 'mangrove', levelMin: 1 }, 0);
  const highLevel = IslandBalancer.enemyMaxHp({ terrain: 'storm', levelMin: 20 }, 0);
  assert.ok(highLevel > lowLevel);
});

test('escala dano dos inimigos pelo nível da ilha', () => {
  assert.ok(
    IslandBalancer.enemyDamage({ terrain: 'mangrove', levelMin: 20 }, 0) >
      IslandBalancer.enemyDamage({ terrain: 'mangrove', levelMin: 1 }, 0),
  );
});

test('calcula a média de nível da formação', () => {
  assert.equal(IslandBalancer.crewAverageLevel([{ level: 10 }, { level: 20 }]), 15);
});

test('boost é limitado, aumenta atributos e possui custo progressivo por nível', () => {
  const character = new Character({
    id: 'test', jobId: 'captain', name: 'Test', role: 'Capitão', icon: '★',
    level: 20, power: 100, tags: [], color: 'coral', skills: [],
  });
  character.applyStatSeed(100, 20, 5, 100, 10);
  const initialCost = character.boostUpgradeCost();
  assert.equal(character.applyBoost(), true);
  assert.equal(character.computedMaxHp, 192);
  assert.equal(character.computedAttack, 48);
  assert.ok((character.boostUpgradeCost() || 0) > (initialCost || 0));
  assert.equal(BoostSystem.essenceCost(0), null);
  assert.equal(BoostSystem.essenceCost(BOOST_MAX_LEVEL + 1), null);
  assert.equal(BoostSystem.essenceCost(1), 8);
  assert.equal(BoostSystem.essenceCost(BOOST_MAX_LEVEL), 538);
  character.boostLevel = BOOST_MAX_LEVEL;
  assert.equal(character.applyBoost(), false);
});

test('chance de essência cresce por ilha e possui teto', () => {
  assert.ok(BoostSystem.essenceDropChance(40) > BoostSystem.essenceDropChance(1));
  assert.equal(BoostSystem.essenceDropChance(1000), 0.08);
});

test('nível de personagem não ultrapassa o máximo de 100', () => {
  const character = new Character({
    id: 'test', jobId: 'captain', name: 'Test', role: 'Capitão', icon: '★',
    level: 99, power: 100, tags: [], color: 'coral', skills: [],
  });
  character.applyStatSeed(100, 20, 5, 100, 10);
  character.level = 99;
  character.experience = 100;
  character.experienceToLevel = 100;
  character.stamina = 0;
  assert.equal(character.grantExperience(10_000), true);
  assert.equal(character.level, MAX_CHARACTER_LEVEL);
  assert.equal(character.experience, 0);
  assert.equal(character.experienceToLevel, 0);
  assert.equal(character.grantExperience(500), false);
  assert.equal(character.level, MAX_CHARACTER_LEVEL);
});
