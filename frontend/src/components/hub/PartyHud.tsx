import { useGameStoreSelector } from '../../hooks/useGameStore';
import { PartyMemberCard } from './PartyMemberCard';

export function PartyHud() {
  const party = useGameStoreSelector((state) => state.party);

  return (
    <aside className="hub-party" id="hub-party" aria-label="Status da tripulação">
      {party.map((unit) => (
        <PartyMemberCard key={unit.id} unit={unit} />
      ))}
    </aside>
  );
}
