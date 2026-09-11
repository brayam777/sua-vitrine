-- The RLS policy alone isn't enough — Postgres also needs the base table
-- privilege granted to the anon/authenticated roles that PostgREST uses.
grant select on public.portfolio_projects to anon, authenticated;
