import { useGameStoreSelector } from '../../hooks/useGameStore';

interface DeathOverlayProps {
  onRevive: () => void;
  onReturn: () => void;
}

export function DeathOverlay({ onRevive, onReturn }: DeathOverlayProps) {
  const visible = useGameStoreSelector((state) => state.partyWiped);
  const potions = useGameStoreSelector((state) => state.potionCount);

  return (
    <section
      className={`death-overlay ${visible ? 'is-visible' : ''}`}
      id="death-overlay"
      aria-live="assertive"
      aria-hidden={!visible}
    >
      <div className="death-card">
        <p>Tripulação derrotada</p>
        <h2>O mar ficou silencioso.</h2>
        <span id="revive-countdown">
          {potions > 0
            ? 'Use uma poção para reviver a tripulação, ou volte ao porto.'
            : 'Sem poções. Volte ao porto ou encontre uma poção para reviver.'}
        </span>
        <button
          className={`button button-primary ${potions <= 0 ? 'is-disabled' : ''}`}
          id="revive-potion"
          type="button"
          disabled={potions <= 0}
          onClick={onRevive}
        >
          ⚗ Reviver com poção (<b id="death-potion-count">{potions}</b>)
        </button>
        <button className="death-return" id="death-return" type="button" onClick={onReturn}>
          Voltar ao porto
        </button>
      </div>
    </section>
  );
}
