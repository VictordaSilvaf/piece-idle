export function characterMaxHp(character) {
  const boost = character.boostLevel || 0;
  return character.maxHp + (character.level - 1) * 4 + boost * (8 + Math.floor(character.level * .4));
}

export function characterAttack(character) {
  const boost = character.boostLevel || 0;
  return character.attack + Math.floor((character.level - 1) * 1.35) + boost * (1 + Math.floor(character.level / 8));
}

export function characterDefense(character) {
  const boost = character.boostLevel || 0;
  return character.defense + Math.floor((character.level - 1) * .35) + Math.floor(boost * (.35 + character.level * .04));
}

export function skillRank(character) {
  return 1 + Math.floor((character.level - 1) / 6);
}

export function skillDamageMultiplier(character, skill) {
  return skill.multiplier * (1 + (skillRank(character) - 1) * .11 + (character.boostLevel || 0) * .006);
}

export function grantExperience(character, amount) {
  if (character.level >= MAX_CHARACTER_LEVEL) {
    character.level = MAX_CHARACTER_LEVEL;
    character.experience = 0;
    return false;
  }
  let leveledUp = false;
  character.experience += amount;
  while (character.level < MAX_CHARACTER_LEVEL && character.experience >= character.experienceToLevel) {
    character.experience -= character.experienceToLevel;
    character.level += 1;
    if (character.level >= MAX_CHARACTER_LEVEL) {
      character.experience = 0;
      character.experienceToLevel = 0;
    } else character.experienceToLevel = Math.floor(character.experienceToLevel * 1.14);
    character.stamina = character.maxStamina;
    leveledUp = true;
  }
  return leveledUp;
}
export const MAX_CHARACTER_LEVEL = 100;
