import type { PartyHudUnit } from '../../game/store/gameStore';
import { Portrait } from './Portrait';

interface PartyMemberCardProps {
  unit: PartyHudUnit;
}

export function PartyMemberCard({ unit }: PartyMemberCardProps) {
  const down = Boolean(unit.downUntil) || unit.hp <= 0;
  const hp = Math.max(0, Math.ceil(unit.hp));
  const maxHp = Math.max(1, unit.maxHp);
  const sp = Math.max(0, Math.ceil(unit.stamina));
  const maxSp = Math.max(1, unit.maxStamina);

  return (
    <article className={`hub-member ${down ? 'is-down' : ''}`} data-hub-member={unit.id}>
      <img className="hub-plate" src="assets/hub/processed/party-plate.png" alt="" aria-hidden="true" />
      <div className="hub-portrait">
        <Portrait id={unit.id} icon={unit.icon} color={unit.color} />
      </div>
      <div className="hub-member-body">
        <strong>{unit.name}</strong>
        <div className="hub-stat hub-stat-hp">
          <span>
            <i style={{ width: `${(hp / maxHp) * 100}%` }} />
            <em>
              {hp}/{maxHp}
            </em>
          </span>
        </div>
        <div className="hub-stat hub-stat-sp">
          <span>
            <i style={{ width: `${(sp / maxSp) * 100}%` }} />
            <em>
              {sp}/{maxSp}
            </em>
          </span>
        </div>
      </div>
    </article>
  );
}
