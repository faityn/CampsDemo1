create extension if not exists pgcrypto;

create table if not exists public.home_content (
  id uuid primary key default gen_random_uuid(),
  slug text not null default 'home',
  eyebrow_en text not null default 'Mongolian Camps',
  eyebrow_mn text not null default 'Монголын баазууд',
  tagline_en text not null default 'Curated stays in the wild',
  tagline_mn text not null default 'Зэрлэгт тохирсон амралт',
  country_name_en text not null default 'MONGOLIA',
  country_name_mn text not null default 'МОНГОЛ',
  motto_en text not null default 'Slow travel. Vast skies. Deep calm.',
  motto_mn text not null default 'Удаан аялал. Уудам тэнгэр. Тайван амгалан.',
  scroll_en text not null default 'Scroll',
  scroll_mn text not null default 'Урагш',
  destinations_label_en text not null default 'Destinations',
  destinations_label_mn text not null default 'Байрлал',
  choose_label_en text not null default 'Choose your horizon',
  choose_label_mn text not null default 'Сонголтоо хийж үзээрэй',
  destinations_description_en text not null default 'From the endless steppe to pine valleys and desert plains, each camp offers a different rhythm of stay.',
  destinations_description_mn text not null default 'Эзэнгүй хээрээс эхлээд гацуур ой, элсэн манхан хүртэл, тус бүр нэгэн өвөрмөц амралтын хэмнэлтэй.',
  different_luxury_en text not null default 'Different luxury',
  different_luxury_mn text not null default 'Өөр төрлийн тансаглал',
  space_to_breathe_en text not null default 'Space to breathe',
  space_to_breathe_mn text not null default 'Амрах зай',
  time_to_stay_en text not null default 'Time to stay',
  time_to_stay_mn text not null default 'Амрах цаг',
  closing_en text not null default 'A slower kind of luxury — wide horizons, warm hospitality, and time that actually feels like yours.',
  closing_mn text not null default 'Удаан, тайван тансаглал — уудам хаяа, дулаан найрсаг байдал, яг таны цаг хугацаа.',
  hero_image text not null default '/images/2.jpg',
  updated_at timestamptz not null default now(),
  unique (slug)
);

create table if not exists public.resorts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_mn text not null,
  region_en text not null,
  region_mn text not null,
  eyebrow_en text not null,
  eyebrow_mn text not null,
  signature_en text not null,
  signature_mn text not null,
  description_en text not null,
  description_mn text not null,
  about_image text not null,
  image text not null,
  accent text not null,
  logo text not null,
  logo_mark text not null,
  map_url text not null,
  map_center text not null,
  phone text not null,
  arrival_text_en text not null,
  arrival_text_mn text not null,
  contact_text_en text not null,
  contact_text_mn text not null,
  featured_restaurant_title_en text not null,
  featured_restaurant_title_mn text not null,
  featured_restaurant_text_en text not null,
  featured_restaurant_text_mn text not null,
  restaurant_gallery_configured boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.resorts
  drop column if exists restaurant_text_en,
  drop column if exists restaurant_text_mn;

alter table public.resorts
  add column if not exists restaurant_gallery_configured boolean not null default false;

create table if not exists public.resort_accommodations (
  id uuid primary key default gen_random_uuid(),
  resort_slug text not null references public.resorts(slug) on delete cascade,
  title_en text not null,
  title_mn text not null,
  description_en text not null,
  description_mn text not null,
  image text not null,
  images text[] not null default '{}',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (resort_slug, title_en)
);

alter table public.resort_accommodations
  add column if not exists images text[] not null default '{}';

create table if not exists public.resort_galleries (
  id uuid primary key default gen_random_uuid(),
  resort_slug text not null references public.resorts(slug) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (resort_slug, image_url)
);

create table if not exists public.resort_restaurant_galleries (
  id uuid primary key default gen_random_uuid(),
  resort_slug text not null references public.resorts(slug) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (resort_slug, image_url)
);

create table if not exists public.resort_activities (
  id uuid primary key default gen_random_uuid(),
  resort_slug text not null references public.resorts(slug) on delete cascade,
  title_en text not null,
  title_mn text not null,
  text_en text not null,
  text_mn text not null,
  image text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (resort_slug, title_en)
);

create table if not exists public.resort_facts (
  id uuid primary key default gen_random_uuid(),
  resort_slug text not null references public.resorts(slug) on delete cascade,
  label_en text not null,
  label_mn text not null,
  value_en text not null,
  value_mn text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (resort_slug, label_en)
);

create table if not exists public.resort_about_texts (
  id uuid primary key default gen_random_uuid(),
  resort_slug text not null references public.resorts(slug) on delete cascade,
  paragraph_en text not null,
  paragraph_mn text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (resort_slug, paragraph_en)
);

