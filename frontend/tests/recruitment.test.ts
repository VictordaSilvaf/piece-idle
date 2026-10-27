import assert from 'node:assert/strict';
import test from 'node:test';
import { chestCatalog } from '../src/data/recruitment';
import { RecruitmentSystem } from '../src/domain/recruitment';

const characters = [
  { id: 'common', rarity: 'common' },
  { id: 'rare', rarity: 'rare' },
  { id: 'epic', rarity: 'epic' },
  { id: 'legendary', rarity: 'legendary' },
  { id: 'mythic', rarity: 'mythic' },
];

test('baú geral garante mítico no limite de pity', () => {
  const chest = chestCatalog.grandLine;
  const state = new RecruitmentSystem();
  state.pityByChest[chest.id] = chest.hardPity - 1;
  const result = state.roll(chest, characters, () => 0.99);
  assert.equal(result.rarity.id, 'mythic');
  assert.equal(result.guaranteed, true);
  assert.equal(state.pity(chest), 0);
});

test('pity suave aumenta a chance mítica antes da garantia', () => {
  const chest = chestCatalog.grandLine;
  const state = new RecruitmentSystem();
  state.pityByChest[chest.id] = chest.softPityStart;
  assert.ok(state.mythicChance(chest) > 0.3);
});
