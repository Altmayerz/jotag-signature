// Links internos andam com a curva da casa (Lenis); "Comprar Elegance" e afins sobem até o hero e trocam a cor lá.
import { irPara } from './rolagem.js';

export function ancoras({ hero }) {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented) return;
    const id = a.getAttribute('href').slice(1);
    const alvo = id ? document.getElementById(id) : null;
    if (!alvo) return;
    e.preventDefault();
    const y = alvo.getBoundingClientRect().top + scrollY - (id === 'hero' ? 0 : 20);
    const longe = Math.abs(y - scrollY) / innerHeight;
    irPara(y, { dur: Math.min(2.2, 0.9 + longe * 0.12) });
    const cor = a.dataset.corLink;
    if (cor) setTimeout(() => hero.escolhe(cor), Math.min(2200, 900 + longe * 120) + 120);
  });
}
