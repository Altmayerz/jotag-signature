// Sacola: o estado (itens, quantidades) mora no localStorage, que o checkout também lê. A gaveta entra pela direita
// com o véu; Esc, o véu e o X fecham; o foco fica preso nela enquanto aberta e volta para quem abriu. "Combina com"
// sugere os dois primeiros acessórios que ainda não estão na sacola e adiciona com um clique, sem fechar nada.
import { gsap } from './ease.js';
import { ACESSORIOS, MARCA, real, realCentavos } from '../config.js';
import { trava, solta } from './rolagem.js';
import { caminho } from './paginas.js';

const CHAVE = 'nix-sacola';
const ler = () => { try { return JSON.parse(localStorage.getItem(CHAVE)) || []; } catch { return []; } };

export function sacola() {
  const raiz = document.querySelector('[data-sacola]');
  const painel = raiz.querySelector('[data-painel]');
  const veu = raiz.querySelector('.sacola__veu');
  const lista = raiz.querySelector('[data-itens]');
  const vazia = raiz.querySelector('[data-vazia]');
  const combina = raiz.querySelector('[data-combina]');
  const sugestoes = raiz.querySelector('[data-sugestoes]');
  const n = raiz.querySelector('[data-sacola-n]');
  const freteTxt = raiz.querySelector('[data-frete-txt]');
  const freteBarra = raiz.querySelector('[data-frete-barra]');
  const subtotal = raiz.querySelector('[data-subtotal]');
  const parcelas = raiz.querySelector('[data-parcelas]');
  const finalizar = raiz.querySelector('[data-finalizar]');
  const botaoSacola = document.querySelector('[data-abre-sacola]');
  const conta = document.querySelector('[data-conta]');

  let itens = ler();
  let aberta = false;
  let quemAbriu = null;
  const grava = () => { try { localStorage.setItem(CHAVE, JSON.stringify(itens)); } catch { /* modo privado */ } };
  const total = () => itens.reduce((s, i) => s + i.preco * i.qtd, 0);
  const pecas = () => itens.reduce((s, i) => s + i.qtd, 0);

  function desenha(novo) {
    lista.innerHTML = itens.map((i) => `
      <li class="item${i.chave === novo ? ' is-novo' : ''}" data-chave="${i.chave}">
        <img class="item__img" src="${caminho(i.img)}" alt="" style="--fundo-item:${i.fundo}">
        <div>
          <p class="item__nome">${i.nome}</p>
          <p class="item__det">${i.detalhe}</p>
          <div class="item__qtd">
            <button type="button" data-menos aria-label="Tirar um ${i.nome}">−</button>
            <output aria-live="polite">${i.qtd}</output>
            <button type="button" data-mais aria-label="Pôr mais um ${i.nome}">+</button>
          </div>
        </div>
        <div class="item__dir">
          <span class="item__preco">${realCentavos(i.preco * i.qtd)}</span>
          <button class="item__remover" type="button" data-remover>Remover</button>
        </div>
      </li>`).join('');
    vazia.hidden = itens.length > 0;
    const sug = ACESSORIOS.filter((a) => !itens.some((i) => i.chave === `acc-${a.id}`)).slice(0, 2);
    combina.hidden = !itens.length || !sug.length;
    sugestoes.innerHTML = sug.map((a) => `
      <li class="sugestao">
        <img class="sugestao__img" src="${caminho(a.img)}" alt="">
        <div><p class="sugestao__nome">${a.nome}</p><p class="sugestao__preco">${real(a.preco)}</p></div>
        <button class="sugestao__add" type="button" data-sugere="${a.id}" aria-label="Adicionar ${a.nome}">Adicionar</button>
      </li>`).join('');

    const t = total(), q = pecas();
    n.textContent = `(${q})`;
    const falta = MARCA.freteGratis - t;
    freteTxt.innerHTML = falta <= 0 ? '<strong>Frete grátis liberado</strong> para este pedido' : `Faltam <strong>${real(Math.ceil(falta))}</strong> para o frete grátis`;
    freteBarra.style.setProperty('--p', Math.min(1, t / MARCA.freteGratis).toFixed(3));
    subtotal.textContent = realCentavos(t);
    parcelas.textContent = t ? `ou ${MARCA.parcelas}x de ${realCentavos(t / MARCA.parcelas)} sem juros` : `em até ${MARCA.parcelas}x sem juros`;
    finalizar.classList.toggle('is-off', !q);
    finalizar.setAttribute('aria-disabled', String(!q));
    conta.textContent = q;
    conta.classList.toggle('is-on', q > 0);
    botaoSacola.setAttribute('aria-label', q ? `Sacola, ${q} ${q === 1 ? 'item' : 'itens'}` : 'Sacola, vazia');
  }

  function adiciona(item, { de = null, abrir = true } = {}) {
    const ja = itens.find((i) => i.chave === item.chave);
    if (ja) ja.qtd++;
    else itens.push({ ...item, qtd: 1 });
    grava();
    const fim = () => { desenha(item.chave); pulo(); if (abrir && !aberta) abre(); };
    if (de && !matchMedia('(prefers-reduced-motion: reduce)').matches) voa(de, item).then(fim);
    else fim();
  }

  // o cartão que voa: nasce em "de" com um pulo e segue uma curva (Bézier quadrática) até o ícone da sacola,
  // encolhendo e girando um pouco
  function voa(de, item) {
    const alvo = botaoSacola.getBoundingClientRect();
    const card = document.createElement('div');
    card.className = 'voo';
    card.innerHTML = `<img src="${caminho(item.img)}" alt="" style="background:${item.fundo}">`;
    document.body.append(card);
    const p0 = { x: de.x - 32, y: de.y - 40 };
    const p1 = { x: alvo.left + alvo.width / 2 - 32, y: alvo.top + alvo.height / 2 - 40 };
    const c = { x: p0.x + (p1.x - p0.x) * 0.62, y: Math.min(p0.y, p1.y) - 150 };
    const st = { p: 0 };
    gsap.set(card, { x: p0.x, y: p0.y, scale: 0.35, opacity: 0, rotation: 0 });
    return new Promise((ok) => {
      gsap.timeline({ onComplete: () => { card.remove(); ok(); } })
        .to(card, { scale: 1.08, opacity: 1, duration: 0.26, ease: 'back.out(2.2)' })
        .to(st, {
          p: 1, duration: 0.74, ease: 'n-io',
          onUpdate: () => {
            const t = st.p, u = 1 - t;
            gsap.set(card, {
              x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x,
              y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y,
              scale: 1.08 - 0.84 * t, rotation: 16 * t,
            });
          },
        }, '+=0.06')
        .to(card, { opacity: 0, duration: 0.12, ease: 'n-in' }, '-=0.1');
    });
  }
  const pulo = () => gsap.fromTo(botaoSacola, { scale: 1.3 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.42)', clearProps: 'scale' });

  function abre() {
    if (aberta) return;
    aberta = true;
    quemAbriu = document.activeElement;
    raiz.hidden = false;
    trava();
    gsap.killTweensOf([painel, veu]);
    gsap.set(painel, { x: 0 });
    gsap.fromTo(veu, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'n-out' });
    gsap.fromTo(painel, { xPercent: 100 }, { xPercent: 0, duration: 0.66, ease: 'n-out' });
    gsap.fromTo(painel.querySelectorAll('.sacola__topo, .sacola__frete, .item, .sacola__combina, .sacola__pe'), { opacity: 0, x: 24 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'n-out', stagger: 0.045, delay: 0.12, clearProps: 'opacity,transform' });
    painel.focus({ preventScroll: true });
    document.addEventListener('keydown', teclado);
  }
  function fecha() {
    if (!aberta) return;
    aberta = false;
    document.removeEventListener('keydown', teclado);
    gsap.killTweensOf([painel, veu]);
    gsap.to(painel, { xPercent: 100, duration: 0.46, ease: 'n-in' });
    gsap.to(veu, {
      opacity: 0, duration: 0.42, ease: 'n-in',
      onComplete: () => { raiz.hidden = true; solta(); quemAbriu?.focus?.({ preventScroll: true }); },
    });
  }
  function teclado(e) {
    if (e.key === 'Escape') { e.preventDefault(); fecha(); return; }
    if (e.key !== 'Tab') return;
    const foco = [...painel.querySelectorAll('button, a[href], [tabindex="0"]')].filter((x) => !x.closest('[hidden]') && x.offsetParent !== null);
    if (!foco.length) return;
    const primeiro = foco[0], ultimo = foco[foco.length - 1];
    if (e.shiftKey && (document.activeElement === primeiro || document.activeElement === painel)) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
  }

  raiz.addEventListener('click', (e) => {
    const alvo = e.target.closest('button, [data-fecha-sacola]');
    if (!alvo) return;
    if (alvo.hasAttribute('data-fecha-sacola')) { fecha(); return; }
    const li = alvo.closest('.item');
    if (alvo.dataset.sugere) {
      const a = ACESSORIOS.find((x) => x.id === alvo.dataset.sugere);
      adiciona({ chave: `acc-${a.id}`, nome: a.nome, detalhe: a.detalhe, preco: a.preco, img: a.img, fundo: '#1d2127', tipo: 'acessorio' }, { abrir: false });
      return;
    }
    if (!li) return;
    const item = itens.find((i) => i.chave === li.dataset.chave);
    if (!item) return;
    if (alvo.hasAttribute('data-mais')) item.qtd++;
    else if (alvo.hasAttribute('data-menos')) item.qtd--;
    if (alvo.hasAttribute('data-remover') || item.qtd <= 0) {
      gsap.to(li, {
        height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0, duration: 0.38, ease: 'n-in',
        onComplete: () => { itens = itens.filter((i) => i !== item); grava(); desenha(); },
      });
      return;
    }
    grava();
    desenha();
  });
  botaoSacola.addEventListener('click', abre);
  finalizar.addEventListener('click', (e) => { if (!pecas()) e.preventDefault(); });
  finalizar.dataset.label = 'Checkout';

  desenha();
  return { adiciona, abre, fecha };
}
