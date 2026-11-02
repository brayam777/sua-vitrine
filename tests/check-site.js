// Verificações de integridade do site. Uso: node tests/check-site.js
// Sem dependências; precisa só do Node 18+. Sai com código 1 se algo falhar.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(ROOT, p));

const WHATSAPP = '5562986057981';
const SITE = 'https://suavitrine.net.br';
const SECRET_PATTERNS = [
  /service_role/i,
  /sbp_[A-Za-z0-9]{20,}/,
  /sb_secret_[A-Za-z0-9_-]{10,}/,
  /postgres(?:ql)?:\/\/[^\s:@/'"]+:[^\s@/'"]+@/,
  /gh[pousr]_[A-Za-z0-9]{30,}/,
  /vc[pi]_[A-Za-z0-9]{20,}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
];

const results = [];
function check(nome, falhas) {
  results.push({ nome, falhas });
}

const htmlFiles = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
const fila = JSON.parse(read('seo-rollout/fila-liberacao.json'));
const state = JSON.parse(read('seo-rollout/release-state.json'));

// Resolve um link do HTML para um arquivo do site (cleanUrls: /pagina -> pagina.html).
const assetCache = new Map();
function linkResolve(link) {
  let p = link.split('#')[0].split('?')[0];
  if (!p) return true;
  p = decodeURIComponent(p.replace(/^\//, '')) || 'index.html';
  if (assetCache.has(p)) return assetCache.get(p);
  const ok = exists(p) || exists(p + '.html');
  assetCache.set(p, ok);
  return ok;
}

const falhaPixel = [];
const falhaLinks = [];
const falhaSegredo = [];
const falhaTelefone = [];
const falhaCanonical = [];
const falhaPreco = [];

const filaPorArquivo = new Map(fila.map((f) => [f.url.replace(SITE + '/', '') + '.html', f]));

for (const file of htmlFiles) {
  const html = read(file);

  const temPixel = file === 'index.html' ? html.includes('js/pixel.js') : html.includes('js/main.js');
  if (!temPixel) falhaPixel.push(file);

  for (const m of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
    const link = m[1];
    if (/^(https?:|mailto:|tel:|data:|whatsapp:|javascript:|#|\/\/)/i.test(link)) continue;
    if (!linkResolve(link)) falhaLinks.push(`${file} -> ${link}`);
  }

  if (SECRET_PATTERNS.some((re) => re.test(html))) falhaSegredo.push(file);

  for (const m of html.matchAll(/"telephone":\s*"([^"]+)"/g)) {
    if (m[1] !== '+' + WHATSAPP) falhaTelefone.push(`${file}: ${m[1]}`);
  }

  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const esperado = file === 'index.html' ? SITE + '/' : SITE + '/' + file.replace(/\.html$/, '');
  if (canonical !== esperado) falhaCanonical.push(`${file}: ${canonical}`);

  if (filaPorArquivo.has(file) && !html.includes('499,90')) falhaPreco.push(file);
}

check('Toda página carrega o pixel (home via <script>, demais via js/main.js)', falhaPixel);
check('Links e assets locais apontam pra arquivos que existem', falhaLinks);
check('Nenhum segredo em HTML', falhaSegredo);
check(`Telefone do JSON-LD é sempre +${WHATSAPP}`, falhaTelefone);
check('Canonical de cada página é a própria URL', falhaCanonical);
check('Páginas de cidade mostram o preço "R$ 499,90"', falhaPreco);

const mainJs = read('js/main.js');
check('js/main.js importa o pixel', mainJs.includes("import './pixel.js'") ? [] : ['import ausente']);
check(
  `Número de WhatsApp igual na home e no main.js`,
  [read('index.html'), mainJs].filter((t) => !t.includes(WHATSAPP)).map(() => 'número divergente')
);

// Sitemap liberado x fila x páginas
const locs = [...read('sitemap-liberado.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const falhaSitemap = [];
if (locs.length !== state.lastReleasedIndex) {
  falhaSitemap.push(`sitemap tem ${locs.length} URLs, release-state diz ${state.lastReleasedIndex}`);
}
if (state.lastReleasedIndex > fila.length) falhaSitemap.push('cursor maior que a fila');
for (const u of locs) {
  if (!exists(u.replace(SITE + '/', '') + '.html')) falhaSitemap.push(`sem página: ${u}`);
}
check('sitemap-liberado.xml bate com release-state.json e com as páginas', falhaSitemap);

const falhaFila = fila.filter((f) => !exists(f.url.replace(SITE + '/', '') + '.html')).map((f) => f.url);
check('Toda URL da fila de SEO tem página .html', falhaFila);

const robots = read('robots.txt');
check(
  'robots.txt lista os dois sitemaps',
  ['sitemap.xml', 'sitemap-liberado.xml'].filter((s) => !robots.includes(`${SITE}/${s}`))
);

const falhaSitemapBase = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1])
  .filter((u) => u !== SITE + '/' && !exists(u.replace(SITE + '/', '') + '.html'));
check('sitemap.xml só lista páginas que existem', falhaSitemapBase);

// Portfólio: domínios do fallback do front precisam existir também nas migrações do banco
const sql = fs.readdirSync(path.join(ROOT, 'supabase/migrations')).map((f) => read('supabase/migrations/' + f)).join('\n');
const dominiosFallback = [...new Set(mainJs.match(/[a-z0-9-]+\.suavitrine\.net\.br/g) || [])];
check('Domínios do FALLBACK_PROJECTS (js/main.js) existem nas migrações do banco', dominiosFallback.filter((d) => !sql.includes(d)));

// Segredos nos arquivos que não são HTML
const falhaSegredoOutros = [];
function walk(dir) {
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = dir ? `${dir}/${e.name}` : e.name;
    if (e.isDirectory()) {
      if (['.git', '.vercel', 'node_modules', 'media', 'img'].includes(e.name)) continue;
      walk(rel);
    } else if (/\.(js|cjs|json|sql|md|xml|txt|css|toml|svg)$/.test(e.name) && !e.name.endsWith('.local') && rel !== 'tests/check-site.js') {
      if (SECRET_PATTERNS.some((re) => re.test(read(rel)))) falhaSegredoOutros.push(rel);
    }
  }
}
walk('');
check('Nenhum segredo em código, migrações e configs', falhaSegredoOutros);

let total = 0;
for (const r of results) {
  const ok = r.falhas.length === 0;
  if (!ok) total++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${r.nome}${ok ? '' : ` (${r.falhas.length})`}`);
  r.falhas.slice(0, 8).forEach((f) => console.log(`       - ${f}`));
  if (r.falhas.length > 8) console.log(`       ... e mais ${r.falhas.length - 8}`);
}
console.log(`\n${htmlFiles.length} páginas HTML, ${fila.length} URLs na fila de SEO, ${locs.length} liberadas.`);
console.log(total ? `${total} verificação(ões) falharam.` : 'Tudo certo.');
process.exitCode = total ? 1 : 0;
