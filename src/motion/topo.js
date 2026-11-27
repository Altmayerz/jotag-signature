// Topo: sobre o hero, solto e na cor do texto da cor ativa; passando do começo da página, vira a barra escura
// flutuante (e o texto fica branco).
export function topo({ lenis }) {
  const t = document.querySelector('[data-topo]');
  const marca = (y) => t.classList.toggle('is-barra', y > 24);
  if (lenis) lenis.on('scroll', ({ scroll }) => marca(scroll));
  else addEventListener('scroll', () => marca(scrollY), { passive: true });
  marca(scrollY);
}
