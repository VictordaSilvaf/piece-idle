// @ts-nocheck — gameplay monolith tipado progressivamente; domínio já é tipado/OOP.
import { clamp, distance } from '../core/math';
import { characterAttack, characterDefense, characterMaxHp, grantExperience, MAX_CHARACTER_LEVEL, skillDamageMultiplier, skillRank } from '../domain/progression';
import { crewAverageLevel, enemyDamage, enemyMaxHp, islandDifficulty } from '../domain/islands';
import { BOOST_MAX_LEVEL, applyBoost, boostUpgradeCost, essenceDropChance } from '../domain/boost';
import { combatMonitoring } from '../config/monitoring';
import { itemCatalog } from '../data/items';
import { chestCatalog } from '../data/recruitment';
import { addItem, consumeItem, itemQuantity } from '../domain/inventory';
import { rollRecruit } from '../domain/recruitment';
import { renderInventory, sellPriceFor } from '../ui/InventoryPanel';
import { renderRecruitment } from '../ui/RecruitmentPanel';
import { crewJobs, getCrewJob } from '../data/crew-jobs';
import { essenceCycle, essenceForCharacter } from '../data/essences';
import { createCharacterRoster } from '../data/characters';
import { CrewRoster } from './CrewRoster';
import { Inventory } from '../domain/inventory';
import { RecruitmentSystem } from '../domain/recruitment';

/**
 * Fachada OOP do cliente: concentra estado de sessão e orquestra HUD, combate e mundo.
 * Regras de domínio (Inventário, Personagem, Recrutamento, Boost, Ilhas) vivem em classes próprias.
 */
