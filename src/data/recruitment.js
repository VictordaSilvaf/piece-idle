export const rarities = {
  common: { id: 'common', name: 'Comum', color: 'gray', label: 'Cinza', chance: 68, icon: '●' },
  rare: { id: 'rare', name: 'Raro', color: 'blue', label: 'Azul', chance: 24, icon: '◆' },
  epic: { id: 'epic', name: 'Épico', color: 'purple', label: 'Roxo', chance: 6.7, icon: '✦' },
  legendary: { id: 'legendary', name: 'Lendário', color: 'gold', label: 'Dourado', chance: 1, icon: '★' },
  mythic: { id: 'mythic', name: 'Mítico', color: 'red', label: 'Vermelho', chance: .3, icon: '✹' },
};

export const chestCatalog = {
  grandLine: {
    id: 'grandLine', name: 'Baú Geral da Grand Line', subtitle: 'Toda a tripulação pode surgir nesta rota.', keyId: 'generalKey', keyName: 'Chave da Grand Line', keyIcon: '🗝',
    softPityStart: 50, hardPity: 100, mythicIncrease: .5, featuredIds: [], selectionMode: 'all', status: 'active',
  },
  swordsman: {
    id: 'swordsman', name: 'Baú do Caminho da Lâmina', subtitle: 'Baú temático com personagens selecionáveis.', keyId: 'bladeKey', keyName: 'Chave da Lâmina', keyIcon: '🔑',
    softPityStart: 40, hardPity: 80, mythicIncrease: .65, featuredIds: ['zoro'], selectionMode: 'featured-guarantee', status: 'upcoming',
  },
  navigator: {
    id: 'navigator', name: 'Baú das Rotas Perdidas', subtitle: 'Maior chance para navegadores e especialistas.', keyId: 'routeKey', keyName: 'Chave das Rotas', keyIcon: '🗝',
    softPityStart: 40, hardPity: 80, mythicIncrease: .65, featuredIds: ['nami', 'robin'], selectionMode: 'featured-rate-up', status: 'upcoming',
  },
};

export const characterRarities = {
  luffy: 'mythic', zoro: 'legendary', nami: 'rare', usopp: 'common', sanji: 'epic',
  chopper: 'common', robin: 'epic', franky: 'rare', brook: 'common', jinbe: 'legendary',
};
