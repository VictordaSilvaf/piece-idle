export const essences = {
  luffy: { itemId: 'essenceLeadership', name: 'Essência da Liderança', icon: '★', characterId: 'luffy' },
  zoro: { itemId: 'essenceBlade', name: 'Essência da Lâmina', icon: '⚔', characterId: 'zoro' },
  nami: { itemId: 'essenceNavigation', name: 'Essência da Navegação', icon: '⌁', characterId: 'nami' },
  usopp: { itemId: 'essenceSniper', name: 'Essência do Atirador', icon: '◎', characterId: 'usopp' },
  sanji: { itemId: 'essenceCook', name: 'Essência do Cozinheiro', icon: '♨', characterId: 'sanji' },
  chopper: { itemId: 'essenceHealing', name: 'Essência da Cura', icon: '✚', characterId: 'chopper' },
  robin: { itemId: 'essenceArchaeologist', name: 'Essência do Arqueólogo', icon: '✦', characterId: 'robin' },
  franky: { itemId: 'essenceShipwright', name: 'Essência do Carpinteiro', icon: '⚙', characterId: 'franky' },
  brook: { itemId: 'essenceMusician', name: 'Essência do Músico', icon: '♫', characterId: 'brook' },
  jinbe: { itemId: 'essenceHelmsman', name: 'Essência do Timoneiro', icon: '≋', characterId: 'jinbe' },
};

export const essenceCycle = Object.values(essences);

export function essenceForCharacter(characterId) {
  return Object.values(essences).find((essence) => essence.characterId === characterId);
}
