const characters = [
  { id: 'luffy', name: 'Monkey D. Luffy', role: 'Capitão', icon: '☀', level: 18, power: 920, tags: ['Capitão', 'Coragem'], color: 'coral', skills: ['Pistola de Borracha', 'Chicote', 'Bazuca', 'Passiva: Vontade do Capitão'] },
  { id: 'zoro', name: 'Roronoa Zoro', role: 'Espadachim', icon: '⚔', level: 17, power: 890, tags: ['Lâmina', 'Guardião'], color: 'moss', skills: ['Oni Giri', 'Tatsumaki', 'Purgatório', 'Passiva: Três Espadas'] },
  { id: 'nami', name: 'Nami', role: 'Navegadora', icon: '⌁', level: 16, power: 710, tags: ['Navegador', 'Cartógrafo'], color: 'sun', skills: ['Clima-Tact', 'Mirage Tempo', 'Thunderbolt Tempo', 'Passiva: Rota Segura'] },
  { id: 'usopp', name: 'Usopp', role: 'Atirador', icon: '◎', level: 15, power: 680, tags: ['Atirador', 'Caçador'], color: 'gold', skills: ['Tiro Explosivo', 'Estrela Verde', 'Martelo Usopp', 'Passiva: Mira Longa'] },
  { id: 'sanji', name: 'Sanji', role: 'Cozinheiro', icon: '♨', level: 16, power: 760, tags: ['Cozinheiro', 'Chama'], color: 'blue', skills: ['Collier Shot', 'Diable Jambe', 'Concassé', 'Passiva: Cozinha de Batalha'] },
  { id: 'chopper', name: 'Tony Tony Chopper', role: 'Médico', icon: '✚', level: 14, power: 650, tags: ['Médico', 'Suporte'], color: 'rose', skills: ['Heavy Point', 'Guard Point', 'Cura de Emergência', 'Passiva: Diagnóstico'] },
  { id: 'robin', name: 'Nico Robin', role: 'Arqueóloga', icon: '✦', level: 15, power: 720, tags: ['Cartógrafo', 'Relíquia'], color: 'violet', skills: ['Dos Fleur', 'Clutch', 'Gigantesco Mano', 'Passiva: Leitura Poneglyph'] },
  { id: 'franky', name: 'Franky', role: 'Carpinteiro', icon: '⚙', level: 14, power: 700, tags: ['Navio', 'Guardião'], color: 'cyan', skills: ['Strong Right', 'Franky Radical', 'Coup de Vent', 'Passiva: Reparos SUPER'] },
  { id: 'brook', name: 'Brook', role: 'Músico', icon: '♫', level: 13, power: 610, tags: ['Músico', 'Suporte'], color: 'purple', skills: ['Soul Solid', 'Party Music', 'Flecha de Gelo', 'Passiva: Alma Gelada'] },
  { id: 'jinbe', name: 'Jinbe', role: 'Timoneiro', icon: '≋', level: 16, power: 810, tags: ['Navegador', 'Guardião'], color: 'aqua', skills: ['Karatê dos Homens-Peixe', 'Brachial Block', 'Lança d’Água', 'Passiva: Mestre do Mar'] },
];

const islands = [
  { id: 'ruinas', name: 'Ruínas da Enseada', subtitle: 'Fragmentos · risco médio', icon: '⚓', color: '#3b8db6', reward: 120, enemy: 'Saqueador da Névoa', enemies: 5, terrain: 'ruins' },
  { id: 'mangue', name: 'Mangue Esmeralda', subtitle: 'Suprimentos · risco baixo', icon: '🌿', color: '#3e9154', reward: 85, enemy: 'Caranguejo Casco-Duro', enemies: 4, terrain: 'mangrove' },
  { id: 'atol', name: 'Atol do Trovão', subtitle: 'Relíquias · risco alto', icon: '⚡', color: '#8756a5', reward: 210, enemy: 'Guardião do Atol', enemies: 7, terrain: 'storm' },
];

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
  terrain: ['ruins', 'mangrove', 'storm'][index % 3], reward: 90 + index * 12, enemies: 4 + (index % 4), enemy: ['Batedor da Ilha', 'Criatura Selvagem', 'Guardião da Rota'][index % 3],
  levelMin: index * 4 + 1, levelMax: index * 4 + 10,
}));

