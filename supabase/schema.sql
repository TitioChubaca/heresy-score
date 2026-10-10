-- Heresy Score cloud log sync
-- Public anon key is safe to expose in the PWA. Row access is additionally
-- guarded by a random per-install sync token sent only in x-sync-token.

create extension if not exists pgcrypto;

create table if not exists public.reading_logs (
  id bigint generated always as identity primary key,
  owner_hash text not null,
  book_slug text not null,
  chapter integer not null check (chapter > 0),
  minutes integer,
  length text,
  intensity text,
  opening text,
  peak text,
  notes text,
  started_at timestamptz,
  finished_at timestamptz,
  app_version text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_hash, book_slug, chapter)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reading_logs_set_updated_at on public.reading_logs;
create trigger reading_logs_set_updated_at
before update on public.reading_logs
for each row execute function public.set_updated_at();

alter table public.reading_logs enable row level security;

drop policy if exists "reading_logs_select_owner" on public.reading_logs;
drop policy if exists "reading_logs_insert_owner" on public.reading_logs;
drop policy if exists "reading_logs_update_owner" on public.reading_logs;

create policy "reading_logs_select_owner"
on public.reading_logs
for select
to anon
using (
  owner_hash = encode(
    digest(
      coalesce((current_setting('request.headers', true)::json ->> 'x-sync-token'), ''),
      'sha256'
    ),
    'hex'
  )
);

create policy "reading_logs_insert_owner"
on public.reading_logs
for insert
to anon
with check (
  owner_hash = encode(
    digest(
      coalesce((current_setting('request.headers', true)::json ->> 'x-sync-token'), ''),
      'sha256'
    ),
    'hex'
  )
);

create policy "reading_logs_update_owner"
on public.reading_logs
for update
to anon
using (
  owner_hash = encode(
    digest(
      coalesce((current_setting('request.headers', true)::json ->> 'x-sync-token'), ''),
      'sha256'
    ),
    'hex'
  )
)
with check (
  owner_hash = encode(
    digest(
      coalesce((current_setting('request.headers', true)::json ->> 'x-sync-token'), ''),
      'sha256'
    ),
    'hex'
  )
);
