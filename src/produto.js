// Página de produto: troca de cor (as fotos e o preço da cor, com o fundo das fotos recortadas), tamanho ou lente,
// "Adicionar à sacola" com o cartão voando da foto até a sacola, o índice das fotos acompanhando a rolagem, os
// cartões de "Combina com" (o mesmo hover de compra da home), a passagem entre páginas e o rodapé.
import { gsap } from './motion/ease.js';
import { criarRolagem, irPara } from './motion/rolagem.js';
import { scrollbar } from './motion/scrollbar.js';
import { sacola as criaSacola } from './motion/sacola.js';
import { revelacoes } from './motion/revela.js';
import { colecao } from './motion/colecao.js';
import { rodape } from './motion/rodape.js';
import { listas } from './motion/lista.js';
import { passagem } from './motion/passagem.js';
import { consertaLinks } from './motion/paginas.js';
import { MARCA, real, realCentavos } from './config.js';
import './motion/rolando.js';

const html = document.documentElement;
window.__nixViva = true;
requestAnimationFrame(() => requestAnimationFrame(() => html.classList.add('assentou')));
history.scrollRestoration = 'manual';

consertaLinks();
const lenis = criarRolagem();
scrollbar({ lenis });
const sacola = criaSacola();
revelacoes();
colecao({ sacola });
rodape();
listas();
passagem();

const $ = (s) => document.querySelector(s);
const dados = JSON.parse($('#produto-dados').textContent);
const main = $('.produto');
const fotos = () => [...document.querySelectorAll('[data-foto]')];
const botaoAdd = $('[data-adicionar]');
const preco = $('[data-preco]');
const precoBotao = $('[data-preco-botao]');
const parc = $('[data-parc]');
const corNome = $('[data-cor-nome]');
const dicaTam = $('[data-dica-tam]');
const tams = [...document.querySelectorAll('[data-tam]')].filter((b) => b.closest('[data-tams]'));
const coresBt = [...document.querySelectorAll('[data-cor]')];
const raiz = $('meta[name="raiz"]').content;

// entrada (depois da passagem, se veio por ela)
setTimeout(() => html.classList.add('pdp-pronta'), html.classList.contains('chegando') ? 650 : 60);

// COR
let cor = dados.cores[0];
const escolheCor = (id, { anima = true } = {}) => {
  const c = dados.cores.find((k) => k.id === id);
  if (!c) return;
  cor = c;
  coresBt.forEach((b) => { const on = b.dataset.cor === id; b.classList.toggle('is-ativa', on); b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; });
  corNome.textContent = c.nome;
  preco.textContent = real(c.preco);
  precoBotao.textContent = real(c.preco);
  parc.textContent = `ou ${MARCA.parcelas}x de ${realCentavos(c.preco / MARCA.parcelas)} sem juros`;
  main.style.setProperty('--fundo-foto', c.fundo);
  // as fotos da cor nova trocam com um apagar rápido, na mesma ordem
  fotos().forEach((f, k) => {
    const nova = c.fotos[k];
    if (!nova) return;
    const img = f.querySelector('img');
    const src = `${raiz}img/${nova[1]}.webp`;
    if (img.getAttribute('src') === src) return;
    if (!anima) { img.src = src; return; }
    f.classList.add('is-trocando');
    const pre = new Image();
    pre.src = src;
    (pre.decode ? pre.decode().catch(() => {}) : Promise.resolve()).then(() => setTimeout(() => { img.src = src; img.alt = `${dados.nome} ${c.nome}`; f.classList.remove('is-trocando'); }, 160));
  });
  if (anima) history.replaceState(null, '', `#${id}`);
};
coresBt.forEach((b, i) => {
  b.addEventListener('click', () => escolheCor(b.dataset.cor));
  b.addEventListener('keydown', (e) => {
    const p = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!p) return;
    e.preventDefault();
    const k = coresBt[(i + p + coresBt.length) % coresBt.length];
    k.focus();
    escolheCor(k.dataset.cor);
  });
});
const daUrl = location.hash.slice(1);
if (daUrl && dados.cores.some((k) => k.id === daUrl)) escolheCor(daUrl, { anima: false });

// TAMANHO (ou lente)
let tamanho = dados.tamanhos.length === 1 ? dados.tamanhos[0] : null;
const marca = (b) => {
  tamanho = b.dataset.tam;
  tams.forEach((t) => { t.setAttribute('aria-checked', String(t === b)); t.tabIndex = t === b ? 0 : -1; });
  dicaTam.classList.remove('is-dica');
  dicaTam.textContent = dados.opcoes === 'Lente' ? `Lente ${tamanho}` : `Tamanho ${tamanho}`;
};
tams.forEach((b, i) => {
  b.addEventListener('click', () => marca(b));
  b.addEventListener('keydown', (e) => {
    const p = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!p) return;
    e.preventDefault();
    const k = tams[(i + p + tams.length) % tams.length];
    k.focus();
    marca(k);
  });
});

// ADICIONAR
botaoAdd.addEventListener('click', () => {
  if (!tamanho) {
    dicaTam.textContent = dados.opcoes === 'Lente' ? 'Escolha a lente' : 'Escolha o tamanho';
    dicaTam.classList.add('is-dica');
    gsap.fromTo(tams, { x: -5 }, { x: 0, duration: 0.7, ease: 'elastic.out(1, 0.32)', stagger: 0.035, clearProps: 'transform' });
    tams[0]?.focus({ preventScroll: true });
    return;
  }
  const primeira = fotos()[0];
  const r = primeira.getBoundingClientRect();
  const visivel = r.bottom > 80 && r.top < innerHeight;
  const de = visivel ? { x: r.left + r.width / 2, y: Math.max(120, Math.min(innerHeight - 80, r.top + r.height * 0.45)) } : (() => { const b = botaoAdd.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })();
  const nomeCor = dados.cores.length > 1 ? `${dados.nome} ${cor.nome}` : dados.nome;
  sacola.adiciona(
    { chave: `${dados.slug}-${cor.id}-${tamanho}`, nome: nomeCor, detalhe: tamanho === 'Único' ? dados.tipo : `${dados.tipo} · ${tamanho}`, preco: cor.preco, img: `img/${cor.fotos[0][1]}.webp`, fundo: cor.fundo, tipo: dados.grupo },
    { de },
  );
});

// ÍNDICE DAS FOTOS: a foto mais à vista acende no índice; clicar leva até ela
const indice = [...document.querySelectorAll('[data-ir]')];
const vis = new Map();
const io = new IntersectionObserver((es) => {
  for (const e of es) vis.set(e.target, e.intersectionRatio);
  let melhor = null, mr = 0;
  for (const [f, r] of vis) if (r > mr) { mr = r; melhor = f; }
  if (melhor) indice.forEach((a) => a.classList.toggle('is-ativo', Number(a.dataset.ir) === Number(melhor.dataset.foto)));
}, { threshold: [0, 0.25, 0.5, 0.75, 1] });
fotos().forEach((f) => io.observe(f));
indice.forEach((a) => a.addEventListener('click', (e) => {
  e.preventDefault();
  const f = fotos()[Number(a.dataset.ir)];
  if (f) irPara(f.getBoundingClientRect().top + scrollY - 96, { dur: 1 });
}));
