import assert from 'node:assert/strict';
import test from 'node:test';
import { Inventory } from '../src/domain/inventory';

test('consome itens somente quando houver quantidade disponível', () => {
  const inventory = new Inventory({ revivePotion: 2 });
  assert.equal(inventory.consume('revivePotion'), true);
  assert.equal(inventory.quantity('revivePotion'), 1);
  assert.equal(inventory.consume('revivePotion', 2), false);
  assert.equal(inventory.quantity('revivePotion'), 1);
});

test('adiciona drops de essência ao inventário', () => {
  const inventory = new Inventory();
  inventory.add('essenceLeadership');
  inventory.add('essenceLeadership', 2);
  assert.equal(inventory.quantity('essenceLeadership'), 3);
});
