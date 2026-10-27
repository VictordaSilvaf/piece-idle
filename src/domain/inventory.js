export function createInventory(initialItems = {}) {
  return { items: new Map(Object.entries(initialItems)) };
}

export function itemQuantity(inventory, itemId) {
  return inventory.items.get(itemId) || 0;
}

export function consumeItem(inventory, itemId, amount = 1) {
  const current = itemQuantity(inventory, itemId);
  if (current < amount) return false;
  inventory.items.set(itemId, current - amount);
  return true;
}

export function addItem(inventory, itemId, amount = 1) {
  inventory.items.set(itemId, itemQuantity(inventory, itemId) + amount);
}

export function inventoryEntries(inventory, catalog) {
  return Object.values(catalog).map((item) => ({ ...item, quantity: itemQuantity(inventory, item.id) }));
}
