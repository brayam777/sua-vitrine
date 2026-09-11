-- Schema for the standalone Sua Vitrine Supabase project.
-- Portfolio is data-driven so new client sites can be added without a code change.

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text not null unique,
  url text not null,
  segment text not null,
  headline text not null,
  description text not null,
  bg_color text not null default '#f6f1e7',
  accent_color text not null default '#c6a15b',
  text_color text not null default '#0b0b0b',
  cover_image_url text,
  cover_image_position text not null default 'center 30%',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.portfolio_projects enable row level security;

create policy "Public can view active portfolio projects"
  on public.portfolio_projects for select
  using (is_active = true);

create policy "Admin can manage portfolio projects"
  on public.portfolio_projects for all
  using (auth.jwt() ->> 'email' = any (array['brayamfelipe02@gmail.com']))
  with check (auth.jwt() ->> 'email' = any (array['brayamfelipe02@gmail.com']));

insert into public.portfolio_projects
  (name, domain, url, segment, headline, description, bg_color, accent_color, text_color, cover_image_url, cover_image_position, sort_order)
values
  (
    'Romano Joias', 'romano-joias.vercel.app', 'https://romano-joias.vercel.app',
    'Ourivesaria', 'Joias em ouro, feitas à mão pra você',
    'Peças exclusivas, desenhadas e lapidadas uma a uma — sem produção em série.',
    '#f6f1e7', '#c6a15b', '#0b0b0b',
    'https://s3.inovai.dev.br/catalogo-brayam/romano-joias/0abf4931-9760-4ce8-b406-24ad2ea284ef.jpg', 'center 42%',
    1
  ),
  (
    'Luanne Pratas 925', 'luanne-pratas.vercel.app', 'https://luanne-pratas.vercel.app',
    'Joias em prata', 'Faça o seu pedido! Prata 925 legítima',
    'Catálogo por categoria, peças exclusivas selecionadas com carinho.',
    '#ece9e3', '#5f8f7a', '#1c3a54',
    'https://ietooopjzlnzmguubrrv.supabase.co/storage/v1/object/public/luanne-photos/hero-1-4656c127-0d74-46a4-9dfd-6b616fc88452.jpeg', 'center 32%',
    2
  ),
  (
    'Wellness Fit Store', 'wellness-fit-store.vercel.app', 'https://wellness-fit-store.vercel.app',
    'Moda fitness', 'Treine com estilo e conforto',
    'Leggings, tops e conjuntos — moda fitness feminina, do treino ao dia a dia.',
    '#eef3ea', '#6b8f5e', '#2c422d',
    'https://vxeokiiwdsbwodlriadm.supabase.co/storage/v1/object/public/wellness-photos/753be5eb-771b-4971-865f-a45bfa3777b4.jpeg', 'center 22%',
    3
  )
on conflict (domain) do nothing;
