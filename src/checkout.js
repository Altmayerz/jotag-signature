// Checkout: lê a sacola (localStorage, a mesma da loja), monta o resumo e as contas (frete grátis acima de R$ 500,
// 5% no Pix, cupom de demonstração DEMO10), máscaras de CEP, cartão, validade e CVV, abas de pagamento com o marcador
// deslizando, parcelas, validação com erro por campo e a confirmação do pedido.
import { gsap } from './motion/ease.js';
import { criarRolagem, irPara } from './motion/rolagem.js';
import { scrollbar } from './motion/scrollbar.js';
import { MARCA, real, realCentavos } from './config.js';
import { passagem } from './motion/passagem.js';
import { caminho } from './motion/paginas.js';
import './motion/rolando.js';

const html = document.documentElement;
window.__nixViva = true;
requestAnimationFrame(() => requestAnimationFrame(() => html.classList.add('assentou')));
const lenis = criarRolagem();
scrollbar({ lenis });

const CHAVE = 'nix-sacola';
let itens = [];
try { itens = JSON.parse(localStorage.getItem(CHAVE)) || []; } catch { itens = []; }
const $ = (s) => document.querySelector(s);
const subtotal = () => itens.reduce((s, i) => s + i.preco * i.qtd, 0);
const FRETE = { expressa: 39.9, economica: 19.9 };
let pagamento = 'cartao';
let cupom = 0; // fração de desconto
let parcelas = 1;

passagem();
if (document.documentElement.classList.contains('chegando')) gsap.from('.checkout .wrap > *', { y: 40, opacity: 0, duration: 1, ease: 'n-out', stagger: 0.08, delay: 0.6, clearProps: 'transform,opacity' });

// conta no topo
const conta = $('[data-conta]');
const q = itens.reduce((s, i) => s + i.qtd, 0);
conta.textContent = q;
conta.classList.toggle('is-on', q > 0);

function contas() {
  const sub = subtotal();
  const freteEscolhido = document.querySelector('input[name="frete"]:checked')?.value || 'expressa';
  const gratis = sub >= MARCA.freteGratis;
  for (const [k, v] of Object.entries(FRETE)) $(`[data-preco-frete="${k}"]`).textContent = gratis ? 'Grátis' : realCentavos(v);
  const frete = gratis || !sub ? 0 : FRETE[freteEscolhido];
  const descPix = pagamento === 'pix' ? 0.05 : 0;
  const desc = sub * Math.min(1, cupom + descPix);
  const total = Math.max(0, sub - desc + frete);
  $('[data-conta-sub]').textContent = realCentavos(sub);
  $('[data-conta-frete]').textContent = frete ? realCentavos(frete) : 'Grátis';
  $('[data-linha-desconto]').hidden = !desc;
  $('[data-conta-desc]').textContent = `− ${realCentavos(desc)}`;
  $('[data-conta-total]').textContent = realCentavos(total);
  $('[data-total-botao]').textContent = realCentavos(total);
  $('[data-conta-parc]').textContent = pagamento === 'cartao' && total ? `em ${parcelas}x de ${realCentavos(total / parcelas)} sem juros` : pagamento === 'pix' ? '5% de desconto no Pix' : 'à vista no boleto';
  desenhaParcelas(total);
  return total;
}

function desenhaResumo() {
  const lista = $('[data-resumo-itens]');
  lista.innerHTML = itens.map((i) => `<li class="ritem"><span class="ritem__img"><img src="${caminho(i.img)}" alt="" style="background:${i.fundo}"><span class="ritem__q">${i.qtd}</span></span><span><span class="ritem__nome">${i.nome}</span><br><span class="ritem__det">${i.detalhe}</span></span><span class="ritem__preco">${realCentavos(i.preco * i.qtd)}</span></li>`).join('');
  $('[data-resumo-vazia]').hidden = itens.length > 0;
}

function desenhaParcelas(total) {
  const box = $('[data-parcelas-opcoes]');
  const ops = [1, 3, 6, MARCA.parcelas];
  if (!ops.includes(parcelas)) parcelas = 1;
  box.innerHTML = ops.map((n) => `<button class="parcela" type="button" role="radio" aria-checked="${n === parcelas}" data-n="${n}">${n}x ${total ? realCentavos(total / n) : ''}</button>`).join('');
}
$('[data-parcelas-opcoes]').addEventListener('click', (e) => { const b = e.target.closest('[data-n]'); if (!b) return; parcelas = Number(b.dataset.n); contas(); });

