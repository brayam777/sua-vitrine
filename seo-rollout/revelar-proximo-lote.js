// Libera o próximo lote de URLs de SEO pro Google, do mais importante pro menos importante.
// Roda uma vez por dia: le seo-rollout/release-state.json, avança o cursor em batchSize,
// e reescreve sitemap-liberado.xml (na raiz do site) só com as URLs já liberadas até agora.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const filaPath = path.join(__dirname, 'fila-liberacao.json');
const statePath = path.join(__dirname, 'release-state.json');
const sitemapPath = path.join(ROOT, 'sitemap-liberado.xml');

const fila = JSON.parse(fs.readFileSync(filaPath, 'utf8'));
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));

if (state.lastReleasedIndex >= fila.length) {
  console.log('Todas as', fila.length, 'URLs já foram liberadas. Nada a fazer.');
  process.exit(0);
}

const start = state.lastReleasedIndex;
const end = Math.min(start + state.batchSize, fila.length);
const liberadasAteAgora = fila.slice(0, end);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${liberadasAteAgora.map((f) => `  <url>\n    <loc>${f.url}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(sitemapPath, xml, 'utf8');

state.lastReleasedIndex = end;
state.history.push({
  data: new Date().toISOString().slice(0, 10),
  de: start,
  ate: end,
  liberadasNoLote: end - start,
  totalLiberadoAcumulado: end,
});
fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');

console.log(`Lote liberado: ${end - start} URLs (posições ${start} a ${end - 1}).`);
console.log(`Total acumulado liberado: ${end} de ${fila.length}.`);
if (end >= fila.length) {
  console.log('Esse foi o último lote — rollout completo.');
}
