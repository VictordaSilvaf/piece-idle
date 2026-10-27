import { inventoryEntries } from '../domain/inventory.js';

const SLOT_COUNT = 30;
const ITEM_WEIGHT = { common: 0.4, uncommon: 0.8, rare: 1.2 };
const FILTERS = {
  itens: () => true,
  equipamentos: (item) => item.category === 'Essência',
  consumiveis: (item) => item.category === 'Consumível' || item.category === 'Suprimento',
  importante: (item) => item.category === 'Chave' || item.category === 'Relíquia',
};

function itemWeight(item) {
  return (ITEM_WEIGHT[item.rarity] || 0.5) * item.quantity;
}

function matchesFilter(item, filter) {
  const check = FILTERS[filter] || FILTERS.itens;
  return check(item);
}

export function renderInventory(container, inventory, catalog, berries, state = {}) {
  const filter = state.filter || 'itens';
  const owned = inventoryEntries(inventory, catalog).filter((item) => item.quantity > 0);
  const visible = owned.filter((item) => matchesFilter(item, filter));
  const selectedId = state.selectedId && visible.some((item) => item.id === state.selectedId)
    ? state.selectedId
    : visible[0]?.id || null;
  const selected = visible.find((item) => item.id === selectedId) || null;
  const weight = owned.reduce((total, item) => total + itemWeight(item), 0);
  const maxWeight = 80;

  const slots = Array.from({ length: SLOT_COUNT }, (_, index) => {
    const item = visible[index];
    if (!item) return '<button class="inv-slot is-empty" type="button" disabled aria-hidden="true"></button>';
    const active = item.id === selectedId ? 'is-selected' : '';
    return `<button class="inv-slot rarity-${item.rarity} ${active}" type="button" data-inv-select="${item.id}" title="${item.name}"><span class="inv-slot-icon">${item.icon}</span><em class="inv-slot-qty">×${item.quantity}</em></button>`;
  }).join('');

  const detail = selected
    ? `<div class="inv-preview"><span>${selected.icon}</span></div>
       <h3 class="inv-item-name">${selected.name}</h3>
       <p class="inv-item-type"><i>🛡</i> ${selected.category.toUpperCase()}</p>
       <div class="inv-scroll"><p>${selected.description}</p></div>
       <div class="inv-actions">
         <button class="inv-action inv-action-use" type="button" data-inv-action="use" data-item="${selected.id}">🖐 Usar / Equipar</button>
         <button class="inv-action inv-action-sell" type="button" data-inv-action="sell" data-item="${selected.id}">⚖ Vender</button>
         <button class="inv-action inv-action-drop" type="button" data-inv-action="discard" data-item="${selected.id}">☠ Descartar</button>
       </div>`
    : `<div class="inv-preview is-empty"><span>📦</span></div>
       <h3 class="inv-item-name">Nenhum item</h3>
       <p class="inv-item-type"><i>◌</i> VAZIO</p>
       <div class="inv-scroll"><p>Selecione um item no baú para ver detalhes.</p></div>`;

  container.innerHTML = `
    <section class="inv-shell">
      <header class="inv-header">
        <div class="inv-crest" aria-hidden="true">☠</div>
        <h2 id="inventory-modal-title">Inventário</h2>
        <div class="inv-stats">
          <span class="inv-stat inv-berries" title="Berries"><i>$</i> <b>${berries.toLocaleString('pt-BR')} B</b></span>
          <span class="inv-stat inv-weight" title="Peso"><i>⚓</i> <b>${weight.toFixed(1)} / ${maxWeight.toFixed(1)} kg</b></span>
        </div>
      </header>
      <div class="inv-body">
        <section class="inv-grid-panel" aria-label="Itens">
          <div class="inv-grid">${slots}</div>
        </section>
        <aside class="inv-detail-panel" aria-live="polite">${detail}</aside>
      </div>
      <nav class="inv-footer" aria-label="Categorias do inventário">
        <button class="inv-back" type="button" data-inv-action="back" id="close-inventory">← Voltar</button>
        <div class="inv-tabs">
          <button class="inv-tab ${filter === 'itens' ? 'is-active' : ''}" type="button" data-inv-filter="itens"><span>🎒</span><small>Itens</small></button>
          <button class="inv-tab ${filter === 'equipamentos' ? 'is-active' : ''}" type="button" data-inv-filter="equipamentos"><span>⚔</span><small>Equipamentos</small></button>
          <button class="inv-tab ${filter === 'consumiveis' ? 'is-active' : ''}" type="button" data-inv-filter="consumiveis"><span>⚗</span><small>Consumíveis</small></button>
          <button class="inv-tab ${filter === 'importante' ? 'is-active' : ''}" type="button" data-inv-filter="importante"><span>★</span><small>Importante</small></button>
        </div>
      </nav>
    </section>
  `;

  return { selectedId, filter };
}

export function sellPriceFor(item) {
  const base = { common: 12, uncommon: 45, rare: 120 }[item.rarity] || 20;
  return base;
}
