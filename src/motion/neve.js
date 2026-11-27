// Neve do hero em duas camadas. "fundo": flocos pequenos atrás da modelo, em queda lenta com balanço de lado.
// "frente": poucos flocos grandes e desfocados na frente dela, mais rápidos (perto da câmera). A densidade acompanha
// a cor ativa (pouca no claro, mais no escuro); sopro(v): vento de lado, para a rajada da troca arrastar os flocos.
// Para quando o hero sai da tela.
import { gsap } from './ease.js';

const TIPOS = {
  fundo: { area: 7600, perto: 0.06, r: [0.6, 1.6], rPerto: [2.2, 3.4], v: [14, 42], vPerto: [40, 62], a: [0.45, 0.95], aPerto: [0.25, 0.5], dpr: 2 },
  frente: { area: 52000, perto: 1, r: [0, 0], rPerto: [5, 13], v: [0, 0], vPerto: [64, 120], a: [0, 0], aPerto: [0.16, 0.42], dpr: 1 },
};

export function neve(canvas, tipo = 'fundo') {
  const T = TIPOS[tipo];
  const ctx = canvas.getContext('2d');
  const borrao = document.createElement('canvas');
  borrao.width = borrao.height = 64;
  const b = borrao.getContext('2d');
  const g = b.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,0.9)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.5)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  b.fillStyle = g;
  b.fillRect(0, 0, 64, 64);

  const entre = ([a, c]) => a + Math.random() * (c - a);
  let W = 0, H = 0, flocos = [], visivel = true, parado = false;
  const estado = { densidade: 0, vento: 0 };
  const novo = (topo) => {
    const perto = Math.random() < T.perto;
    return {
      x: Math.random() * W, y: topo ? -16 : Math.random() * H,
      r: entre(perto ? T.rPerto : T.r), v: entre(perto ? T.vPerto : T.v), a: entre(perto ? T.aPerto : T.a),
      f: Math.random() * 6.28, w: 0.3 + Math.random() * 0.9, perto, k: Math.random(),
    };
  };
  const toque = matchMedia('(hover: none)').matches;
  function medir() {
    const dpr = Math.min(T.dpr, devicePixelRatio || 1);
    // no toque, a barra do Safari some e volta durante a rolagem: mudança só de altura (< 120 px) não refaz a neve
    if (toque && W && canvas.clientWidth === W && Math.abs(canvas.clientHeight - H) < 120) return;
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    flocos = Array.from({ length: Math.max(6, Math.round((W * H) / T.area)) }, () => novo(false));
  }
  let ultimo = performance.now();
  function quadro(agora) {
    requestAnimationFrame(quadro);
    const dt = Math.min(0.05, (agora - ultimo) / 1000);
    ultimo = agora;
    if (!visivel || parado || !W) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    for (const f of flocos) {
      f.f += dt * f.w;
      f.y += f.v * dt;
      f.x += (Math.sin(f.f) * (f.perto ? 22 : 14) + estado.vento * (f.perto ? 1.35 : 1)) * dt;
      if (f.y > H + 20) Object.assign(f, novo(true));
      if (f.x > W + 24) { f.x = -20; f.y = Math.random() * H; }
      if (f.x < -24) f.x = W + 20;
      if (f.k > estado.densidade) continue;
      ctx.globalAlpha = f.a;
      if (f.perto) ctx.drawImage(borrao, f.x - f.r * 2, f.y - f.r * 2, f.r * 4, f.r * 4);
      else { ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.2832); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
  }
  medir();
  requestAnimationFrame(quadro);
  addEventListener('resize', medir);
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; }).observe(canvas);

  return {
    pausa(sim) { parado = sim; if (sim) ctx.clearRect(0, 0, W, H); },
    densidade(d, dur = 0.9) { gsap.to(estado, { densidade: d, duration: dur, ease: 'n-io', overwrite: 'auto' }); },
    sopro(forca = 900, dur = 1.1) {
      gsap.timeline()
        .to(estado, { vento: forca, duration: dur * 0.32, ease: 'n-out', overwrite: 'auto' })
        .to(estado, { vento: 0, duration: dur * 0.68, ease: 'n-io' });
    },
  };
}
