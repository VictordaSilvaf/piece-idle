import { useSyncExternalStore } from 'react';
import { gameStore, type GameUiState } from '../game/store/gameStore';

export function useGameStore(): GameUiState {
  return useSyncExternalStore(gameStore.subscribe, gameStore.getState, gameStore.getState);
}

export function useGameStoreSelector<T>(selector: (state: GameUiState) => T): T {
  return useSyncExternalStore(
    gameStore.subscribe,
    () => selector(gameStore.getState()),
    () => selector(gameStore.getState()),
  );
}
