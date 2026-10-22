# Arquitetura — Grand Line Idle

## Decisão

O jogo seguirá uma arquitetura modular em JavaScript ES Modules, separando regras de jogo da renderização. Assim, o Canvas atual pode ser substituído por Phaser sem reescrever combate, progressão ou interface.

```text
src/
├── app/                 # composição e ciclo de vida da aplicação
│   ├── bootstrap.js      # inicialização e injeção de dependências
│   └── game-loop.js      # loop e atualização temporal
├── core/                # primitivas sem dependência de interface
│   ├── store.js          # estado único e eventos
│   ├── math.js           # distância, clamp e vetores
│   └── clock.js          # tempo, cooldown e agendamentos
├── data/                # conteúdo declarativo, sem lógica visual
│   ├── characters.js     # personagens, atributos e habilidades
│   ├── islands.js        # ilhas, faixas e recompensas
│   ├── enemies.js        # fórmulas e famílias de inimigos
│   └── assets.js         # caminhos e metadados de assets
├── domain/              # regras de negócio puras
│   ├── crew.js           # formação, média de nível e sinergias
│   ├── progression.js    # XP, nível, berries e escalonamento
│   └── combat.js         # dano, stamina, cooldown, morte e revive
├── systems/             # sistemas atualizados a cada quadro
│   ├── movement-system.js
│   ├── target-system.js
│   ├── enemy-system.js
│   └── reward-system.js
├── world/               # entidades e mapas da sessão atual
│   ├── world-state.js
│   ├── entity-factory.js
│   └── camera.js
├── renderers/           # adaptadores visuais intercambiáveis
│   ├── canvas-renderer.js
│   └── phaser-renderer.js
└── ui/                  # componentes DOM sem regra de combate
    ├── hud.js
    ├── islands-modal.js
    ├── crew-panel.js
    ├── notifications.js
    └── death-overlay.js
```

## Regras de dependência

- `data` e `core` não importam DOM, Canvas nem Phaser.
- `domain` só depende de `core` e `data`.
- `systems` dependem de `domain` e do estado do mundo; não manipulam HTML.
- `ui` apenas apresenta estado e dispara intenções (`viajar`, `usarPoção`, `alterarFormação`).
- `renderers` desenham uma leitura do estado; nunca calculam dano, XP ou cooldown.
- `app/bootstrap` é o único ponto que conecta UI, input, sistemas e renderizador.

## Componentes de jogo

Cada entidade terá componentes de dados simples, em vez de objetos com responsabilidades misturadas:

```js
{
  identity: { id: 'luffy', name: 'Monkey D. Luffy' },
  transform: { x: 220, y: 332, direction: 'down' },
  stats: { level: 18, hp: 176, maxHp: 176, stamina: 100 },
  combat: { targetId: null, cooldowns: [0, 0, 0] },
  visual: { sprite: 'hero', outfit: 'coral', animation: 'idle' }
}
```

## Contratos principais

- `enterIsland(islandId)` cria a sessão de mundo e nunca decide a interface.
- `updateWorld(delta, now)` roda movimentação, alvo, combate, revive e respawn.
- `getIslandDifficulty(island, crew)` devolve `easy`, `medium` ou `hard` pela média da tripulação.
- `renderer.render(snapshot)` recebe estado somente para leitura.
- Componentes de UI recebem ações por callbacks; não acessam variáveis globais.

## Migração segura

1. Extrair conteúdo estático (`characters`, `islands`, `assets`).
2. Extrair funções puras de progressão e combate, com testes unitários.
3. Criar `world-state` e mover o loop para sistemas independentes.
4. Migrar HUD, modal de ilhas e tripulação para módulos de UI.
5. Introduzir o adaptador Phaser somente quando a simulação estiver independente do Canvas.

Essa ordem preserva o jogo atual enquanto elimina o arquivo monolítico gradualmente.
