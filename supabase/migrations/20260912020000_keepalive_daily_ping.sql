-- Keeps this free-tier project from auto-pausing after a week of inactivity.
-- pg_cron runs once a day and calls this project's own REST API (insert + delete),
-- which counts as real API traffic — a plain internal SQL write from cron does not.
create extension if not exists pg_cron;
create extension if not exists pg_net;

create table if not exists public._keepalive_ping (
  id bigint generated always as identity primary key,
  pinged_at timestamptz not null default now()
);

alter table public._keepalive_ping enable row level security;

grant select, insert, delete on public._keepalive_ping to anon;

create policy "anon can insert keepalive ping"
  on public._keepalive_ping for insert
  to anon
  with check (true);

create policy "anon can delete old keepalive pings"
  on public._keepalive_ping for delete
  to anon
  using (true);

create or replace function public.keepalive_ping()
returns void
language plpgsql
security definer
as $$
declare
  project_url text := 'https://svovabwkremtnnesuknj.supabase.co';
  anon_key text := 'sb_publishable_rZ0ZbUXW3Ed5pY6Vtka2HQ_GXwrXFSy';
begin
  -- clear previous pings first (every row has id >= 0)
  perform net.http_delete(
    url := project_url || '/rest/v1/_keepalive_ping?id=gte.0',
    headers := jsonb_build_object('apikey', anon_key)
  );
  -- then insert today's ping
  perform net.http_post(
    url := project_url || '/rest/v1/_keepalive_ping',
    headers := jsonb_build_object('apikey', anon_key, 'Content-Type', 'application/json', 'Prefer', 'return=minimal'),
    body := '{}'::jsonb
  );
end;
$$;

select cron.schedule(
  'keepalive-daily-ping',
  '17 3 * * *',
  $$select public.keepalive_ping();$$
);
