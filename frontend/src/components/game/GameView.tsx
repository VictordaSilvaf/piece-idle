import { useEffect, useRef } from 'react';
import type { GameController } from '../../game/GameController';
import { HubActions } from '../hub/HubActions';
import { HubLocation } from '../hub/HubLocation';
import { PartyHud } from '../hub/PartyHud';
import { DeathOverlay } from './DeathOverlay';
import { DialoguePanel } from './DialoguePanel';
import { GameCanvas } from './GameCanvas';
import { useGameStoreSelector } from '../../hooks/useGameStore';

interface GameViewProps {
  controller: GameController | null;
  active: boolean;
}

export function GameView({ controller, active }: GameViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const potionCount = useGameStoreSelector((state) => state.potionCount);
  const playerLevel = useGameStoreSelector((state) => state.playerLevel);
  const playerHp = useGameStoreSelector((state) => state.playerHp);
  const playerMaxHp = useGameStoreSelector((state) => state.playerMaxHp);
  const playerStamina = useGameStoreSelector((state) => state.playerStamina);
  const playerXpLabel = useGameStoreSelector((state) => state.playerXpLabel);
  const berries = useGameStoreSelector((state) => state.berries);

  useEffect(() => {
    if (!controller || !canvasRef.current) return;
    controller.attachCanvas(canvasRef.current);
  }, [controller]);

  return (
    <section className={`view ${active ? 'is-active' : ''}`} data-view-panel="jogo" aria-labelledby="hub-location-label">
      <section className="game-hud" aria-label="Mundo do jogo">
        <GameCanvas ref={canvasRef} />
        <PartyHud />
        <HubLocation />
        <HubActions
          onAttack={() => controller?.attackOrTalk()}
          onExplore={() => controller?.openIslands()}
          onInventory={() => controller?.openInventory()}
        />

        <span id="potion-count" className="hub-sr-only">
          {potionCount}
        </span>
        <button type="button" id="use-potion" className="hub-sr-only" tabIndex={-1} aria-hidden="true" onClick={() => controller?.usePotion()}>
          Poção
        </button>

        <DialoguePanel onClose={() => controller?.closeDialogue()} />
        <DeathOverlay onRevive={() => controller?.usePotion()} onReturn={() => controller?.returnToPort()} />

        <section className="reward-stack" id="reward-stack" aria-live="polite" aria-label="Recompensas recebidas" />

        <p id="scene-kicker" className="hub-sr-only">
          Porto Seguro
        </p>
        <h1 id="game-title" className="hub-sr-only">
          Cais da Aurora
        </h1>
        <span id="combat-state" className="hub-sr-only">
          Explore e fale com os NPCs
        </span>
        <span id="quest-title" className="hub-sr-only">
          Preparar a expedição
        </span>
        <span id="quest-copy" className="hub-sr-only">
          Fale com Nami no cais ou abra o mapa para navegar até uma ilha.
        </span>
        <span id="quest-progress" className="hub-sr-only" style={{ width: '20%' }} />
        <span id="player-level" className="hub-sr-only">
          {playerLevel}
        </span>
        <span id="player-hp" className="hub-sr-only">
          {Math.ceil(playerHp)}
        </span>
        <span id="player-max-hp" className="hub-sr-only">
          {playerMaxHp}
        </span>
        <span id="player-hp-bar" className="hub-sr-only" style={{ width: `${(playerHp / Math.max(1, playerMaxHp)) * 100}%` }} />
        <span id="player-stamina" className="hub-sr-only">
          {Math.ceil(playerStamina)}
        </span>
        <span id="player-stamina-bar" className="hub-sr-only" style={{ width: '100%' }} />
        <span id="player-xp" className="hub-sr-only">
          {playerXpLabel}
        </span>
        <span id="berries" className="hub-sr-only">
          {berries.toLocaleString('pt-BR')}
        </span>
        <div id="mini-party" className="hub-sr-only" aria-hidden="true" />
      </section>
    </section>
  );
}
