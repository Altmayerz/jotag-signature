// Compra pelos cartões (coleção, acessórios e "Combina com"): o hover/foco abre o painel de opções; escolher uma
// opção adiciona à sacola com o cartão voando da foto até o ícone, e o painel confirma por um instante. A foto é um
// link para a página do produto. Favoritar marca o coração com um pulo. Os cartões da grade entram em degraus.
import { gsap, ScrollTrigger } from './ease.js';

export function colecao({ sacola }) {
  for (const card of document.querySelectorAll('.card')) {
    const foto = card.querySelector('.card__foto');
    const painel = card.querySelector('.card__tam');
    const dica = card.querySelector('.card__dica');
    const textoDica = dica.textContent;
    const fav = card.querySelector('.fav');
    fav?.addEventListener('click', (e) => {
      e.stopPropagation();
      const on = fav.getAttribute('aria-pressed') !== 'true';
      fav.setAttribute('aria-pressed', String(on));
      fav.classList.remove('is-pulo'); void fav.offsetWidth; fav.classList.add('is-pulo');
    });
    let tempo = 0;
    painel.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-tam]');
      if (!b) return;
      e.stopPropagation();
      const d = card.dataset;
      const opcao = b.dataset.tam;
      const r = foto.getBoundingClientRect();
      sacola.adiciona(
        { chave: `${d.produto}-${opcao}`, nome: d.nome, detalhe: opcao === 'Único' ? d.tipo : `${d.tipo} · ${opcao}`, preco: Number(d.preco.replace('.', '')), img: d.img, fundo: d.fundo, tipo: 'roupa' },
        { de: { x: r.left + r.width / 2, y: r.top + r.height * 0.45 }, abrir: false },
      );
      painel.classList.add('is-feito');
      dica.textContent = 'Na sacola ✓';
      clearTimeout(tempo);
      tempo = setTimeout(() => { painel.classList.remove('is-feito'); dica.textContent = textoDica; }, 1800);
    });
  }

  // entrada da grade: as colunas sobem em degraus quando a grade chega
  const grade = document.querySelector('[data-grade]');
  if (grade && !document.documentElement.classList.contains('reduzido')) {
    const itens = [...grade.children];
    gsap.set(itens, { y: 60, opacity: 0 });
    ScrollTrigger.create({
      trigger: grade, start: 'top 82%', once: true,
      onEnter: () => gsap.to(itens, { y: 0, opacity: 1, duration: 1.05, ease: 'n-out', stagger: { each: 0.06, grid: 'auto', from: 'start' }, clearProps: 'transform,opacity' }),
    });
  }
}
