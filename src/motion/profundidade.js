// Profundidade do hero: cada camada da cena (.capa com data-prof, em px) anda com o mouse no sentido contrário, as
// de trás menos e as da frente mais, sempre com atraso (o alvo é perseguido a ~7% por quadro). Para quando o hero sai
// da tela; sem mouse (toque) ou com movimento reduzido, fica parada.
import { gsap } from './ease.js';

export function profundidade(raiz) {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const capas = [...raiz.querySelectorAll('[data-prof]')].map((el) => ({ el, k: Number(el.dataset.prof) || 0 }));
  let mx = 0, my = 0, x = 0, y = 0, visivel = true, parado = true, pausado = false;
  addEventListener('pointermove', (e) => {
    mx = (e.clientX / innerWidth - 0.5) * 2;
    my = (e.clientY / innerHeight - 0.5) * 2;
    if (parado) raiz.classList.add('is-mexendo');
    parado = false;
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { mx = 0; my = 0; });
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; }).observe(raiz);
  gsap.ticker.add(() => {
    if (!visivel || parado || pausado) return;
    x += (mx - x) * 0.07;
    y += (my - y) * 0.07;
    if (Math.abs(mx - x) < 0.0005 && Math.abs(my - y) < 0.0005) { parado = true; raiz.classList.remove('is-mexendo'); }
    for (const c of capas) c.el.style.transform = `translate3d(${(-x * c.k).toFixed(2)}px, ${(-y * c.k * 0.55).toFixed(2)}px, 0)`;
  });
  return { pausa(sim) { pausado = sim; } };
}
