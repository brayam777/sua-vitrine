-- Adds Mimo3D (custom 3D-printed keychains/gifts) to the portfolio.
insert into public.portfolio_projects
  (name, domain, url, segment, headline, description, bg_color, accent_color, text_color, cover_image_url, cover_image_position, sort_order)
values
  (
    'Mimo3D', 'mimo3d-zeta.vercel.app', 'https://mimo3d-zeta.vercel.app',
    'Impressão 3D', 'Sua ideia, impressa em camadas',
    'Chaveiros, brindes e lembrancinhas personalizados em impressão 3D, sob encomenda.',
    '#17151c', '#ff3d77', '#7b5cff',
    null, 'center',
    4
  )
on conflict (domain) do nothing;
