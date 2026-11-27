// O catálogo da loja, num lugar só. Quem lê: scripts/paginas.mjs (gera uma página estática por produto em
// produto/<slug>/index.html) e o JS das páginas de produto (cores, tamanhos, fotos, sacola).
// Fotos em public/img (WebP): look = a foto principal; det- = detalhe; costas- = de costas. As que não existem em
// public/img ficam de fora da página (o gerador confere).

export const COLECAO = 'Signature One';

export const GARANTIAS = {
  roupa: ['Condições comerciais a confirmar'],
  acessorio: ['Condições comerciais a confirmar'],
};

const LETRAS = ['PP', 'P', 'M', 'G', 'GG'];

export const PRODUTOS = [
  {
    slug: 'serac', nome: 'Tricot', tipo: 'Moda masculina', grupo: 'roupa', tamanhos: LETRAS,
    desc: 'Peça de referência para apresentação visual. Informações oficiais a confirmar.',
    ficha: [['Catálogo', 'Demonstrativo']],
    cores: [
      { id: 'breu', nome: 'Classic', hex: '#121418', preco: 1890, fundo: '#dcdfe3', fotos: [['look', 'hero-breu', 'Look'], ['detalhe', 'det-serac-breu', 'Detalhe ampliado'], ['costas', 'costas-serac-breu', 'Outro enquadramento']] },
      { id: 'gelo', nome: 'Heritage', hex: '#eef1f4', preco: 1890, fundo: '#8e9bb0', fotos: [['look', 'hero-gelo', 'Look'], ['detalhe', 'det-serac-geada', 'Detalhe ampliado']] },
      { id: 'cromo', nome: 'Elegance', hex: '#a9b0bb', preco: 2290, fundo: '#3b4454', fotos: [['look', 'hero-cromo', 'Look'], ['detalhe', 'det-serac-cromo', 'Detalhe ampliado']] },
      { id: 'sinal', nome: 'Timeless', hex: '#ff5a1f', preco: 1990, fundo: '#23272e', fotos: [['look', 'hero-sinal', 'Look'], ['detalhe', 'det-serac-sinal', 'Detalhe ampliado']] },
    ],
  },
  {
    slug: 'firn', nome: 'Camisa casual', tipo: 'Camisa', grupo: 'roupa', tamanhos: LETRAS, selo: 'Novo',
    desc: 'Peça de referência para apresentação visual. Informações oficiais a confirmar.',
    ficha: [['Catálogo', 'Demonstrativo']],
    cores: [
      { id: 'aco', nome: 'Aço', hex: '#8e9bb0', preco: 2490, fundo: '#d9dde3', fotos: [['look', 'prod-firn', 'Look'], ['detalhe', 'det-firn', 'Detalhe ampliado']] },
    ],
  },
  {
    slug: 'nevasca', nome: 'Bomber', tipo: 'Jaqueta', grupo: 'roupa', tamanhos: LETRAS,
    desc: 'Peça de referência para apresentação visual. Informações oficiais a confirmar.',
    ficha: [['Catálogo', 'Demonstrativo']],
    cores: [
      { id: 'grafite', nome: 'Grafite', hex: '#3b4454', preco: 2690, fundo: '#d9dde3', fotos: [['look', 'prod-nevasca', 'Look'], ['detalhe', 'det-nevasca', 'Detalhe ampliado']] },
    ],
  },
  {
    slug: 'cornija', nome: 'Polo tricot', tipo: 'Polo', grupo: 'roupa', tamanhos: LETRAS, selo: 'Novo',
    desc: 'Peça de referência para apresentação visual. Informações oficiais a confirmar.',
    ficha: [['Catálogo', 'Demonstrativo']],
    cores: [
      { id: 'osso', nome: 'Osso', hex: '#ece8df', preco: 690, fundo: '#d9dde3', fotos: [['look', 'prod-cornija', 'Look'], ['detalhe', 'det-cornija', 'Detalhe ampliado']] },
    ],
  },
  {
    slug: 'crista', nome: 'Camiseta tricot', tipo: 'Camiseta', grupo: 'roupa', tamanhos: LETRAS,
    desc: 'Peça de referência para apresentação visual. Informações oficiais a confirmar.',
    ficha: [['Catálogo', 'Demonstrativo']],
    cores: [
      { id: 'breu', nome: 'Classic', hex: '#121418', preco: 990, fundo: '#d9dde3', fotos: [['look', 'prod-crista', 'Look'], ['detalhe', 'det-crista', 'Detalhe ampliado']] },
    ],
  },
  {
    slug: 'couloir', nome: 'Calça de alfaiataria', tipo: 'Alfaiataria', grupo: 'roupa', tamanhos: LETRAS,
    desc: 'Peça de referência para apresentação visual. Informações oficiais a confirmar.',
    ficha: [['Catálogo', 'Demonstrativo']],
    cores: [
      { id: 'gelo', nome: 'Heritage', hex: '#eef1f4', preco: 1490, fundo: '#d9dde3', fotos: [['look', 'prod-couloir', 'Look'], ['detalhe', 'det-couloir', 'Detalhe ampliado'], ['costas', 'costas-couloir', 'Outro enquadramento']] },
    ],
  },
  {
    slug: 'plato', nome: 'Look casual', tipo: 'Vestuário', grupo: 'roupa', tamanhos: LETRAS, selo: 'Novo',
    desc: 'Peça de referência para apresentação visual. Informações oficiais a confirmar.',
    ficha: [['Catálogo', 'Demonstrativo']],
    cores: [
      { id: 'gelo', nome: 'Heritage', hex: '#eef1f4', preco: 1690, fundo: '#d9dde3', fotos: [['look', 'prod-plato', 'Look'], ['detalhe', 'det-plato', 'Detalhe ampliado']] },
    ],
  },
  {
    slug: 'zero', nome: 'Look editorial', tipo: 'Camada base de merino', grupo: 'roupa', tamanhos: LETRAS,
    desc: 'Peça de referência para apresentação visual. Informações oficiais a confirmar.',
    ficha: [['Catálogo', 'Demonstrativo']],
    cores: [
      { id: 'grafite', nome: 'Grafite', hex: '#3d4148', preco: 390, fundo: '#d9dde3', fotos: [['look', 'prod-zero', 'Look'], ['detalhe', 'det-zero', 'Detalhe ampliado']] },
    ],
  },
  {
    slug: 'albedo', nome: 'Seleção Albedo', tipo: 'Lente única espelhada', grupo: 'acessorio', selo: 'Novo', opcoes: 'Lente', tamanhos: ['Fogo', 'Prata', 'Heritage'],
    desc: 'Peça de referência para apresentação visual. Informações oficiais a confirmar.',
    ficha: [['Catálogo', 'Demonstrativo']],
    cores: [{ id: 'branco', nome: 'Branco', hex: '#f7f8fa', preco: 890, fundo: '#1d2127', fotos: [['look', 'acc-albedo', 'Frente'], ['detalhe', 'det-acc-albedo', 'Perfil']] }],
  },
  {
    slug: 'zenite', nome: 'Máscara Zênite', tipo: 'Máscara de neve esférica', grupo: 'acessorio', opcoes: 'Lente', tamanhos: ['Prata', 'Fogo'],
    desc: 'Peça de referência para apresentação visual. Informações oficiais a confirmar.',
    ficha: [['Catálogo', 'Demonstrativo']],
    cores: [{ id: 'preto', nome: 'Preto', hex: '#121418', preco: 1190, fundo: '#1d2127', fotos: [['look', 'acc-zenite', 'Frente'], ['detalhe', 'det-acc-zenite', 'Por dentro']] }],
  },
  {
    slug: 'halo', nome: 'Seleção Halo', tipo: 'Duas lentes espelhadas', grupo: 'acessorio', opcoes: 'Lente', tamanhos: ['Prata', 'Fumê'],
    desc: 'Peça de referência para apresentação visual. Informações oficiais a confirmar.',
    ficha: [['Catálogo', 'Demonstrativo']],
    cores: [{ id: 'preto', nome: 'Preto', hex: '#121418', preco: 790, fundo: '#1d2127', fotos: [['look', 'acc-halo', 'Frente'], ['detalhe', 'det-acc-halo', 'Dobrado']] }],
  },
  {
    slug: 'sombra', nome: 'Balaclava Sombra', tipo: 'Merino canelado', grupo: 'acessorio', tamanhos: ['Único'],
    desc: 'Peça de referência para apresentação visual. Informações oficiais a confirmar.',
    ficha: [['Catálogo', 'Demonstrativo']],
    cores: [{ id: 'preto', nome: 'Preto', hex: '#121418', preco: 190, fundo: '#1d2127', fotos: [['look', 'acc-sombra', 'Frente'], ['detalhe', 'det-acc-sombra', 'Costas']] }],
  },
  {
    slug: 'pico', nome: 'Luva Pico', tipo: 'Pluma e couro', grupo: 'acessorio', selo: 'Novo', opcoes: 'Tamanho', tamanhos: ['P', 'M', 'G'],
    desc: 'Peça de referência para apresentação visual. Informações oficiais a confirmar.',
    ficha: [['Catálogo', 'Demonstrativo']],
    cores: [{ id: 'gelo', nome: 'Azul-gelo', hex: '#b9cbe0', preco: 390, fundo: '#1d2127', fotos: [['look', 'acc-pico', 'Par'], ['detalhe', 'det-acc-pico', 'Palma']] }],
  },
  {
    slug: 'granizo', nome: 'Gorro Granizo', tipo: 'Lã canelada', grupo: 'acessorio', tamanhos: ['Único'],
    desc: 'Peça de referência para apresentação visual. Informações oficiais a confirmar.',
    ficha: [['Catálogo', 'Demonstrativo']],
    cores: [{ id: 'osso', nome: 'Osso', hex: '#ece8df', preco: 159, fundo: '#1d2127', fotos: [['look', 'acc-granizo', 'Frente'], ['detalhe', 'det-acc-granizo', 'De cima']] }],
  },
  {
    slug: 'bruma', nome: 'Gola Bruma', tipo: 'Merino escovado', grupo: 'acessorio', tamanhos: ['Único'],
    desc: 'Peça de referência para apresentação visual. Informações oficiais a confirmar.',
    ficha: [['Catálogo', 'Demonstrativo']],
    cores: [{ id: 'cinza', nome: 'Cinza', hex: '#c9cfd6', preco: 129, fundo: '#1d2127', fotos: [['look', 'acc-bruma', 'De pé'], ['detalhe', 'det-acc-bruma', 'Dobrada']] }],
  },
  {
    slug: 'pala', nome: 'Boné Pala', tipo: 'Ripstop de aba reta', grupo: 'acessorio', tamanhos: ['Único'],
    desc: 'Peça de referência para apresentação visual. Informações oficiais a confirmar.',
    ficha: [['Catálogo', 'Demonstrativo']],
    cores: [{ id: 'preto', nome: 'Preto', hex: '#121418', preco: 229, fundo: '#1d2127', fotos: [['look', 'acc-pala', 'Frente'], ['detalhe', 'det-acc-pala', 'Costas']] }],
  },
];

export const precoDe = (p) => Math.min(...p.cores.map((c) => c.preco));
