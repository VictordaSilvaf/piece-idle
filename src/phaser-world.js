import Phaser from 'phaser';

const ASSET_ROOT = 'assets/Pixel Crawler/Pixel Crawler - Free Pack';
const POWER_ROOT = 'assets/Powers/Super Pixel Effects Gigapack (Free Version)/PNG';

const paths = {
  heroIdle: `${ASSET_ROOT}/Entities/Characters/Body_A/Animations/Idle_Base/Idle_Down-Sheet.png`,
  heroWalk: `${ASSET_ROOT}/Entities/Characters/Body_A/Animations/Walk_Base/Walk_Down-Sheet.png`,
  skeleton: `${ASSET_ROOT}/Entities/Mobs/Skeleton Crew/Skeleton - Base/Idle/Idle-Sheet.png`,
  orc: `${ASSET_ROOT}/Entities/Mobs/Orc Crew/Orc/Idle/Idle-Sheet.png`,
  tree: `${ASSET_ROOT}/Environment/Props/Static/Trees/Model_01/Size_04.png`,
  rocks: `${ASSET_ROOT}/Environment/Props/Static/Rocks.png`,
  vegetation: `${ASSET_ROOT}/Environment/Props/Static/Vegetation.png`,
  bonfire: `${ASSET_ROOT}/Environment/Structures/Stations/Bonfire/Bonfire.png`,
};

const effectConfig = {
  luffy: ['Impacts/directional_impact_001/directional_impact_001_small_blue', 7, 32, 32, 2.2],
  zoro: ['Impacts/symmetrical_impact_001/symmetrical_impact_001_small_yellow', 7, 48, 48, 1.45],
  nami: ['Lightning/lightning_burst_001/lightning_burst_001_small_violet', 8, 32, 32, 2.4],
  usopp: ['Sci-fi/scifi_spark_burst_001/scifi_spark_burst_001_small_yellow', 12, 64, 64, 1.05],
  sanji: ['Fire/fire_looping_003A/fire_looping_003A_small_orange', 5, 40, 64, 1.25],
  chopper: ['Fantasy Spells/spell_heal_001/spell_heal_001_small_red', 16, 64, 64, 1.05],
  robin: ['Magic Bursts/round_light_burst_001/round_light_burst_001_small_yellow', 9, 128, 72, .65],
  franky: ['Sci-fi/scifi_spark_burst_001/scifi_spark_burst_001_small_yellow', 12, 64, 64, 1.15],
  brook: ['Magic Bursts/directional_music_burst_001/directional_music_burst_001_small_red', 21, 64, 64, 1.05],
  jinbe: ['Impacts/directional_impact_001/directional_impact_001_small_blue', 7, 32, 32, 2.4],
};

const terrainColors = { storm: 0x395c68, snow: 0xd4e5e8, desert: 0xcba56a, ruins: 0x6c563f, mangrove: 0x2e711b };
const outfitTints = { coral: 0xe9624f, moss: 0x4e9d5c, sun: 0xe6ad42, gold: 0xb88926, blue: 0x4c79ba, rose: 0xcb6378, violet: 0x8d62b4, cyan: 0x43aeb5, purple: 0x8756a5, aqua: 0x45a5ad };

class GrandLineScene extends Phaser.Scene {
  constructor(stateProvider) {
    super({ key: 'GrandLineScene' });
    this.stateProvider = stateProvider;
    this.entities = new Map();
    this.effectEntities = new Map();
    this.lastTerrainKey = '';
  }

