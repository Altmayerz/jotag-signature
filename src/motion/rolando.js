// Hover não acende sozinho com a página rolando debaixo de um cursor parado (é assim que a prévia é gravada).
// A trava (.rolando no <html>) liga só com gesto de rolagem (roda, teclas de rolagem) e desliga no primeiro movimento
// de verdade do mouse (mais de 3 px). Não liga pelo evento "scroll": o Lenis segue rolando ~1 s depois do gesto e,
// ligando a cada quadro, o hover piscava com o mouse andando.
const html = document.documentElement;
let x0 = -1, y0 = -1, x = -1, y = -1;
const liga = () => { if (!html.classList.contains('rolando')) { html.classList.add('rolando'); x0 = x; y0 = y; } };
addEventListener('wheel', liga, { passive: true });
addEventListener('keydown', (e) => { if (['PageDown', 'PageUp', 'Space', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key) && !e.target.closest?.('input, textarea')) liga(); });
addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse') return;
  x = e.clientX; y = e.clientY;
  if (html.classList.contains('rolando') && Math.hypot(x - x0, y - y0) > 3) html.classList.remove('rolando');
}, { passive: true });
