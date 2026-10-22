# Game Design Document — Maré dos Cinco

**Versão:** 0.2  
**Plataforma:** navegador, desktop e mobile responsivo  
**Gênero:** RPG idle de tripulação e aventura marítima  
**Stack sugerida:** Phaser 3, TypeScript e Vite

## 1. Resumo

**Maré dos Cinco** é um RPG idle 2D sobre montar uma tripulação, navegar entre ilhas, vencer inimigos automaticamente e melhorar personagens e navio. O jogador decide sua formação, rota, sinergias e investimentos; expedições continuam rendendo recursos enquanto está offline.

O universo deve ser inteiramente original: personagens, nomes, ilhas, artes e história próprios. A referência é a fantasia de aventura no mar, não o uso de propriedade intelectual de outras obras.

## 2. Pilares

1. **Tripulação importa:** cinco membros criam escolhas de composição e especialização.
2. **Idle com decisão:** navegar, formar equipe e investir deve alterar o resultado.
3. **Sinergias legíveis:** o jogador sempre entende requisito e benefício.
4. **Progresso constante:** toda sessão entrega ganho, descoberta ou meta próxima.
5. **Monetização honesta:** compras são opcionais, transparentes e não bloqueiam o conteúdo principal.

## 3. Loop principal

```text
Escolher ilha e rota
        ↓
Montar tripulação e preparar o navio
        ↓
Expedição e combate automáticos
        ↓
Receber recursos, equipamentos e reputação
        ↓
Melhorar heróis, sinergias ou navio
        ↓
Desbloquear novo chefe, rota ou mar
```

### Decisões por sessão

- Escolher a ilha que contém o recurso desejado.
- Navegar por rota segura, equilibrada ou perigosa.
- Escolher os cinco personagens e sinergias ativas.
- Investir em herói, equipamento ou melhoria de navio.
- Interpretar o resumo de expedição e adaptar a equipe.

## 4. Tripulação de cinco membros

Há cinco vagas simultâneas, sem posições travadas. Funções orientam a estratégia, mas personagens híbridos e equipes fora do padrão devem funcionar em conteúdos específicos.

| Função | Responsabilidade | Exemplos de efeito |
|---|---|---|
| Capitão | comando e liderança | bônus global, moral, habilidade suprema |
| Navegador | exploração e risco | rotas raras, tesouros, menos incidentes |
| Combatente | dano e proteção | dano, controle, defesa contra chefe |
| Suporte | sustentação | cura, escudo, buffs, recuperação |
| Especialista | navio e economia | reparos, cozinha, saque, construção |

### Ficha de personagem

Cada personagem possui:

- função principal e, quando adequado, secundária;
- duas ou três tags;
- ataque básico automático;
- habilidade automática com recarga;
- passiva de tripulação;
- nível, ascensão e equipamentos;
- vínculos de sinergia.

Tags iniciais: `Lâmina`, `Atirador`, `Fogo`, `Médico`, `Cartógrafo`, `Caçador`, `Cozinheiro` e `Guardião`.

### Formação inicial ensinada ao jogador

Capitão + Navegador + Combatente + Suporte + Especialista. Esta é a formação de introdução; o jogador deve poder substituí-la para farm, chefes ou exploração.

## 5. Combate automático

O combate é automático e visual. O domínio vem do planejamento anterior, não de cliques repetitivos durante a luta.

| Atributo | Função |
|---|---|
| PV | sobrevivência |
| Ataque | dano básico |
| Defesa | redução de dano físico |
| Poder | cura, escudo e habilidades especiais |
| Velocidade | frequência de ações |
| Sorte | eventos e qualidade de saque, com teto |

### Regras

- Inimigos comuns devem cair rápido e manter o ritmo.
- Chefes devem testar dano, cura e sobrevivência.
- Uma derrota deve explicar a causa provável: falta de dano, defesa ou preparo para a rota.
- Poder de combate é uma estimativa, não uma barreira absoluta; sinergia pode superar diferença moderada de poder.

## 6. Sistema de sinergia

Sinergias criam estilos de equipe. Elas não devem se tornar multiplicadores obrigatórios de dano.

**Limite:** no máximo duas sinergias principais ativas por tripulação.

