create extension if not exists pgcrypto;

create type public.profile_role as enum ('customer', 'admin');
create type public.product_status as enum ('draft', 'active', 'archived');
create type public.order_status as enum (
  'pending',
  'paid',
  'fulfilled',
  'canceled',
  'refunded'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role public.profile_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null default 'Billing',
  full_name text not null,
  line1 text not null,
  line2 text,
  city text not null,
  region text,
  postal_code text not null,
  country text not null default 'US',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  image_path text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  description text not null default '',
  long_description text not null default '',
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'usd',
  status public.product_status not null default 'draft',
  rating numeric(2, 1) not null default 0 check (rating >= 0 and rating <= 5),
  delivery text not null default 'Instant download',
  file_types text[] not null default '{}',
  license text not null default 'Solo commercial license',
  stripe_price_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, storage_path)
);

create table public.product_assets (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  filename text not null,
  size_mb numeric(10, 2) not null default 0,
  version text not null default 'latest',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, version)
);

create table public.wishlist_items (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.order_status not null default 'pending',
  total_cents integer not null default 0 check (total_cents >= 0),
  currency text not null default 'usd',
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  customer_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  product_title text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_amount_cents integer not null check (unit_amount_cents >= 0),
  total_amount_cents integer generated always as (quantity * unit_amount_cents) stored,
  created_at timestamptz not null default now()
);

create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  order_item_id uuid not null references public.order_items(id) on delete cascade,
  active boolean not null default true,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (user_id, product_id, order_item_id)
);

create index addresses_user_id_idx on public.addresses(user_id);
create index categories_active_sort_idx on public.categories(is_active, sort_order);
create index products_category_status_idx on public.products(category_id, status);
create index products_created_at_idx on public.products(created_at desc);
create index product_images_product_sort_idx on public.product_images(product_id, sort_order);
create index product_assets_product_active_idx on public.product_assets(product_id, is_active);
create index orders_user_created_idx on public.orders(user_id, created_at desc);
create index orders_status_idx on public.orders(status);
create index order_items_order_idx on public.order_items(order_id);
create index entitlements_user_product_idx on public.entitlements(user_id, product_id) where active;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.prevent_profile_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role is distinct from new.role and not public.current_user_is_admin() then
    raise exception 'Only admins can change profile roles.';
  end if;

  return new;
end;
$$;

create trigger profiles_prevent_role_escalation
before update on public.profiles
for each row execute function public.prevent_profile_role_escalation();

create trigger addresses_set_updated_at
before update on public.addresses
for each row execute function public.set_updated_at();

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger product_assets_set_updated_at
before update on public.product_assets
for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.user_has_active_entitlement(product uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.entitlements
    where user_id = auth.uid()
      and product_id = product
      and active = true
      and revoked_at is null
  );
$$;

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_assets enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.entitlements enable row level security;

create policy "Users can read their own profile"
on public.profiles for select
using (id = auth.uid() or public.current_user_is_admin());

create policy "Users can update their own profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "Admins can manage profiles"
on public.profiles for all
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

create policy "Users can manage their addresses"
on public.addresses for all
using (user_id = auth.uid() or public.current_user_is_admin())
with check (user_id = auth.uid() or public.current_user_is_admin());

create policy "Public can read active categories"
on public.categories for select
using (is_active = true or public.current_user_is_admin());

create policy "Admins can manage categories"
on public.categories for all
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

create policy "Public can read active products"
on public.products for select
using (status = 'active' or public.current_user_is_admin());

create policy "Admins can manage products"
on public.products for all
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

create policy "Public can read active product images"
on public.product_images for select
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and (products.status = 'active' or public.current_user_is_admin())
  )
);

create policy "Admins can manage product images"
on public.product_images for all
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

create policy "Users can read assets they own"
on public.product_assets for select
using (
  public.current_user_is_admin()
  or public.user_has_active_entitlement(product_id)
);

create policy "Admins can manage product assets"
on public.product_assets for all
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

create policy "Users can manage their wishlist"
on public.wishlist_items for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Admins can read wishlist items"
on public.wishlist_items for select
using (public.current_user_is_admin());

create policy "Users can read their orders"
on public.orders for select
using (user_id = auth.uid() or public.current_user_is_admin());

create policy "Users can create their pending orders"
on public.orders for insert
with check (user_id = auth.uid() and status = 'pending');

create policy "Admins can manage orders"
on public.orders for all
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

create policy "Users can read their order items"
on public.order_items for select
using (
  public.current_user_is_admin()
  or exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
  )
);

create policy "Users can create items for their pending orders"
on public.order_items for insert
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
      and orders.status = 'pending'
  )
);

create policy "Admins can manage order items"
on public.order_items for all
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

create policy "Users can read their entitlements"
on public.entitlements for select
using (user_id = auth.uid() or public.current_user_is_admin());

create policy "Admins can manage entitlements"
on public.entitlements for all
using (public.current_user_is_admin())
with check (public.current_user_is_admin());
