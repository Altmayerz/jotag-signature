// Caminhos entre as páginas: a home e o checkout ficam na raiz do site; as páginas de produto, duas pastas abaixo
// (produto/<slug>/), com <meta name="raiz" content="../../">. caminho() resolve as fotos guardadas na sacola
// (sempre relativas à raiz) e consertaLinks() aponta para a home os links de seção (#colecao…) que não existem na
// página (os caminhos de arquivo das seções incluídas o vite.config.js já acerta no build).
export const raiz = () => document.querySelector('meta[name="raiz"]')?.content || '';
export const caminho = (rel) => (/^(https?:|\/|data:|blob:)/.test(rel) ? rel : raiz() + rel);

export function consertaLinks() {
  const r = raiz();
  for (const a of document.querySelectorAll('a[href]')) {
    const h = a.getAttribute('href');
    if (h.startsWith('#') && h.length > 1 && !document.getElementById(h.slice(1))) {
      a.setAttribute('href', `${r}index.html${h}`);
      a.dataset.troca = '';
      a.dataset.label ||= 'JotaG Signature';
    }
  }
}
