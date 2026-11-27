// Abertura: o logo no meio e a altitude num contador de rodas, subindo com o carregamento de verdade, sobre duas
// portas na cor do fundo do hero. Nunca termina antes de MIN segundos (a curva mínima) nem antes de tudo chegar; não
// reage a gesto (é pré-carga). O hero já está pintado por baixo: no fim, logo e número sobem e somem, e as portas se
// abrem a partir de um fio diagonal no meio da tela (só transform, sem repintar nada); a cena do hero chega junto.
import { gsap } from './ease.js';
import { precarga } from './precarga.js';
import { trava, solta } from './rolagem.js';

const MIN = 1.3; // s
const ANG = 7; // graus da faixa (as portas giram -ANG: a faixa sobe para a direita)


export function abertura({ entrada }) {
  const html = document.documentElement;
  const el = document.querySelector('[data-abertura]');
  const imgs = [...document.querySelectorAll('.hero__modelo, .ficha__img, .hero__amostras img, .hero__marca img')];
  const carga = precarga(imgs);
  if (!html.classList.contains('js')) html.classList.remove('abrindo');
  if (!html.classList.contains('abrindo')) {
    el?.remove();
    entrada(true);
    return;
  }

  trava();
  scrollTo(0, 0);
  const marca = el.querySelector('.abertura__marca');
  const [cima, baixo] = el.querySelectorAll('.porta');
  gsap.set([marca, cima, baixo], { x: 0, y: 0 });
  gsap.fromTo(marca, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'n-out' });

  Promise.all([carga.pronto, new Promise(resolve => setTimeout(resolve, MIN * 1000))]).then(sai);

  function sai() {
    // quanto cada porta anda (no eixo dela, perpendicular à faixa) para a tela ficar inteira descoberta
    const rad = (ANG * Math.PI) / 180;
    const meia = (innerHeight / 2) * Math.cos(rad) + (innerWidth / 2) * Math.sin(rad) + 24;
    const tl = gsap.timeline({ delay: 0.12 });
    tl.to(marca, { opacity: 0, y: -18, scale: 0.98, duration: 0.34, ease: 'n-in' });
    tl.addLabel('abre', '-=0.06');
    tl.to(cima, { y: -meia, duration: 1, ease: 'n-io' }, 'abre');
    tl.to(baixo, { y: meia, duration: 1, ease: 'n-io' }, 'abre');
    tl.add(() => performance.mark('nix-abre'), 'abre');
    tl.add(() => entrada(false), 'abre+=0.08');
    tl.add(() => { html.classList.remove('abrindo'); el.remove(); solta(); }, 'abre+=1.05');
  }
}

