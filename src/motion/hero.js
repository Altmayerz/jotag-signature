import { gsap, ScrollTrigger } from './ease.js';
import { CORES, real } from '../config.js';

// o que muda junto com o fundo em cada cor
const VARS = {
  breu: { vidro: 'rgb(18 20 24 / 0.06)', ativo: 'rgb(255 255 255 / 0.7)', topo: 'rgb(18 20 24 / 0.07)', luz: 'rgb(255 255 255 / 0.62)', serra: 'rgb(112 124 142 / 0.38)', nevoa: 'rgb(246 247 249 / 0.92)', frente: 'rgb(246 247 249 / 0.55)', marca: 0.96 },
  gelo: { vidro: 'rgb(247 248 250 / 0.14)', ativo: 'rgb(247 248 250 / 0.32)', topo: 'rgb(247 248 250 / 0.16)', luz: 'rgb(255 255 255 / 0.3)', serra: 'rgb(58 70 90 / 0.34)', nevoa: 'rgb(230 235 242 / 0.6)', frente: 'rgb(230 235 242 / 0.34)', marca: 0.62 },
  cromo: { vidro: 'rgb(247 248 250 / 0.08)', ativo: 'rgb(247 248 250 / 0.2)', topo: 'rgb(247 248 250 / 0.1)', luz: 'rgb(178 192 212 / 0.24)', serra: 'rgb(160 175 196 / 0.18)', nevoa: 'rgb(160 175 196 / 0.26)', frente: 'rgb(160 175 196 / 0.14)', marca: 0.32 },
  sinal: { vidro: 'rgb(247 248 250 / 0.07)', ativo: 'rgb(247 248 250 / 0.18)', topo: 'rgb(247 248 250 / 0.09)', luz: 'rgb(178 192 212 / 0.17)', serra: 'rgb(160 175 196 / 0.13)', nevoa: 'rgb(160 175 196 / 0.2)', frente: 'rgb(160 175 196 / 0.11)', marca: 0.25 },
};
const PERSP = 700; // perspectiva das letras que viram

