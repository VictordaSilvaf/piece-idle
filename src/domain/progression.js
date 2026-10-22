export function characterMaxHp(character) {
  return character.maxHp + (character.level - 1) * 4;
}

export function characterAttack(character) {
  return character.attack + Math.floor((character.level - 1) * 1.35);
}

export function characterDefense(character) {
  return character.defense + Math.floor((character.level - 1) * .35);
}

export function skillRank(character) {
  return 1 + Math.floor((character.level - 1) / 6);
}

export function skillDamageMultiplier(character, skill) {
  return skill.multiplier * (1 + (skillRank(character) - 1) * .11);
}

export function grantExperience(character, amount) {
  let leveledUp = false;
  character.experience += amount;
  while (character.experience >= character.experienceToLevel) {
    character.experience -= character.experienceToLevel;
    character.level += 1;
    character.experienceToLevel = Math.floor(character.experienceToLevel * 1.14);
    character.stamina = character.maxStamina;
    leveledUp = true;
  }
  return leveledUp;
}
