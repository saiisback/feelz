-- Run this in the Supabase SQL editor.
-- It creates the `feelz_properties` table, opens RLS so the publishable
-- (anon) key can read AND write, and seeds the Phase 1 launch list.
--
-- NOTE: open RLS for writes is fine for a prototype admin panel that
-- has no auth, but tighten this before going live (e.g. require
-- `auth.role() = 'authenticated'` for inserts/updates/deletes and
-- gate the /admin page with Supabase Auth).

create extension if not exists "pgcrypto";

create table if not exists public.feelz_properties (
  id          uuid primary key default gen_random_uuid(),
  city        text not null,
  region      text not null,
  archetype   text not null default '',
  status      text not null default 'stocked'
              check (status in ('stocked', 'soon', 'few-left')),
  stocks      text[] not null default '{}',
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists feelz_properties_sort_idx
  on public.feelz_properties (sort_order, created_at);

-- keep updated_at fresh
create or replace function public.feelz_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists feelz_properties_set_updated_at on public.feelz_properties;
create trigger feelz_properties_set_updated_at
  before update on public.feelz_properties
  for each row execute function public.feelz_set_updated_at();

alter table public.feelz_properties enable row level security;

drop policy if exists "feelz_properties read"   on public.feelz_properties;
drop policy if exists "feelz_properties insert" on public.feelz_properties;
drop policy if exists "feelz_properties update" on public.feelz_properties;
drop policy if exists "feelz_properties delete" on public.feelz_properties;

create policy "feelz_properties read"   on public.feelz_properties for select using (true);
create policy "feelz_properties insert" on public.feelz_properties for insert with check (true);
create policy "feelz_properties update" on public.feelz_properties for update using (true) with check (true);
create policy "feelz_properties delete" on public.feelz_properties for delete using (true);

-- seed the Phase 1 launch list. ON CONFLICT keys off (city, region) so re-runs
-- are idempotent. We add a unique index for that.
create unique index if not exists feelz_properties_city_region_uq
  on public.feelz_properties (city, region);

insert into public.feelz_properties (city, region, archetype, status, stocks, sort_order)
values
  ('Zostel Kasol Katagla',          'Himachal Pradesh', 'Mountain · Trekking',  'stocked', array['focus','sleep','joy'],     10),
  ('Zostel Old Manali (Goshal Rd)', 'Himachal Pradesh', 'Mountain · Party',     'stocked', array['extrovert','joy','sleep'], 20),
  ('Zostel Shoja Jibhi',            'Himachal Pradesh', 'Mountain · Offbeat',   'stocked', array['focus','sleep'],           30),
  ('Zostel Shangarh',               'Himachal Pradesh', 'Mountain · Escape',    'stocked', array['focus','sleep','joy'],     40),
  ('Zostel McLeodganj',             'Himachal Pradesh', 'Spiritual · Cultural', 'stocked', array['focus','joy','sleep'],     50),
  ('Zostel Gokarna',                'Karnataka',        'Beach · Spiritual',    'stocked', array['joy','sleep','focus'],     60),
  ('Zostel Plus Lonavala',          'Maharashtra',      'Weekend · Adventure',  'stocked', array['extrovert','joy','focus'], 70),
  ('Zostel Plus Poombarai Kodaikanal', 'Tamil Nadu',    'Mountain · Nature',    'stocked', array['focus','sleep','joy'],     80)
on conflict (city, region) do nothing;
