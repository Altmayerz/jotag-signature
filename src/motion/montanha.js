// Montanha: três profundidades com a rolagem (presas à rolagem, só imagem): o céu quase parado, o logo de neve atrás
// do pico descendo devagar, o pico subindo mais rápido que a página.
import { gsap } from './ease.js';

export function montanha() {
  const s = document.querySelector('.montanha');
  if (!s) return;
  const st = { trigger: s, start: 'top bottom', end: 'bottom top', scrub: true };
  const marca = s.querySelector('.montanha__marca');
  gsap.set(marca, { rotation: -4 });
  gsap.fromTo(marca, { y: -20, scale: 1.03 }, { y: 50, scale: 1, ease: 'none', scrollTrigger: st });
  gsap.fromTo(s.querySelector('.montanha__pico'), { y: 90 }, { y: -50, ease: 'none', scrollTrigger: { ...st } });
}