export class GameApp {
  start(): void {
    const characters = createCharacterRoster();
    const roster = new CrewRoster(
      characters,
      ['luffy', 'zoro', 'nami', 'sanji', 'chopper'],
      ['luffy', 'zoro', 'nami', 'sanji', 'chopper'],
    );

    const islands = [
      { id: 'ruinas', name: 'Ruínas da Enseada', subtitle: 'Fragmentos · risco médio', icon: '⚓', color: '#3b8db6', reward: 120, enemy: 'Saqueador da Névoa', enemies: 5, terrain: 'ruins' },
      { id: 'mangue', name: 'Mangue Esmeralda', subtitle: 'Suprimentos · risco baixo', icon: '🌿', color: '#3e9154', reward: 85, enemy: 'Caranguejo Casco-Duro', enemies: 4, terrain: 'mangrove' },
      { id: 'atol', name: 'Atol do Trovão', subtitle: 'Relíquias · risco alto', icon: '⚡', color: '#8756a5', reward: 210, enemy: 'Guardião do Atol', enemies: 7, terrain: 'storm' },
    ];
    islands.forEach((island, index) => { island.essence = essenceCycle[index]; });

    const worldIslands = [
      ['cactus', 'Ilha Cactus', 'Onde fica Whisky Peak'],
      ['little-garden', 'Little Garden', 'Ilha pré-histórica com dinossauros'],
      ['kyuka', 'Ilha Kyuka', 'Ilha de férias'],
      ['drum', 'Ilha Drum', 'Ilha de inverno, terra natal de Chopper'],
      ['nanimonai', 'Ilha Nanimonai', 'Ilha pouco explorada'],
      ['alabasta', 'Alabasta (Sandy Island)', 'Reino desértico'],
      ['jaya', 'Jaya', 'Ilha onde fica Mock Town'],
      ['skypiea', 'Skypiea', 'Ilha do céu'],
      ['angel', 'Ilha Angel', 'Parte de Skypiea'],
      ['long-ring', 'Long Ring Long Land', 'Ilha com animais de proporções incomuns'],
      ['water-7', 'Water 7', 'Cidade dos construtores navais'],
      ['enies-lobby', 'Enies Lobby', 'Ilha judicial do Governo Mundial'],
      ['san-faldo', 'San Faldo', 'Ilha conectada ao trem marítimo'],
      ['pucci', 'Pucci', 'Ilha conectada ao trem marítimo'],
      ['saint-poplar', 'Saint Poplar', 'Ilha conectada ao trem marítimo'],
      ['banaro', 'Ilha Banaro', 'Local da batalha entre Ace e Barba Negra'],
      ['sabaody', 'Arquipélago Sabaody', 'Principal ponto de passagem para o Novo Mundo'],
      ['karakuri', 'Ilha Karakuri', 'Ilha tecnológica'],
      ['momoiro', 'Ilha Momoiro', 'Reino Kamabakka'],
      ['boin', 'Arquipélago Boin', 'Arquipélago de plantas gigantes'],
      ['namakura', 'Ilha Namakura', 'Ilha associada ao culto de Satan'],
      ['kuraigana', 'Ilha Kuraigana', 'Local onde Mihawk vivia'],
      ['kenzan', 'Ilha Kenzan', 'Ilha associada à tribo dos braços longos'],
      ['merveille', 'Merveille', 'Ilha flutuante associada a Shiki'],
      ['foolshout', 'Ilha Foolshout', 'Ilha visitada por Kuma'],
      ['vira', 'Vira', 'Local mencionado na história'],
      ['guanhao', 'Guanhao', 'Local associado à construção de pontes'],
    ].map(([id, name, subtitle], index) => ({
      id, name, subtitle, icon: ['⚓', '🦕', '☀', '❄', '❔', '🏜', '🍺', '☁', '😇', '🦒', '⚙', '⚖', '🚆', '🚆', '🚆', '⚔', '🫧', '🔩', '🌺', '🌿', '🪬', '🏰', '💪', '🪽', '🐾', '🏳', '🌉'][index],
      color: ['#3b8db6', '#537d4c', '#e2a447', '#7db8df', '#7a8693', '#c28a43', '#81614b', '#74b4d6', '#a6dff2'][index % 9],
      terrain: ['ruins', 'mangrove', 'mangrove', 'snow', 'mangrove', 'desert', 'ruins', 'storm', 'storm', 'mangrove'][index] || ['ruins', 'mangrove', 'storm'][index % 3], reward: 90 + index * 12, enemies: 4 + (index % 4), enemy: ['Batedor da Ilha', 'Criatura Selvagem', 'Guardião da Rota'][index % 3],
      levelMin: index * 4 + 1, levelMax: index * 4 + 10, essence: essenceCycle[index % essenceCycle.length],
    }));

    const selected = roster.selected;
    const recruitedCharacterIds = roster.recruited;
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const assetPaths = {
      pcHeroIdle: 'assets/Pixel Crawler/Pixel Crawler - Free Pack/Entities/Characters/Body_A/Animations/Idle_Base/Idle_Down-Sheet.png',
      pcHeroWalk: 'assets/Pixel Crawler/Pixel Crawler - Free Pack/Entities/Characters/Body_A/Animations/Walk_Base/Walk_Down-Sheet.png',
      pcHeroIdleSide: 'assets/Pixel Crawler/Pixel Crawler - Free Pack/Entities/Characters/Body_A/Animations/Idle_Base/Idle_Side-Sheet.png',
      pcHeroIdleUp: 'assets/Pixel Crawler/Pixel Crawler - Free Pack/Entities/Characters/Body_A/Animations/Idle_Base/Idle_Up-Sheet.png',
      pcHeroWalkSide: 'assets/Pixel Crawler/Pixel Crawler - Free Pack/Entities/Characters/Body_A/Animations/Walk_Base/Walk_Side-Sheet.png',
      pcHeroWalkUp: 'assets/Pixel Crawler/Pixel Crawler - Free Pack/Entities/Characters/Body_A/Animations/Walk_Base/Walk_Up-Sheet.png',
      pcSkeleton: 'assets/Pixel Crawler/Pixel Crawler - Free Pack/Entities/Mobs/Skeleton Crew/Skeleton - Base/Idle/Idle-Sheet.png',
      pcOrc: 'assets/Pixel Crawler/Pixel Crawler - Free Pack/Entities/Mobs/Orc Crew/Orc/Idle/Idle-Sheet.png',
      pcFloors: 'assets/Pixel Crawler/Pixel Crawler - Free Pack/Environment/Tilesets/Floors_Tiles.png',
      pcWater: 'assets/Pixel Crawler/Pixel Crawler - Free Pack/Environment/Tilesets/Water_tiles.png',
      pcTree: 'assets/Pixel Crawler/Pixel Crawler - Free Pack/Environment/Props/Static/Trees/Model_01/Size_04.png',
      pcRock: 'assets/Pixel Crawler/Pixel Crawler - Free Pack/Environment/Props/Static/Rocks.png',
      pcVegetation: 'assets/Pixel Crawler/Pixel Crawler - Free Pack/Environment/Props/Static/Vegetation.png',
      pcBonfire: 'assets/Pixel Crawler/Pixel Crawler - Free Pack/Environment/Structures/Stations/Bonfire/Bonfire.png',
      pcFarm: 'assets/Pixel Crawler/Pixel Crawler - Free Pack/Environment/Props/Static/Farm.png',
      idle: 'assets/Farm RPG/Character/Idle.png',
      walk: 'assets/Farm RPG/Character/Walk.png',
      tiles: 'assets/Farm RPG/Tileset/Tileset Grass Spring.png',
      tree: 'assets/Farm RPG/Objects/Maple Tree.png',
      road: 'assets/Farm RPG/Objects/Road copiar.png',
      house: 'assets/Farm RPG/Objects/House.png',
      fence: "assets/Farm RPG/Objects/Fence's copiar.png",
      crops: 'assets/Farm RPG/Objects/Spring Crops.png',
      chest: 'assets/Farm RPG/Objects/chest.png',
      chicken: 'assets/Farm RPG/Farm Animals/Chicken Red.png',
      cow: 'assets/Farm RPG/Farm Animals/Female Cow Brown.png',
    };
    const powerRoot = 'assets/Powers/Super Pixel Effects Gigapack (Free Version)/PNG';
    const powerEffects = {
      luffy: { path: 'Impacts/directional_impact_001/directional_impact_001_small_blue', frames: 7, width: 32, height: 32, scale: 2.2 },
      zoro: { path: 'Impacts/symmetrical_impact_001/symmetrical_impact_001_small_yellow', frames: 7, width: 48, height: 48, scale: 1.45 },
      nami: { path: 'Lightning/lightning_burst_001/lightning_burst_001_small_violet', frames: 8, width: 32, height: 32, scale: 2.4 },
      usopp: { path: 'Sci-fi/scifi_spark_burst_001/scifi_spark_burst_001_small_yellow', frames: 12, width: 64, height: 64, scale: 1.05 },
      sanji: { path: 'Fire/fire_looping_003A/fire_looping_003A_small_orange', frames: 5, width: 40, height: 64, scale: 1.25 },
      chopper: { path: 'Fantasy Spells/spell_heal_001/spell_heal_001_small_red', frames: 16, width: 64, height: 64, scale: 1.05 },
      robin: { path: 'Magic Bursts/round_light_burst_001/round_light_burst_001_small_yellow', frames: 9, width: 128, height: 72, scale: .65 },
      franky: { path: 'Sci-fi/scifi_spark_burst_001/scifi_spark_burst_001_small_yellow', frames: 12, width: 64, height: 64, scale: 1.15 },
      brook: { path: 'Magic Bursts/directional_music_burst_001/directional_music_burst_001_small_red', frames: 21, width: 64, height: 64, scale: 1.05 },
      jinbe: { path: 'Impacts/directional_impact_001/directional_impact_001_small_blue', frames: 7, width: 32, height: 32, scale: 2.4 },
    };
    const keyedSpriteAssets = new Set(['pcHeroIdle', 'pcHeroWalk', 'pcHeroIdleSide', 'pcHeroIdleUp', 'pcHeroWalkSide', 'pcHeroWalkUp', 'pcSkeleton', 'pcOrc']);

    function removeSheetBackdrop(image) {
      const source = document.createElement('canvas'); source.width = image.naturalWidth; source.height = image.naturalHeight;
      const sourceContext = source.getContext('2d', { willReadFrequently: true }); sourceContext.drawImage(image, 0, 0);
      const pixels = sourceContext.getImageData(0, 0, source.width, source.height);
      const [red, green, blue] = pixels.data;
      for (let index = 0; index < pixels.data.length; index += 4) {
        const distanceFromBackdrop = Math.abs(pixels.data[index] - red) + Math.abs(pixels.data[index + 1] - green) + Math.abs(pixels.data[index + 2] - blue);
        if (distanceFromBackdrop < 18) pixels.data[index + 3] = 0;
      }
      sourceContext.putImageData(pixels, 0, 0); image.cleanedSheet = source;
    }

    const assets = Object.fromEntries(Object.entries(assetPaths).map(([name, src]) => {
      const image = new Image();
      if (keyedSpriteAssets.has(name)) image.addEventListener('load', () => removeSheetBackdrop(image));
      image.src = src;
      return [name, image];
    }));
    const powerSprites = Object.fromEntries(Object.entries(powerEffects).map(([id, effect]) => [id, Array.from({ length: effect.frames }, (_, frame) => {
      const image = new Image();
      image.src = `${powerRoot}/${effect.path}/frame${String(frame).padStart(4, '0')}.png`;
      return image;
    })]));
    const keys = new Set();
    let view = 'jogo';
    let activeIsland = null;
    let autoCombat = true;
    let lastFrame = 0;
    let lastAttack = 0;
    let lastPassiveTick = 0;
    let lastHudUpdate = 0;
    let toastTimer;
    let dialogueOpen = false;
    let berries = 1250;
    let animationTime = 0;
    let playerLevel = 18;
    let experience = 0;
    let experienceToLevel = 160;
    const inventory = new Inventory({ revivePotion: 3, seaRation: 38, mapFragment: 1, generalKey: 1 });
    const recruitmentState = new RecruitmentSystem();
    const recruitmentChests = Object.values(chestCatalog);
    let lastRecruitResult = null;
    let playerDownUntil = 0;
    let partyWiped = false;
    let partyReviveAt = 0;
    let activePowerEffects = [];
    let combatEvents = [];

    const player = { x: 220, y: 332, radius: 17, hp: 100, maxHp: 100, speed: 175, facing: 1, direction: 'down', isHit: 0 };
    let enemies = [];
    let companions = [];
    const camera = { x: 0, y: 0 };

    const npcs = [
      { id: 'nami', name: 'Nami', icon: '⌁', x: 560, y: 278, color: '#e7ad42', dialogue: 'Capitão, o mar está calmo. Abra o mapa e escolha uma ilha para iniciarmos uma expedição.', action: 'mapa', actionLabel: 'Abrir mapa' },
      { id: 'franky', name: 'Franky', icon: '⚙', x: 736, y: 365, color: '#45a5ad', dialogue: 'O navio aguenta mais uma aventura. Quer trocar a formação antes de navegar?', action: 'tripulacao', actionLabel: 'Editar tripulação' },
      { id: 'brook', name: 'Brook', icon: '♫', x: 355, y: 194, color: '#8756a5', dialogue: 'Yohoho! Uma boa equipe luta melhor junta. Veja suas sinergias na formação.', action: 'tripulacao', actionLabel: 'Ver sinergias' },
    ];

    function byId(id) { return document.getElementById(id); }
    function crew() { return roster.crew(); }
    function characterById(id) { return roster.byId(id); }
    function hasPassive(effect) { return roster.hasPassive(effect); }
    function updateDirection(unit, dx, dy) { if (!dx && !dy) return; unit.direction = Math.abs(dx) > Math.abs(dy) ? 'side' : dy < 0 ? 'up' : 'down'; if (dx) unit.facing = dx < 0 ? -1 : 1; }
    function worldSize() {
      return { width: Math.max(1440, canvas.clientWidth), height: Math.max(900, canvas.clientHeight) };
    }

    function syncCaptainProgress() {
      const captain = characterById('luffy');
      playerLevel = captain.level; experience = captain.experience; experienceToLevel = captain.experienceToLevel;
      player.maxHp = characterMaxHp(captain); player.hp = clamp(player.hp, 0, player.maxHp);
    }

    const hubPortraits = {
      luffy: 'assets/hub/processed/portrait-luffy.png',
      zoro: 'assets/hub/processed/portrait-zoro.png',
      nami: 'assets/hub/processed/portrait-nami.png',
      usopp: 'assets/hub/processed/portrait-usopp.png',
      sanji: 'assets/hub/processed/portrait-sanji.png',
      chopper: 'assets/hub/processed/portrait-chopper.png',
      robin: 'assets/hub/processed/portrait-robin.png',
      franky: 'assets/hub/processed/portrait-franky.png',
      brook: 'assets/hub/processed/portrait-brook.png',
      jinbe: 'assets/hub/processed/portrait-jinbe.png',
    };

    function portraitFor(character) {
      const source = hubPortraits[character.id];
      return source ? `<img src="${source}" alt="">` : `<span class="portrait-${character.color}">${character.icon}</span>`;
    }

    function partyHudUnits() {
      const units = [];
      const captain = characterById('luffy');
      if (selected.has('luffy')) {
        units.push({
          id: 'luffy', name: captain.name, icon: captain.icon, color: captain.color,
          hp: player.hp, maxHp: player.maxHp, stamina: captain.stamina, maxStamina: captain.maxStamina, downUntil: playerDownUntil,
        });
      }
      companions.forEach((member) => {
        const base = characterById(member.id);
        units.push({
          id: member.id, name: member.name, icon: member.icon, color: member.color,
          hp: member.hp, maxHp: member.maxHp, stamina: base.stamina, maxStamina: base.maxStamina, downUntil: member.downUntil,
        });
      });
      return units;
    }

    function renderPartyHud(now = performance.now()) {
      const party = byId('hub-party');
      if (!party) return;
      party.innerHTML = partyHudUnits().map((unit) => {
        const down = Boolean(unit.downUntil) || unit.hp <= 0;
        const hp = Math.max(0, Math.ceil(unit.hp));
        const maxHp = Math.max(1, unit.maxHp);
        const sp = Math.max(0, Math.ceil(unit.stamina));
        const maxSp = Math.max(1, unit.maxStamina);
        const portrait = portraitFor(unit);
        return `<article class="hub-member ${down ? 'is-down' : ''}" data-hub-member="${unit.id}">
          <img class="hub-plate" src="assets/hub/processed/party-plate.png" alt="" aria-hidden="true" />
          <div class="hub-portrait">${portrait}</div>
          <div class="hub-member-body">
            <strong>${unit.name}</strong>
            <div class="hub-stat hub-stat-hp"><span><i style="width:${(hp / maxHp) * 100}%"></i><em>${hp}/${maxHp}</em></span></div>
            <div class="hub-stat hub-stat-sp"><span><i style="width:${(sp / maxSp) * 100}%"></i><em>${sp}/${maxSp}</em></span></div>
          </div>
        </article>`;
      }).join('');
    }

    function setHubLocation(label) {
      const el = byId('hub-location-label');
      if (el) el.setAttribute('alt', label);

      // A placa é parte do hub do porto; as ilhas usam apenas o cenário jogável.
      const sign = el?.closest('.hub-location');
      if (sign) sign.hidden = Boolean(activeIsland);
    }

    function syncHubNav(activeView = view) {
      document.querySelectorAll('.hub-nav-btn').forEach((button) => {
        const action = button.dataset.hubAction;
        const mappedView = button.dataset.view;
        const isActive = (mappedView && mappedView === activeView)
          || (action === 'explorar' && activeView === 'mapa')
          || (action === 'inventario' && byId('inventory-modal')?.open)
          || (action === 'conta' && byId('inventory-modal')?.open);
        button.classList.toggle('is-active', Boolean(isActive));
      });
    }

    function updatePlayerHud() {
      syncCaptainProgress();
      const captain = characterById('luffy');
      byId('player-level').textContent = `${playerLevel}/${MAX_CHARACTER_LEVEL}`;
      byId('player-hp').textContent = Math.ceil(player.hp);
      byId('player-max-hp').textContent = player.maxHp;
      byId('player-hp-bar').style.width = `${(player.hp / player.maxHp) * 100}%`;
      byId('player-stamina').textContent = Math.ceil(captain.stamina);
      byId('player-stamina-bar').style.width = `${(captain.stamina / captain.maxStamina) * 100}%`;
      byId('player-xp').textContent = playerLevel >= MAX_CHARACTER_LEVEL ? 'Nível máximo' : `${experience.toLocaleString('pt-BR')} / ${experienceToLevel.toLocaleString('pt-BR')}`;
      byId('berries').textContent = berries.toLocaleString('pt-BR');
      const potionCount = itemQuantity(inventory, 'revivePotion');
      byId('potion-count').textContent = potionCount;
      byId('death-potion-count').textContent = potionCount;
      renderPartyHud();
    }

    function resetCompanions() {
      companions = crew().filter((member) => member.id !== 'luffy').slice(0, 4).map((member, index) => ({
        ...member, x: player.x - 42 - index * 9, y: player.y + 28 + index * 8,
        radius: 15, hp: characterMaxHp(member), maxHp: characterMaxHp(member),
        speed: 142 + index * 7, cooldown: 0, downUntil: 0,
      }));
    }

    function livingUnits() {
      const captain = player.hp > 0 && !playerDownUntil ? [{ id: 'luffy', name: 'Você', ...player, isPlayer: true }] : [];
      return [...captain, ...companions.filter((member) => member.hp > 0 && !member.downUntil)];
    }

    function everyoneDown() { return !livingUnits().length; }

    function setDeathOverlay(visible) {
      const overlay = byId('death-overlay');
      overlay.classList.toggle('is-visible', visible);
      overlay.setAttribute('aria-hidden', String(!visible));
    }

    function reviveEntireCrew(source = 'potion') {
      playerDownUntil = 0; player.hp = Math.ceil(player.maxHp * .55);
      companions.forEach((member) => { member.downUntil = 0; member.hp = Math.ceil(member.maxHp * .55); member.x = player.x - 34; member.y = player.y + 28; });
      partyWiped = false; partyReviveAt = 0; setDeathOverlay(false); updatePlayerHud();
      showToast(source === 'potion' ? 'A poção reviveu toda a tripulação!' : 'A tripulação voltou à luta.');
    }

    function syncDeathOverlayCopy() {
      const potions = itemQuantity(inventory, 'revivePotion');
      const btn = byId('revive-potion');
      byId('death-potion-count').textContent = potions;
      byId('revive-countdown').textContent = potions > 0
        ? 'Use uma poção para reviver a tripulação, ou volte ao porto.'
        : 'Sem poções. Volte ao porto ou encontre uma poção para reviver.';
      btn.disabled = potions <= 0;
      btn.classList.toggle('is-disabled', potions <= 0);
    }

    function triggerPartyWipe() {
      if (partyWiped) return;
      partyWiped = true; partyReviveAt = 0; playerDownUntil = 1;
      companions.forEach((member) => { member.hp = 0; member.downUntil = 1; });
      setDeathOverlay(true); syncDeathOverlayCopy(); updatePlayerHud();
    }

    function updateWipeState() {
      if (!partyWiped) return false;
      syncDeathOverlayCopy();
      return partyWiped;
    }

    function usePotion() {
      if (!activeIsland) return showToast('As poções só podem ser usadas durante uma expedição.');
      if (!partyWiped) return showToast('A poção de reviver só funciona quando toda a tripulação cair.');
      if (itemQuantity(inventory, 'revivePotion') <= 0) return showToast('Você não possui poções de reviver.');
      consumeItem(inventory, 'revivePotion');
      reviveEntireCrew('potion');
      updatePlayerHud();
    }

    function rewardKill(enemy) {
      const xpGain = enemy.xpReward;
      const berryGain = enemy.berryReward;
      berries += berryGain;
      const essenceDropped = enemy.essence && Math.random() < enemy.essenceDropChance ? enemy.essence : null;
      if (essenceDropped) addItem(inventory, essenceDropped.itemId);
      const keyDropped = Math.random() < Math.min(.035, .008 + (enemy.level || 1) * .00015);
      if (keyDropped) addItem(inventory, 'generalKey');
      const levelUps = crew().map((member) => grantCharacterExperience(member, xpGain)).filter(Boolean);
      updatePlayerHud();
      showReward(enemy, xpGain, berryGain, levelUps.some((member) => member.id === 'luffy') ? 1 : 0, essenceDropped);
      if (essenceDropped) showToast(`+1 ${essenceDropped.name}`);
      if (keyDropped) showToast('+1 Chave da Grand Line');
      if (levelUps.length) showToast(`${levelUps.map((member) => member.name.split(' ').at(-1)).join(', ')} subiu de nível!`);
    }

    function grantCharacterExperience(character, amount) {
      const leveledUp = grantExperience(character, amount);
      const companion = companions.find((member) => member.id === character.id);
      if (companion) {
        const previousMaxHp = companion.maxHp;
        companion.maxHp = characterMaxHp(character);
        companion.hp = Math.min(companion.maxHp, companion.hp + Math.max(0, companion.maxHp - previousMaxHp));
      }
      if (character.id === 'luffy' && leveledUp) { player.maxHp = characterMaxHp(character); player.hp = player.maxHp; }
      return leveledUp ? character : null;
    }

    function recoverStamina(delta) {
      if (!activeIsland) return;
      crew().forEach((character) => { character.stamina = Math.min(character.maxStamina, character.stamina + character.staminaRegen * delta); });
    }

    function useCombatSkill(member, now) {
      const character = characterById(member.id);
      const skillIndex = character.skills.findIndex((skill, index) => skill.kind === 'active' && character.stamina >= skill.staminaCost && now >= character.skillReadyAt[index]);
      const basicDamage = 2 + Math.floor(characterAttack(character) / 7);
      if (skillIndex === -1) return { damage: basicDamage, skill: null };
      const skill = character.skills[skillIndex];
      character.stamina -= skill.staminaCost;
      character.skillReadyAt[skillIndex] = now + skill.cooldown;
      return { damage: Math.round(characterAttack(character) * skillDamageMultiplier(character, skill)), skill };
    }

    function logCombatEvent({ type, target, text, color = '#ffffff' }) {
      if (!combatMonitoring.enabled || !combatMonitoring[type] || !target) return;
      combatEvents.push({ type, x: target.x, y: target.y, text, color, startedAt: performance.now() });
      if (combatEvents.length > combatMonitoring.maxVisibleEvents) combatEvents.splice(0, combatEvents.length - combatMonitoring.maxVisibleEvents);
    }

    function combatTargetFor(member) {
      return member.id === 'luffy' ? player : companions.find((unit) => unit.id === member.id);
    }

    function healMostWounded(amount, healer) {
      const units = livingUnits();
      const target = units.sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
      if (!target) return;
      if (target.isPlayer) { player.hp = Math.min(player.maxHp, player.hp + amount); updatePlayerHud(); }
      else target.hp = Math.min(target.maxHp, target.hp + amount);
      logCombatEvent({ type: 'healing', target, text: `${healer.name.split(' ').at(-1)} · +${amount}`, color: outfitTints[healer.color] });
    }

    function applyPassiveRegeneration(now) {
      if (!activeIsland || !hasPassive('doctor') || now - lastPassiveTick < 1000) return;
      lastPassiveTick = now;
      livingUnits().forEach((unit) => {
        if (unit.isPlayer) player.hp = Math.min(player.maxHp, player.hp + 2);
        else unit.hp = Math.min(unit.maxHp, unit.hp + 2);
        logCombatEvent({ type: 'healing', target: unit, text: 'Chopper · +2', color: outfitTints.rose });
      });
      updatePlayerHud();
    }

    function setView(nextView) {
      view = nextView;
      document.querySelectorAll('[data-view-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.viewPanel === nextView));
      document.querySelectorAll('.nav-link').forEach((button) => button.classList.toggle('is-active', button.dataset.view === nextView));
      syncHubNav(nextView);
      if (nextView === 'jogo') requestAnimationFrame(() => resizeCanvas());
      if (nextView === 'tripulacao') renderCrew();
      if (nextView === 'recrutamento') renderRecruitmentScreen();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function resizeCanvas() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;
      canvas.width = cssWidth * ratio;
      canvas.height = cssHeight * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function showToast(message) {
      const toast = byId('toast');
      toast.textContent = message;
      toast.classList.add('is-visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3000);
    }

    function showReward(enemy, xpGain, berryGain, levelsGained = 0, essence = null) {
      const stack = byId('reward-stack');
      const reward = document.createElement('article');
      reward.className = 'reward-notification';
      reward.innerHTML = `<span class="reward-seal">✦</span><div><b>${enemy.name} derrotado</b><small>+${xpGain} XP <i>·</i> +${berryGain} Berries${levelsGained ? ` <em>NV. ${playerLevel}</em>` : ''}${essence ? ` <strong>· +1 ${essence.icon} ${essence.name}</strong>` : ''}</small></div>`;
      stack.append(reward);

      while (stack.children.length > 3) stack.firstElementChild.remove();
      requestAnimationFrame(() => reward.classList.add('is-visible'));
      setTimeout(() => {
        reward.classList.remove('is-visible');
        reward.classList.add('is-leaving');
        setTimeout(() => reward.remove(), 180);
      }, 3400);
    }

    function setDialogue(npc, force = false) {
      if (!npc && !force) return;
      dialogueOpen = Boolean(npc);
      byId('dialogue-panel').classList.toggle('is-open', Boolean(npc));
      if (npc) {
        byId('npc-seal').textContent = npc.icon;
        byId('dialogue-name').textContent = npc.name;
        byId('dialogue-text').innerHTML = `${npc.dialogue} <button class="inline-action" data-npc-action="${npc.action}" type="button">${npc.actionLabel} →</button>`;
      }
    }

    function nearestNpc() {
      return npcs.map((npc) => ({ npc, distance: distance(player, npc) })).sort((a, b) => a.distance - b.distance)[0];
    }

    function talk() {
      if (activeIsland) return showToast('Nesta ilha, a prioridade é derrotar os inimigos.');
      const nearby = nearestNpc();
      if (nearby.distance > 86) return showToast('Aproxime-se de um NPC antes de conversar.');
      setDialogue(nearby.npc);
    }

    function drawBar(x, y, width, percent, color) {
      ctx.fillStyle = 'rgba(3, 28, 42, .55)'; ctx.fillRect(x, y, width, 6);
      ctx.fillStyle = color; ctx.fillRect(x, y, width * clamp(percent, 0, 1), 6);
    }

    function ready(image) { return image && image.complete && image.naturalWidth > 0; }

    function drawSprite(image, sx, sy, sw, sh, dx, dy, dw = sw, dh = sh) {
      if (ready(image)) ctx.drawImage(image.cleanedSheet || image, sx, sy, sw, sh, Math.round(dx), Math.round(dy), dw, dh);
    }

    function drawTileGround(width, height) {
      const terrain = activeIsland?.terrain;
      ctx.fillStyle = terrain === 'storm' ? '#395c68' : terrain === 'snow' ? '#d4e5e8' : terrain === 'desert' ? '#cba56a' : terrain === 'ruins' ? '#6c563f' : '#2e711b';
      ctx.fillRect(0, 0, width, height);
      const detail = terrain === 'storm' ? 'rgba(202, 230, 234, .12)' : terrain === 'snow' ? 'rgba(255, 255, 255, .52)' : terrain === 'desert' ? 'rgba(246, 211, 139, .23)' : terrain === 'ruins' ? 'rgba(222, 174, 102, .13)' : 'rgba(122, 196, 67, .18)';
      ctx.fillStyle = detail;
      for (let y = 18; y < height; y += 46) for (let x = 12 + ((y / 46) % 2) * 17; x < width; x += 59) {
        ctx.fillRect(x, y, 6, 2); ctx.fillRect(x + 4, y - 4, 2, 5);
      }
    }

    function drawFarmObject(image, sx, sy, sw, sh, x, y, scale = 2) {
      drawSprite(image, sx, sy, sw, sh, x, y, sw * scale, sh * scale);
    }

    function drawPixelWater(x, y, width, height) {
      ctx.fillStyle = '#2b86a9'; ctx.fillRect(x, y, width, height);
      if (ready(assets.pcWater)) for (let row = y; row < y + height; row += 32) for (let column = x; column < x + width; column += 32) drawSprite(assets.pcWater, 16, 128, 16, 16, column, row, 32, 32);
      ctx.fillStyle = 'rgba(214, 246, 255, .3)';
      for (let wave = x + 14; wave < x + width; wave += 58) ctx.fillRect(wave, y + 17 + ((wave / 58) % 3) * 13, 18, 3);
    }

    function drawPcTree(x, y, variant = 0, scale = 1) {
      const sources = [[0, 0], [92, 0], [0, 128], [92, 128]];
      const [sx, sy] = sources[variant % sources.length];
      drawSprite(assets.pcTree, sx, sy, 92, 128, x, y, 92 * scale, 128 * scale);
    }

    function drawPcRock(x, y, variant = 0, scale = 1) {
      const sourceX = (variant % 4) * 52;
      drawSprite(assets.pcRock, sourceX, 0, 52, 76, x, y, 52 * scale, 76 * scale);
    }

    function drawPcVegetation(x, y, variant = 0) {
      const sx = (variant % 4) * 48;
      drawSprite(assets.pcVegetation, sx, 144, 48, 48, x, y, 48, 48);
    }

    function drawMapBorder(width, height, snowy = false) {
      const treeScale = snowy ? 1.05 : 1;
      for (let x = -20; x < width; x += 76) { const index = Math.floor((x + 20) / 76); drawPcTree(x, -44 + (index % 3) * 5, index % 4, treeScale); drawPcTree(x, height - 95 + (index % 2) * 8, (index + 1) % 4, treeScale); }
      for (let y = 58; y < height - 80; y += 95) { const index = Math.floor((y - 58) / 95); drawPcTree(-26, y, (index + 2) % 4, treeScale); drawPcTree(width - 66, y, (index + 3) % 4, treeScale); }
    }

    function drawDirtTrail(width, height, island = false) {
      ctx.save();
      ctx.strokeStyle = island ? '#654526' : '#75502f';
      ctx.lineWidth = 94; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(width * .08, height * .70); ctx.bezierCurveTo(width * .25, height * .56, width * .32, height * .50, width * .48, height * .54); ctx.bezierCurveTo(width * .64, height * .58, width * .74, height * .50, width * .92, height * .61); ctx.stroke();
      ctx.strokeStyle = island ? '#a97845' : '#bd884f'; ctx.lineWidth = 78; ctx.stroke();
      ctx.fillStyle = 'rgba(83, 54, 32, .18)';
      for (let x = width * .22; x < width * .79; x += 72) ctx.fillRect(x, height * .57 + (x % 3) * 9, 19, 4);
      ctx.restore();
    }

    function drawBackground(width, height) {
      drawTileGround(width, height);
      if (!activeIsland) {
        drawPixelWater(0, height * .68, width, height * .32);
        drawDirtTrail(width, height);
        drawMapBorder(width, height);
        drawPcTree(width * .68, 35, 1, 1.13); drawPcTree(width * .78, 50, 0, .95);
        drawPcRock(width * .34, height * .32, 0, .9); drawPcRock(width * .56, height * .27, 2, .75);
        drawPcVegetation(width * .18, height * .36, 0); drawPcVegetation(width * .69, height * .44, 2);
        drawSprite(assets.pcBonfire, 0, 0, 64, 48, width * .48, height * .42, 64, 48);
        drawPcRock(width * .76, height * .45, 3, .72);
      } else {
        const storm = activeIsland.terrain === 'storm'; const ruins = activeIsland.terrain === 'ruins';
        if (storm) { ctx.fillStyle = 'rgba(38, 62, 77, .16)'; ctx.fillRect(0, 0, width, height); drawPixelWater(0, height * .74, width, height * .26); }
        if (ruins) { ctx.fillStyle = 'rgba(105, 68, 39, .28)'; ctx.fillRect(0, 0, width, height); }
        drawDirtTrail(width, height, true);
        drawMapBorder(width, height, storm);
        drawPcTree(width * .12, height * .13, ruins ? 2 : 0, 1.05); drawPcTree(width * .76, height * .12, storm ? 3 : 1, 1.08);
        drawPcTree(width * .05, height * .55, 1, .85); drawPcTree(width * .84, height * .55, 2, .9);
        drawPcRock(width * .32, height * .27, 1, .9); drawPcRock(width * .66, height * .62, 3, .9);
        drawPcVegetation(width * .21, height * .65, 1); drawPcVegetation(width * .73, height * .32, 3);
        if (ruins) drawSprite(assets.pcBonfire, 0, 48, 64, 48, width * .47, height * .33, 64, 48);
      }
    }

    function drawEntity(entity, fill, symbol, label, hp) {
      ctx.save();
      ctx.translate(entity.x, entity.y);
      ctx.fillStyle = 'rgba(2, 22, 34, .22)'; ctx.beginPath(); ctx.ellipse(0, entity.radius + 9, entity.radius + 8, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = fill; ctx.beginPath(); ctx.arc(0, 0, entity.radius, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 17px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(symbol, 0, 1);
      ctx.font = '600 12px system-ui'; ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 3; ctx.fillText(label, 0, -entity.radius - 13); ctx.restore();
      if (hp !== undefined) drawBar(entity.x - 25, entity.y - entity.radius - 7, 50, hp, hp > .35 ? '#5ecb76' : '#ed6c55');
    }

    function drawEnemy(enemy, index) {
      const image = index % 2 ? assets.pcOrc : assets.pcSkeleton;
      if (!ready(image)) return drawEntity(enemy, enemy.color, enemy.icon, enemy.name, enemy.hp / enemy.maxHp);
      const frame = Math.floor(animationTime / 190) % 4;
      ctx.save(); ctx.translate(enemy.x, enemy.y);
      drawSprite(image, frame * 32, 0, 32, 32, -28, -28, 56, 56);
      ctx.restore();
      ctx.fillStyle = '#fff'; ctx.font = '700 10px system-ui'; ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 3;
      ctx.fillText(enemy.name, enemy.x, enemy.y - 30); ctx.shadowBlur = 0;
      drawBar(enemy.x - 25, enemy.y - 25, 50, enemy.hp / enemy.maxHp, enemy.hp / enemy.maxHp > .35 ? '#68cf82' : '#ed6c55');
    }

    function triggerPowerEffects(fighters, target, now) {
      fighters.forEach((fighter, index) => {
        const effect = powerEffects[fighter.id];
        if (!effect) return;
        const angle = (Math.PI * 2 * index) / Math.max(1, fighters.length);
        activePowerEffects.push({ id: fighter.id, x: target.x + Math.cos(angle) * 12, y: target.y + Math.sin(angle) * 10 - 8, startedAt: now + index * 42 });
      });
      if (activePowerEffects.length > 24) activePowerEffects.splice(0, activePowerEffects.length - 24);
    }

    function triggerCombatMotion(fighters, target, now) {
      fighters.forEach((fighter) => {
        const unit = fighter.id === 'luffy' ? player : companions.find((member) => member.id === fighter.id);
        if (!unit) return;
        const dx = target.x - unit.x; const dy = target.y - unit.y; const distanceToTarget = Math.hypot(dx, dy) || 1;
        updateDirection(unit, dx, dy);
        Object.assign(unit, { attackUntil: now + 260, attackDx: dx / distanceToTarget, attackDy: dy / distanceToTarget });
      });
    }

    function drawPowerEffects(now) {
      activePowerEffects = activePowerEffects.filter((active) => {
        const effect = powerEffects[active.id];
        return now < active.startedAt + effect.frames * 58;
      });
      activePowerEffects.forEach((active) => {
        if (now < active.startedAt) return;
        const effect = powerEffects[active.id];
        const frame = Math.min(effect.frames - 1, Math.floor((now - active.startedAt) / 58));
        const image = powerSprites[active.id][frame];
        if (!ready(image)) return;
        const width = effect.width * effect.scale; const height = effect.height * effect.scale;
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .92;
        ctx.drawImage(image, Math.round(active.x - width / 2), Math.round(active.y - height / 2), width, height);
        ctx.restore();
      });
    }

    function drawCombatEvents(now) {
      combatEvents = combatEvents.filter((event) => now - event.startedAt < 1180);
      combatEvents.forEach((event, index) => {
        const age = (now - event.startedAt) / 1180;
        const critical = event.type === 'critical';
        const size = critical ? 17 : event.type === 'damage' ? 13 : 12;
        ctx.save(); ctx.globalAlpha = 1 - age; ctx.textAlign = 'center';
        ctx.font = `800 ${size}px system-ui`; ctx.fillStyle = event.color;
        ctx.shadowColor = critical ? '#ffd34f' : 'rgba(0,0,0,.9)'; ctx.shadowBlur = critical ? 11 : 4;
        ctx.fillText(event.text, event.x, event.y - 36 - age * 48 - (index % 3) * 15);
        ctx.restore();
      });
    }

    function drawNpc(npc) {
      if (!ready(assets.pcHeroIdle)) return drawEntity({ ...npc, radius: 17 }, npc.color, npc.icon, npc.name);
      const frame = Math.floor(animationTime / 280) % 4;
      ctx.save(); ctx.translate(npc.x, npc.y);
      drawSprite(assets.pcHeroIdle, frame * 64, 0, 64, 64, -61, -61, 122, 122);
      ctx.restore();
      ctx.fillStyle = '#fff'; ctx.font = '700 10px system-ui'; ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 3; ctx.fillText(npc.name, npc.x, npc.y - 33); ctx.shadowBlur = 0;
    }

    function drawScene(timestamp) {
      const width = canvas.clientWidth; const height = canvas.clientHeight;
      if (!width || !height) return;
      const world = worldSize();
      camera.x = clamp(player.x - width / 2, 0, Math.max(0, world.width - width));
      camera.y = clamp(player.y - height / 2, 0, Math.max(0, world.height - height));
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(-camera.x, -camera.y);
      drawBackground(world.width, world.height);
      if (!activeIsland) npcs.forEach(drawNpc);
      enemies.filter((enemy) => enemy.hp > 0).forEach((enemy, index) => drawEnemy(enemy, index));
      drawPowerEffects(timestamp);
      drawPlayer();
      drawCompanions();
      drawCombatEvents(timestamp);
      ctx.restore();
      if (activeIsland) {
        ctx.fillStyle = 'rgba(3, 26, 38, .78)'; ctx.fillRect(16, 16, 250, 42);
        ctx.fillStyle = '#fff'; ctx.font = '700 13px system-ui'; ctx.fillText(`${activeIsland.name} · ${enemies.filter((e) => e.hp > 0).length} inimigos`, 30, 42);
      }
      requestAnimationFrame(drawScene);
    }

    function drawPlayer() {
      if (playerDownUntil) return;
      const moving = keys.size > 0 || (activeIsland && autoCombat && enemies.some((enemy) => enemy.hp > 0));
      const suffix = player.direction === 'side' ? 'Side' : player.direction === 'up' ? 'Up' : '';
      const image = assets[`pcHero${moving ? 'Walk' : 'Idle'}${suffix}`] || (moving ? assets.pcHeroWalk : assets.pcHeroIdle);
      const frames = moving ? 6 : 4;
      const frame = Math.floor(animationTime / (moving ? 110 : 210)) % frames;
      const size = 152;
      if (ready(image)) {
        ctx.save();
        const attack = player.attackUntil > performance.now() ? Math.sin((1 - (player.attackUntil - performance.now()) / 260) * Math.PI) * 18 : 0;
        ctx.translate(player.x + (player.attackDx || 0) * attack, player.y + (player.attackDy || 0) * attack);
        if (player.facing < 0) ctx.scale(-1, 1);
        drawSprite(image, frame * 64, 0, 64, 64, -size / 2, -size / 2, size, size);
        ctx.restore();
        ctx.fillStyle = '#fff'; ctx.font = '700 11px system-ui'; ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 3; ctx.fillText('Você', player.x, player.y - 39); ctx.shadowBlur = 0;
        drawBar(player.x - 25, player.y - 33, 50, player.hp / player.maxHp, '#5ecb76');
        const captain = characterById('luffy');
        drawBar(player.x - 25, player.y - 25, 50, captain.stamina / captain.maxStamina, '#56b8e7');
        return;
      }
      drawEntity(player, '#e9624f', '★', 'Você', player.hp / player.maxHp);
    }

    const outfitTints = { coral: '#e9624f', moss: '#4e9d5c', sun: '#e6ad42', gold: '#b88926', blue: '#4c79ba', rose: '#cb6378', violet: '#8d62b4', cyan: '#43aeb5', purple: '#8756a5', aqua: '#45a5ad' };

    function currentTarget() {
      return enemies.filter((enemy) => enemy.hp > 0).sort((a, b) => distance(player, a) - distance(player, b))[0];
    }

    function companionDestination(index, target) {
      const offsets = [[-52, 29], [-62, -16], [48, 30], [60, -13]];
      if (target && distance(player, target) <= 104) {
        const angle = [-2.3, -0.9, 0.75, 2.15][index];
        return { x: target.x + Math.cos(angle) * 58, y: target.y + Math.sin(angle) * 44 };
      }
      const [x, y] = offsets[index] || [0, 42];
      return { x: player.x + x, y: player.y + y };
    }

    function drawCompanion(member, index, target) {
      const position = member;
      const moving = Boolean(activeIsland && target);
      if (target) updateDirection(member, target.x - position.x, target.y - position.y);
      const suffix = member.direction === 'side' ? 'Side' : member.direction === 'up' ? 'Up' : '';
      const image = assets[`pcHero${moving ? 'Walk' : 'Idle'}${suffix}`] || (moving ? assets.pcHeroWalk : assets.pcHeroIdle);
      const frames = moving ? 6 : 4;
      const frame = Math.floor(animationTime / (moving ? 115 : 220)) % frames;
      const facing = member.facing || player.facing;
      const size = 126;
      if (!ready(image)) return drawEntity({ ...position, radius: 14 }, outfitTints[member.color], member.icon, member.name.split(' ').at(-1));
      ctx.save();
      const attack = member.attackUntil > performance.now() ? Math.sin((1 - (member.attackUntil - performance.now()) / 260) * Math.PI) * 15 : 0;
      ctx.translate(position.x + (member.attackDx || 0) * attack, position.y + (member.attackDy || 0) * attack);
      if (facing < 0) ctx.scale(-1, 1);
      drawSprite(image, frame * 64, 0, 64, 64, -size / 2, -size / 2, size, size);
      ctx.restore();
      ctx.fillStyle = '#fff'; ctx.font = '700 10px system-ui'; ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 3;
      ctx.fillText(member.name.split(' ').at(-1), position.x, position.y - 34); ctx.shadowBlur = 0;
      drawBar(position.x - 21, position.y - 29, 42, member.hp / member.maxHp, member.hp / member.maxHp > .35 ? '#63cc7b' : '#ed6c55');
      const character = characterById(member.id);
      drawBar(position.x - 21, position.y - 21, 42, character.stamina / character.maxStamina, '#56b8e7');
    }

    function drawCompanions() {
      // No porto, a leitura fica focada no capitão e nos NPCs. A tripulação se
      // reúne visualmente apenas quando uma expedição começa em uma ilha.
      if (!activeIsland) return;
      const target = activeIsland ? currentTarget() : null;
      companions.filter((member) => member.hp > 0 && !member.downUntil).forEach((member, index) => drawCompanion(member, index, target));
    }

    function spawnEnemies(island) {
      const symbols = island.terrain === 'mangrove' ? ['🦀', '🐍'] : island.terrain === 'storm' ? ['⚡', '☄'] : ['☠', '⚔'];
      enemies = Array.from({ length: island.enemies }, (_, index) => ({
        id: `${island.id}-${index}`, name: island.enemy, icon: symbols[index % symbols.length], spawnX: 500 + (index % 3) * 120, spawnY: 145 + Math.floor(index / 3) * 120,
        x: 500 + (index % 3) * 120, y: 145 + Math.floor(index / 3) * 120, radius: 17, level: island.levelMin || 1,
        hp: enemyMaxHp(island, index), maxHp: enemyMaxHp(island, index),
        speed: (62 + index * 4) * (hasPassive('control') ? .9 : 1), range: 34, damage: enemyDamage(island, index), color: island.color, cooldown: 0,
        xpReward: 12 + (island.levelMin || 1) * 3 + index * 2, berryReward: 7 + (island.levelMin || 1) * 2 + index, essence: island.essence || essenceCycle[0], essenceDropChance: essenceDropChance(island.levelMin || 1), respawnAt: 0,
      }));
    }

    function updateCompanions(delta, target, now) {
      companions.forEach((member, index) => {
        if (member.downUntil) return;
        const destination = companionDestination(index, target);
        const dx = destination.x - member.x; const dy = destination.y - member.y; const distanceToDestination = Math.hypot(dx, dy);
        if (distanceToDestination > 3) { member.x += dx / distanceToDestination * Math.min(member.speed * delta, distanceToDestination); member.y += dy / distanceToDestination * Math.min(member.speed * delta, distanceToDestination); }
      });
    }

    function reviveEnemies(now) {
      enemies.forEach((enemy) => {
        if (enemy.respawnAt && now >= enemy.respawnAt) {
          enemy.respawnAt = 0; enemy.hp = enemy.maxHp; enemy.x = enemy.spawnX; enemy.y = enemy.spawnY; enemy.cooldown = 0;
          showToast(`${enemy.name} reapareceu.`);
        }
      });
    }

    function enterIsland(id) {
      const nextIsland = worldIslands.find((island) => island.id === id) || islands.find((island) => island.id === id);
      if (!nextIsland) return;
      activeIsland = nextIsland;
      if (byId('islands-modal').open) byId('islands-modal').close();
      partyWiped = false; partyReviveAt = 0; playerDownUntil = 0; setDeathOverlay(false); player.x = 155; player.y = 352; player.hp = player.maxHp;
      activePowerEffects = []; combatEvents = []; crew().forEach((member) => { member.stamina = member.maxStamina; member.skillReadyAt = [0, 0, 0]; });
      resetCompanions(); spawnEnemies(activeIsland); setDialogue(null, true); setView('jogo');
      byId('scene-kicker').textContent = 'Ilha hostil'; byId('game-title').textContent = activeIsland.name;
      byId('combat-state').textContent = 'Inimigos surgiram'; byId('quest-title').textContent = `Limpar ${activeIsland.name}`;
      byId('quest-copy').textContent = 'A formação mantém foco coletivo: todos atacam o mesmo alvo até ele ser derrotado.';
      byId('quest-progress').style.width = '35%'; setHubLocation(activeIsland.name); updatePlayerHud();
      showToast(`${activeIsland.name}: ${enemies.length} inimigos surgiram.`);
    }

    function returnToPort() {
      activeIsland = null; enemies = []; activePowerEffects = []; combatEvents = []; partyWiped = false; partyReviveAt = 0; playerDownUntil = 0; setDeathOverlay(false); player.x = 220; player.y = 332; player.hp = player.maxHp; crew().forEach((member) => { member.stamina = member.maxStamina; }); resetCompanions(); updatePlayerHud();
      byId('scene-kicker').textContent = 'Porto Seguro'; byId('game-title').textContent = 'Cais da Aurora'; byId('combat-state').textContent = 'Explore e fale com os NPCs';
      byId('quest-title').textContent = 'Preparar a expedição'; byId('quest-copy').textContent = 'Fale com Nami no cais ou abra o mapa para navegar até uma ilha.'; byId('quest-progress').style.width = '20%';
      setHubLocation('Cais da Aurora');
    }

    function updateGame(delta, now) {
      animationTime += delta * 1000;
      if (updateWipeState()) { renderPartyHud(now); return; }
      recoverStamina(delta);
      if (now - lastHudUpdate > 120) { updatePlayerHud(); lastHudUpdate = now; }
      const movement = { x: 0, y: 0 };
      if (keys.has('w') || keys.has('arrowup')) movement.y -= 1;
      if (keys.has('s') || keys.has('arrowdown')) movement.y += 1;
      if (keys.has('a') || keys.has('arrowleft')) movement.x -= 1;
      if (keys.has('d') || keys.has('arrowright')) movement.x += 1;
      const manualMove = movement.x || movement.y;
      if (manualMove) { const length = Math.hypot(movement.x, movement.y); player.x += movement.x / length * player.speed * delta; player.y += movement.y / length * player.speed * delta; updateDirection(player, movement.x, movement.y); }

      if (activeIsland) {
        reviveEnemies(now);
        applyPassiveRegeneration(now);
        const alive = enemies.filter((enemy) => enemy.hp > 0 && !enemy.respawnAt);
        const target = currentTarget();
        updateCompanions(delta, target, now);
        if (target && autoCombat && !manualMove) {
          const dx = target.x - player.x; const dy = target.y - player.y; const dist = Math.hypot(dx, dy); const attackRange = 48;
          if (dist > attackRange) { player.x += dx / dist * player.speed * delta; player.y += dy / dist * player.speed * delta; updateDirection(player, dx, dy); byId('combat-state').textContent = `Aproximando de ${target.name}`; }
          else if (now - lastAttack > (hasPassive('tempo') ? 620 : 720)) {
            const captain = crew().find((member) => member.id === 'luffy') || characters.find((member) => member.id === 'luffy');
            const fightingCrew = [...(playerDownUntil ? [] : [captain]), ...companions.filter((member) => member.hp > 0 && !member.downUntil && distance(member, target) < 76)];
            const fighters = fightingCrew.length;
            const combatActions = fightingCrew.map((member) => ({ member, ...useCombatSkill(member, now) }));
            let multiplier = 1;
            if (hasPassive('captain')) multiplier *= 1.08;
            if (hasPassive('execution') && target.hp / target.maxHp < .4) multiplier *= 1.15;
            const critical = hasPassive('critical') && Math.random() < .12;
            if (critical) multiplier *= 1.75;
            const resolvedActions = combatActions.map((action) => ({ ...action, damage: Math.ceil(action.damage * multiplier) }));
            const damage = resolvedActions.reduce((sum, action) => sum + action.damage, Math.max(0, fighters - 1) * 2);
            target.hp -= damage; lastAttack = now;
            resolvedActions.forEach((action) => {
              const label = action.skill ? action.skill.name : 'Golpe básico';
              const color = outfitTints[action.member.color] || '#ffffff';
              logCombatEvent({ type: critical ? 'critical' : 'damage', target, text: `${action.member.name.split(' ').at(-1)} · ${label} -${action.damage}`, color });
            });
            const skillFighters = resolvedActions.filter((action) => action.skill).map((action) => action.member);
            triggerPowerEffects(skillFighters, target, now); triggerCombatMotion(skillFighters, target, now);
            if (hasPassive('cook')) healMostWounded(4, characterById('sanji'));
            const skillNames = combatActions.filter((action) => action.skill).map((action) => action.skill.name).slice(0, 2).join(' · ');
            byId('combat-state').textContent = `${fighters} tripulantes focam ${target.name} · -${damage} PV${skillNames ? ` · ${skillNames}` : ''}${critical ? ' · CRÍTICO!' : ''}`;
            if (target.hp <= 0) { target.hp = 0; target.respawnAt = now + 4500; rewardKill(target); }
          }
        }
        alive.forEach((enemy) => {
          const victims = livingUnits();
          const victim = victims.sort((a, b) => distance(a, enemy) - distance(b, enemy))[0];
          if (!victim) return;
          const dist = distance(victim, enemy);
          if (dist > enemy.range + victim.radius && dist < 210) { enemy.x += (victim.x - enemy.x) / dist * enemy.speed * delta; enemy.y += (victim.y - enemy.y) / dist * enemy.speed * delta; }
          else if (dist <= enemy.range + victim.radius && now - enemy.cooldown > 1650) {
            enemy.cooldown = now;
            if (hasPassive('evasion') && Math.random() < .12) { byId('combat-state').textContent = 'Mirage Tempo evitou o ataque inimigo!'; logCombatEvent({ type: 'evasion', target: victim, text: 'ESQUIVOU!', color: '#b77cf5' }); return; }
            let incomingDamage = enemy.damage;
            const defended = hasPassive('armor') || hasPassive('tideguard');
            if (hasPassive('armor')) incomingDamage *= .9;
            if (hasPassive('tideguard')) incomingDamage *= .92;
            const defender = characterById(victim.id);
            incomingDamage /= 1 + characterDefense(defender) * .035;
            incomingDamage = Math.max(1, Math.round(incomingDamage));
            if (defended) logCombatEvent({ type: 'defense', target: victim, text: `🛡 Defesa · -${incomingDamage}`, color: '#8ac7e8' });
            else logCombatEvent({ type: 'damage', target: victim, text: `${enemy.name} · -${incomingDamage}`, color: '#ff8c7a' });
            if (victim.isPlayer) {
              player.hp = Math.max(0, player.hp - incomingDamage); updatePlayerHud();
              if (player.hp <= 0) { playerDownUntil = 1; showToast('Você caiu. A tripulação ainda pode lutar.'); }
            } else {
              victim.hp = Math.max(0, victim.hp - incomingDamage);
              if (victim.hp <= 0) { victim.downUntil = 1; showToast(`${victim.name} caiu e ficou fora do combate.`); }
            }
            if (everyoneDown()) triggerPartyWipe();
          }
        });
        if (!alive.length) byId('combat-state').textContent = 'Área limpa. Inimigos reaparecerão em instantes.';
      }
      const world = worldSize(); const margin = 28;
      player.x = clamp(player.x, margin, world.width - margin); player.y = clamp(player.y, margin, world.height - margin);
    }

    function gameLoop(now) { const delta = Math.min((now - lastFrame) / 1000, .035); lastFrame = now; updateGame(delta, now); requestAnimationFrame(gameLoop); }

    function characterCard(character) {
      const chosen = selected.has(character.id);
      const owned = recruitedCharacterIds.has(character.id);
      const job = getCrewJob(character.jobId);
      const rank = skillRank(character);
      const skillTags = character.skills.map((skill, index) => {
        if (skill.kind === 'passive') return `<i class="is-passive" title="${skill.description}">◈ ${skill.name}</i>`;
        const cooldown = (skill.cooldown / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
        return `<i title="${skill.description} · Nv. ${rank} · ${skill.staminaCost} EST · recarga ${cooldown}s">${index + 1} ${skill.name} · Nv.${rank}</i>`;
      }).join('');
      const essence = essenceForCharacter(character.id);
      const boostCost = boostUpgradeCost(character);
      const essenceAmount = itemQuantity(inventory, essence.itemId);
      const atMaxBoost = character.boostLevel >= BOOST_MAX_LEVEL;
      const nextBoost = character.boostLevel + 1;
      const portrait = portraitFor(character);
      if (!owned) return `<article class="character-card is-locked" data-character="${character.id}" role="button" tabindex="0" aria-label="${character.name} bloqueado"><span class="portrait portrait-${character.color}" aria-hidden="true">${portrait}</span><span class="character-main"><b>${character.name}</b><small>Bloqueado · encontre este tripulante em baús</small></span><span class="character-power">${character.rarity}</span><span class="tag-row"><i>Recrutamento</i><i>${character.role}</i></span></article>`;
      return `<article class="character-card ${chosen ? 'is-selected' : ''}" data-character="${character.id}" role="button" tabindex="0" aria-pressed="${chosen}"><span class="portrait portrait-${character.color}" aria-hidden="true">${portrait}</span><span class="character-main"><b>${character.name}</b><small>Cargo: ${job.name} · ${job.formationRole} · Nv. ${character.level}/${MAX_CHARACTER_LEVEL}</small></span><span class="character-power">⚔ ${characterAttack(character)}</span><span class="character-stats"><i>PV ${characterMaxHp(character)}</i><i>DEF ${characterDefense(character)}</i><i>EST ${Math.ceil(character.stamina)}/${character.maxStamina}</i></span><span class="tag-row">${character.tags.map((tag) => `<i>${tag}</i>`).join('')}</span><span class="skill-row">${skillTags}</span><span class="essence-evolution"><i>${essence.icon} ${essence.name}</i><b>Boost +${character.boostLevel}/${BOOST_MAX_LEVEL}</b><button class="essence-upgrade" type="button" data-boost-character="${character.id}" ${activeIsland || atMaxBoost ? 'disabled' : ''}>${atMaxBoost ? 'Boost máximo' : `+${nextBoost}: ${essenceAmount}/${boostCost}`}</button></span></article>`;
    }

    function boostCharacter(id) {
      if (activeIsland) return showToast('Boosts são feitos no porto, fora de expedições.');
      const character = characterById(id);
      const essence = essenceForCharacter(id);
      if (character.boostLevel >= BOOST_MAX_LEVEL) return showToast(`${character.name} já alcançou Boost +${BOOST_MAX_LEVEL}.`);
      const cost = boostUpgradeCost(character);
      if (!consumeItem(inventory, essence.itemId, cost)) return showToast(`São necessárias ${cost} ${essence.name} para este Boost.`);
      applyBoost(character);
      if (id === 'luffy') { player.maxHp = characterMaxHp(character); player.hp = player.maxHp; }
      resetCompanions(); updatePlayerHud(); renderCrew();
      showToast(`${character.name} alcançou Boost +${character.boostLevel}!`);
    }

    const crewFocusStat = {
      captain: { label: 'Saúde', icon: '♥', tone: 'health', value: (c) => characterMaxHp(c), max: (c) => characterMaxHp(c) },
      firstMate: { label: 'Força', icon: '⚔', tone: 'force', value: (c) => characterAttack(c), max: (c) => characterAttack(c) + 20 },
      swordsman: { label: 'Força', icon: '⚔', tone: 'force', value: (c) => characterAttack(c), max: (c) => characterAttack(c) + 20 },
      navigator: { label: 'Agilidade', icon: '🌬', tone: 'agility', value: (c) => c.maxStamina, max: (c) => c.maxStamina },
      helmsman: { label: 'Agilidade', icon: '🌬', tone: 'agility', value: (c) => c.maxStamina, max: (c) => c.maxStamina },
      cook: { label: 'Técnica', icon: '♨', tone: 'tech', value: (c) => Math.round(c.power / 8), max: (c) => Math.round(c.power / 8) + 40 },
      doctor: { label: 'Suporte', icon: '✚', tone: 'support', value: (c) => characterMaxHp(c), max: (c) => characterMaxHp(c) },
      sniper: { label: 'Técnica', icon: '◎', tone: 'tech', value: (c) => characterAttack(c), max: (c) => characterAttack(c) + 20 },
      archaeologist: { label: 'Técnica', icon: '✦', tone: 'tech', value: (c) => characterAttack(c), max: (c) => characterAttack(c) + 20 },
      shipwright: { label: 'Força', icon: '⚙', tone: 'force', value: (c) => characterDefense(c) * 4, max: (c) => characterDefense(c) * 4 + 40 },
      musician: { label: 'Suporte', icon: '♫', tone: 'support', value: (c) => c.maxStamina, max: (c) => c.maxStamina },
      lookout: { label: 'Agilidade', icon: '◉', tone: 'agility', value: (c) => c.maxStamina, max: (c) => c.maxStamina },
      gunner: { label: 'Força', icon: '◈', tone: 'force', value: (c) => characterAttack(c), max: (c) => characterAttack(c) + 20 },
      scholar: { label: 'Técnica', icon: '▤', tone: 'tech', value: (c) => characterAttack(c), max: (c) => characterAttack(c) + 20 },
    };

    let crewFocusId = 'luffy';
    let crewSwapOpen = false;
    let crewSummaryOpen = false;
    let upgradeTab = 'boost';

    const skillIconFor = (skill, index) => {
      if (skill.kind === 'passive') return '◈';
      return ['①', '②', '③'][index] || '✦';
    };

    function characterBlurb(character) {
      const job = getCrewJob(character.jobId);
      return `${character.name.split(' ').at(-1)} atua como ${job.name.toLowerCase()} da tripulação. ${job.description}`;
    }

    function focusStatFor(character) {
      return crewFocusStat[character.jobId] || crewFocusStat.captain;
    }

    function renderCrewDetail(character) {
      const panel = byId('crew-detail-panel');
      if (!crewSummaryOpen || !character) {
        panel.hidden = true;
        panel.innerHTML = '';
        return;
      }
      const job = getCrewJob(character.jobId);
      const companion = companions.find((member) => member.id === character.id);
      const hp = character.id === 'luffy' ? Math.ceil(player.hp) : Math.ceil(companion?.hp ?? characterMaxHp(character));
      const maxHp = character.id === 'luffy' ? player.maxHp : (companion?.maxHp ?? characterMaxHp(character));
      const stamina = Math.ceil(character.stamina);
      const skills = character.skills.map((skill, index) => `
        <button class="crew-skill" type="button" data-tip="${skill.description.replace(/"/g, '&quot;')}" title="${skill.description}">
          <span class="crew-skill-icon ${skill.kind === 'passive' ? 'is-passive' : ''}">${skillIconFor(skill, index)}</span>
          <small>${skill.name}</small>
        </button>`).join('');
      const portrait = hubPortraits[character.id]
        ? `<img src="${hubPortraits[character.id]}" alt="">`
        : character.icon;
      panel.hidden = false;
      panel.innerHTML = `
        <div class="crew-summary">
          <div class="crew-summary-main">
            <span class="crew-detail-portrait">${portrait}</span>
            <div>
              <p class="crew-summary-role">${job.name}</p>
              <h2>${character.name}</h2>
              <p class="crew-summary-blurb">${characterBlurb(character)}</p>
              <div class="crew-summary-stats">
                <span><b>PV</b> ${hp}/${maxHp}</span>
                <span><b>EST</b> ${stamina}/${character.maxStamina}</span>
                <span><b>Boost</b> +${character.boostLevel}/${BOOST_MAX_LEVEL}</span>
                <span><b>Nv.</b> ${character.level}/${MAX_CHARACTER_LEVEL}</span>
              </div>
            </div>
          </div>
          <div class="crew-skill-row" aria-label="Habilidades">${skills}</div>
          <p class="crew-skill-hint">Passe o mouse sobre uma habilidade para ver a descrição.</p>
        </div>`;
    }

    function renderCharUpgrade(character) {
      const root = byId('char-upgrade-content');
      if (!character) { root.innerHTML = ''; return; }
      const job = getCrewJob(character.jobId);
      const essence = essenceForCharacter(character.id);
      const boostCost = boostUpgradeCost(character);
      const essenceAmount = itemQuantity(inventory, essence.itemId);
      const atMaxBoost = character.boostLevel >= BOOST_MAX_LEVEL;
      const portrait = hubPortraits[character.id]
        ? `<img src="${hubPortraits[character.id]}" alt="">`
        : `<span>${character.icon}</span>`;
      const tabs = [
        ['boost', 'Boost', false],
        ['equip', 'Equipamento', true],
        ['treino', 'Treino', true],
      ].map(([id, label, locked]) => `<button class="char-tab ${upgradeTab === id ? 'is-active' : ''} ${locked ? 'is-locked' : ''}" type="button" data-upgrade-tab="${id}" ${locked ? 'disabled' : ''}>${label}${locked ? ' · em breve' : ''}</button>`).join('');

      let body = '';
      if (upgradeTab === 'boost') {
        body = `
          <section class="char-boost-panel">
            <p>Use essências para elevar o potencial de combate deste tripulante.</p>
            <div class="char-boost-meter"><span style="width:${(character.boostLevel / BOOST_MAX_LEVEL) * 100}%"></span></div>
            <div class="char-boost-meta">
              <strong>Boost +${character.boostLevel}/${BOOST_MAX_LEVEL}</strong>
              <span>${essence.icon} ${essence.name}: ${essenceAmount}</span>
            </div>
            <button class="char-boost-btn" type="button" data-boost-character="${character.id}" ${activeIsland || atMaxBoost ? 'disabled' : ''}>
              ${atMaxBoost ? 'Boost máximo alcançado' : `Subir para +${character.boostLevel + 1} · custo ${boostCost}`}
            </button>
            <small>Boosts só podem ser feitos no porto, fora de expedições.</small>
          </section>`;
      } else {
        body = `<section class="char-boost-panel is-soon"><p>Esta aba chegará em breve para evoluir ${character.name.split(' ').at(-1)} ainda mais.</p></section>`;
      }

      root.innerHTML = `
        <section class="char-upgrade-shell">
          <header class="char-upgrade-head">
            <span class="crew-detail-portrait">${portrait}</span>
            <div>
              <p>${job.name}</p>
              <h2 id="char-upgrade-title">${character.name}</h2>
              <small>Nv. ${character.level} · PV ${characterMaxHp(character)} · EST ${character.maxStamina} · ⚔ ${characterAttack(character)}</small>
            </div>
            <button class="char-upgrade-close" type="button" data-upgrade-close aria-label="Fechar">×</button>
          </header>
          <nav class="char-tabs" aria-label="Abas de evolução">${tabs}</nav>
          ${body}
        </section>`;
    }

    function openCharUpgrade() {
      const character = characterById(crewFocusId);
      if (!character) return;
      upgradeTab = 'boost';
      renderCharUpgrade(character);
      byId('char-upgrade-modal').showModal();
    }

    function renderCrew() {
      const current = crew();
      if (!current.some((member) => member.id === crewFocusId)) crewFocusId = current[0]?.id || 'luffy';
      const cards = byId('crew-cards');
      cards.innerHTML = Array.from({ length: 5 }, (_, index) => {
        const character = current[index];
        if (!character) {
          return `<button class="crew-card is-empty" type="button" data-crew-swap-open title="Abrir formação"><span class="crew-card-empty">+</span><small>Vaga livre</small></button>`;
        }
        const focus = focusStatFor(character);
        const value = Math.round(focus.value(character));
        const max = Math.max(value, Math.round(focus.max(character)));
        const pct = Math.max(8, Math.min(100, (value / max) * 100));
        const isFocus = character.id === crewFocusId;
        const isCaptain = character.id === 'luffy';
        const portrait = hubPortraits[character.id]
          ? `<img src="${hubPortraits[character.id]}" alt="">`
          : `<span class="portrait-${character.color}">${character.icon}</span>`;
        return `<button class="crew-card tone-${focus.tone} ${isFocus ? 'is-focused' : ''}" type="button" data-crew-focus="${character.id}" aria-pressed="${isFocus}">
          ${isCaptain ? '<span class="crew-captain-badge"><i>♛</i> Capitão</span>' : ''}
          <div class="crew-card-art">${portrait}</div>
          <strong>${character.name}</strong>
          <small>Nv. ${character.level}</small>
          <span class="crew-card-stat"><i>${focus.icon}</i> ${focus.label}</span>
          <div class="crew-card-bar"><i style="width:${pct}%"></i><em>${value} / ${max}</em></div>
        </button>`;
      }).join('');

      byId('roster').innerHTML = characters.map(characterCard).join('');
      byId('crew-counter').textContent = `${current.length} / 5`;
      byId('crew-power').textContent = current.reduce((total, character) => total + character.power, 0).toLocaleString('pt-BR');
      byId('mini-party').innerHTML = current.map((character) => `<span class="mini-member portrait-${character.color}" title="${character.name}">${portraitFor(character)}</span>`).join('');
      byId('crew-slots').innerHTML = '';
      byId('cargo-catalog-list').innerHTML = '';
      byId('crew-roster-panel').hidden = !crewSwapOpen;
      byId('crew-swap-btn').classList.toggle('is-active', crewSwapOpen);
      renderCrewDetail(characterById(crewFocusId));
      if (byId('char-upgrade-modal').open) renderCharUpgrade(characterById(crewFocusId));
    }

    function toggleCharacter(id) {
      if (!recruitedCharacterIds.has(id)) return showToast('Este tripulante ainda não foi recrutado. Abra baús para encontrá-lo.');
      if (id === 'luffy' && selected.has(id)) return showToast('O capitão precisa permanecer na tripulação.');
      if (activeIsland) return showToast('Você não pode alterar a tripulação durante uma expedição.');
      if (selected.has(id)) selected.delete(id);
      else if (selected.size < 5) selected.add(id);
      else return showToast('A tripulação já possui cinco membros.');
      resetCompanions(); renderCrew();
    }

    function renderMap() {
      byId('map-grid').innerHTML = islands.map((island) => `<article class="island-card"><span class="island-icon" style="background:${island.color}">${island.icon}</span><div><p class="eyebrow">${island.enemies} inimigos</p><h2>${island.name}</h2><p>${island.subtitle}</p><span class="island-drop">Drop (${Math.round(essenceDropChance(island.levelMin || 1) * 100)}%): ${island.essence.icon} ${island.essence.name}</span></div><button class="button button-primary" type="button" data-enter-island="${island.id}">Entrar na ilha →</button></article>`).join('');
    }

    function renderIslandModal() {
      const activeCrew = crew();
      const averageLevel = crewAverageLevel(activeCrew);
      byId('island-modal-list').innerHTML = worldIslands.map((island, index) => {
        const available = true;
        const difficulty = islandDifficulty(island, averageLevel);
        return `<article class="modal-island-card ${available ? 'is-available' : 'is-locked'} difficulty-${difficulty.id}"><span class="modal-island-number">${String(index + 1).padStart(2, '0')}</span><span class="modal-island-icon" style="background:${island.color}">${island.icon}</span><h3>${island.name}</h3><p>${island.subtitle}</p><strong class="island-level">Nv. ${island.levelMin}–${island.levelMax}</strong><span class="island-difficulty">${difficulty.label} · média Nv. ${averageLevel.toFixed(1)}</span><span class="island-drop">Drop (${Math.round(essenceDropChance(island.levelMin) * 100)}%): ${island.essence.icon} ${island.essence.name}</span><button class="button ${available ? 'button-primary' : 'button-locked'}" type="button" ${available ? `data-enter-island="${island.id}"` : 'disabled'}>${available ? 'Viajar' : 'Bloqueada'}</button></article>`;
      }).join('');
    }

    const inventoryUi = { filter: 'itens', selectedId: null };

    function refreshInventory() {
      const next = renderInventory(byId('inventory-content'), inventory, itemCatalog, berries, inventoryUi);
      inventoryUi.selectedId = next.selectedId;
      inventoryUi.filter = next.filter;
    }

    function openInventory() {
      refreshInventory();
      byId('inventory-modal').showModal();
      syncHubNav();
    }

    function handleInventoryAction(action, itemId) {
      if (action === 'back') {
        byId('inventory-modal').close();
        syncHubNav();
        return;
      }
      const item = itemCatalog[itemId];
      if (!item || itemQuantity(inventory, itemId) <= 0) return;
      if (action === 'use') {
        if (itemId === 'revivePotion') {
          usePotion();
          refreshInventory();
          return;
        }
        showToast(`${item.name} fica guardado para uso em breve.`);
        return;
      }
      if (action === 'sell') {
        if (item.category === 'Chave' || item.category === 'Essência') {
          showToast(`${item.name} é importante demais para vender.`);
          return;
        }
        const price = sellPriceFor(item);
        if (!consumeItem(inventory, itemId)) return;
        berries += price;
        updatePlayerHud();
        if (inventoryUi.selectedId === itemId && itemQuantity(inventory, itemId) <= 0) inventoryUi.selectedId = null;
        refreshInventory();
        showToast(`Vendeu 1× ${item.name} por ${price} Berries.`);
        return;
      }
      if (action === 'discard') {
        if (item.category === 'Chave') {
          showToast('Chaves não podem ser descartadas.');
          return;
        }
        if (!consumeItem(inventory, itemId)) return;
        if (inventoryUi.selectedId === itemId && itemQuantity(inventory, itemId) <= 0) inventoryUi.selectedId = null;
        refreshInventory();
        showToast(`Descartou 1× ${item.name}.`);
      }
    }

    function renderRecruitmentScreen() {
      renderRecruitment(byId('recruitment-content'), { chests: recruitmentChests, state: recruitmentState, inventory, lastResult: lastRecruitResult });
    }

    function openChest(chestId) {
      const chest = chestCatalog[chestId];
      if (!chest || chest.status !== 'active') return;
      if (!consumeItem(inventory, chest.keyId)) return showToast(`Você precisa de ${chest.keyName}.`);
      lastRecruitResult = rollRecruit(recruitmentState, chest, characters);
      lastRecruitResult.isNew = !recruitedCharacterIds.has(lastRecruitResult.character.id);
      recruitedCharacterIds.add(lastRecruitResult.character.id);
      renderRecruitmentScreen();
      const prefix = lastRecruitResult.guaranteed ? 'MÍTICO GARANTIDO: ' : '';
      showToast(`${prefix}${lastRecruitResult.character.name} — ${lastRecruitResult.rarity.name}!`);
    }

    document.addEventListener('keydown', (event) => {
      const key = event.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) { keys.add(key); event.preventDefault(); }
      if (key === 'e' && view === 'jogo') talk();
      if (key === 'm') setView('mapa');
    });
    document.addEventListener('keyup', (event) => keys.delete(event.key.toLowerCase()));
    document.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-character]')) {
        event.preventDefault();
        toggleCharacter(event.target.dataset.character);
      }
    });
    document.addEventListener('click', (event) => {
      const viewButton = event.target.closest('[data-view]'); if (viewButton) setView(viewButton.dataset.view);
      const boost = event.target.closest('[data-boost-character]'); if (boost) { boostCharacter(boost.dataset.boostCharacter); return; }
      const chest = event.target.closest('[data-open-chest]'); if (chest) { openChest(chest.dataset.openChest); return; }
      const focus = event.target.closest('[data-crew-focus]');
      if (focus) {
        crewFocusId = focus.dataset.crewFocus;
        crewSummaryOpen = true;
        crewSwapOpen = false;
        renderCrew();
        return;
      }
      if (event.target.closest('[data-crew-swap-open]')) {
        crewSwapOpen = true;
        crewSummaryOpen = false;
        renderCrew();
        return;
      }
      const upgradeTabBtn = event.target.closest('[data-upgrade-tab]');
      if (upgradeTabBtn && !upgradeTabBtn.disabled) {
        upgradeTab = upgradeTabBtn.dataset.upgradeTab;
        renderCharUpgrade(characterById(crewFocusId));
        return;
      }
      if (event.target.closest('[data-upgrade-close]')) {
        byId('char-upgrade-modal').close();
        return;
      }
      const character = event.target.closest('#roster [data-character], .crew-roster-panel [data-character]');
      if (character) { toggleCharacter(character.dataset.character); return; }
      const islandButton = event.target.closest('[data-enter-island]'); if (islandButton) enterIsland(islandButton.dataset.enterIsland);
      const action = event.target.closest('[data-npc-action]'); if (action) { setDialogue(null, true); setView(action.dataset.npcAction); }
    });
    byId('crew-details-btn').addEventListener('click', () => {
      crewSwapOpen = false;
      crewSummaryOpen = true;
      renderCrew();
      openCharUpgrade();
    });
    byId('crew-swap-btn').addEventListener('click', () => {
      crewSwapOpen = !crewSwapOpen;
      crewSummaryOpen = false;
      renderCrew();
    });
    byId('crew-roster-close').addEventListener('click', () => {
      crewSwapOpen = false;
      renderCrew();
    });
    byId('char-upgrade-modal').addEventListener('click', (event) => {
      if (event.target === byId('char-upgrade-modal')) byId('char-upgrade-modal').close();
    });
    byId('use-potion').addEventListener('click', usePotion);
    byId('revive-potion').addEventListener('click', usePotion);
    byId('death-return').addEventListener('click', () => { returnToPort(); showToast('A tripulação retornou ao porto para se recuperar.'); });
    byId('dialogue-close').addEventListener('click', () => setDialogue(null, true));
    byId('hub-attack').addEventListener('click', () => {
      if (view !== 'jogo') setView('jogo');
      if (activeIsland) showToast('Combate automático ativo: a tripulação foca o inimigo mais próximo.');
      else talk();
    });
    byId('hub-explore').addEventListener('click', () => byId('islands-modal').showModal());
    byId('hub-inventory').addEventListener('click', openInventory);
    document.querySelectorAll('[data-hub-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.hubAction;
        if (action === 'porto') { returnToPort(); setView('jogo'); showToast('Você voltou ao Cais da Aurora.'); return; }
        if (action === 'explorar') { byId('islands-modal').showModal(); syncHubNav(); return; }
        if (action === 'inventario' || action === 'conta') { openInventory(); syncHubNav(); return; }
      });
    });
    byId('close-islands').addEventListener('click', () => byId('islands-modal').close());
    byId('islands-modal').addEventListener('click', (event) => { if (event.target === byId('islands-modal')) byId('islands-modal').close(); });
    byId('inventory-content').addEventListener('click', (event) => {
      const select = event.target.closest('[data-inv-select]');
      if (select) {
        inventoryUi.selectedId = select.dataset.invSelect;
        refreshInventory();
        return;
      }
      const filter = event.target.closest('[data-inv-filter]');
      if (filter) {
        inventoryUi.filter = filter.dataset.invFilter;
        inventoryUi.selectedId = null;
        refreshInventory();
        return;
      }
      const action = event.target.closest('[data-inv-action]');
      if (action) handleInventoryAction(action.dataset.invAction, action.dataset.item);
    });
    byId('inventory-modal').addEventListener('click', (event) => { if (event.target === byId('inventory-modal')) { byId('inventory-modal').close(); syncHubNav(); } });
    byId('inventory-modal').addEventListener('close', () => syncHubNav());
    window.addEventListener('resize', resizeCanvas);

    setDeathOverlay(false); resetCompanions(); setHubLocation('Cais da Aurora'); updatePlayerHud(); renderMap(); renderIslandModal(); renderCrew(); syncHubNav();
    resizeCanvas(); requestAnimationFrame(drawScene); requestAnimationFrame(gameLoop);

  }
}

export function bootstrapGame(): GameApp {
  const game = new GameApp();
  game.start();
  return game;
}
