-- Moves existing demo sites to their suavitrine.net.br subdomains and adds two new samples.
update public.portfolio_projects
  set domain = 'romano.suavitrine.net.br', url = 'https://romano.suavitrine.net.br'
  where domain = 'romano-joias.vercel.app';

update public.portfolio_projects
  set domain = 'luanne-pratas.suavitrine.net.br', url = 'https://luanne-pratas.suavitrine.net.br'
  where domain = 'luanne-pratas.vercel.app';

update public.portfolio_projects
  set domain = 'wellness-fit-store.suavitrine.net.br', url = 'https://wellness-fit-store.suavitrine.net.br'
  where domain = 'wellness-fit-store.vercel.app';

update public.portfolio_projects
  set domain = 'mimo3d.suavitrine.net.br', url = 'https://mimo3d.suavitrine.net.br'
  where domain = 'mimo3d-zeta.vercel.app';

insert into public.portfolio_projects
  (name, domain, url, segment, headline, description, bg_color, accent_color, text_color, cover_image_url, cover_image_position, sort_order)
values
  (
    'Infinity Brilho', 'infinitybrilhojoias.com.br', 'https://infinitybrilhojoias.com.br',
    'Semijoias e acessórios', 'O brilho infinito que você procura está aqui',
    'Semijoias, prata 925 e acessórios em catálogo, com pedido direto pelo WhatsApp.',
    '#f7ece1', '#8a1f2b', '#2b1210',
    'https://www.infinitybrilhojoias.com.br/logo-infinity-brilho-completo.png', 'center',
    5
  ),
  (
    'Verdurão Império', 'verdurao-imperio.suavitrine.net.br', 'https://verdurao-imperio.suavitrine.net.br',
    'Hortifruti', 'Frutas e verduras prontas pro seu pedido',
    'Catálogo de hortifruti higienizado, com pedido montado direto pelo WhatsApp.',
    '#eef6e9', '#3f7d20', '#1f3a1a',
    'https://verdurao-imperio.suavitrine.net.br/img/logo-imperio.png', 'center',
    6
  )
on conflict (domain) do nothing;
