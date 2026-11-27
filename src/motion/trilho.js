import { gsap, ScrollTrigger } from './ease.js';
export function trilho() {
  const raiz = document.querySelector('[data-trilho]');
  if (!raiz) return;
  const fila = raiz.querySelector('[data-fila]');
  const secao = raiz.closest('.acessorios');
  const palco = secao.querySelector('.acessorios__palco');
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference) and (min-height: 650px), (max-width: 899px) and (prefers-reduced-motion: no-preference)', () => {
    const distance = () => Math.max(0, fila.scrollWidth-raiz.clientWidth);
    const measure = () => {
      secao.style.setProperty('--track-distance', `${Math.ceil(distance())}px`);
      secao.style.setProperty('--track-height', `${Math.max(innerHeight,palco.scrollHeight)}px`);
    };
    secao.classList.add('selection-scroll');
    measure();
    const tween = gsap.to(fila,{x:()=>-distance(),ease:'none',scrollTrigger:{trigger:secao,start:'top top',end:()=>`+=${distance() || 1}`,scrub:.45,invalidateOnRefresh:true,onRefreshInit:measure}});
    const focus = e => {
      const item=e.target.closest('.trilho__item'); if(!item || !distance()) return;
      const r=item.getBoundingClientRect(), c=raiz.getBoundingClientRect();
      if(r.left<c.left || r.right>c.right) {
        const target=Math.min(distance(),Math.max(0,item.offsetLeft));
        window.scrollTo({top:tween.scrollTrigger.start+target,behavior:'instant'});
      }
    };
    raiz.addEventListener('focusin',focus);
    return ()=>{raiz.removeEventListener('focusin',focus);secao.classList.remove('selection-scroll');secao.style.removeProperty('--track-distance');secao.style.removeProperty('--track-height');};
  });
}
