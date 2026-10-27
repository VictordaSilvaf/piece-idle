import { useEffect } from 'react';
import { gameStore } from '../../game/store/gameStore';
import { useGameStoreSelector } from '../../hooks/useGameStore';

export function Toast() {
  const message = useGameStoreSelector((state) => state.toast);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => gameStore.setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [message]);

  return (
    <div className={`toast ${message ? 'is-visible' : ''}`} id="toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}
