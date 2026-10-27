import { rarities } from '../data/recruitment';
import type { Inventory } from '../domain/inventory';
import type { RecruitmentSystem, RecruitResult } from '../domain/recruitment';
import type { ChestDefinition } from '../types/game';

export class RecruitmentPanel {
  static render(
    container: HTMLElement,
    {
      chests,
      state,
      inventory,
      lastResult,
    }: {
      chests: ChestDefinition[];
      state: RecruitmentSystem;
      inventory: Inventory;
      lastResult: (RecruitResult & { isNew?: boolean; character: { name: string; role: string } }) | null;
    },
  ): void {
    const activeChest = chests.find((chest) => chest.status === 'active');
    if (!activeChest) return;
    const pity = state.pity(activeChest);
    const rate = state.mythicChance(activeChest);
    const keys = inventory.quantity(activeChest.keyId);
    const rarityRows = Object.values(rarities)
      .map(
        (rarity) =>
          `<li class="rarity-row rarity-${rarity.color}"><span>${rarity.icon} ${rarity.name}</span><b>${rarity.chance.toLocaleString('pt-BR')}%</b></li>`,
      )
      .join('');

    container.innerHTML = `<section class="recruitment-hero"><div><p>Recrutamento</p><h1>O próximo membro da tripulação está em algum lugar do mar.</h1><span>Explore ilhas para encontrar chaves, abra baús e construa sua coleção.</span></div><aside><strong>${keys}</strong><span>${activeChest.keyIcon} ${activeChest.keyName}</span></aside></section><section class="recruitment-layout"><div class="chest-stage"><div class="chest-orbit" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span></div><div class="chest-illustration"><div class="chest-lock">⚓</div><span>▰</span></div><p class="chest-kicker">BAÚ ATIVO</p><h2>${activeChest.name}</h2><p>${activeChest.subtitle}</p><button class="recruit-open" type="button" data-open-chest="${activeChest.id}" ${keys ? '' : 'disabled'}>${keys ? `Abrir com ${activeChest.keyIcon} 1 chave` : 'Encontre uma chave explorando ilhas'}</button><small>Você possui ${keys} chave${keys === 1 ? '' : 's'}.</small></div><aside class="pity-panel"><div class="pity-heading"><span>Rota do destino</span><b>${pity}/${activeChest.hardPity}</b></div><div class="pity-track"><i style="width:${(pity / activeChest.hardPity) * 100}%"></i></div><p>Após ${activeChest.softPityStart} aberturas, a chance mítica aumenta a cada baú. Na ${activeChest.hardPity}ª, ela é garantida.</p><div class="mythic-rate"><span>Chance mítica atual</span><strong>${rate.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%</strong></div><ul class="rarity-table">${rarityRows}</ul></aside></section>${lastResult ? `<section class="recruit-result rarity-${lastResult.rarity.color}"><span class="recruit-result-icon">${lastResult.rarity.icon}</span><div><p>${lastResult.guaranteed ? 'Mítico garantido' : lastResult.isNew ? 'Novo tripulante recrutado' : 'Contrato repetido'}</p><h2>${lastResult.character.name}</h2><span>${lastResult.rarity.name} · ${lastResult.character.role}</span></div><b>${lastResult.guaranteed ? 'GARANTIDO' : lastResult.rarity.label.toUpperCase()}</b></section>` : `<section class="recruit-result is-empty"><span class="recruit-result-icon">⚓</span><div><p>Histórico de abertura</p><h2>Nenhum baú aberto nesta sessão</h2><span>Use uma chave da Grand Line para encontrar um novo contrato.</span></div></section>`}<section class="future-chests"><div><h2>Próximos baús</h2><p>A estrutura aceita banners com garantia selecionável, personagens em destaque e taxas exclusivas.</p></div><div class="future-chest-list">${chests
      .filter((chest) => chest.status === 'upcoming')
      .map(
        (chest) =>
          `<article><span>${chest.keyIcon}</span><div><b>${chest.name}</b><small>${chest.selectionMode === 'featured-guarantee' ? 'Garantia selecionável' : 'Chance aumentada para destaque'}</small></div><em>Em breve</em></article>`,
      )
      .join('')}</div></section>`;
  }
}

export function renderRecruitment(
  container: HTMLElement,
  options: Parameters<typeof RecruitmentPanel.render>[1],
): void {
  RecruitmentPanel.render(container, options);
}
