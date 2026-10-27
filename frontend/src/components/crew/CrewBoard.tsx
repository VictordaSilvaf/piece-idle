interface CrewBoardProps {
  active: boolean;
}

/** Container React; o GameController preenche cards/roster via IDs estáveis. */
export function CrewBoard({ active }: CrewBoardProps) {
  return (
    <section
      className={`view crew-board-page ${active ? 'is-active' : ''}`}
      data-view-panel="tripulacao"
      aria-labelledby="crew-title"
    >
      <div className="crew-board">
        <header className="crew-board-header">
          <span className="crew-wheel" aria-hidden="true">
            ☸
          </span>
          <h1 id="crew-title">Tripulação</h1>
          <span className="crew-power-badge">
            Poder <b id="crew-power">0</b>
          </span>
        </header>
        <div className="crew-cards" id="crew-cards" aria-label="Formação ativa" />
        <div className="crew-board-actions">
          <button className="crew-board-btn" type="button" id="crew-details-btn">
            👁 Ver Detalhes
          </button>
          <button className="crew-board-btn" type="button" id="crew-swap-btn">
            ⚔ Trocar Formação
          </button>
        </div>
        <section className="crew-detail-panel" id="crew-detail-panel" hidden aria-live="polite" />
        <section className="crew-roster-panel" id="crew-roster-panel" hidden>
          <div className="crew-roster-head">
            <p>
              Escolha até 5 tripulantes · <strong id="crew-counter">0 / 5</strong>
            </p>
            <button type="button" id="crew-roster-close">
              Fechar
            </button>
          </div>
          <section className="roster" id="roster" aria-label="Personagens disponíveis" />
        </section>
      </div>
      <div id="crew-slots" className="hub-sr-only" aria-hidden="true" />
      <div id="cargo-catalog-list" className="hub-sr-only" aria-hidden="true" />
    </section>
  );
}
