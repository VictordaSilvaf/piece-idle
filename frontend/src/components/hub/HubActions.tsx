interface HubActionsProps {
  onAttack: () => void;
  onExplore: () => void;
  onInventory: () => void;
}

export function HubActions({ onAttack, onExplore, onInventory }: HubActionsProps) {
  return (
    <div className="hub-actions" aria-label="Ações rápidas">
      <button className="hub-action-btn" type="button" id="hub-attack" title="Atacar / Conversar" onClick={onAttack}>
        <img src="assets/hub/processed/btn-atacar.png" alt="Atacar" />
      </button>
      <button className="hub-action-btn" type="button" id="hub-explore" title="Explorar ilhas" onClick={onExplore}>
        <img src="assets/hub/processed/btn-explorar.png" alt="Explorar" />
      </button>
      <button className="hub-action-btn" type="button" id="hub-inventory" title="Inventário" onClick={onInventory}>
        <img src="assets/hub/processed/btn-inventario.png" alt="Inventário" />
      </button>
    </div>
  );
}