create index if not exists idx_home_content_slug on public.home_content(slug);
create index if not exists idx_resorts_slug on public.resorts(slug);
create index if not exists idx_resort_accommodations_slug on public.resort_accommodations(resort_slug);
create index if not exists idx_resort_galleries_slug on public.resort_galleries(resort_slug);
create index if not exists idx_resort_restaurant_galleries_slug on public.resort_restaurant_galleries(resort_slug);
create index if not exists idx_resort_activities_slug on public.resort_activities(resort_slug);
create index if not exists idx_resort_facts_slug on public.resort_facts(resort_slug);
create index if not exists idx_resort_about_texts_slug on public.resort_about_texts(resort_slug);

create or replace function public.is_camps_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role' = 'admin', false);
$$;

-- Set app_metadata.role = 'admin' for trusted admin users in Supabase Auth.
grant execute on function public.is_camps_admin() to anon, authenticated;

alter table public.home_content enable row level security;
alter table public.resorts enable row level security;
alter table public.resort_accommodations enable row level security;
alter table public.resort_galleries enable row level security;
alter table public.resort_restaurant_galleries enable row level security;
alter table public.resort_activities enable row level security;
alter table public.resort_facts enable row level security;
alter table public.resort_about_texts enable row level security;

grant select on public.home_content, public.resorts, public.resort_accommodations,
  public.resort_galleries, public.resort_restaurant_galleries, public.resort_activities,
  public.resort_facts, public.resort_about_texts to anon, authenticated;
grant insert, update, delete on public.home_content, public.resorts, public.resort_accommodations,
  public.resort_galleries, public.resort_restaurant_galleries, public.resort_activities,
  public.resort_facts, public.resort_about_texts to authenticated;

drop policy if exists "Public can read home content" on public.home_content;
create policy "Public can read home content" on public.home_content
  for select to anon, authenticated using (true);
drop policy if exists "Admins can manage home content" on public.home_content;
create policy "Admins can manage home content" on public.home_content
  for all to authenticated
  using (public.is_camps_admin()) with check (public.is_camps_admin());

drop policy if exists "Public can read resorts" on public.resorts;
create policy "Public can read resorts" on public.resorts
  for select to anon, authenticated using (true);
drop policy if exists "Admins can manage resorts" on public.resorts;
create policy "Admins can manage resorts" on public.resorts
  for all to authenticated
  using (public.is_camps_admin()) with check (public.is_camps_admin());

drop policy if exists "Public can read resort accommodations" on public.resort_accommodations;
create policy "Public can read resort accommodations" on public.resort_accommodations
  for select to anon, authenticated using (true);
drop policy if exists "Admins can manage resort accommodations" on public.resort_accommodations;
create policy "Admins can manage resort accommodations" on public.resort_accommodations
  for all to authenticated
  using (public.is_camps_admin()) with check (public.is_camps_admin());

drop policy if exists "Public can read resort galleries" on public.resort_galleries;
create policy "Public can read resort galleries" on public.resort_galleries
  for select to anon, authenticated using (true);
drop policy if exists "Admins can manage resort galleries" on public.resort_galleries;
create policy "Admins can manage resort galleries" on public.resort_galleries
  for all to authenticated
  using (public.is_camps_admin()) with check (public.is_camps_admin());

drop policy if exists "Public can read resort restaurant galleries" on public.resort_restaurant_galleries;
create policy "Public can read resort restaurant galleries" on public.resort_restaurant_galleries
  for select to anon, authenticated using (true);
drop policy if exists "Admins can manage resort restaurant galleries" on public.resort_restaurant_galleries;
create policy "Admins can manage resort restaurant galleries" on public.resort_restaurant_galleries
  for all to authenticated
  using (public.is_camps_admin()) with check (public.is_camps_admin());

drop policy if exists "Public can read resort activities" on public.resort_activities;
create policy "Public can read resort activities" on public.resort_activities
  for select to anon, authenticated using (true);
drop policy if exists "Admins can manage resort activities" on public.resort_activities;
create policy "Admins can manage resort activities" on public.resort_activities
  for all to authenticated
  using (public.is_camps_admin()) with check (public.is_camps_admin());

drop policy if exists "Public can read resort facts" on public.resort_facts;
create policy "Public can read resort facts" on public.resort_facts
  for select to anon, authenticated using (true);
drop policy if exists "Admins can manage resort facts" on public.resort_facts;
create policy "Admins can manage resort facts" on public.resort_facts
  for all to authenticated
  using (public.is_camps_admin()) with check (public.is_camps_admin());

drop policy if exists "Public can read resort about texts" on public.resort_about_texts;
create policy "Public can read resort about texts" on public.resort_about_texts
  for select to anon, authenticated using (true);
drop policy if exists "Admins can manage resort about texts" on public.resort_about_texts;
create policy "Admins can manage resort about texts" on public.resort_about_texts
  for all to authenticated
  using (public.is_camps_admin()) with check (public.is_camps_admin());
