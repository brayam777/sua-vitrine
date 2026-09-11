-- Portfolio grid should show each store's logo, not a client product photo.
update public.portfolio_projects set cover_image_url = 'https://suavitrine.net.br/img/portfolio-romano-joias.svg', cover_image_position = 'center' where domain = 'romano-joias.vercel.app';
update public.portfolio_projects set cover_image_url = 'https://suavitrine.net.br/img/portfolio-luanne-pratas.png', cover_image_position = 'center' where domain = 'luanne-pratas.vercel.app';
update public.portfolio_projects set cover_image_url = 'https://suavitrine.net.br/img/portfolio-wellness-fit-store.svg', cover_image_position = 'center' where domain = 'wellness-fit-store.vercel.app';
update public.portfolio_projects set cover_image_url = 'https://suavitrine.net.br/img/portfolio-mimo3d.svg', cover_image_position = 'center' where domain = 'mimo3d-zeta.vercel.app';
