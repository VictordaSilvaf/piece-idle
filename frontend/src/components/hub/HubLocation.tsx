import { useGameStoreSelector } from '../../hooks/useGameStore';

export function HubLocation() {
  const label = useGameStoreSelector((state) => state.locationLabel);
  const hidden = useGameStoreSelector((state) => state.locationHidden);

  if (hidden) return null;

  return (
    <div className="hub-location" aria-live="polite">
      <img src="assets/hub/processed/location.png" alt={label} id="hub-location-label" />
    </div>
  );
}
