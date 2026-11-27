// Gera, a partir de src/dados/produtos.js, uma página estática por produto em produto/<slug>/index.html (endereço
// próprio que abre direto em qualquer hospedagem: /produto/firn/ é uma pasta com index.html, sem rewrite).
// Roda sozinho antes do dev e do build (package.json: predev/prebuild). Uso manual: node scripts/paginas.mjs
// Fotos que ainda não existem em public/img ficam de fora da página.
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { PRODUTOS, COLECAO, GARANTIAS, precoDe } from '../src/dados/produtos.js';

const R = '../../'; // da página do produto até a raiz do site
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const real = (v) => 'R$ ' + v.toLocaleString('pt-BR');
const centavos = (v) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const existe = (n) => existsSync(`public/img/${n}.webp`);
const SETA = '';
const FAV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19.6s-7.2-4.3-7.2-9.4A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7.2 2.2c0 5.1-7.2 9.4-7.2 9.4Z"/></svg>';
const total = String(PRODUTOS.length).padStart(2, '0');
// a foto do cartão: a Tricot usa a de corpo inteiro (a do hero é recortada); os outros, a primeira foto
const fotoCartao = (p) => (p.slug === 'serac' ? 'prod-serac' : p.cores[0].fotos[0][1]);

const topo = () => `<header class="topo is-barra topo--fixo" data-topo>
  <nav class="topo__nav" aria-label="Loja">
    <a class="topo__link" href="${R}index.html#colecao" data-troca data-label="Coleção">Loja</a>
    <a class="topo__link" href="${R}index.html#colecao" data-troca data-label="Coleção">Vestuário</a>
    <a class="topo__link" href="${R}index.html#acessorios" data-troca data-label="Acessórios">Seleção</a>
    <a class="topo__link" href="${R}index.html#lookbook" data-troca data-label="Lookbook">Lookbook</a>
  </nav>
  <a class="topo__marca" href="${R}index.html" data-troca data-label="JotaG Signature" aria-label="JotaG Signature, voltar à loja"><!-- @svg logo topo__logo --></a>
  <div class="topo__acoes">
    <a class="topo__link topo__ajuda" href="${R}index.html#ajuda" data-troca data-label="Ajuda">Ajuda</a>
    <button class="topo__icone" type="button" aria-label="Buscar"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.2"/><path d="m15.2 15.2 4.6 4.6"/></svg></button>
    <button class="topo__icone" type="button" aria-label="Favoritos"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19.6s-7.2-4.3-7.2-9.4A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7.2 2.2c0 5.1-7.2 9.4-7.2 9.4Z"/></svg></button>
    <button class="topo__icone topo__sacola" type="button" aria-label="Sacola, vazia" data-abre-sacola>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.6 8.4h12.8l-.9 11.2H6.5L5.6 8.4Z"/><path d="M9 8.4V7a3 3 0 0 1 6 0v1.4"/></svg>
      <span class="topo__conta" data-conta>0</span>
    </button>
  </div>
</header>`;

// cartão de produto (o mesmo da home: hover com as opções; a foto leva para a página)
export const cartao = (p, raiz) => {
  const c = p.cores[0];
  const escuro = p.grupo === 'acessorio';
  const ops = p.tamanhos.map((t) => `<button type="button" data-tam="${esc(t)}">${t === 'Único' ? 'Adicionar' : esc(t)}</button>`).join('');
  const dica = p.tamanhos.length === 1 ? 'Tamanho único' : `Adicionar · escolha ${p.opcoes === 'Lente' ? 'a lente' : 'o tamanho'}`;
  const pontos = p.cores.map((k) => `<span class="ponto" style="--c:${k.hex}"></span>`).join('');
  const nCores = `${p.cores.length} ${p.cores.length === 1 ? 'cor' : 'cores'}`;
  return `<li class="relacionados__item">
        <article class="card${escuro ? ' card--escuro' : ''}" data-produto="${p.slug}" data-nome="${esc(p.nome)}" data-tipo="${esc(p.tipo)}" data-preco="${precoDe(p).toLocaleString('pt-BR')}" data-img="img/${fotoCartao(p)}.webp" data-fundo="${c.fundo}">
          <div class="card__foto">
            <a class="card__link" href="${raiz}produto/${p.slug}/" data-troca data-label="${esc(p.nome)}" aria-label="${esc(p.nome)}, ${real(precoDe(p))}"></a>
            <img class="card__img" src="${raiz}img/${fotoCartao(p)}.webp" alt="" width="720" height="900" loading="lazy" decoding="async" draggable="false">
            ${p.selo ? `<span class="selo${escuro ? ' selo--claro' : ''}">${p.selo}</span>` : ''}
            <button class="fav" type="button" aria-pressed="false" aria-label="Favoritar ${esc(p.nome)}">${FAV}</button>
            <div class="card__tam" role="group" aria-label="Adicionar ${esc(p.nome)} à sacola">
              <p class="card__dica">${dica}</p>
              <div class="card__tams">${ops}</div>
            </div>
          </div>
          <div class="card__info">
            <h3 class="card__nome">${esc(p.nome)}</h3><span class="card__preco">${real(precoDe(p))}</span>
            <p class="card__tipo">${esc(p.tipo)}</p>
            <p class="card__cores">${pontos}<span>${nCores}</span></p>
          </div>
        </article>
      </li>`;
};

