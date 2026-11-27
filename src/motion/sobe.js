import { gsap, REDUZIDO } from './ease.js';
export function sobe() {
  const s = document.querySelector('.sobe');
  if (!s || REDUZIDO) return;
  const palco = s.querySelector('.sobe__palco');
  const janela = s.querySelector('.sobe__janela');
  const laterais = s.querySelectorAll('.sobe__lateral');
  const marca = s.querySelector('.sobe__marca-editorial');
  const legenda = s.querySelector('.sobe__legenda-editorial');
  const st = { p: 0 };
  let wasMobile = false;
  function render() {
    const w = palco.clientWidth, h = palco.clientHeight;
    if (w < 900) {
      wasMobile = true;
      const p=st.p, e=p*p*(3-2*p);
      const iw=w*.90, ih=iw*9/16;
      const sideH=(iw-12)/2*5/4;
      const headerH=marca.offsetHeight, footerH=legenda.offsetHeight;
      const gap=12;
      const available=Math.max(1,h-headerH-footerH-ih-4*gap);
      const actualSideH=Math.min(sideH,available);
      const startY=Math.max(headerH+gap,(h-ih-actualSideH-footerH+headerH)/2);
      gsap.set(marca,{top:startY-headerH-gap,opacity:Math.max(0,1-e*3)});
      gsap.set(legenda,{top:startY+ih+actualSideH+2*gap,opacity:Math.max(0,1-e*3)});
      gsap.set(janela,{width:iw+(w-iw)*e,height:ih+(h-ih)*e,top:startY*(1-e),borderRadius:8*(1-e)});
      laterais.forEach((el,i)=>gsap.set(el,{top:startY+ih+12,height:actualSideH,x:(i?1:-1)*w*.12*e,opacity:Math.max(0,1-e*1.8)}));
      return;
    }
    if(wasMobile){gsap.set([janela,...laterais],{clearProps:'top,height'});wasMobile=false;}
    const iw = Math.min(w*.50,h*.62*16/9), ih=iw*9/16;
    const p=st.p, e=p*p*(3-2*p);
    gsap.set(marca,{top:(h-ih)/4,opacity:Math.max(0,1-e*3)});
    gsap.set(legenda,{top:h-(h-ih)/4,opacity:Math.max(0,1-e*3)});
    gsap.set(janela,{width:iw+(w-iw)*e,height:ih+(h-ih)*e,borderRadius:8*(1-e)});
    laterais.forEach((el,i)=>gsap.set(el,{x:(i?1:-1)*w*.12*e,opacity:Math.max(0,1-e*1.8)}));
  }
  render();
  gsap.to(st,{p:1,ease:'none',scrollTrigger:{trigger:s,start:'top top',end:'bottom bottom',scrub:.5,invalidateOnRefresh:true,onRefresh:render},onUpdate:render});
}