| Categoria | Ativação | Benefício típico |
|---|---|---|
| Função | funções complementares | cura, escudo, sobrevivência |
| Tag | tags iguais ou relacionadas | combo, controle, dano situacional |
| Navio | especialista + melhoria | reparo, saque, duração de expedição |
| Exploração | navegador + tag apropriada | mapas, eventos, redução de risco |

### Sinergias iniciais

- **Guarda da Proa:** `Guardião` + Suporte. A equipe começa com escudo e recebe cura maior abaixo de 50% de PV.
- **Rota de Caça:** Navegador + `Atirador`. Mais encontros de elite e maior chance de mapa de tesouro.
- **Banquete de Bordo:** Capitão + `Cozinheiro`. Menos tempo de recuperação e moral temporária.
- **Investida de Lâminas:** dois personagens `Lâmina`. Habilidade especial atinge um segundo alvo com dano reduzido.
- **Cartografia Antiga:** Navegador + `Cartógrafo`. Chance de rota secreta e relíquia adicional.
- **Chama Coordenada:** dois personagens `Fogo`. Aplica dano ao longo do tempo em chefes, com limite de acúmulo.

### Balanceamento

- Bônus globais de dano têm teto baixo; benefícios situacionais são preferíveis.
- Toda sinergia deve ter uma atividade em que seja útil.
- Nenhum personagem pode ser inútil sem uma sinergia específica.
- A interface informa sinergias ativas, inativas e requisito faltante.

## 7. Ilhas, rotas e farm

Ilhas são a base da progressão e do farm. Cada uma possui uma tabela de recursos clara, inimigos próprios, evento, elite opcional e chefe.

| Rota | Risco | Recompensa | Uso |
|---|---:|---:|---|
| Segura | baixo | recursos estáveis | evolução inicial e testes |
| Equilibrada | médio | melhor eficiência geral | farm padrão |
| Perigosa | alto | relíquias e materiais raros | equipes especializadas |

### Recursos

| Recurso | Origem | Uso |
|---|---|---|
| Moedas | todas as ilhas | evolução e taxas |
| Suprimentos | ilhas básicas | expedições e reparos |
| Fragmentos | chefes e elites | desbloqueio e ascensão |
| Materiais de ilha | ilha específica | equipamentos |
| Relíquias | chefes e rota perigosa | bônus de longo prazo |
| Reputação | conclusão de ilha | liberar mares e história |

### Mares

1. **Mar Inicial:** tutorial, cinco funções e recursos básicos.
2. **Mar das Correntes:** equipamentos, elites e primeiras tags.
3. **Mar Profundo:** sinergias completas, relíquias e especialização do navio.
4. **Mar Lendário:** chefes semanais, rotas de alto risco e fim de jogo.

## 8. Progresso offline

- Ao iniciar uma expedição, registrar equipe, rota e horário.
- Ao retornar, calcular ganhos offline até o limite inicial de oito horas.
- Melhorias do navio ampliam esse limite por progressão normal.
- Exibir resumo com duração, recursos, inimigos, eventos e itens importantes.
- Jogar ativamente pode melhorar a eficiência, mas o ganho offline permanece relevante.

## 9. Economia e balanceamento

### Princípios

- O jogador obtém o primeiro ganho em poucos minutos.
- A primeira equipe de cinco é obtida sem pagamento.
- A progressão principal nunca exige moeda premium.
- Toda moeda possui fonte e consumo compreensíveis.
- Nenhum item pago deve conceder poder exclusivo impossível de obter jogando.

### Ritmo-alvo inicial

| Marco | Tempo alvo |
|---|---:|
| completar os cinco membros iniciais | 30–60 min |
| ativar a primeira sinergia | 1–2 h |
| vencer o primeiro chefe | 2–4 h |
| chegar ao segundo mar | 1–2 dias |
| criar primeira equipe especializada | 5–7 dias |

### Métricas de playtest

- tempo até a próxima melhoria relevante;
- duração e taxa de vitória em chefes;
- equipes escolhidas por ilha;
- entrada e gasto de recursos;
- abandono após derrota e retenção do primeiro dia.

## 10. Apoie o projeto e Berries

### Conceito

**Apoie o projeto** é o nome da área comercial. O jogador compra **Berries**, moeda virtual de uso exclusivo no jogo. A interface deve ser emocionalmente acolhedora, mas juridicamente e comercialmente clara.

