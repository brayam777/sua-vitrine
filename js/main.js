import { supabase, isConfigured } from './supabase-config.js';

const WHATSAPP_NUMBER = '5562986057981';

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function wireGenericWhatsappLinks() {
  const generic = waLink('Olá! Vi o site da Sua Vitrine e quero criar minha vitrine online.');
  document.querySelectorAll('[data-wa-generic]').forEach((el) => (el.href = generic));
}

function wireMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mobileNav');
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// Used if Supabase isn't reachable, so the page never breaks.
const FALLBACK_PROJECTS = [
  {
    name: 'Romano Joias',
    domain: 'romano.suavitrine.net.br',
    url: 'https://romano.suavitrine.net.br',
    segment: 'Ourivesaria',
    headline: 'Joias em ouro, feitas à mão pra você',
    description: 'Peças exclusivas, desenhadas e lapidadas uma a uma — sem produção em série.',
    bg_color: '#f6f1e7',
    accent_color: '#c6a15b',
    text_color: '#0b0b0b',
    cover_image_url: 'https://s3.inovai.dev.br/catalogo-brayam/romano-joias/0abf4931-9760-4ce8-b406-24ad2ea284ef.jpg',
    cover_image_position: 'center 42%',
  },
  {
    name: 'Luanne Pratas 925',
    domain: 'luanne-pratas.suavitrine.net.br',
    url: 'https://luanne-pratas.suavitrine.net.br',
    segment: 'Joias em prata',
    headline: 'Faça o seu pedido! Prata 925 legítima',
    description: 'Catálogo por categoria, peças exclusivas selecionadas com carinho.',
    bg_color: '#ece9e3',
    accent_color: '#5f8f7a',
    text_color: '#1c3a54',
    cover_image_url: 'https://ietooopjzlnzmguubrrv.supabase.co/storage/v1/object/public/luanne-photos/hero-1-4656c127-0d74-46a4-9dfd-6b616fc88452.jpeg',
    cover_image_position: 'center 32%',
  },
  {
    name: 'Wellness Fit Store',
    domain: 'wellness-fit-store.suavitrine.net.br',
    url: 'https://wellness-fit-store.suavitrine.net.br',
    segment: 'Moda fitness',
    headline: 'Treine com estilo e conforto',
    description: 'Leggings, tops e conjuntos — moda fitness feminina, do treino ao dia a dia.',
    bg_color: '#eef3ea',
    accent_color: '#6b8f5e',
    text_color: '#2c422d',
    cover_image_url: 'https://vxeokiiwdsbwodlriadm.supabase.co/storage/v1/object/public/wellness-photos/753be5eb-771b-4971-865f-a45bfa3777b4.jpeg',
    cover_image_position: 'center 22%',
  },
];

async function loadPortfolioProjects() {
  if (!isConfigured) return FALLBACK_PROJECTS;
  try {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error || !data || !data.length) return FALLBACK_PROJECTS;
    return data;
  } catch {
    return FALLBACK_PROJECTS;
  }
}

function buildPortfolioGrid(projects) {
  const grid = document.getElementById('portfolioGrid');
  if (!grid) return;
  grid.innerHTML = projects
    .map(
      (p) => `
      <a class="portfolio-card" href="${p.url}" target="_blank" rel="noopener" style="--pf-a:${p.accent_color};--pf-b:${p.text_color};--pf-bg:${p.bg_color};">
        <div class="portfolio-media" style="background-image:url('${p.cover_image_url || ''}');background-position:${p.cover_image_position || 'center'};"></div>
        <div class="portfolio-info">
          <span class="portfolio-tag">${p.segment}</span>
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <span class="portfolio-link">Ver site ↗</span>
        </div>
      </a>`
    )
    .join('');
}

function wireDemoCarousel(projects) {
  const card = document.getElementById('demoCard');
  const frameWrap = document.getElementById('miniFrame');
  const labelsWrap = document.getElementById('demoLabels');
  const domain = document.getElementById('demoDomain');
  const eyebrow = document.getElementById('demoEyebrow');
  const title = document.getElementById('demoTitle');
  const desc = document.getElementById('demoDesc');
  const btn = document.getElementById('demoBtn');
  if (!card || !frameWrap || !projects.length) return;

  frameWrap.innerHTML = projects
    .map(
      (p, i) =>
        `<iframe class="demo-frame-item${i === 0 ? ' is-active' : ''}" data-i="${i}" src="${p.url}" title="Prévia ao vivo: ${p.name}" tabindex="-1" aria-hidden="true"></iframe>`
    )
    .join('');
  labelsWrap.innerHTML = projects
    .map((p, i) => `<span class="demo-label-dot${i === 0 ? ' active' : ''}" data-i="${i}"></span>`)
    .join('');

  const frames = frameWrap.querySelectorAll('.demo-frame-item');
  const dots = labelsWrap.querySelectorAll('.demo-label-dot');

  function fitFrames() {
    const scale = frameWrap.clientWidth / 1440;
    frames.forEach((f) => (f.style.transform = `scale(${scale})`));
  }
  fitFrames();
  window.addEventListener('resize', fitFrames);

  let i = 0;

  function apply(project, index) {
    card.style.setProperty('--demo-bg', project.bg_color);
    card.style.setProperty('--demo-a', project.accent_color);
    card.style.setProperty('--demo-b', project.text_color);
    domain.textContent = project.domain;
    eyebrow.textContent = project.segment;
    title.textContent = project.headline;
    desc.textContent = project.description;
    btn.href = project.url;
    frames.forEach((f) => f.classList.toggle('is-active', Number(f.dataset.i) === index));
    dots.forEach((d) => d.classList.toggle('active', Number(d.dataset.i) === index));
  }

  apply(projects[0], 0);

  if (projects.length > 1) {
    setInterval(() => {
      i = (i + 1) % projects.length;
      apply(projects[i], i);
    }, 6000);
  }
}

function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
}

document.addEventListener('DOMContentLoaded', async () => {
  wireGenericWhatsappLinks();
  wireMobileMenu();
  setYear();
  const projects = await loadPortfolioProjects();
  buildPortfolioGrid(projects);
  wireDemoCarousel(projects);
});
