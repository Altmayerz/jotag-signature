// JotaG Signature: monta a rolagem, a barra de rolagem própria, a sacola, o hero, o topo e a abertura (que solta o hero quando
// as fotos da primeira tela chegaram).
import { criarRolagem, irPara } from './motion/rolagem.js';
import { scrollbar } from './motion/scrollbar.js';
import { abertura } from './motion/abertura.js';
import { hero } from './motion/hero.js';
import { sacola } from './motion/sacola.js';
import { topo } from './motion/topo.js';
import { ScrollTrigger } from './motion/ease.js';
import { revelacoes } from './motion/revela.js';
import { colecao } from './motion/colecao.js';
import { numeros } from './motion/numeros.js';
import { montanha } from './motion/montanha.js';
import { sobe } from './motion/sobe.js';
import { solta } from './motion/solta.js';
import { trilho } from './motion/trilho.js';
import { lookbook } from './motion/lookbook.js';
import { cume } from './motion/cume.js';
import { drop } from './motion/drop.js';
import { listas } from './motion/lista.js';
import { rodape } from './motion/rodape.js';
import { ancoras } from './motion/ancoras.js';
import { passagem } from './motion/passagem.js';
import './motion/rolando.js';

const html = document.documentElement;
window.__nixViva = true;
// sem transição no primeiro quadro (a trava sai depois de dois quadros)
requestAnimationFrame(() => requestAnimationFrame(() => html.classList.add('assentou')));
history.scrollRestoration = 'manual';

const lenis = criarRolagem();
scrollbar({ lenis });
const s = sacola();
const h = hero({ sacola: s });
topo({ lenis });
revelacoes();
colecao({ sacola: s });
montanha();
sobe();
trilho();
// Lookbook editorial estático, sem quadros vazios.
listas();
rodape();
ancoras({ hero: h });
passagem();
// chegando de outra página por um link para uma seção: vai direto até ela
if (location.hash && document.querySelector(location.hash)) requestAnimationFrame(() => irPara(document.querySelector(location.hash).getBoundingClientRect().top + scrollY - 20, { imediato: true }));
abertura({ entrada: h.entrada });

// fontes e fotos que chegam mudam a altura da página: remede as cenas presas
let largura = innerWidth;
let tempo = 0;
const remede = () => { lenis?.resize(); ScrollTrigger.refresh(); };
addEventListener('resize', () => { if (innerWidth === largura) return; largura = innerWidth; clearTimeout(tempo); tempo = setTimeout(remede, 150); });
document.fonts.ready.then(remede);
addEventListener('load', remede, { once: true });