// abas de pagamento (setas do teclado trocam; o marcador desliza)
const abas = [...document.querySelectorAll('[data-aba]')];
const marca = $('.abas__marca');
const escolheAba = (b, foco = false) => {
  pagamento = b.dataset.aba;
  abas.forEach((a, i) => {
    const on = a === b;
    a.classList.toggle('is-ativa', on);
    a.setAttribute('aria-selected', String(on));
    a.tabIndex = on ? 0 : -1;
    $(`#${a.getAttribute('aria-controls')}`).hidden = !on;
    if (on) marca.style.translate = `${i * 100}% 0`;
  });
  for (const c of document.querySelectorAll('[data-pagamento="cartao"]')) c.required = pagamento === 'cartao';
  if (foco) b.focus();
  contas();
};
abas.forEach((a, i) => {
  a.addEventListener('click', () => escolheAba(a));
  a.addEventListener('keydown', (e) => {
    const p = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!p) return;
    e.preventDefault();
    escolheAba(abas[(i + p + abas.length) % abas.length], true);
  });
});
for (const b of document.querySelectorAll('[data-expresso]')) b.addEventListener('click', () => { if (b.dataset.expresso === 'pix') escolheAba(abas[1]); finaliza(true); });
for (const r of document.querySelectorAll('input[name="frete"]')) r.addEventListener('change', contas);

// máscaras
const so = (v) => v.replace(/\D/g, '');
const MASCARAS = {
  cep: (v) => so(v).slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2'),
  cartao: (v) => so(v).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '),
  validade: (v) => so(v).slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2'),
  cvv: (v) => so(v).slice(0, 4),
  uf: (v) => v.replace(/[^a-z]/gi, '').slice(0, 2).toUpperCase(),
};
for (const i of document.querySelectorAll('[data-mascara]')) i.addEventListener('input', () => { i.value = MASCARAS[i.dataset.mascara](i.value); });

// validação por campo (ao sair dele e ao finalizar)
const REGRAS = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),
  cep: (v) => so(v).length === 8,
  uf: (v) => /^[A-Z]{2}$/.test(v),
  cartao: (v) => so(v).length >= 13,
  validade: (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v),
  cvv: (v) => so(v).length >= 3,
};
const valida = (input) => {
  const caixa = input.closest('.campo');
  if (!caixa) return true;
  const v = input.value.trim();
  const regra = REGRAS[input.name];
  const ok = !input.required || (v && (!regra || regra(v)));
  caixa.classList.toggle('is-erro', !ok);
  caixa.classList.toggle('is-ok', ok && !!v);
  return ok;
};
for (const i of document.querySelectorAll('.campo input')) {
  i.addEventListener('blur', () => { if (i.value) valida(i); });
  i.addEventListener('input', () => { if (i.closest('.campo').classList.contains('is-erro')) valida(i); });
}

// cupom de demonstração
$('[data-cupom]').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  const v = f.querySelector('input').value.trim().toUpperCase();
  const msg = $('[data-cupom-msg]');
  if (v === 'DEMO10') { cupom = 0.1; f.classList.remove('is-erro'); msg.textContent = 'Cupom aplicado: 10% de desconto.'; }
  else { cupom = 0; f.classList.add('is-erro'); msg.textContent = v ? 'Esse cupom não existe ou já venceu.' : 'Escreva o cupom.'; }
  contas();
});

// finalizar
const form = $('[data-pedido]');
function finaliza(expresso = false) {
  if (!itens.length) { irPara(0); return; }
  if (!expresso) {
    const campos = [...form.querySelectorAll('.campo input')].filter((i) => !i.closest('[hidden]'));
    const ruins = campos.filter((i) => !valida(i));
    if (ruins.length) {
      const primeiro = ruins[0];
      irPara(primeiro.getBoundingClientRect().top + scrollY - 140, { dur: 0.8 });
      setTimeout(() => primeiro.focus({ preventScroll: true }), 500);
      return;
    }
  }
  const botao = $('[data-finalizar-pedido]');
  botao.classList.add('is-enviando');
  botao.querySelector('.botao__txt').textContent = 'Processando';
  setTimeout(() => {
    const email = $('#c-email').value.trim() || 'o seu e-mail';
    $('[data-feito-n]').textContent = `NX-${String(Math.floor(1000 + Math.random() * 9000))}`;
    $('[data-feito-email]').textContent = email;
    try { localStorage.removeItem(CHAVE); } catch { /* sem storage */ }
    conta.textContent = '0';
    conta.classList.remove('is-on');
    const grade = $('[data-grade-checkout]');
    gsap.to([grade, '.checkout__topo'], { opacity: 0, y: -20, duration: 0.4, ease: 'n-in', onComplete: () => {
      grade.hidden = true;
      $('.checkout__topo').hidden = true;
      const feito = $('[data-feito]');
      feito.hidden = false;
      irPara(0, { imediato: true });
      gsap.from(feito.children, { y: 30, opacity: 0, duration: 0.9, ease: 'n-out', stagger: 0.08 });
      feito.focus({ preventScroll: true });
    } });
  }, 1200);
}
form.addEventListener('submit', (e) => { e.preventDefault(); finaliza(); });

desenhaResumo();
escolheAba(abas[0]);
