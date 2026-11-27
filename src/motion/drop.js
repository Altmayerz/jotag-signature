// Próximo drop: contagem regressiva ao vivo (o alvo é relativo à visita, então a demo nunca chega a zero). O formulário
// da lista de espera é o mesmo do rodapé (motion/lista.js).
import { gsap } from './ease.js';

const dois = (n) => String(n).padStart(2, '0');

export function drop() {
  const r = document.querySelector('[data-relogio]');
  if (r) {
    const alvo = Date.now() + (((39 * 24 + 6) * 60 + 41) * 60 + 27) * 1000;
    const campos = { d: r.querySelector('[data-dias]'), h: r.querySelector('[data-horas]'), m: r.querySelector('[data-min]'), s: r.querySelector('[data-seg]') };
    let antes = {};
    const tick = () => {
      let t = Math.max(0, Math.floor((alvo - Date.now()) / 1000));
      const v = { d: Math.floor(t / 86400), h: Math.floor((t % 86400) / 3600), m: Math.floor((t % 3600) / 60), s: t % 60 };
      for (const k of Object.keys(v)) {
        if (v[k] === antes[k]) continue;
        campos[k].textContent = dois(v[k]);
        if (antes[k] !== undefined) gsap.fromTo(campos[k], { yPercent: -35, opacity: 0.2 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'n-out' });
      }
      antes = v;
      r.setAttribute('aria-label', `Faltam ${v.d} dias, ${v.h} horas e ${v.m} minutos para o lançamento`);
    };
    tick();
    setInterval(tick, 1000);
  }
}
