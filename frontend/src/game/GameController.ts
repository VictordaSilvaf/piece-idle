import { GameApp, type GameHostApi } from './GameApp';
import type { GameViewId } from './store/gameStore';
import { gameStore } from './store/gameStore';

/** Ponte React ↔ engine: UI chama estes métodos; o canvas e o loop ficam no GameApp. */
export class GameController {
  private readonly app = new GameApp();
  private api: GameHostApi | null = null;
  private started = false;

  attachCanvas(canvas: HTMLCanvasElement): void {
    if (this.started) {
      this.api?.resize?.();
      return;
    }
    this.started = true;
    this.api = this.app.start({ canvas });
  }

  setView(view: GameViewId): void {
    this.api?.setView(view);
  }

  openInventory(): void {
    this.api?.openInventory();
    gameStore.patch({ inventoryOpen: true });
  }

  closeInventory(): void {
    this.api?.closeInventory();
    gameStore.patch({ inventoryOpen: false });
  }

  openIslands(): void {
    this.api?.openIslands();
    gameStore.patch({ islandsOpen: true });
  }

  closeIslands(): void {
    this.api?.closeIslands();
    gameStore.patch({ islandsOpen: false });
  }

  closeUpgrade(): void {
    this.api?.closeUpgrade();
    gameStore.patch({ upgradeOpen: false });
  }

  attackOrTalk(): void {
    this.api?.attackOrTalk();
  }

  usePotion(): void {
    this.api?.usePotion();
  }

  returnToPort(): void {
    this.api?.returnToPort();
  }

  closeDialogue(): void {
    this.api?.closeDialogue();
  }

  goPorto(): void {
    this.api?.goPorto();
  }
}