> **Apoie o projeto**  
> Escolha um pacote de Berries para continuar sua aventura.  
> `500 Berries — R$ 4,90` · `1.200 Berries — R$ 9,90`

### Regras de produto

- Berries não são dinheiro e não podem ser sacadas, transferidas ou vendidas entre jogadores.
- Exibir valor final, quantidade de Berries e conteúdo da compra antes da confirmação.
- Oferecer histórico de compras e saldo.
- Usar provedor especializado de pagamentos; não armazenar dados de cartão no jogo.
- Mostrar política de reembolso, atendimento e reversão de saldo aplicável.
- Compras são opcionais e não podem usar mensagens enganosas ou pressão abusiva.

### Produtos possíveis

- pacotes de Berries;
- cosméticos de navio e personagens;
- passe de temporada com trilha gratuita;
- conveniência moderada com alternativa conquistável jogando.

## 11. Programa de indicação

O programa oferece comissão determinística por convite válido. Não é sorteio e não possui remuneração por níveis.

```text
Jogador A cria código de convite
        ↓
Jogador B entra pelo código
        ↓
B conclui primeira compra elegível de Berries
        ↓
Fim da janela de reembolso + análise antifraude
        ↓
A recebe saldo de indicação e solicita saque
```

### Regras

- Publicar fórmula, teto, prazo e condições antes da adesão.
- Recompensar somente a indicação direta; não existe segundo nível.
- Não pagar por cadastro isolado.
- Saldo de indicação em reais é separado de Berries.
- Reverter comissão de compra reembolsada, contestada ou fraudulenta.
- Bloquear autoindicação por sinais como dispositivo, pagamento, conta de saque ou identidade repetidos.
- Na primeira versão real, restringir saque a maiores de 18 anos com verificação adequada.
- Valores, impostos, documentos e regras finais exigem validação jurídica, contábil e do parceiro de pagamentos antes do lançamento.

## 12. Segurança, privacidade e consumidor

Este documento é de produto, não parecer jurídico. Antes de qualquer cobrança, indicação ou saque real, revisar o produto com especialistas em direito digital, consumidor, tributário, proteção de dados e pagamentos.

Requisitos mínimos:

- Termos de Uso, Política de Privacidade, regras de compra e regulamento de indicação visíveis.
- Coleta mínima de dados e atendimento a solicitações de privacidade.
- Fluxos apropriados de idade, consentimento e controle parental.
- Preços, condições, suporte, estorno e histórico de transações claros.
- Logs auditáveis de compra, Berries, estorno, indicação e saque.
- Limites de fraude, análise de risco e atendimento humano para contestação.
- Proibição de aposta, recompensa aleatória em dinheiro, pirâmide e ganho por recrutamento em níveis.

## 13. Telas do MVP

1. **Porto/Navio:** expedição, coleta de ganhos e atalhos.
2. **Tripulação:** cinco vagas, personagens e sinergias.
3. **Mapa:** ilhas, rotas, recursos e chefes.
4. **Expedição:** preparação, combate e resultado.
5. **Personagem:** nível, habilidade, tags e equipamento.
6. **Navio:** melhorias e especializações.
7. **Inventário:** recursos, equipamentos e relíquias.
8. **Apoie o projeto:** protótipo visual de compra de Berries.
9. **Indique e receba:** protótipo visual de convite, saldo e regras.

## 14. Escopo do primeiro protótipo

- Cinco personagens iniciais, um de cada função;
- três ilhas e um chefe por ilha;
- seis sinergias;
- combate automático simplificado;
- expedição offline com resumo;
- níveis, equipamentos básicos e duas melhorias de navio;
- save local no navegador;
- telas simuladas de compra e indicação;
- sem pagamento, saque, login ou dados reais.

## 15. Próximos passos

1. Definir mundo, facções e os cinco personagens iniciais.
2. Escrever kits e valores das seis primeiras sinergias.
3. Desenhar inimigos, recursos e chefes das três ilhas iniciais.
4. Implementar combate, expedição e save local.
5. Fazer playtests e ajustar o ritmo da economia.
6. Depois do protótipo validado, avaliar backend, pagamentos, indicação e saque com especialistas.