const pagina = (p, i) => {
  const c = p.cores[0];
  const fotos = (cor) => cor.fotos.filter(([, n]) => existe(n));
  const fs = fotos(c);
  const outros = PRODUTOS.filter((q) => q !== p);
  const mesmo = outros.filter((q) => q.grupo === p.grupo), outro = outros.filter((q) => q.grupo !== p.grupo);
  const juntos = [...outro.slice(i % Math.max(1, outro.length - 1), (i % Math.max(1, outro.length - 1)) + 2), ...mesmo.slice(0, 2)].slice(0, 4);
  const dados = { slug: p.slug, nome: p.nome, tipo: p.tipo, grupo: p.grupo, opcoes: p.opcoes || 'Tamanho', tamanhos: p.tamanhos, cores: p.cores.map((k) => ({ ...k, fotos: fotos(k) })) };
  const rotOp = p.opcoes || 'Tamanho';
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(p.nome)} · ${esc(p.tipo)} · JotaG Signature</title>
  <meta name="description" content="${esc(p.desc)}">
  <meta name="theme-color" content="#e6e8eb">
  <meta name="raiz" content="${R}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <!-- gerado por scripts/paginas.mjs a partir de src/dados/produtos.js; não editar à mão -->
  <script>
    (function () {
      var d = document.documentElement;
      d.classList.add('js');
      try { if (sessionStorage.getItem('nix-passagem')) { d.classList.add('chegando'); sessionStorage.removeItem('nix-passagem'); } } catch (e) {}
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) d.classList.add('reduzido');
      if (matchMedia('(hover: none)').matches) d.classList.add('toque');
      setTimeout(function () { if (!window.__nixViva) d.classList.remove('js', 'chegando'); }, 4000);
    })();
  </script>
  <style>
    html { background: #e6e8eb; color: #121418; }
    html.chegando { background: #3b4454; }
    body { margin: 0; }
    html:not(.assentou) *, html:not(.assentou) *::before, html:not(.assentou) *::after { transition: none !important; }
  </style>
  <link rel="preload" href="/node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/src/styles/produto-site.css">
</head>
<body class="pag-produto">
  <div class="passagem" data-passagem aria-hidden="true">
    <!-- @svg logo passagem__logo -->
    <p class="passagem__txt" data-passagem-txt>${esc(p.nome)}</p>
  </div>

  ${topo()}

  <main class="produto" id="conteudo" style="--fundo-foto:${c.fundo}">
    <div class="wrap produto__grade">
      <aside class="produto__ficha" data-entra-pdp>
        <nav class="migalha" aria-label="Você está em"><a href="${R}index.html" data-troca data-label="JotaG Signature">Início</a><span aria-hidden="true">/</span><a href="${R}index.html#${p.grupo === 'acessorio' ? 'acessorios' : 'colecao'}" data-troca data-label="${p.grupo === 'acessorio' ? 'Acessórios' : 'Coleção'}">${p.grupo === 'acessorio' ? 'Acessórios' : 'Coleção'}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.nome)}</span></nav>
        <p class="rotulo produto__rotulo">${COLECAO} · ${String(i + 1).padStart(2, '0')}/${total}</p>
        <h1 class="produto__nome">${esc(p.nome)}</h1>
        <p class="produto__tipo">${esc(p.tipo)}</p>
        <p class="produto__desc">${esc(p.desc)}</p>
        <dl class="produto__ficha-lista">
