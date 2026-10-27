# Progressão de Boost

Cada tripulante possui Boost de `+0` até `+50`. Um Boost só pode ser aplicado com a Essência exclusiva do tripulante.

O nível máximo atual de cada tripulante é `100`.

## Custo de cada nível

Para avançar de `+N` para `+(N + 1)`, o custo é calculado para o nível-alvo:

`Essências = 8 + (N × 2) + piso(N² × 0,18)`

O crescimento quadrático impede que os últimos níveis sejam obtidos rapidamente. O nível do personagem escala os atributos ganhos pelo Boost, mas não altera o custo de Essências. A interface da Tripulação exibe o próximo Boost e a quantidade necessária antes da confirmação.

| Boost-alvo | Essências | Boost-alvo | Essências |
| --- | ---: | --- | ---: |
| +1 | 8 | +26 | 170 |
| +2 | 10 | +27 | 181 |
| +3 | 12 | +28 | 193 |
| +4 | 15 | +29 | 205 |
| +5 | 18 | +30 | 217 |
| +6 | 22 | +31 | 230 |
| +7 | 26 | +32 | 242 |
| +8 | 30 | +33 | 256 |
| +9 | 35 | +34 | 270 |
| +10 | 40 | +35 | 284 |
| +11 | 46 | +36 | 298 |
| +12 | 51 | +37 | 313 |
| +13 | 57 | +38 | 328 |
| +14 | 64 | +39 | 343 |
| +15 | 71 | +40 | 359 |
| +16 | 78 | +41 | 376 |
| +17 | 86 | +42 | 392 |
| +18 | 94 | +43 | 409 |
| +19 | 102 | +44 | 426 |
| +20 | 110 | +45 | 444 |
| +21 | 120 | +46 | 462 |
| +22 | 129 | +47 | 480 |
| +23 | 139 | +48 | 499 |
| +24 | 149 | +49 | 518 |
| +25 | 159 | +50 | 538 |

## Limites e obtenção

- Limite: `Boost +50`.
- Essências caem apenas na ilha associada ao tripulante.
- Chance de drop por inimigo: 2,3% no início, aumentando com o nível da ilha até o teto de 8%.
- Cada Boost aumenta PV, ataque, defesa e o multiplicador das habilidades; os bônus também consideram o nível atual do personagem.
