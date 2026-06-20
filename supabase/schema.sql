create table if not exists public.site_state (
  id text primary key,
  site_data jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.site_state (id, site_data)
values ('site', '{}'::jsonb)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('team-images', 'team-images', true)
on conflict (id) do update set public = excluded.public;
