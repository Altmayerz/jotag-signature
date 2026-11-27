// Formulários de lista (drop e rodapé, em todas as páginas que têm rodapé): e-mail inválido treme, borda laranja e
// mensagem; enviado: "Na lista ✓" e o campo trava.
import { gsap } from './ease.js';

export function listas() {
  const ok = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
  for (const f of document.querySelectorAll('[data-lista]')) {
    const campo = f.querySelector('input');
    const msg = f.querySelector('[data-msg]');
    const txt = f.querySelector('.botao__txt');
    campo.addEventListener('input', () => { if (f.classList.contains('is-erro') && ok(campo.value.trim())) { f.classList.remove('is-erro'); msg.textContent = ''; } });
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      if (f.classList.contains('is-ok')) return;
      if (!ok(campo.value.trim())) {
        f.classList.add('is-erro');
        msg.textContent = 'Confira o e-mail: falta alguma coisa.';
        gsap.fromTo(f, { x: -6 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)', clearProps: 'transform' });
        campo.focus();
        return;
      }
      f.classList.remove('is-erro');
      f.classList.add('is-ok');
      msg.textContent = 'Pronto: você está na lista. Avisamos antes de todo mundo.';
      txt.textContent = 'Na lista ✓';
      campo.disabled = true;
    });
  }
}
