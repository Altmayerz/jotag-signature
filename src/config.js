// A loja como dado: marca, as quatro cores do hero, os acessórios que a sacola sugere e as regras de frete e
// parcelamento. Trocar de marca ou de produto é editar este arquivo e as fotos em public/img.

export const MARCA = {
  nome: 'JotaG Signature',
  cume: 100, // a altitude que a abertura conta, em metros
  freteGratis: 500, // subtotal a partir do qual o frete sai grátis (R$)
  parcelas: 10, // em até N vezes sem juros
  entrega: 'Entrega expressa em 2 a 4 dias úteis',
};

export const TAMANHOS = ['PP', 'P', 'M', 'G', 'GG'];

// A jaqueta do hero em quatro cores. fundo e tinta: a cor da tela e a do texto quando a cor está ativa.
export const CORES = [
  {
    id: 'breu',
    titulo: 'Elegance',
    produto: 'Tricot',
    tipo: 'Moda masculina',
    preco: 1890,
    fundo: '#dcdfe3',
    tinta: '#f7f8fa',
    neve: 0,
    img: 'img/campaign-breu.webp',
    mini: 'img/campaign-mini-breu.webp',
    linha: ['Signature One · moda masculina', 'Catálogo demonstrativo'],
  },
  {
    id: 'gelo',
    titulo: 'Timeless',
    produto: 'Tricot',
    tipo: 'Moda masculina',
    preco: 1890,
    fundo: '#8e9bb0',
    tinta: '#f7f8fa',
    neve: 0,
    img: 'img/campaign-gelo.webp',
    mini: 'img/campaign-mini-gelo.webp',
    linha: ['Signature One · moda masculina', 'Catálogo demonstrativo'],
  },
  {
    id: 'cromo',
    titulo: 'Heritage',
    produto: 'Tricot',
    tipo: 'Moda masculina',
    preco: 2290,
    fundo: '#3b4454',
    tinta: '#f7f8fa',
    neve: 0,
    img: 'img/campaign-cromo.webp',
    mini: 'img/campaign-mini-cromo.webp',
    linha: ['Signature One · moda masculina', 'Catálogo demonstrativo'],
  },
  {
    id: 'sinal',
    titulo: 'Classic',
    produto: 'Tricot',
    tipo: 'Moda masculina',
    preco: 1990,
    fundo: '#23272e',
    tinta: '#f7f8fa',
    neve: 0,
    img: 'img/campaign-sinal.webp',
    mini: 'img/campaign-mini-sinal.webp',
    linha: ['Signature One · moda masculina', 'Catálogo demonstrativo'],
  },
];

// Acessórios: a sacola sugere na ordem desta lista o que ainda não está nela ("combina com").
export const ACESSORIOS = [
  { id: 'bruma', nome: 'Gola Bruma', detalhe: 'Merino · tamanho único', preco: 129, img: 'img/acc-bruma.webp' },
  { id: 'granizo', nome: 'Gorro Granizo', detalhe: 'Lã canelada · tamanho único', preco: 159, img: 'img/acc-granizo.webp' },
  { id: 'albedo', nome: 'Seleção Albedo', detalhe: 'Lente única espelhada', preco: 890, img: 'img/acc-albedo.webp' },
  { id: 'pico', nome: 'Luva Pico', detalhe: 'Pluma e couro · P a G', preco: 390, img: 'img/acc-pico.webp' },
];

export const real = (v) =>
  'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
export const realCentavos = (v) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Avaliações na montanha: cada uma finca uma bandeira na altitude dela (a última é o cume, MARCA.cume).
export const AVALIACOES = [
  { alt: 1035, temp: -4, nota: 5, frase: 'Comprei para o dia a dia e acabei usando na primeira subida do ano. Não tirei mais.', nome: 'Marina T.', usou: 'Tricot Heritage', link: 'produto/serac/#gelo' },
  { alt: 2310, temp: -9, nota: 5, frase: 'O capuz fecha de verdade com o capacete. Vento de lado a tarde inteira e nada entrou.', nome: 'Rafael M.', usou: 'Camisa casual', link: 'produto/firn/' },
  { alt: 3842, temp: -14, nota: 4, frase: 'Esquenta muito: no meio da subida abri o zíper e seguiu confortável. Só achei o bolso de dentro pequeno.', nome: 'Júlia C.', usou: 'Tricot Classic', link: 'produto/serac/#breu' },
  { alt: 4808, temp: -21, nota: 5, frase: 'Parka comprida que não atrapalha o passo. Dormi com ela no acampamento.', nome: 'Diego A.', usou: 'Bomber', link: 'produto/nevasca/' },
  { alt: 5590, temp: -24, nota: 5, frase: 'A lente da Albedo não embaçou nenhuma vez, mesmo com a balaclava por cima.', nome: 'Paula S.', usou: 'Seleção Albedo', link: 'produto/albedo/' },
  { alt: 6190, temp: -28, nota: 5, frase: 'No último acampamento a temperatura despencou e eu nem percebi. Valeu cada real.', nome: 'Bruno K.', usou: 'Tricot Timeless', link: 'produto/serac/#sinal' },
  { alt: 6961, temp: -32, nota: 5, frase: 'No cume, a jaqueta prateada virou ponto de encontro do grupo. E por dentro, nem sinal do vento.', nome: 'Lia F.', usou: 'Tricot Elegance', link: 'produto/serac/#cromo' },
];
