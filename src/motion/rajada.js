// Rajada de neve da troca de cor: nuvens de neve em pó (fotos geradas, com o alfa tirado do brilho) presas à borda do
// círculo da cor nova. A borda sai da ficha (à direita) e atravessa a tela para a esquerda sem frear, até a nuvem sair
// inteira pelo outro lado (rastro()); a nuvem anda junto com ela, cobrindo a fronteira entre a cor antiga e a nova,
// então nenhum ponto da tela volta para a cor antiga depois que a neve passa.
// Quatro nuvens em profundidades diferentes, bolas de luz no miolo e riscos finos de neve, todos virados para o lado em
// que o vento sopra.
export function rajada(canvas) {
  const ctx = canvas.getContext('2d');
  const carrega = (src) => { const i = new Image(); i.decoding = 'async'; i.src = src; return i; };
  const fotos = [carrega('img/rajada-1.webp'), carrega('img/rajada-2.webp')];
  const bola = document.createElement('canvas');
  bola.width = bola.height = 160;
  const s = bola.getContext('2d');
  const g = s.createRadialGradient(80, 80, 0, 80, 80, 80);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.75)');
  g.addColorStop(0.7, 'rgba(255,255,255,0.2)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  s.fillStyle = g;
  s.fillRect(0, 0, 160, 160);

  let W = 0, H = 0;
  const toque = matchMedia('(hover: none)').matches;
  function medir() {
    const dpr = Math.min(1.5, devicePixelRatio || 1); // nuvem borrada: resolução menor basta
    // no toque, a barra do Safari some e volta durante a rolagem: mudança só de altura (< 120 px) não mexe no quadro
    if (toque && W && canvas.clientWidth === W && Math.abs(canvas.clientHeight - H) < 120) return;
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  medir();
  addEventListener('resize', medir);

  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  // quanto a rajada se estende para trás do centro (px): a borda precisa ir isso além da tela para a neve sair inteira.
  // A nuvem maior tem 1,15 da largura e cresce até 10%; os riscos vão até meia tela atrás, mais o comprimento.
  const rastro = () => Math.max(0.64 * W, 0.5 * W + 180, 0.14 * W + 0.28 * H);
  const pronta = (i) => i.complete && i.naturalWidth > 0;
  let corrida = 0;

  // centro(): x da borda do círculo agora (px do canvas); ativo(): a borda ainda está andando; dir: -1 = para a esquerda
  function sopra({ centro, ativo, meioY = 0.55, dir = -1 } = {}) {
    const id = ++corrida;
    const nuvens = [
      { f: 0, w: 1.15, y: meioY + 0.02, ox: 0, a: 1, vira: false },
      { f: 1, w: 0.95, y: meioY - 0.17, ox: 0.08, a: 0.85, vira: false },
      { f: 0, w: 0.85, y: meioY + 0.2, ox: -0.06, a: 0.75, vira: true },
      { f: 1, w: 0.7, y: meioY - 0.31, ox: 0.12, a: 0.5, vira: true },
    ];
    const bolas = Array.from({ length: 14 }, () => ({ ox: gauss() * W * 0.14, y: H * meioY + gauss() * H * 0.22, r: H * (0.13 + Math.random() * 0.15), a: 0.35 + Math.random() * 0.45 }));
    const riscos = Array.from({ length: 80 }, () => ({ ox: gauss() * W * 0.5, y: H * meioY + gauss() * H * 0.5, l: 24 + Math.random() * 150, a: 0.2 + Math.random() * 0.55, w: 0.5 + Math.random() * 1.3, d: Math.random() * 0.12 }));
    const t0 = performance.now();
    let fimT = 0; // quando a borda parou (a nuvem já saiu da tela): limpa em 0,18 s
    return new Promise((ok) => {
      const quadro = (agora) => {
        if (id !== corrida) { ok(); return; }
        const t = (agora - t0) / 1000;
        if (!ativo() && !fimT) fimT = t;
        const some = fimT ? Math.max(0, 1 - (t - fimT) / 0.18) : 1;
        const entra = Math.min(1, t / 0.1);
        const env = entra * some;
        const cx = centro();
        const cresce = 0.95 + Math.min(0.15, t * 0.15);
        ctx.clearRect(0, 0, W, H);
        ctx.save();
        // tudo é desenhado como se o vento fosse para a direita; para a esquerda, o quadro vira no x da borda
        if (dir < 0) { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
        for (const n of nuvens) {
          const img = fotos[n.f];
          if (!pronta(img)) continue;
          const w = W * n.w * cresce, h = (w * img.naturalHeight) / img.naturalWidth;
          const x = cx + n.ox * W;
          ctx.globalAlpha = n.a * env;
          if (n.vira) { ctx.save(); ctx.translate(0, H * n.y * 2); ctx.scale(1, -1); }
          ctx.drawImage(img, x - w / 2, H * n.y - h / 2, w, h);
          if (n.vira) ctx.restore();
        }
        for (const b of bolas) {
          ctx.globalAlpha = b.a * env;
          ctx.drawImage(bola, cx + b.ox - b.r, b.y - b.r, b.r * 2, b.r * 2);
        }
        ctx.strokeStyle = '#fff';
        ctx.lineCap = 'round';
        for (const r of riscos) {
          const x = cx + r.ox + r.d * W * Math.min(1, t * 2);
          ctx.globalAlpha = r.a * env;
          ctx.lineWidth = r.w;
          ctx.beginPath(); ctx.moveTo(x - r.l, r.y + r.l * 0.05); ctx.lineTo(x, r.y); ctx.stroke();
        }
        ctx.restore();
        ctx.globalAlpha = 1;
        if (some > 0) requestAnimationFrame(quadro);
        else { ctx.clearRect(0, 0, W, H); ok(); }
      };
      requestAnimationFrame(quadro);
    });
  }
  return { sopra, medir, rastro };
}
