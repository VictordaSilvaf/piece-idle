import { Character } from '../domain/character';
import type { PassiveEffect } from '../types/game';

/** Gerencia o elenco, recrutamento e formação ativa. */
export class CrewRoster {
  readonly characters: Character[];
  readonly selected: Set<string>;
  readonly recruited: Set<string>;

  constructor(
    characters: Character[],
    selectedIds: string[] = [],
    recruitedIds: string[] = selectedIds,
  ) {
    this.characters = characters;
    this.selected = new Set(selectedIds);
    this.recruited = new Set(recruitedIds);
  }

  byId(id: string): Character | undefined {
    return this.characters.find((character) => character.id === id);
  }

  crew(): Character[] {
    return this.characters.filter((character) => this.selected.has(character.id));
  }

  hasPassive(effect: PassiveEffect): boolean {
    return this.crew().some((member) => member.passiveEffect() === effect);
  }

  recruit(characterId: string): boolean {
    if (this.recruited.has(characterId)) return false;
    this.recruited.add(characterId);
    return true;
  }

  toggleSelected(characterId: string, maxParty = 5): boolean {
    if (!this.recruited.has(characterId)) return false;
    if (this.selected.has(characterId)) {
      if (this.selected.size <= 1) return false;
      this.selected.delete(characterId);
      return true;
    }
    if (this.selected.size >= maxParty) return false;
    this.selected.add(characterId);
    return true;
  }
}
