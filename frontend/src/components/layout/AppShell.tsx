import { useMemo, useState } from 'react';
import { GameController } from '../../game/GameController';
import type { GameViewId } from '../../game/store/gameStore';
import { useGameStoreSelector } from '../../hooks/useGameStore';
import { CharUpgradeModal } from '../crew/CharUpgradeModal';
import { CrewBoard } from '../crew/CrewBoard';
import { GameView } from '../game/GameView';
import { HubTopNav } from '../hub/HubTopNav';
import { InventoryModal } from '../inventory/InventoryModal';
import { IslandsModal } from '../map/IslandsModal';
import { MapView } from '../map/MapView';
import { RecruitmentView } from '../recruitment/RecruitmentView';
import { Toast } from '../ui/Toast';

export function AppShell() {
  const [controller] = useState(() => new GameController());
  const view = useGameStoreSelector((state) => state.view);

  const handlers = useMemo(
    () => ({
      onNavAction: (action: string, mappedView?: GameViewId) => {
        if (action === 'porto') {
          controller.goPorto();
          return;
        }
        if (action === 'explorar') {
          controller.openIslands();
          return;
        }
        if (action === 'inventario' || action === 'conta') {
          controller.openInventory();
          return;
        }
        if (mappedView) controller.setView(mappedView);
      },
    }),
    [controller],
  );

  return (
    <div className="app-shell flex min-h-dvh w-full flex-col font-sans">
      <HubTopNav onAction={handlers.onNavAction} />

      <main className="flex-1 p-0">
        <GameView controller={controller} active={view === 'jogo'} />
        <MapView active={view === 'mapa'} />
        <CrewBoard active={view === 'tripulacao'} />
        <RecruitmentView active={view === 'recrutamento'} />
      </main>

      <IslandsModal onClose={() => controller.closeIslands()} />
      <InventoryModal onClose={() => controller.closeInventory()} />
      <CharUpgradeModal onClose={() => controller.closeUpgrade()} />
      <Toast />
    </div>
  );
}
