// Rodapé: quando o nome gigante chega, as letras sobem uma a uma (por tempo) e as quatro pessoas aparecem em cima
// delas, cada uma com um pulo (uma vez só).
import { gsap, ScrollTrigger } from './ease.js';

export function rodape() {
  const n = document.querySelector('[data-nome-gigante]');
  if (!n) return;
  const letras = [...n.querySelectorAll('.rodape__palavra span')];
  const pessoas = [...n.querySelectorAll('.pessoa')];
  if (document.documentElement.classList.contains('reduzido')) { pessoas.forEach((p) => p.classList.add('is-on')); return; }
  gsap.set(letras, { yPercent: 70, opacity: 0 });
  gsap.set(pessoas, { y: 40, scale: 0.7, opacity: 0 });
  ScrollTrigger.create({
    trigger: n, start: 'top 82%', once: true,
    onEnter: () => gsap.timeline()
      .to(letras, { yPercent: 0, opacity: 1, duration: 1.15, ease: 'n-out', stagger: 0.12 })
       ,
  });
}
