import { Inventory } from '../domain/inventory';
import type { InventoryEntry, ItemDefinition } from '../types/game';

const SLOT_COUNT = 30;
const ITEM_WEIGHT: Record<string, number> = { common: 0.4, uncommon: 0.8, rare: 1.2 };

type InventoryFilter = 'itens' | 'equipamentos' | 'consumiveis' | 'importante';

const FILTERS: Record<InventoryFilter, (item: InventoryEntry) => boolean> = {
  itens: () => true,
  equipamentos: (item) => item.category === 'Essência',
  consumiveis: (item) => item.category === 'Consumível' || item.category === 'Suprimento',
  importante: (item) => item.category === 'Chave' || item.category === 'Relíquia',
};

export interface InventoryPanelState {
  filter?: InventoryFilter | string;
  selectedId?: string | null;
}

export class InventoryPanel {
  static itemWeight(item: InventoryEntry): number {
    return (ITEM_WEIGHT[item.rarity] || 0.5) * item.quantity;
  }

  static sellPriceFor(item: Pick<ItemDefinition, 'rarity'>): number {
    return ({ common: 12, uncommon: 45, rare: 120 } as Record<string, number>)[item.rarity] || 20;
  }

  static render(
    container: HTMLElement,
    inventory: Inventory,
    catalog: Record<string, ItemDefinition>,
    berries: number,
    state: InventoryPanelState = {},
  ): { selectedId: string | null; filter: string } {
    const filter = (state.filter || 'itens') as InventoryFilter;
    const owned = inventory.entries(catalog).filter((item) => item.quantity > 0);
    const check = FILTERS[filter] || FILTERS.itens;
    const visible = owned.filter((item) => check(item));
    const selectedId =
      state.selectedId && visible.some((item) => item.id === state.selectedId)
        ? state.selectedId
        : visible[0]?.id || null;
    const selected = visible.find((item) => item.id === selectedId) || null;
    const weight = owned.reduce((total, item) => total + InventoryPanel.itemWeight(item), 0);
    const maxWeight = 80;

    const slots = Array.from({ length: SLOT_COUNT }, (_, index) => {
      const item = visible[index];
      if (!item) {
        return '<button class="inv-slot is-empty relative grid aspect-square place-items-center" type="button" disabled aria-hidden="true"></button>';
      }
      const active = item.id === selectedId ? 'is-selected ring-2 ring-gold/70' : '';
      return `<button class="inv-slot rarity-${item.rarity} ${active} relative grid aspect-square place-items-center transition hover:brightness-110" type="button" data-inv-select="${item.id}" title="${item.name}"><span class="inv-slot-icon drop-shadow">${item.icon}</span><em class="inv-slot-qty absolute right-1 bottom-0.5 rounded bg-black/60 px-1 text-[0.58rem] not-italic font-black text-gold">×${item.quantity}</em></button>`;
    }).join('');

    const detail = selected
      ? `<div class="inv-preview mx-auto grid size-24 place-items-center"><span class="text-5xl leading-none">${selected.icon}</span></div>
       <h3 class="inv-item-name text-center uppercase tracking-wide text-gold">${selected.name}</h3>
       <p class="inv-item-type flex items-center justify-center gap-1.5 text-sm font-extrabold tracking-wide text-sky-200"><i class="not-italic">🛡</i> ${selected.category.toUpperCase()}</p>
       <div class="inv-scroll mt-1 rounded border-2 border-wood-light bg-parchment px-3 py-3 text-parchment-ink shadow"><p class="m-0 text-sm leading-snug">${selected.description}</p></div>
       <div class="inv-actions mt-auto grid gap-2 pt-2">
         <button class="inv-action inv-action-use flex min-h-10 items-center justify-center gap-2 uppercase" type="button" data-inv-action="use" data-item="${selected.id}">🖐 Usar / Equipar</button>
         <button class="inv-action inv-action-sell flex min-h-10 items-center justify-center gap-2 uppercase" type="button" data-inv-action="sell" data-item="${selected.id}">⚖ Vender</button>
         <button class="inv-action inv-action-drop flex min-h-10 items-center justify-center gap-2 uppercase" type="button" data-inv-action="discard" data-item="${selected.id}">☠ Descartar</button>
       </div>`
      : `<div class="inv-preview is-empty mx-auto grid size-24 place-items-center opacity-55"><span class="text-5xl leading-none">📦</span></div>
       <h3 class="inv-item-name text-center uppercase tracking-wide text-gold">Nenhum item</h3>
       <p class="inv-item-type flex items-center justify-center gap-1.5 text-sm font-extrabold tracking-wide text-sky-200"><i class="not-italic">◌</i> VAZIO</p>
       <div class="inv-scroll mt-1 rounded border-2 border-wood-light bg-parchment px-3 py-3 text-parchment-ink shadow"><p class="m-0 text-sm leading-snug">Selecione um item no baú para ver detalhes.</p></div>`;

    container.innerHTML = `
    <section class="inv-shell grid h-[min(760px,calc(100dvh-36px))] grid-rows-[auto_minmax(0,1fr)_auto] rounded-[10px] p-3.5 font-sans">
      <header class="inv-header mb-3 grid grid-cols-[56px_1fr_auto] items-center gap-3 border-b-2 border-wood pb-3">
        <div class="inv-crest grid size-[52px] place-items-center rounded-full text-2xl" aria-hidden="true">☠</div>
        <h2 id="inventory-modal-title" class="m-0 text-center text-[clamp(1.4rem,3vw,2rem)] font-black uppercase tracking-wider text-parchment">Inventário</h2>
        <div class="inv-stats grid gap-1.5">
          <span class="inv-stat inv-berries flex min-w-[132px] items-center gap-2 rounded-md px-2.5 py-1.5" title="Berries"><i class="not-italic">$</i> <b class="text-sm font-extrabold text-gold">${berries.toLocaleString('pt-BR')} B</b></span>
          <span class="inv-stat inv-weight flex min-w-[132px] items-center gap-2 rounded-md px-2.5 py-1.5" title="Peso"><i class="not-italic">⚓</i> <b class="text-sm font-extrabold text-parchment">${weight.toFixed(1)} / ${maxWeight.toFixed(1)} kg</b></span>
        </div>
      </header>
      <div class="inv-body grid min-h-0 grid-cols-1 gap-3.5 overflow-hidden md:grid-cols-[minmax(0,1.35fr)_minmax(240px,0.85fr)]">
        <section class="inv-grid-panel relative min-h-0 overflow-auto rounded-lg p-3.5" aria-label="Itens">
          <div class="inv-grid relative z-10 grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">${slots}</div>
        </section>
        <aside class="inv-detail-panel relative z-10 flex min-h-0 flex-col gap-2 overflow-auto rounded-lg p-3.5 md:order-none order-first" aria-live="polite">${detail}</aside>
      </div>
      <nav class="inv-footer mt-2.5 flex shrink-0 flex-col items-stretch justify-between gap-3 border-t-0 pt-2 sm:flex-row sm:items-end" aria-label="Categorias do inventário">
        <button class="inv-back min-w-[110px] rounded px-3.5 py-3 text-sm font-black uppercase tracking-wide" type="button" data-inv-action="back" id="close-inventory">← Voltar</button>
        <div class="inv-tabs grid flex-1 grid-cols-2 justify-center gap-2.5 sm:flex">
          <button class="inv-tab ${filter === 'itens' ? 'is-active' : ''} grid min-w-[88px] place-items-center gap-1 rounded-md px-2 py-2.5" type="button" data-inv-filter="itens"><span class="text-2xl leading-none">🎒</span><small class="text-[0.58rem] font-extrabold uppercase tracking-wide">Itens</small></button>
          <button class="inv-tab ${filter === 'equipamentos' ? 'is-active' : ''} grid min-w-[88px] place-items-center gap-1 rounded-md px-2 py-2.5" type="button" data-inv-filter="equipamentos"><span class="text-2xl leading-none">⚔</span><small class="text-[0.58rem] font-extrabold uppercase tracking-wide">Equipamentos</small></button>
          <button class="inv-tab ${filter === 'consumiveis' ? 'is-active' : ''} grid min-w-[88px] place-items-center gap-1 rounded-md px-2 py-2.5" type="button" data-inv-filter="consumiveis"><span class="text-2xl leading-none">⚗</span><small class="text-[0.58rem] font-extrabold uppercase tracking-wide">Consumíveis</small></button>
          <button class="inv-tab ${filter === 'importante' ? 'is-active' : ''} grid min-w-[88px] place-items-center gap-1 rounded-md px-2 py-2.5" type="button" data-inv-filter="importante"><span class="text-2xl leading-none">★</span><small class="text-[0.58rem] font-extrabold uppercase tracking-wide">Importante</small></button>
        </div>
      </nav>
    </section>
  `;

    return { selectedId, filter };
  }
}

export function renderInventory(
  container: HTMLElement,
  inventory: Inventory,
  catalog: Record<string, ItemDefinition>,
  berries: number,
  state: InventoryPanelState = {},
) {
  return InventoryPanel.render(container, inventory, catalog, berries, state);
}

export function sellPriceFor(item: Pick<ItemDefinition, 'rarity'>): number {
  return InventoryPanel.sellPriceFor(item);
}
