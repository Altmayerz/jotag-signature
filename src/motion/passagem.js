// Passagem entre páginas (produto, checkout, de volta à home): um círculo ardósia nasce de onde a pessoa clicou e
// cobre a tela, o logo e o nome do destino aparecem, e a página troca. A página nova nasce com a mesma tela
// (html.chegando, posto no <head> pela marca no sessionStorage) e a tira para cima.
import { gsap } from './ease.js';

export function passagem() {
  const tela = document.querySelector('[data-passagem]');
  if (!tela) return;
  const txt = tela.querySelector('.passagem__txt');
  let indo = false;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-troca], a[data-finalizar]');
    if (!a || indo || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    if (a.matches('[data-finalizar]') && a.classList.contains('is-off')) return;
    const url = new URL(a.href, location.href);
    if (url.pathname === location.pathname) return; // na mesma página, quem cuida é a âncora
    e.preventDefault();
    indo = true;
    txt.textContent = a.dataset.label || (a.matches('[data-finalizar]') ? 'Checkout' : 'JotaG Signature');
    const r = a.getBoundingClientRect();
    const cx = e.clientX || r.left + r.width / 2, cy = e.clientY || r.top + r.height / 2;
    const R = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) + 20;
    tela.classList.add('is-on');
    gsap.set(tela, { yPercent: 0 });
    gsap.set(tela.children, { opacity: 0, y: 10 });
    const st = { r: 0 };
    gsap.timeline({ onComplete: () => { try { sessionStorage.setItem('nix-passagem', '1'); } catch { /* sem storage */ } location.href = url.href; } })
      .to(st, { r: R, duration: 0.6, ease: 'n-io', onUpdate: () => { tela.style.clipPath = `circle(${st.r}px at ${cx}px ${cy}px)`; } })
      .to(tela.children, { opacity: 1, y: 0, duration: 0.35, ease: 'n-out', stagger: 0.05 }, '-=0.2')
      .to({}, { duration: 0.12 });
  });
  // voltando pelo botão do navegador, a tela não pode ficar por cima
  addEventListener('pageshow', (e) => { if (e.persisted) { indo = false; tela.classList.remove('is-on'); tela.style.clipPath = ''; } });
  chegada(tela);
}

function chegada(tela) {
  const html = document.documentElement;
  if (!html.classList.contains('chegando')) return;
  gsap.set(tela, { yPercent: 0 });
  gsap.timeline({ delay: 0.15, onComplete: () => { html.classList.remove('chegando'); gsap.set(tela, { clearProps: 'all' }); } })
    .to(tela.children, { opacity: 0, y: -10, duration: 0.28, ease: 'n-in', stagger: 0.04 })
    .to(tela, { yPercent: -100, duration: 0.7, ease: 'n-io' }, '-=0.05');
}
