// Avaliações na montanha: a crista da foto vira uma trilha em SVG (pontos medidos na imagem, src/dados/crista.js).
// Presa à rolagem, a linha acesa sobe a trilha com um ponto de luz na ponta; quando passa da altura de cada avaliação,
// a bandeira finca (por tempo) e o cartão ao lado troca para o depoimento; a nota conta até 4,9 na primeira bandeira.
// Voltando, tudo volta.
import { gsap, ScrollTrigger } from './ease.js';
import { AVALIACOES, MARCA } from '../config.js';
import { CRISTA, LARGURA, ALTURA } from '../dados/crista.js';

const NS = 'http://www.w3.org/2000/svg';
const el = (tag, at = {}) => { const n = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(at)) n.setAttribute(k, v); return n; };
const metros = (m) => `${m.toLocaleString('pt-BR')} m`;
const flocos = (n) => '✱'.repeat(n) + '<span style="opacity:.3">' + '✱'.repeat(5 - n) + '</span>';

export function cume() {
  const s = document.querySelector('.cume');
  if (!s) return;
  const svg = s.querySelector('[data-trilha]');
  const cartoes = s.querySelector('[data-cartoes]');
  const notaEl = s.querySelector('[data-nota]');
  svg.setAttribute('viewBox', `0 0 ${LARGURA} ${ALTURA}`);
  const etiquetas = document.createElement('div');
  etiquetas.className = 'cume__etiquetas';
  etiquetas.setAttribute('aria-hidden', 'true');
  svg.after(etiquetas);
  svg.setAttribute('preserveAspectRatio', 'none');

  // a trilha: curva suave pelos pontos (Catmull-Rom em Bézier)
  const p = CRISTA;
  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
    d += ` C${b[0] + (c[0] - a[0]) / 6},${b[1] + (c[1] - a[1]) / 6} ${c[0] - (e[0] - b[0]) / 6},${c[1] - (e[1] - b[1]) / 6} ${c[0]},${c[1]}`;
  }
  const fundo = el('path', { d, class: 'trilha__fundo' });
  const acesa = el('path', { d, class: 'trilha__acesa' });
  const luz = el('circle', { r: 7, class: 'trilha__luz' });
  svg.append(fundo, acesa);
  const L = acesa.getTotalLength();
  acesa.style.strokeDasharray = `${L} ${L}`;
  acesa.style.strokeDashoffset = `${L}`;

  // onde cada altitude cai na trilha: pela altura (y), do pé ao cume
  const y0 = p[0][1], y1 = Math.min(...p.map((q) => q[1]));
  const amostras = Array.from({ length: 400 }, (_, i) => { const l = (i / 399) * L; const q = acesa.getPointAtLength(l); return { l, y: q.y }; });
  const naAltura = (frac) => { const yAlvo = y0 + (y1 - y0) * frac; const a = amostras.find((q) => q.y <= yAlvo) || amostras[amostras.length - 1]; return a.l; };
  const bandeiras = AVALIACOES.map((av, i) => {
    const l = naAltura(Math.min(1, av.alt / MARCA.cume));
    const q = acesa.getPointAtLength(l);
    const cumeFinal = i === AVALIACOES.length - 1;
    const g = el('g', { class: `bandeira${cumeFinal ? ' bandeira--cume' : ''}`, transform: `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})` });
    const h = 64;
    g.append(el('line', { x1: 0, y1: 0, x2: 0, y2: -h, class: 'bandeira__mastro' }));
    g.append(el('path', { d: `M0,${-h} L34,${-h + 9} L0,${-h + 20} Z`, class: 'bandeira__pano' }));
    // a etiqueta da altitude é HTML por cima da foto (o SVG encolhe com ela; a letra não pode encolher junto)
    const etq = document.createElement('span');
    etq.className = `etq${cumeFinal ? ' etq--cume' : ''}`;
    etq.textContent = cumeFinal ? `${metros(av.alt)} · cume` : metros(av.alt);
    etq.style.left = `${(q.x / LARGURA) * 100}%`;
    etq.style.top = `${((q.y - h) / ALTURA) * 100}%`;
    etiquetas.append(etq);
    svg.append(g);
    return { g, l, i, etq };
  });
  svg.append(luz);

  // os cartões, um por avaliação, atrás do cartão da base
  const base = cartoes.querySelector('[data-base]');
  const cards = AVALIACOES.map((av) => {
    const a = document.createElement('article');
    a.className = 'cartao';
    const ini = av.nome.split(' ').map((x) => x[0]).join('');
    a.innerHTML = `<div class="cartao__topo"><span aria-label="${av.nota} de 5">${flocos(av.nota)} &nbsp;${av.nota},0</span><span>${metros(av.alt)} · ${String(av.temp).replace('-', '−')} °C</span></div>
      <p class="cartao__frase">“${av.frase}”</p>
      <p class="cartao__quem"><span class="cartao__ini" aria-hidden="true">${ini}</span><span>${av.nome}<br><span style="opacity:.6">Avaliação verificada</span></span></p>
      <a class="cartao__usou" href="${av.link}" data-troca data-label="${av.usou}">Usou: ${av.usou}</a>`;
    cartoes.append(a);
    return a;
  });
  let ativo = base;
  const mostra = (c) => {
    if (c === ativo) return;
    ativo.classList.remove('is-ativo');
    ativo.classList.add('is-saindo');
    const velho = ativo;
    setTimeout(() => velho.classList.remove('is-saindo'), 320);
    c.classList.add('is-ativo');
    ativo = c;
  };

  const nota = { v: 0 };
  let contou = false;
  const conta = (sim) => {
    if (sim === contou) return;
    contou = sim;
    gsap.to(nota, { v: sim ? 4.9 : 0, duration: sim ? 1.6 : 0.4, ease: 'n-out', overwrite: true, onUpdate: () => { notaEl.textContent = nota.v.toFixed(1).replace('.', ','); } });
  };

  let feito = -1;
  const atualiza = (prog) => {
    const l = prog * L;
    acesa.style.strokeDashoffset = `${(L - l).toFixed(1)}`;
    const q = acesa.getPointAtLength(Math.max(0.01, l));
    luz.setAttribute('cx', q.x.toFixed(1)); luz.setAttribute('cy', q.y.toFixed(1));
    luz.style.opacity = prog > 0.002 ? 1 : 0;
    let k = -1;
    for (const b of bandeiras) if (l >= b.l - 0.5) k = b.i;
    if (k !== feito) {
      bandeiras.forEach((b) => { b.g.classList.toggle('is-on', b.i <= k); b.etq.classList.toggle('is-on', b.i <= k); b.etq.classList.toggle('is-atual', b.i === k); });
      mostra(k >= 0 ? cards[k] : base);
      conta(k >= 0);
      feito = k;
    }
  };
  atualiza(0);
  if (document.documentElement.classList.contains('reduzido')) { atualiza(1); return; }
  const st = { p: 0 };
  // a linha sobe durante 85% da cena presa; o fim fica parado no cume com o último depoimento
  ScrollTrigger.create({
    trigger: s, start: 'top top', end: 'bottom bottom',
    onUpdate: (t) => gsap.to(st, { p: Math.min(1, t.progress / 0.85), duration: 0.5, ease: 'n-out', overwrite: true, onUpdate: () => atualiza(st.p) }),
  });
}
