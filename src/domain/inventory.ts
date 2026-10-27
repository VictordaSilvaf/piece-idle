import type { InventoryEntry, ItemDefinition } from '../types/game';

export class Inventory {
  readonly items: Map<string, number>;

  constructor(initialItems: Record<string, number> = {}) {
    this.items = new Map(Object.entries(initialItems));
  }

  quantity(itemId: string): number {
    return this.items.get(itemId) || 0;
  }

  consume(itemId: string, amount = 1): boolean {
    const current = this.quantity(itemId);
    if (current < amount) return false;
    this.items.set(itemId, current - amount);
    return true;
  }

  add(itemId: string, amount = 1): void {
    this.items.set(itemId, this.quantity(itemId) + amount);
  }

  entries(catalog: Record<string, ItemDefinition>): InventoryEntry[] {
    return Object.values(catalog).map((item) => ({
      ...item,
      quantity: this.quantity(item.id),
    }));
  }
}

/** Compatibility helpers used by existing call sites / tests */
export function createInventory(initialItems: Record<string, number> = {}): Inventory {
  return new Inventory(initialItems);
}

export function itemQuantity(inventory: Inventory, itemId: string): number {
  return inventory.quantity(itemId);
}

export function consumeItem(inventory: Inventory, itemId: string, amount = 1): boolean {
  return inventory.consume(itemId, amount);
}

export function addItem(inventory: Inventory, itemId: string, amount = 1): void {
  inventory.add(itemId, amount);
}

export function inventoryEntries(
  inventory: Inventory,
  catalog: Record<string, ItemDefinition>,
): InventoryEntry[] {
  return inventory.entries(catalog);
}
