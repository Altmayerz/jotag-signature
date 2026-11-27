// Pré-carga da abertura: as fontes do hero e as fotos da primeira tela (as quatro cores da modelo e as miniaturas:
// a troca de cor tem que ser instantânea). O progresso é o que já chegou de verdade; o resto da loja carrega
// conforme a rolagem chega perto. Teto de rede de 15 s para não prender ninguém.
export function precarga(imgs) {
  const fontes = ['800 1em "Archivo Variable"', '500 1em "Geist Variable"'];
  const total = imgs.length + 1;
  let feitos = 0;
  const conta = () => { feitos = Math.min(total, feitos + 1); };
  const decodifica = (img) => (img.decode ? img.decode().catch(() => {}) : Promise.resolve());

  const promessas = imgs.map((img) => {
    if (img.getAttribute('loading') === 'lazy') img.loading = 'eager';
    if (img.complete && img.naturalWidth) { conta(); return decodifica(img); }
    return new Promise((ok) => {
      const fim = () => { conta(); ok(); };
      img.addEventListener('load', fim, { once: true });
      img.addEventListener('error', fim, { once: true });
    }).then(() => decodifica(img));
  });
  promessas.push(Promise.all(fontes.map((f) => document.fonts.load(f).catch(() => {}))).then(conta));

  const teto = new Promise((ok) => setTimeout(ok, 15000));
  return { pronto: Promise.race([Promise.all(promessas), teto]), progresso: () => feitos / total };
}
