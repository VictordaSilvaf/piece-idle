import { Inventory } from '../../domain/inventory';
import type { InventoryEntry, ItemDefinition } from '../../types/game';

const SLOT_COUNT = 30;
const ITEM_WEIGHT: Record<string, number> = { common: 0.4, uncommon: 0.8, rare: 1.2 };

type InventoryFilter = 'itens' | 'equipamentos' | 'consumiveis' | 'importante';

const FILTERS: Record<InventoryFilter, (item: InventoryEntry) => boolean> = {
  itens: () => true,
  equipamentos: (item) => item.category === 'Essência',
  consumiveis: (item) => item.category === 'Consumível' || item.category === 'Suprimento',
  importante: (item) => item.category === 'Chave' || item.category === 'Relíquia',
};

export interface InventoryViewProps {
  inventory: Inventory;
  catalog: Record<string, ItemDefinition>;
  berries: number;
  filter?: string;
  selectedId?: string | null;
  onSelect: (itemId: string) => void;
  onFilter: (filter: string) => void;
  onAction: (action: string, itemId?: string) => void;
}

function itemWeight(item: InventoryEntry): number {
  return (ITEM_WEIGHT[item.rarity] || 0.5) * item.quantity;
}

export function InventoryView({
  inventory,
  catalog,
  berries,
  filter = 'itens',
  selectedId = null,
  onSelect,
  onFilter,
  onAction,
}: InventoryViewProps) {
  const activeFilter = (filter || 'itens') as InventoryFilter;
  const owned = inventory.entries(catalog).filter((item) => item.quantity > 0);
  const check = FILTERS[activeFilter] || FILTERS.itens;
  const visible = owned.filter((item) => check(item));
  const currentId =
    selectedId && visible.some((item) => item.id === selectedId) ? selectedId : visible[0]?.id || null;
  const selected = visible.find((item) => item.id === currentId) || null;
  const weight = owned.reduce((total, item) => total + itemWeight(item), 0);
  const maxWeight = 80;

  return (
    <section className="inv-shell grid h-[min(760px,calc(100dvh-36px))] grid-rows-[auto_minmax(0,1fr)_auto] rounded-[10px] p-3.5 font-sans">
      <header className="inv-header mb-3 grid grid-cols-[56px_1fr_auto] items-center gap-3 border-b-2 border-wood pb-3">
        <div className="inv-crest grid size-[52px] place-items-center rounded-full text-2xl" aria-hidden="true">
          ☠
        </div>
        <h2 id="inventory-modal-title" className="m-0 text-center text-[clamp(1.4rem,3vw,2rem)] font-black uppercase tracking-wider text-parchment">
          Inventário
        </h2>
        <div className="inv-stats grid gap-1.5">
          <span className="inv-stat inv-berries flex min-w-[132px] items-center gap-2 rounded-md px-2.5 py-1.5" title="Berries">
            <i className="not-italic">$</i>{' '}
            <b className="text-sm font-extrabold text-gold">{berries.toLocaleString('pt-BR')} B</b>
          </span>
          <span className="inv-stat inv-weight flex min-w-[132px] items-center gap-2 rounded-md px-2.5 py-1.5" title="Peso">
            <i className="not-italic">⚓</i>{' '}
            <b className="text-sm font-extrabold text-parchment">
              {weight.toFixed(1)} / {maxWeight.toFixed(1)} kg
            </b>
          </span>
        </div>
      </header>

      <div className="inv-body grid min-h-0 grid-cols-1 gap-3.5 overflow-hidden md:grid-cols-[minmax(0,1.35fr)_minmax(240px,0.85fr)]">
        <section className="inv-grid-panel relative min-h-0 overflow-auto rounded-lg p-3.5" aria-label="Itens">
          <div className="inv-grid relative z-10 grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
            {Array.from({ length: SLOT_COUNT }, (_, index) => {
              const item = visible[index];
              if (!item) {
                return (
                  <button key={`empty-${index}`} className="inv-slot is-empty relative grid aspect-square place-items-center" type="button" disabled aria-hidden="true" />
                );
              }
              const active = item.id === currentId ? 'is-selected ring-2 ring-gold/70' : '';
              return (
                <button
                  key={item.id}
                  className={`inv-slot rarity-${item.rarity} ${active} relative grid aspect-square place-items-center transition hover:brightness-110`}
                  type="button"
                  title={item.name}
                  onClick={() => onSelect(item.id)}
                >
                  <span className="inv-slot-icon drop-shadow">{item.icon}</span>
                  <em className="inv-slot-qty absolute right-1 bottom-0.5 rounded bg-black/60 px-1 text-[0.58rem] not-italic font-black text-gold">
                    ×{item.quantity}
                  </em>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="inv-detail-panel relative z-10 order-first flex min-h-0 flex-col gap-2 overflow-auto rounded-lg p-3.5 md:order-none" aria-live="polite">
          {selected ? (
            <>
              <div className="inv-preview mx-auto grid size-24 place-items-center">
                <span className="text-5xl leading-none">{selected.icon}</span>
              </div>
              <h3 className="inv-item-name text-center uppercase tracking-wide text-gold">{selected.name}</h3>
              <p className="inv-item-type flex items-center justify-center gap-1.5 text-sm font-extrabold tracking-wide text-sky-200">
                <i className="not-italic">🛡</i> {selected.category.toUpperCase()}
              </p>
              <div className="inv-scroll mt-1 rounded border-2 border-wood-light bg-parchment px-3 py-3 text-parchment-ink shadow">
                <p className="m-0 text-sm leading-snug">{selected.description}</p>
              </div>
              <div className="inv-actions mt-auto grid gap-2 pt-2">
                <button className="inv-action inv-action-use flex min-h-10 items-center justify-center gap-2 uppercase" type="button" onClick={() => onAction('use', selected.id)}>
                  🖐 Usar / Equipar
                </button>
                <button className="inv-action inv-action-sell flex min-h-10 items-center justify-center gap-2 uppercase" type="button" onClick={() => onAction('sell', selected.id)}>
                  ⚖ Vender
                </button>
                <button className="inv-action inv-action-drop flex min-h-10 items-center justify-center gap-2 uppercase" type="button" onClick={() => onAction('discard', selected.id)}>
                  ☠ Descartar
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="inv-preview is-empty mx-auto grid size-24 place-items-center opacity-55">
                <span className="text-5xl leading-none">📦</span>
              </div>
              <h3 className="inv-item-name text-center uppercase tracking-wide text-gold">Nenhum item</h3>
              <p className="inv-item-type flex items-center justify-center gap-1.5 text-sm font-extrabold tracking-wide text-sky-200">
                <i className="not-italic">◌</i> VAZIO
              </p>
              <div className="inv-scroll mt-1 rounded border-2 border-wood-light bg-parchment px-3 py-3 text-parchment-ink shadow">
                <p className="m-0 text-sm leading-snug">Selecione um item no baú para ver detalhes.</p>
              </div>
            </>
          )}
        </aside>
      </div>

      <nav className="inv-footer mt-2.5 flex shrink-0 flex-col items-stretch justify-between gap-3 pt-2 sm:flex-row sm:items-end" aria-label="Categorias do inventário">
        <button className="inv-back min-w-[110px] rounded px-3.5 py-3 text-sm font-black uppercase tracking-wide" type="button" onClick={() => onAction('back')}>
          ← Voltar
        </button>
        <div className="inv-tabs grid flex-1 grid-cols-2 justify-center gap-2.5 sm:flex">
          {(
            [
              ['itens', '🎒', 'Itens'],
              ['equipamentos', '⚔', 'Equipamentos'],
              ['consumiveis', '⚗', 'Consumíveis'],
              ['importante', '★', 'Importante'],
            ] as const
          ).map(([id, icon, label]) => (
            <button
              key={id}
              className={`inv-tab ${activeFilter === id ? 'is-active' : ''} grid min-w-[88px] place-items-center gap-1 rounded-md px-2 py-2.5`}
              type="button"
              onClick={() => onFilter(id)}
            >
              <span className="text-2xl leading-none">{icon}</span>
              <small className="text-[0.58rem] font-extrabold uppercase tracking-wide">{label}</small>
            </button>
          ))}
        </div>
      </nav>
    </section>
  );
}