  preload() {
    if (window.location.search.includes('skip-assets-test')) return;
    this.load.spritesheet('hero-idle', paths.heroIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('hero-walk', paths.heroWalk, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('skeleton', paths.skeleton, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('orc', paths.orc, { frameWidth: 32, frameHeight: 32 });
    this.load.image('tree', paths.tree);
    this.load.image('rocks', paths.rocks);
    this.load.image('vegetation', paths.vegetation);
    this.load.image('bonfire', paths.bonfire);

    Object.entries(effectConfig).forEach(([id, [path, frames]]) => {
      for (let frame = 0; frame < frames; frame += 1) this.load.image(`effect-${id}-${frame}`, `${POWER_ROOT}/${path}/frame${String(frame).padStart(4, '0')}.png`);
    });
  }

  create() {
    this.add.text(20, 220, 'Carregando mundo…', { fontFamily: 'monospace', fontSize: '14px', color: '#ffffff' }).setDepth(1000).setName('boot-label');
    this.cameras.main.setRoundPixels(true);
    this.anims.create({ key: 'hero-idle-animation', frames: this.anims.generateFrameNumbers('hero-idle', { start: 0, end: 3 }), frameRate: 5, repeat: -1 });
    this.anims.create({ key: 'hero-walk-animation', frames: this.anims.generateFrameNumbers('hero-walk', { start: 0, end: 5 }), frameRate: 9, repeat: -1 });
    this.anims.create({ key: 'skeleton-idle', frames: this.anims.generateFrameNumbers('skeleton', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'orc-idle', frames: this.anims.generateFrameNumbers('orc', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });

    this.background = this.add.graphics().setDepth(0);
    this.decoration = this.add.container(0, 0).setDepth(1);
    this.entityLayer = this.add.container(0, 0).setDepth(3);
    this.effectsLayer = this.add.container(0, 0).setDepth(5);
    this.areaLabel = this.add.text(18, 18, '', { fontFamily: 'system-ui', fontSize: '13px', fontStyle: 'bold', color: '#ffffff', backgroundColor: '#031a26cc', padding: { x: 12, y: 10 } }).setDepth(7).setVisible(false);
    this.scale.on('resize', () => this.lastTerrainKey = '');
  }

  update(time) {
    try {
      const state = this.stateProvider();
      this.paintTerrain(state);
      this.syncEntities(state);
      this.syncEffects(state, time);
    } catch (error) {
      // Evita uma tela silenciosamente vazia durante desenvolvimento e deixa a
      // mensagem visível caso um novo asset ou estado seja inválido.
      console.error('Grand Line Idle / Phaser:', error);
      if (!this.runtimeError) this.runtimeError = this.add.text(20, 120, `Erro da cena: ${error.message}`, { fontFamily: 'monospace', fontSize: '14px', color: '#ffe2dd', backgroundColor: '#6f2018', padding: { x: 10, y: 8 }, wordWrap: { width: 600 } }).setDepth(1000);
    }
  }

  paintTerrain(state) {
    const width = this.scale.width;
    const height = this.scale.height;
    const terrain = state.activeIsland?.terrain || 'mangrove';
    const terrainKey = `${state.activeIsland?.id || 'port'}-${width}x${height}`;
    if (terrainKey === this.lastTerrainKey) return;
    this.lastTerrainKey = terrainKey;
    this.background.clear();
    this.decoration.removeAll(true);
    this.background.fillStyle(terrainColors[terrain] || terrainColors.mangrove).fillRect(0, 0, width, height);
    this.background.fillStyle(terrain === 'snow' ? 0xffffff : terrain === 'desert' ? 0xf6d38b : 0x8ccf58, terrain === 'snow' ? .24 : .12);
    for (let y = 18; y < height; y += 46) for (let x = 12 + ((y / 46) % 2) * 17; x < width; x += 59) this.background.fillRect(x, y, 7, 3);
    this.background.lineStyle(78, terrain === 'ruins' ? 0xa97845 : 0xbd884f, .86);
    this.background.beginPath(); this.background.moveTo(width * .08, height * .70); this.background.bezierCurveTo(width * .25, height * .56, width * .32, height * .50, width * .48, height * .54); this.background.bezierCurveTo(width * .64, height * .58, width * .74, height * .50, width * .92, height * .61); this.background.strokePath();
    if (!state.activeIsland || terrain === 'storm') this.background.fillStyle(0x2b86a9, .92).fillRect(0, height * .76, width, height * .24);
    if (terrain === 'ruins') this.background.fillStyle(0x694427, .25).fillRect(0, 0, width, height);

    const add = (key, x, y, scale = 1, originX = .5, originY = 1) => this.decoration.add(this.add.image(x, y, key).setScale(scale).setOrigin(originX, originY).setDepth(y));
    for (let x = 10; x < width; x += 110) { add('tree', x, 124, .62); add('tree', x + 43, height + 10, .64); }
    add('tree', width * .12, height * .39, .76); add('tree', width * .88, height * .42, .8); add('tree', width * .72, 140, .72);
    add('rocks', width * .33, height * .45, .48); add('rocks', width * .67, height * .73, .42); add('vegetation', width * .21, height * .70, .55); add('vegetation', width * .76, height * .40, .52);
    if (!state.activeIsland || terrain === 'ruins') add('bonfire', width * .50, height * .50, 1.15);
  }

  makeEntity(id, kind, tint) {
    const root = this.add.container(0, 0);
    const shadow = this.add.ellipse(0, 22, 28, 10, 0x061c29, .35);
    const spriteKey = kind === 'enemy' ? (id.endsWith('1') || id.endsWith('3') ? 'orc' : 'skeleton') : 'hero-idle';
    const sprite = this.add.sprite(0, 0, spriteKey).setOrigin(.5, .62).setScale(kind === 'enemy' ? 1.72 : 2.08);
    if (kind !== 'enemy') sprite.setTint(tint || 0xffffff);
    sprite.play(kind === 'enemy' ? `${spriteKey}-idle` : 'hero-idle-animation');
    const name = this.add.text(0, -40, '', { fontFamily: 'system-ui', fontSize: '10px', fontStyle: 'bold', color: '#ffffff', stroke: '#06131d', strokeThickness: 3 }).setOrigin(.5);
    const hpBack = this.add.rectangle(0, -29, 52, 6, 0x061c29, .82).setOrigin(.5);
    const hp = this.add.rectangle(-25, -29, 50, 4, 0x5ecb76).setOrigin(0, .5);
    const stamina = kind === 'enemy' ? null : this.add.rectangle(-25, -21, 50, 3, 0x56b8e7).setOrigin(0, .5);
    root.add([shadow, sprite, name, hpBack, hp, ...(stamina ? [stamina] : [])]);
    root.setData({ sprite, name, hp, stamina, kind });
    this.entityLayer.add(root); this.entities.set(id, root);
    return root;
  }

  syncEntities(state) {
    const wanted = new Set();
    const playerDead = Boolean(state.playerDownUntil);
    if (!playerDead) {
      wanted.add('player'); this.placeEntity(this.makeOrGet('player', 'player', 0xffffff), state.player, 'Você', state.player.hp / state.player.maxHp, state.captain.stamina / state.captain.maxStamina, state.player.facing, Boolean(state.moving));
    }
    if (!state.activeIsland) state.npcs.forEach((npc) => { wanted.add(`npc-${npc.id}`); this.placeEntity(this.makeOrGet(`npc-${npc.id}`, 'npc', outfitTints[npc.color] || 0xffffff), npc, npc.name, 1, null, 1, false); });
    state.companions.filter((unit) => unit.hp > 0 && !unit.downUntil).forEach((unit) => {
      wanted.add(`crew-${unit.id}`); const character = state.charactersById[unit.id]; this.placeEntity(this.makeOrGet(`crew-${unit.id}`, 'crew', outfitTints[unit.color] || 0xffffff), unit, unit.name.split(' ').at(-1), unit.hp / unit.maxHp, character.stamina / character.maxStamina, state.target ? Math.sign(state.target.x - unit.x) || 1 : state.player.facing, Boolean(state.target));
    });
    state.enemies.filter((enemy) => enemy.hp > 0 && !enemy.respawnAt).forEach((enemy) => { wanted.add(`enemy-${enemy.id}`); this.placeEntity(this.makeOrGet(`enemy-${enemy.id}`, 'enemy'), enemy, `${enemy.name} · Nv. ${enemy.level}`, enemy.hp / enemy.maxHp, null, 1, true); });
    this.entities.forEach((entity, id) => { if (!wanted.has(id)) { entity.destroy(); this.entities.delete(id); } });
    if (state.activeIsland) { this.areaLabel.setText(`${state.activeIsland.name} · ${state.enemies.filter((enemy) => enemy.hp > 0).length} inimigos`).setVisible(true); } else this.areaLabel.setVisible(false);
  }

  makeOrGet(id, kind, tint) { return this.entities.get(id) || this.makeEntity(id, kind, tint); }

  placeEntity(root, entity, label, health, stamina, facing, moving) {
    root.setPosition(entity.x, entity.y).setDepth(entity.y);
    // getData exige uma chave no Phaser 3; sem ela retorna undefined e a
    // atualização da cena parava antes de desenhar os personagens.
    const sprite = root.getData('sprite');
    const name = root.getData('name');
    const hp = root.getData('hp');
    const staminaBar = root.getData('stamina');
    const kind = root.getData('kind');
    name.setText(label); hp.scaleX = Phaser.Math.Clamp(health, 0, 1);
    if (staminaBar) staminaBar.scaleX = Phaser.Math.Clamp(stamina ?? 0, 0, 1);
    sprite.setFlipX(facing < 0);
    const animation = kind === 'enemy' ? sprite.anims.currentAnim?.key : moving ? 'hero-walk-animation' : 'hero-idle-animation';
    if (animation && sprite.anims.currentAnim?.key !== animation) sprite.play(animation);
  }

  syncEffects(state, now) {
    const wanted = new Set();
    state.activePowerEffects.forEach((effect, index) => {
      const [path, frames, width, height, scale] = effectConfig[effect.id] || [];
      if (!path || now < effect.startedAt || now > effect.startedAt + frames * 58) return;
      const key = `${effect.id}-${effect.startedAt}-${index}`; wanted.add(key);
      const frame = Math.min(frames - 1, Math.floor((now - effect.startedAt) / 58));
      let image = this.effectEntities.get(key);
      if (!image) { image = this.add.image(effect.x, effect.y, `effect-${effect.id}-${frame}`).setBlendMode(Phaser.BlendModes.ADD).setDepth(99); this.effectsLayer.add(image); this.effectEntities.set(key, image); }
      image.setTexture(`effect-${effect.id}-${frame}`).setPosition(effect.x, effect.y).setDisplaySize(width * scale, height * scale);
    });
    this.effectEntities.forEach((image, key) => { if (!wanted.has(key)) { image.destroy(); this.effectEntities.delete(key); } });
  }
}

export function createGrandLineWorld(canvas, stateProvider) {
  // Phaser instancia cenas internamente. Passar uma instância aqui deixa o
  // canvas ativo, porém sem executar preload/create/update.
  class WorldScene extends GrandLineScene {
    constructor() { super(stateProvider); }
  }
  // O ScaleManager do Phaser 3 precisa de números na inicialização. Valores
  // percentuais podem resultar em um canvas 0×0 em alguns navegadores.
  const bounds = canvas.getBoundingClientRect();
  const width = Math.max(320, Math.round(bounds.width) || window.innerWidth || 1280);
  const height = Math.max(480, Math.round(bounds.height) || window.innerHeight || 720);
  const game = new Phaser.Game({ type: Phaser.AUTO, canvas, width, height, backgroundColor: '#2e711b', pixelArt: true, antialias: false, roundPixels: true, scene: [], scale: { mode: Phaser.Scale.RESIZE }, render: { pixelArt: true } });
  game.scene.add('GrandLineScene', WorldScene, true);
  return game;
}
