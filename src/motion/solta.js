// A jaqueta solta: presa à rolagem, a Tricot voa de baixo girando e pousa (só a peça é presa à rolagem, com
// suavização); por marcos (tempo), as palavras acendem uma a uma, os quatro rótulos pregam e o adesivo bate. Voltando
// para cima de cada marco, o estado volta junto.
import { gsap, ScrollTrigger } from './ease.js';

export function solta() {
  const s = document.querySelector('.solta');
  if (!s) return;
  const peca = s.querySelector('.solta__peca');
  const palavras = [...s.querySelectorAll('.solta__frase .w')];
  const pinos = [...s.querySelectorAll('.pino')];
  const selo = s.querySelector('.solta__selo');
  if (document.documentElement.classList.contains('reduzido')) {
    palavras.forEach((p) => p.classList.add('is-aceso')); pinos.forEach((p) => p.classList.add('is-on')); selo.classList.add('is-on');
    return;
  }
  gsap.timeline({ scrollTrigger: { trigger: s, start: 'top bottom', end: () => `top+=${(s.offsetHeight - innerHeight * 1.6) * 0.42} top`, scrub: 0.8, invalidateOnRefresh: true } })
    .fromTo(peca, { y: '75svh', rotation: -18, scale: 0.78 }, { y: 0, rotation: 0, scale: 1, ease: 'n-out', duration: 1 });
  // depois de pousar, a peça flutua de leve até a cena acabar
  gsap.fromTo(peca, { yPercent: 0 }, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: s, start: () => `top+=${(s.offsetHeight - innerHeight * 1.6) * 0.42} top`, end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true } });
  // os marcos contam só o trecho preso antes da seção seguinte começar a subir por cima (--cobre, 60% da tela)
  const marco = (frac, liga, desliga) => ScrollTrigger.create({ trigger: s, start: () => `top+=${frac * (s.offsetHeight - innerHeight * 1.6)} top`, onEnter: liga, onLeaveBack: desliga, invalidateOnRefresh: true });
  palavras.forEach((p, i) => marco(0.1 + i * 0.05, () => p.classList.add('is-aceso'), () => p.classList.remove('is-aceso')));
  pinos.forEach((p, i) => marco(0.5 + i * 0.09, () => p.classList.add('is-on'), () => p.classList.remove('is-on')));
  marco(0.9, () => selo.classList.add('is-on'), () => selo.classList.remove('is-on'));
}
