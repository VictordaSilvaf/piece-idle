export type GameViewId = 'jogo' | 'mapa' | 'tripulacao' | 'recrutamento';

export interface PartyHudUnit {
  id: string;
  name: string;
  icon: string;
  color: string;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  downUntil: number;
}

export interface GameUiState {
  view: GameViewId;
  berries: number;
  potionCount: number;
  partyWiped: boolean;
  inventoryOpen: boolean;
  islandsOpen: boolean;
  upgradeOpen: boolean;
  locationLabel: string;
  locationHidden: boolean;
  toast: string | null;
  party: PartyHudUnit[];
  playerLevel: number;
  playerHp: number;
  playerMaxHp: number;
  playerStamina: number;
  playerMaxStamina: number;
  playerXpLabel: string;
  dialogueOpen: boolean;
  dialogue: { icon: string; name: string; text: string } | null;
}

const listeners = new Set<() => void>();

let state: GameUiState = {
  view: 'jogo',
  berries: 1250,
  potionCount: 3,
  partyWiped: false,
  inventoryOpen: false,
  islandsOpen: false,
  upgradeOpen: false,
  locationLabel: 'Cais da Aurora',
  locationHidden: false,
  toast: null,
  party: [],
  playerLevel: 18,
  playerHp: 100,
  playerMaxHp: 100,
  playerStamina: 100,
  playerMaxStamina: 100,
  playerXpLabel: '0 / 160',
  dialogueOpen: false,
  dialogue: null,
};

function emit() {
  listeners.forEach((listener) => listener());
}

export const gameStore = {
  getState(): GameUiState {
    return state;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  patch(partial: Partial<GameUiState>): void {
    state = { ...state, ...partial };
    emit();
  },

  setToast(message: string | null): void {
    state = { ...state, toast: message };
    emit();
  },
};
