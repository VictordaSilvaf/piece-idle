import assert from 'node:assert/strict';
import test from 'node:test';
import { addItem, consumeItem, createInventory, itemQuantity } from '../src/domain/inventory.js';

test('consome itens somente quando houver quantidade disponível', () => {
  const inventory = createInventory({ revivePotion: 2 });
  assert.equal(consumeItem(inventory, 'revivePotion'), true);
  assert.equal(itemQuantity(inventory, 'revivePotion'), 1);
  assert.equal(consumeItem(inventory, 'revivePotion', 2), false);
  assert.equal(itemQuantity(inventory, 'revivePotion'), 1);
});

test('adiciona drops de essência ao inventário', () => {
  const inventory = createInventory();
  addItem(inventory, 'essenceLeadership');
  addItem(inventory, 'essenceLeadership', 2);
  assert.equal(itemQuantity(inventory, 'essenceLeadership'), 3);
});