const selected = new Set(['luffy', 'zoro', 'nami', 'sanji', 'chopper']);
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const assetPaths = {
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
const assets = Object.fromEntries(Object.entries(assetPaths).map(([name, src]) => {
  const image = new Image(); image.src = src; return [name, image];
}));
const keys = new Set();
let view = 'jogo';
let activeIsland = null;
let autoCombat = true;
let lastFrame = 0;
let lastAttack = 0;
let toastTimer;
let dialogueOpen = false;
let berries = 1250;
let supplies = 38;
let animationTime = 0;
const playerLevel = 18;

const player = { x: 220, y: 332, radius: 17, hp: 100, maxHp: 100, speed: 175, facing: 1, isHit: 0 };
let enemies = [];

const npcs = [
  { id: 'nami', name: 'Nami', icon: '⌁', x: 560, y: 278, color: '#e7ad42', dialogue: 'Capitão, o mar está calmo. Abra o mapa e escolha uma ilha para iniciarmos uma expedição.', action: 'mapa', actionLabel: 'Abrir mapa' },
  { id: 'franky', name: 'Franky', icon: '⚙', x: 736, y: 365, color: '#45a5ad', dialogue: 'O navio aguenta mais uma aventura. Quer trocar a formação antes de navegar?', action: 'tripulacao', actionLabel: 'Editar tripulação' },
  { id: 'brook', name: 'Brook', icon: '♫', x: 355, y: 194, color: '#8756a5', dialogue: 'Yohoho! Uma boa equipe luta melhor junta. Veja suas sinergias na formação.', action: 'tripulacao', actionLabel: 'Ver sinergias' },
];

function byId(id) { return document.getElementById(id); }
function crew() { return characters.filter((character) => selected.has(character.id)); }
function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

function setView(nextView) {
  view = nextView;
  document.querySelectorAll('[data-view-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.viewPanel === nextView));
  document.querySelectorAll('.nav-link').forEach((button) => button.classList.toggle('is-active', button.dataset.view === nextView));
  if (nextView === 'jogo') requestAnimationFrame(() => resizeCanvas());
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
  if (ready(image)) ctx.drawImage(image, sx, sy, sw, sh, Math.round(dx), Math.round(dy), dw, dh);
}

function drawTileGround(width, height) {
  ctx.fillStyle = activeIsland?.terrain === 'storm' ? '#776a99' : activeIsland?.terrain === 'ruins' ? '#ccaa68' : '#69b875';
  ctx.fillRect(0, 0, width, height);
  if (!ready(assets.tiles)) return;
  for (let y = 0; y < height; y += 32) for (let x = 0; x < width; x += 32) drawSprite(assets.tiles, 32, 0, 32, 32, x, y);
}

function drawFarmObject(image, sx, sy, sw, sh, x, y, scale = 2) {
  drawSprite(image, sx, sy, sw, sh, x, y, sw * scale, sh * scale);
}

function drawBackground(width, height) {
  drawTileGround(width, height);
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  if (!activeIsland) {
    ctx.fillStyle = 'rgba(92, 188, 205, .25)'; ctx.fillRect(0, 0, width, height * .28);
    ctx.fillStyle = 'rgba(32, 121, 158, .28)'; ctx.fillRect(0, height * .73, width, height * .27);
    for (let x = 70; x < width; x += 165) drawFarmObject(assets.tree, 96, 0, 32, 48, x, 40 + (x % 3) * 10, 2);
    drawFarmObject(assets.house, 0, 0, 112, 112, width - 250, 38, 1);
    drawFarmObject(assets.road, 0, 0, 80, 64, width * .3, height * .54, 2);
    drawFarmObject(assets.crops, 0, 0, 96, 64, width - 280, height - 150, 1);
    drawFarmObject(assets.fence, 0, 0, 48, 48, width - 350, height - 86, 1.5);
    drawFarmObject(assets.chest, 0, 0, 32, 32, width * .42, height * .64, 1.2);
    drawFarmObject(assets.chicken, 0, 0, 32, 32, width * .2, height * .57, 1.2);
    drawFarmObject(assets.cow, 0, 0, 32, 32, width * .75, height * .54, 1.3);
  } else {
    const tint = activeIsland.terrain === 'storm' ? 'rgba(63, 42, 103, .34)' : activeIsland.terrain === 'ruins' ? 'rgba(189, 125, 58, .22)' : 'rgba(43, 120, 80, .2)';
    ctx.fillStyle = tint; ctx.fillRect(0, 0, width, height);
    for (let x = 20; x < width; x += 145) drawFarmObject(assets.tree, 64, 0, 32, 48, x, 25 + (x % 4) * 9, 1.7);
    for (let x = 90; x < width; x += 180) drawFarmObject(assets.road, 0, 0, 80, 64, x, height * .61, 1.25);
    drawFarmObject(assets.chest, 0, 0, 32, 32, width * .75, height * .22, 1.2);
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

function drawScene(timestamp) {
  const width = canvas.clientWidth; const height = canvas.clientHeight;
  if (!width || !height) return;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, width, height); drawBackground(width, height);
  if (!activeIsland) npcs.forEach((npc) => drawEntity({ ...npc, radius: 17 }, npc.color, npc.icon, npc.name));
  enemies.filter((enemy) => enemy.hp > 0).forEach((enemy) => drawEntity(enemy, enemy.color, enemy.icon, enemy.name, enemy.hp / enemy.maxHp));
  drawPlayer();
  drawCompanions();
  if (activeIsland) {
    ctx.fillStyle = 'rgba(3, 26, 38, .78)'; ctx.fillRect(16, 16, 250, 42);
    ctx.fillStyle = '#fff'; ctx.font = '700 13px system-ui'; ctx.fillText(`${activeIsland.name} · ${enemies.filter((e) => e.hp > 0).length} inimigos`, 30, 42);
  }
  requestAnimationFrame(drawScene);
}

function drawPlayer() {
  const moving = keys.size > 0 || (activeIsland && autoCombat && enemies.some((enemy) => enemy.hp > 0));
  const image = moving ? assets.walk : assets.idle;
  const frames = moving ? 6 : 4;
  const frame = Math.floor(animationTime / (moving ? 110 : 210)) % frames;
  const row = player.facing < 0 ? 1 : 0;
  const size = 56;
  if (ready(image)) {
    ctx.save();
    ctx.translate(player.x, player.y);
    if (player.facing < 0) ctx.scale(-1, 1);
    drawSprite(image, frame * 32, row * 32, 32, 32, -size / 2, -size / 2, size, size);
    ctx.restore();
    ctx.fillStyle = '#fff'; ctx.font = '600 12px system-ui'; ctx.textAlign = 'center'; ctx.fillText('Você', player.x, player.y - 36);
    drawBar(player.x - 25, player.y - 31, 50, player.hp / player.maxHp, '#5ecb76');
    return;
  }
  drawEntity(player, '#e9624f', '★', 'Você', player.hp / player.maxHp);
}

const outfitTints = { coral: '#e9624f', moss: '#4e9d5c', sun: '#e6ad42', gold: '#b88926', blue: '#4c79ba', rose: '#cb6378', violet: '#8d62b4', cyan: '#43aeb5', purple: '#8756a5', aqua: '#45a5ad' };

function currentTarget() {
  return enemies.filter((enemy) => enemy.hp > 0).sort((a, b) => distance(player, a) - distance(player, b))[0];
}

function companionPosition(index, target) {
  const offsets = [[-52, 29], [-62, -16], [48, 30], [60, -13]];
  if (target && distance(player, target) <= 104) {
    const angle = [-2.3, -0.9, 0.75, 2.15][index];
    return { x: target.x + Math.cos(angle) * 58, y: target.y + Math.sin(angle) * 44 };
  }
  const [x, y] = offsets[index] || [0, 42];
  return { x: player.x + x, y: player.y + y };
}

function drawCompanion(member, index, target) {
  const position = companionPosition(index, target);
  const moving = Boolean(activeIsland && target);
  const image = moving ? assets.walk : assets.idle;
  const frames = moving ? 6 : 4;
  const frame = Math.floor(animationTime / (moving ? 115 : 220)) % frames;
  const facing = target ? Math.sign(target.x - position.x) || 1 : player.facing;
  const size = 47;
  if (!ready(image)) return drawEntity({ ...position, radius: 14 }, outfitTints[member.color], member.icon, member.name.split(' ').at(-1));
  ctx.save();
  ctx.translate(position.x, position.y);
  if (facing < 0) ctx.scale(-1, 1);
  drawSprite(image, frame * 32, 0, 32, 32, -size / 2, -size / 2, size, size);
  ctx.globalCompositeOperation = 'source-atop';
  ctx.globalAlpha = .45;
  ctx.fillStyle = outfitTints[member.color];
  ctx.fillRect(-size / 2, -size / 2, size, size);
  ctx.restore();
  ctx.fillStyle = '#fff'; ctx.font = '700 10px system-ui'; ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 3;
  ctx.fillText(member.name.split(' ').at(-1), position.x, position.y - 31); ctx.shadowBlur = 0;
}

function drawCompanions() {
  const target = activeIsland ? currentTarget() : null;
  crew().filter((member) => member.id !== 'luffy').slice(0, 4).forEach((member, index) => drawCompanion(member, index, target));
}

function spawnEnemies(island) {
  const symbols = island.terrain === 'mangrove' ? ['🦀', '🐍'] : island.terrain === 'storm' ? ['⚡', '☄'] : ['☠', '⚔'];
  enemies = Array.from({ length: island.enemies }, (_, index) => ({
    id: `${island.id}-${index}`, name: island.enemy, icon: symbols[index % symbols.length], x: 500 + (index % 3) * 120, y: 145 + Math.floor(index / 3) * 120, radius: 17, hp: island.terrain === 'storm' ? 110 : 72, maxHp: island.terrain === 'storm' ? 110 : 72, speed: 62 + index * 4, range: 34, damage: island.terrain === 'storm' ? 9 : 6, color: island.color, cooldown: 0,
  }));
}

function enterIsland(id) {
  const nextIsland = worldIslands.find((island) => island.id === id) || islands.find((island) => island.id === id);
  if (!nextIsland) return;
  if (nextIsland.levelMin && (playerLevel < nextIsland.levelMin || playerLevel > nextIsland.levelMax)) {
    showToast(`${nextIsland.name} requer nível ${nextIsland.levelMin}–${nextIsland.levelMax}.`);
    return;
  }
  activeIsland = nextIsland;
  if (byId('islands-modal').open) byId('islands-modal').close();
  player.x = 155; player.y = 352; player.hp = player.maxHp;
  spawnEnemies(activeIsland); setDialogue(null, true); setView('jogo');
  byId('scene-kicker').textContent = 'Ilha hostil'; byId('game-title').textContent = activeIsland.name;
  byId('combat-state').textContent = 'Inimigos surgiram'; byId('quest-title').textContent = `Limpar ${activeIsland.name}`;
  byId('quest-copy').textContent = 'A formação mantém foco coletivo: todos atacam o mesmo alvo até ele ser derrotado.';
  byId('quest-progress').style.width = '35%'; showToast(`${activeIsland.name}: ${enemies.length} inimigos surgiram.`);
}

function returnToPort() {
  activeIsland = null; enemies = []; player.x = 220; player.y = 332; player.hp = player.maxHp;
  byId('scene-kicker').textContent = 'Porto Seguro'; byId('game-title').textContent = 'Cais da Aurora'; byId('combat-state').textContent = 'Explore e fale com os NPCs';
  byId('quest-title').textContent = 'Preparar a expedição'; byId('quest-copy').textContent = 'Fale com Nami no cais ou abra o mapa para navegar até uma ilha.'; byId('quest-progress').style.width = '20%';
}

function updateGame(delta, now) {
  animationTime += delta * 1000;
  const movement = { x: 0, y: 0 };
  if (keys.has('w') || keys.has('arrowup')) movement.y -= 1;
  if (keys.has('s') || keys.has('arrowdown')) movement.y += 1;
  if (keys.has('a') || keys.has('arrowleft')) movement.x -= 1;
  if (keys.has('d') || keys.has('arrowright')) movement.x += 1;
  const manualMove = movement.x || movement.y;
  if (manualMove) { const length = Math.hypot(movement.x, movement.y); player.x += movement.x / length * player.speed * delta; player.y += movement.y / length * player.speed * delta; player.facing = movement.x || player.facing; }

  if (activeIsland) {
    const alive = enemies.filter((enemy) => enemy.hp > 0);
    const target = currentTarget();
    if (target && autoCombat && !manualMove) {
      const dx = target.x - player.x; const dy = target.y - player.y; const dist = Math.hypot(dx, dy); const attackRange = 48;
      if (dist > attackRange) { player.x += dx / dist * player.speed * delta; player.y += dy / dist * player.speed * delta; player.facing = Math.sign(dx) || player.facing; byId('combat-state').textContent = `Aproximando de ${target.name}`; }
      else if (now - lastAttack > 720) {
        const party = crew();
        const damage = party.reduce((sum, member) => sum + 3 + Math.floor(member.power / 550), 0) + Math.max(0, party.length - 1) * 2;
        target.hp -= damage; lastAttack = now;
        byId('combat-state').textContent = `${party.length} tripulantes focam ${target.name} · -${damage} PV`;
        if (target.hp <= 0) showToast(`${target.name} derrotado pela tripulação!`);
      }
    }
    alive.forEach((enemy) => {
      const dist = distance(player, enemy);
      if (dist > enemy.range + player.radius && dist < 180) { enemy.x += (player.x - enemy.x) / dist * enemy.speed * delta; enemy.y += (player.y - enemy.y) / dist * enemy.speed * delta; }
      else if (dist <= enemy.range + player.radius && now - enemy.cooldown > 1200) { player.hp = Math.max(0, player.hp - enemy.damage); enemy.cooldown = now; if (player.hp <= 0) { showToast('Você foi derrotado e voltou ao porto.'); returnToPort(); } }
    });
    if (!alive.length) { berries += activeIsland.reward; supplies += 3; byId('berries').textContent = berries.toLocaleString('pt-BR'); byId('supplies').textContent = supplies; showToast(`Ilha conquistada! +${activeIsland.reward} Berries e +3 suprimentos.`); returnToPort(); }
  }
  const margin = 28; player.x = clamp(player.x, margin, canvas.clientWidth - margin); player.y = clamp(player.y, margin, canvas.clientHeight - margin);
}

function gameLoop(now) { const delta = Math.min((now - lastFrame) / 1000, .035); lastFrame = now; updateGame(delta, now); requestAnimationFrame(gameLoop); }

function characterCard(character) {
  const chosen = selected.has(character.id);
  return `<button class="character-card ${chosen ? 'is-selected' : ''}" type="button" data-character="${character.id}" aria-pressed="${chosen}"><span class="portrait portrait-${character.color}" aria-hidden="true">${character.icon}</span><span class="character-main"><b>${character.name}</b><small>${character.role} · Nv. ${character.level}</small></span><span class="character-power">${character.power}</span><span class="tag-row">${character.tags.map((tag) => `<i>${tag}</i>`).join('')}</span><span class="skill-row">${character.skills.map((skill, index) => `<i class="${index === 3 ? 'is-passive' : ''}">${index === 3 ? '◈' : index + 1} ${skill}</i>`).join('')}</span></button>`;
}

function renderCrew() {
  const current = crew();
  byId('crew-slots').innerHTML = Array.from({ length: 5 }, (_, index) => { const character = current[index]; return character ? `<button class="crew-slot portrait-${character.color}" type="button" data-character="${character.id}" title="Remover ${character.name}"><span>${character.icon}</span><small>${character.name.split(' ').at(-1)}</small></button>` : '<div class="crew-slot is-empty"><span>+</span><small>Vaga livre</small></div>'; }).join('');
  byId('roster').innerHTML = characters.map(characterCard).join('');
  byId('crew-counter').textContent = `${current.length} / 5`;
  byId('crew-power').textContent = current.reduce((total, character) => total + character.power, 0).toLocaleString('pt-BR');
  byId('mini-party').innerHTML = current.map((character) => `<span class="mini-member portrait-${character.color}" title="${character.name}">${character.icon}</span>`).join('');
}

function toggleCharacter(id) {
  if (activeIsland) return showToast('Você não pode alterar a tripulação durante uma expedição.');
  if (selected.has(id)) selected.delete(id);
  else if (selected.size < 5) selected.add(id);
  else return showToast('A tripulação já possui cinco membros.');
  renderCrew();
}

function renderMap() {
  byId('map-grid').innerHTML = islands.map((island) => `<article class="island-card"><span class="island-icon" style="background:${island.color}">${island.icon}</span><div><p class="eyebrow">${island.enemies} inimigos</p><h2>${island.name}</h2><p>${island.subtitle}</p></div><button class="button button-primary" type="button" data-enter-island="${island.id}">Entrar na ilha →</button></article>`).join('');
}

function renderIslandModal() {
  byId('island-modal-list').innerHTML = worldIslands.map((island, index) => {
    const available = playerLevel >= island.levelMin && playerLevel <= island.levelMax;
    return `<article class="modal-island-card ${available ? 'is-available' : 'is-locked'}"><span class="modal-island-number">${String(index + 1).padStart(2, '0')}</span><span class="modal-island-icon" style="background:${island.color}">${island.icon}</span><h3>${island.name}</h3><p>${island.subtitle}</p><strong class="island-level">Nv. ${island.levelMin}–${island.levelMax}</strong><button class="button ${available ? 'button-primary' : 'button-locked'}" type="button" ${available ? `data-enter-island="${island.id}"` : 'disabled'}>${available ? 'Viajar' : 'Bloqueada'}</button></article>`;
  }).join('');
}

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) { keys.add(key); event.preventDefault(); }
  if (key === 'e' && view === 'jogo') talk();
  if (key === 'm') setView('mapa');
});
document.addEventListener('keyup', (event) => keys.delete(event.key.toLowerCase()));
document.addEventListener('click', (event) => {
  const viewButton = event.target.closest('[data-view]'); if (viewButton) setView(viewButton.dataset.view);
  const character = event.target.closest('[data-character]'); if (character) toggleCharacter(character.dataset.character);
  const islandButton = event.target.closest('[data-enter-island]'); if (islandButton) enterIsland(islandButton.dataset.enterIsland);
  const action = event.target.closest('[data-npc-action]'); if (action) { setDialogue(null, true); setView(action.dataset.npcAction); }
});
byId('talk-shortcut').addEventListener('click', talk);
byId('dialogue-close').addEventListener('click', () => setDialogue(null, true));
document.querySelector('[data-spawn]').addEventListener('click', () => { returnToPort(); setView('jogo'); showToast('Você voltou ao Cais da Aurora.'); });
byId('exit-game').addEventListener('click', () => { returnToPort(); setDialogue(null, true); showToast('Sessão local encerrada. Você pode recomeçar pelo Spawn.'); });
byId('open-islands').addEventListener('click', () => byId('islands-modal').showModal());
byId('close-islands').addEventListener('click', () => byId('islands-modal').close());
byId('islands-modal').addEventListener('click', (event) => { if (event.target === byId('islands-modal')) byId('islands-modal').close(); });
window.addEventListener('resize', resizeCanvas);

renderMap(); renderIslandModal(); renderCrew(); resizeCanvas(); requestAnimationFrame(drawScene); requestAnimationFrame(gameLoop);
