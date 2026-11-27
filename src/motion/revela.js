// Títulos de seção por marco: cada linha (separada por <br>) entra numa máscara própria e sobe por tempo quando o
// título chega a 85% da tela, uma vez só (rolar de volta não apaga). Também liga os
// blocos [data-entra-sec] (sobem saindo do desfoque).
import { ScrollTrigger } from './ease.js';

export function revelacoes(raiz = document) {
  for (const t of raiz.querySelectorAll('[data-revela]')) {
    const linhas = t.innerHTML.split(/<br\s*\/?>/i);
    t.innerHTML = linhas.map((l) => `<span class="revela__linha"><span class="revela__txt">${l.trim()}</span></span>`).join('');
    t.classList.add('revela');
    ScrollTrigger.create({ trigger: t, start: 'top 85%', once: true, onEnter: () => t.classList.add('is-dentro') });
  }
  for (const b of raiz.querySelectorAll('[data-entra-sec]')) {
    ScrollTrigger.create({ trigger: b, start: 'top 88%', once: true, onEnter: () => b.classList.add('is-dentro') });
  }
  // Tab caindo num bloco que ainda não entrou: entra na hora
  document.addEventListener('focusin', (e) => {
    const r = e.target.closest?.('.revela, [data-entra-sec]');
    if (r) r.classList.add('is-dentro');
  });
}