export function hero({ sacola }) {
  const el = document.querySelector('[data-hero]');
  const topo = document.querySelector('[data-topo]');
  const cena = el.querySelector('[data-cena]');
  const tinta = el.querySelector('[data-tinta]');
  const peNovo = el.querySelector('[data-pe-novo]'); // celular: o degradê do pé na cor nova, recortado junto com o fundo
  const nome = el.querySelector('[data-nome]');
  const copy = el.querySelector('.signature-copy');
  const descriptions = {Elegance:'Sofisticação que se revela nos detalhes.',Timeless:'O estilo que permanece, além das tendências.',Heritage:'Personalidade e tradição em cada detalhe.',Classic:'Toda grande história começa com uma boa assinatura.'};
  const preco = el.querySelector('[data-preco]');
  const linha = el.querySelector('[data-linha]');
  const fichas = [...el.querySelectorAll('[data-cor]')];
  const tams = [...el.querySelectorAll('[data-tam]')];
  const dicaEl = el.querySelector('[data-dica]');
  const add = el.querySelector('[data-adicionar]');
  const detalhes = el.querySelector('[data-detalhes]');
  const caixaModelos = el.querySelector('.hero__modelos');
  const modelos = Object.fromEntries([...el.querySelectorAll('[data-modelo]')].map((i) => [i.dataset.modelo, i]));
  const tingidos = [...el.querySelectorAll('[data-tinge]'), topo];
  const burn = el.querySelector('[data-film-burn]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  gsap.set(caixaModelos, { xPercent: 0, x: 0 }); // o GSAP passa a ser dono do transform da caixa da modelo

  let atual = 0;
  let tamanho = null;
  let tl = null;
  let pendente = null;
  let preparando = false;
  const prontas = new Map(Object.values(modelos).map(img => [img, img.decode().then(() => true, () => false)]));

  const letras = (txt) => {
    nome.textContent = '';
    const word = document.createElement('span');
    word.className = 'l';
    word.textContent = txt;
    nome.append(word);
    return [word];
  };
  const pinta = (c, { fundo = true } = {}) => {
    const v = VARS[c.id];
    if (fundo) el.style.setProperty('--hero-fundo', c.fundo);
    const props = { '--hero-tinta': c.tinta, '--vidro': v.vidro, '--vidro-ativo': v.ativo, '--luz': v.luz, '--serra': v.serra, '--nevoa': v.nevoa, '--nevoa-frente': v.frente, '--marca-a': String(v.marca) };
    for (const [k, val] of Object.entries(props)) el.style.setProperty(k, val);
    topo.style.setProperty('--vidro-topo', v.topo);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', c.fundo);
  };


  letras(CORES[0].titulo); copy.textContent = descriptions[CORES[0].titulo];
  pinta(CORES[0]);
  topo.style.setProperty('--t', CORES[0].tinta);

  // ENTRADA
  function entrada(imediato) {
    const ls = [...nome.children];
    const resto = [...el.querySelectorAll('[data-entra]')];
    if (imediato) {
      gsap.set([...ls, ...resto, ...fichas], { clearProps: 'opacity,transform,filter' });

      return;
    }
    const marcaImg = el.querySelector('.hero__marca img');
    const serra = el.querySelector('.hero__serra');
    const nevoas = el.querySelectorAll('.hero__nevoa');
    gsap.fromTo(serra, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.8, ease: 'n-out', delay: 0.1, clearProps: 'transform,opacity' });
    gsap.fromTo(marcaImg, { opacity: 0, scale: 1.1, filter: 'blur(16px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.6, ease: 'n-out', delay: 0.12, clearProps: 'all' });
    gsap.fromTo(nevoas, { opacity: 0 }, { opacity: 1, duration: 1.6, ease: 'n-out', delay: 0.2, clearProps: 'opacity' });

    gsap.fromTo(ls, { yPercent: 104, rotationX: -88, opacity: 0, filter: 'blur(10px)' },
      { yPercent: 0, rotationX: 0, opacity: 1, filter: 'blur(0px)', transformPerspective: PERSP, duration: 1.2, ease: 'n-out', stagger: 0.06, delay: 0.42, clearProps: 'filter' });
    gsap.fromTo(resto, { opacity: 0, y: 24, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.05, ease: 'n-out', stagger: 0.08, delay: 0.66, clearProps: 'transform,filter' });
    gsap.fromTo(fichas, { opacity: 0, x: 42, filter: 'blur(6px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.1, ease: 'n-out', stagger: 0.075, delay: 0.56, clearProps: 'transform,filter,opacity' });
    gsap.fromTo(topo.children, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 1, ease: 'n-out', stagger: 0.07, delay: 0.5, clearProps: 'transform,opacity' });
  }

  // o preço do botão rola: o velho sobe e some, o novo vem de baixo
  const rolaPreco = (txt) => {
    const s = preco.firstElementChild;
    gsap.to(s, {
      yPercent: -100, opacity: 0, duration: 0.2, ease: 'n-in', overwrite: true,
      onComplete: () => { s.textContent = txt; gsap.fromTo(s, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'n-out' }); },
    });
  };

  // Decoded photographs crossfade without exposing the background.
  async function troca(i, origem) {
    if (preparando || tl?.isActive()) { pendente = [i, origem]; return; }
    if (i === atual) return;
    const de = CORES[atual], para = CORES[i];
    const velho = modelos[de.id], novo = modelos[para.id];
    preparando = true;
    const pronto = await prontas.get(novo);
    preparando = false;
    if (!pronto) {
      if (pendente) { const [k,f] = pendente; pendente = null; troca(k,f); }
      return;
    }
    atual = i;
    fichas.forEach((f,k) => { f.classList.toggle('is-ativa', k === i); f.setAttribute('aria-checked', String(k === i)); f.tabIndex = k === i ? 0 : -1; });
    const update = () => { copy.textContent = descriptions[para.titulo]; pinta(para); topo.style.setProperty('--t', para.tinta); linha.innerHTML = para.linha.join('<br>'); detalhes.href = `produto/serac/#${para.id}`; detalhes.dataset.label = `Tricot ${para.titulo}`; };
    // Keep the outgoing photograph fully opaque underneath the incoming one.
    // Only the incoming layer animates; the background is never exposed.
    gsap.killTweensOf([velho, novo, cena, ...nome.children, linha, copy]);
    gsap.set(velho, {zIndex: 1, opacity: 1});
    gsap.set(novo, {zIndex: 2, opacity: 0});
    const updateText = () => {
      letras(para.titulo);
      gsap.set(nome.children, {opacity: 1, clearProps: 'transform,filter'});
      preco.firstElementChild.textContent = real(para.preco);
      update();
    };
    const finish = () => {
      gsap.set(novo, {opacity: 1, zIndex: 2});
      novo.classList.add('is-ativa');
      velho.classList.remove('is-ativa');
      gsap.set(velho, {zIndex: 0, opacity: 0});
      gsap.set(novo, {zIndex: 1});
      tl = null;
      if (pendente) { const [k,f] = pendente; pendente = null; troca(k,f); }
    };
    if (reduced.matches) { updateText(); finish(); return; }
    tl = gsap.timeline({onComplete: finish});
    tl.to(novo, {opacity: 1, duration: 0.9, ease: 'sine.inOut'}, 0);
    tl.call(updateText, [], 0.45);

  }
  fichas.forEach((f, i) => {
    f.tabIndex = i === 0 ? 0 : -1;
    f.addEventListener('click', () => troca(i, f));
    f.addEventListener('keydown', (e) => {
      const passo = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!passo) return;
      e.preventDefault();
      const k = (i + passo + fichas.length) % fichas.length;
      fichas[k].focus();
      troca(k, fichas[k]);
    });
  });

  // TAMANHO
  const marcaTam = (b) => {
    tamanho = b.dataset.tam;
    tams.forEach((t) => { t.setAttribute('aria-checked', String(t === b)); t.tabIndex = t === b ? 0 : -1; });
    dicaEl.textContent = 'Tamanho';
    dicaEl.classList.remove('is-dica');
  };
  tams.forEach((b, i) => {
    b.tabIndex = i === 0 ? 0 : -1;
    b.addEventListener('click', () => marcaTam(b));
    b.addEventListener('keydown', (e) => {
      const passo = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!passo) return;
      e.preventDefault();
      const k = (i + passo + tams.length) % tams.length;
      tams[k].focus();
      marcaTam(tams[k]);
    });
  });
  let dicaTempo = 0;
  const dica = () => {
    dicaEl.textContent = 'Escolha o tamanho';
    dicaEl.classList.add('is-dica');
    gsap.fromTo(tams, { x: -5 }, { x: 0, duration: 0.7, ease: 'elastic.out(1, 0.32)', stagger: 0.035, clearProps: 'transform' });
    tams[0].focus({ preventScroll: true });
    clearTimeout(dicaTempo);
    dicaTempo = setTimeout(() => { if (!tamanho) { dicaEl.textContent = 'Tamanho'; dicaEl.classList.remove('is-dica'); } }, 2600);
  };

  // ADICIONAR: o cartão nasce no peito da modelo e voa até a sacola
  add.addEventListener('click', () => {
    if (!tamanho) { dica(); return; }
    const c = CORES[atual];
    const m = modelos[c.id].getBoundingClientRect();
    sacola.adiciona(
      { chave: `serac-${c.id}-${tamanho}`, nome: `${c.produto} ${c.titulo}`, detalhe: `${c.tipo} · ${tamanho}`, preco: c.preco, img: c.img, fundo: c.fundo, tipo: 'roupa' },
      { de: { x: m.left + m.width * 0.5, y: m.top + m.height * 0.5 } },
    );
  });

  // coberto pela coleção, o hero para de desenhar (a neve e a profundidade); volta quando ela desce

  // escolher uma cor de fora (o "Comprar Elegance" da coleção, o "Comprar Tricot" da jaqueta solta)
  const escolhe = (id) => { const i = CORES.findIndex((c) => c.id === id); if (i >= 0) troca(i, fichas[i]); };

  return { entrada, escolhe };
}
