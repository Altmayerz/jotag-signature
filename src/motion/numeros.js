// Números: cada valor conta do zero até o dele quando o cartão entra (por tempo, uma vez por passagem), e a foto do
// cartão anda um pouco dentro dele com a rolagem.
import { gsap, ScrollTrigger } from './ease.js';

const fmt = (v) => Math.round(v).toLocaleString('pt-BR').replace('-', '−');

export function numeros() {
  // só os números dos cartões: o número da sacola no topo também é [data-conta]
  for (const el of document.querySelectorAll('.numero [data-conta]')) {
    const alvo = Number(el.dataset.conta);
    const st = { v: 0 };
    el.textContent = fmt(0);
    ScrollTrigger.create({
      trigger: el.closest('.numero'), start: 'top 85%', once: true,
      onEnter: () => gsap.to(st, { v: alvo, duration: 1.7, ease: 'n-out', overwrite: true, onUpdate: () => { el.textContent = fmt(st.v); } }),
    });
  }
  for (const img of document.querySelectorAll('.numero__img')) {
    gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  }
  const lista = document.querySelector('.numeros__lista');
  if (lista && !document.documentElement.classList.contains('reduzido')) {
    gsap.set(lista.children, { y: 70, opacity: 0 });
    ScrollTrigger.create({ trigger: lista, start: 'top 85%', once: true, onEnter: () => gsap.to(lista.children, { y: 0, opacity: 1, duration: 1.1, ease: 'n-out', stagger: 0.08, clearProps: 'transform,opacity' }) });
  }
}
