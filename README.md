# Grand Line Idle — MVP

Protótipo web estático de um jogo idle de tripulação. Inclui dez personagens, seleção de cinco membros, sinergias, rotas, ilhas e uma expedição simulada.

## Executar localmente

No diretório do projeto:

```bash
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite (normalmente `http://localhost:5173`). O jogo agora usa Phaser 3 para o mundo jogável: cenário, sprites, animações, inimigos, barras no mapa e efeitos de habilidade. Os menus e modais permanecem em HTML/CSS por cima do canvas, para serem responsivos e acessíveis.

Para gerar a versão de produção:

```bash
npm run build
```

## Observação de propriedade intelectual

Este MVP usa nomes de personagens de One Piece apenas como protótipo privado de teste. Não publique, monetize ou distribua esta versão. Para lançamento, substitua nomes, personagens, artes e mundo por conteúdo original ou licenciado.