${p.ficha.map(([k, v]) => `          <div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n')}
        </dl>
      </aside>

      <div class="produto__fotos" data-fotos>
${fs.map(([tipo, n, leg], k) => `        <figure class="foto foto--${tipo}${n.startsWith('hero-') ? ' foto--recorte' : ''}" id="foto-${k + 1}" data-foto="${k}">
          <img src="${R}img/${n}.webp" alt="${esc(p.nome)} ${esc(c.nome)}: ${esc(leg.toLowerCase())}" ${k === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
          <figcaption><span>${String(k + 1).padStart(2, '0')}</span>${esc(leg)}</figcaption>
        </figure>`).join('\n')}
      </div>

      <aside class="produto__compra" data-entra-pdp>
        <p class="produto__preco"><span data-preco>${real(c.preco)}</span></p>
        <p class="produto__parc" data-parc>ou 10x de ${centavos(c.preco / 10)} sem juros</p>
        <div class="produto__grupo">
          <p class="produto__rot">Cor <span data-cor-nome>${esc(c.nome)}</span></p>
          <div class="cores" role="radiogroup" aria-label="Cor" data-cores>
${p.cores.map((k, j) => `            <button class="cor${j === 0 ? ' is-ativa' : ''}" type="button" role="radio" aria-checked="${j === 0}" aria-label="${esc(k.nome)}" data-cor="${k.id}" style="--c:${k.hex}"${j === 0 ? '' : ' tabindex="-1"'}></button>`).join('\n')}
          </div>
        </div>
        <div class="produto__grupo">
          <p class="produto__rot" data-dica-tam>${p.tamanhos.length === 1 ? 'Tamanho único' : rotOp}</p>
          <div class="opcoes-tam" role="radiogroup" aria-label="${rotOp}" data-tams>
${p.tamanhos.length === 1 ? '' : p.tamanhos.map((t, j) => `            <button class="op" type="button" role="radio" aria-checked="false" data-tam="${esc(t)}"${j === 0 ? '' : ' tabindex="-1"'}>${esc(t)}</button>`).join('\n')}
          </div>
        </div>
        <button class="botao botao--escuro produto__add" type="button" data-adicionar><span class="botao__txt">Adicionar à sacola</span><span class="botao__preco" data-preco-botao>${real(c.preco)}</span>${SETA}</button>
        <p class="produto__estoque"><span class="produto__luz" aria-hidden="true"></span>Disponibilidade a confirmar</p>
        <ul class="produto__garantias">
${GARANTIAS[p.grupo].map((g) => `          <li>${esc(g)}</li>`).join('\n')}
        </ul>
        <ol class="produto__indice" data-indice>
${fs.map(([, , leg], k) => `          <li><a href="#foto-${k + 1}" data-ir="${k}"${k === 0 ? ' class="is-ativo"' : ''}><span>${String(k + 1).padStart(2, '0')}</span>${esc(leg)}</a></li>`).join('\n')}
        </ol>
      </aside>
    </div>

    <section class="secao relacionados" aria-labelledby="rel-titulo">
      <div class="wrap">
        <h2 class="titulo" id="rel-titulo" data-revela>Combina com</h2>
        <ul class="relacionados__lista">
      ${juntos.map((q) => cartao(q, R)).join('\n      ')}
        </ul>
      </div>
    </section>
  </main>

  <!-- @secao rodape -->

  <!-- @secao sacola -->

  <script type="application/json" id="produto-dados">${JSON.stringify(dados).replace(/</g, '\\u003c')}</script>
  <script type="module" src="/src/produto.js"></script>
<div class="demo-aviso">PROTÓTIPO CONCEITUAL · imagens de referência e valores ilustrativos · sem vendas reais</div></body>
</html>
`;
};

rmSync('produto', { recursive: true, force: true });
let faltam = 0;
for (const [i, p] of PRODUTOS.entries()) {
  mkdirSync(`produto/${p.slug}`, { recursive: true });
  writeFileSync(`produto/${p.slug}/index.html`, pagina(p, i));
  for (const c of p.cores) faltam += c.fotos.filter(([, n]) => !existe(n)).length;
}
console.log(`${PRODUTOS.length} páginas em produto/${faltam ? ` (${faltam} fotos ainda não existem e ficaram de fora)` : ''}`);
