// Curvas e tempos da casa. Todo o movimento do site sai daqui: entradas longas e firmes, trocas em S, saídas curtas.
// As curvas são as de padrão público (easings.net): easeOutQuint, easeInOutCubic, easeInCubic.
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(CustomEase, ScrollTrigger);

export const DUR = { s: 0.3, m: 0.65, l: 1.05 };
export const QUEBRA = 900; // abaixo disso, o layout do celular

export const desktop = () => innerWidth >= QUEBRA;
export const REDUZIDO = matchMedia('(prefers-reduced-motion: reduce)').matches;

CustomEase.create('n-out', '0.22,1,0.36,1');
CustomEase.create('n-io', '0.65,0,0.35,1');
CustomEase.create('n-in', '0.32,0,0.67,0');
// rajada da troca de cor: arranca no primeiro quarto e segue em velocidade constante, sem frear no fim (a neve sai da
// tela andando)
CustomEase.create('n-vento', 'M0,0 C0.12,0.04 0.25,0.2 1,1');

export const limita = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const mistura = (a, b, t) => a + (b - a) * t;

export { gsap, ScrollTrigger };
