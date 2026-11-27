// Lookbook: presas à rolagem, as três colunas sobem em velocidades diferentes. Cada coluna começa com o topo dentro da
// cena e termina com o pé dentro dela: a borda da seção nunca corta uma foto.
import { gsap } from './ease.js';

export function lookbook() {
  const s = document.querySelector('.lookbook');
  if (!s || document.documentElement.classList.contains('reduzido')) return;
  const colunas = [...s.querySelectorAll('.coluna')];
  const folgas = [[40, 40], [200, 30], [110, 150]]; // [topo no começo, pé no fim] de cada coluna, em px
  colunas.forEach((c, i) => {
    const [t0, p1] = folgas[i];
    gsap.fromTo(c, { y: () => t0 }, {
      y: () => Math.min(t0, innerHeight - c.offsetHeight - p1), ease: 'none',
      scrollTrigger: { trigger: s, start: 'top top', end: () => `bottom-=${Math.round(innerHeight * 0.6)} bottom`, scrub: 0.7, invalidateOnRefresh: true },
    });
  });
}
