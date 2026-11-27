import { defineConfig } from 'vite';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';

// Uma seção por arquivo: <!-- @secao hero --> no HTML vira o conteúdo de src/sections/hero.html (vale dentro das
// próprias seções). <!-- @svg logo --> põe o public/logo.svg inline (a marca da abertura e do topo chega no HTML,
// pintada pela cor do CSS, sem esperar o JS).
const SECAO = /<!--\s*@secao\s+([\w-]+)\s*-->/g;
const SVG = /<!--\s*@svg\s+([\w-]+)(?:\s+([\w-]+))?\s*-->/g;
const ler = (p) => readFileSync(resolve(import.meta.dirname, p), 'utf8');
// Páginas em subpastas (produto/<slug>/index.html): os caminhos relativos das seções incluídas (img/…, checkout.html)
// ganham o caminho até a raiz e apontam para o mesmo arquivo que na home. Os links de âncora (#colecao) quem acerta é
// o motion/paginas.js, que sabe quais seções existem na página.
const RELATIVO = /(\s(?:src|href|poster|data-img)=")(?![a-z][\w+.-]*:|\/|#|\.\.?\/)([^"]+")/g;
const raizDe = (arquivo) => {
  const r = arquivo ? relative(dirname(arquivo), import.meta.dirname).split('\\').join('/') : '';
  return r ? `${r}/` : '';
};
const inclui = (html, raiz = '') =>
  html
    .replace(SECAO, (_, nome) => {
      const secao = inclui(ler(`src/sections/${nome}.html`), raiz);
      return raiz ? secao.replace(RELATIVO, `$1${raiz}$2`) : secao;
    })
    .replace(SVG, (_, nome, classe) => {
      const svg = ler(`public/${nome}.svg`).trim();
      return classe ? svg.replace('<svg ', `<svg class="${classe}" aria-hidden="true" focusable="false" `).replace(/ role="img" aria-label="[^"]*"/, '') : svg;
    });
const secoes = () => ({
  name: 'secoes',
  transformIndexHtml: { order: 'pre', handler: (html, ctx) => inclui(html, raizDe(ctx.filename)) },
  handleHotUpdate({ file, server }) {
    if ((file.includes('/src/sections/') && file.endsWith('.html')) || file.endsWith('.svg')) server.ws.send({ type: 'full-reload' });
  },
});

export default defineConfig({
  plugins: [secoes()],
  // base relativa: o dist/ abre em qualquer pasta da hospedagem, não só na raiz do domínio
  base: './',
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        checkout: resolve(import.meta.dirname, 'checkout.html'),
        // uma página por produto, geradas por scripts/paginas.mjs
        ...Object.fromEntries((existsSync(resolve(import.meta.dirname, 'produto')) ? readdirSync(resolve(import.meta.dirname, 'produto')) : [])
          .map((s) => [`produto-${s}`, resolve(import.meta.dirname, `produto/${s}/index.html`)])),
      },
    },
  },
});
