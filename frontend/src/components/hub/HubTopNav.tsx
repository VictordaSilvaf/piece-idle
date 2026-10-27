import { useGameStoreSelector } from '../../hooks/useGameStore';
import type { GameViewId } from '../../game/store/gameStore';

const NAV_ITEMS = [
  { action: 'porto', view: 'jogo' as GameViewId | undefined, title: 'Porto', src: 'assets/hub/processed/nav-porto.png', alt: 'Porto' },
  { action: 'explorar', view: undefined, title: 'Explorar', src: 'assets/hub/processed/nav-explorar.png', alt: 'Explorar' },
  { action: 'inventario', view: undefined, title: 'Inventário', src: 'assets/hub/processed/nav-inventario.png', alt: 'Inventário' },
  { action: 'baus', view: 'recrutamento' as GameViewId, title: 'Baús', src: 'assets/hub/processed/nav-baus.png', alt: 'Baús' },
  { action: 'tripulacao', view: 'tripulacao' as GameViewId, title: 'Tripulação', src: 'assets/hub/processed/nav-tripulacao.png', alt: 'Tripulação' },
  { action: 'conta', view: undefined, title: 'Conta', src: 'assets/hub/processed/nav-conta.png', alt: 'Conta' },
];

interface HubTopNavProps {
  onAction: (action: string, view?: GameViewId) => void;
}

export function HubTopNav({ onAction }: HubTopNavProps) {
  const view = useGameStoreSelector((state) => state.view);
  const inventoryOpen = useGameStoreSelector((state) => state.inventoryOpen);

  return (
    <nav
      className="hub-topnav sticky top-0 z-20 flex flex-wrap items-center justify-center gap-1.5 px-3 py-2.5"
      aria-label="Menu do hub"
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          (item.view && item.view === view) ||
          (item.action === 'explorar' && view === 'mapa') ||
          ((item.action === 'inventario' || item.action === 'conta') && inventoryOpen);

        return (
          <button
            key={item.action}
            className={`hub-nav-btn cursor-pointer border-0 bg-transparent p-0 leading-none transition hover:-translate-y-0.5 ${isActive ? 'is-active' : ''}`}
            type="button"
            data-hub-action={item.action}
            data-view={item.view}
            title={item.title}
            onClick={() => onAction(item.action, item.view)}
          >
            <img
              className="pointer-events-none block h-[42px] w-auto max-w-[min(148px,18vw)] object-contain"
              src={item.src}
              alt={item.alt}
            />
          </button>
        );
      })}
    </nav>
  );
}
