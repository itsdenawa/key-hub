insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-assets',
  'product-assets',
  false,
  104857600,
  array[
    'application/zip',
    'application/pdf',
    'application/json',
    'text/markdown',
    'text/plain',
    'text/csv'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can read product images"
on storage.objects for select
using (bucket_id = 'product-images');

create policy "Admins can manage product images"
on storage.objects for all
using (bucket_id = 'product-images' and public.current_user_is_admin())
with check (bucket_id = 'product-images' and public.current_user_is_admin());

create policy "Admins can manage private product assets"
on storage.objects for all
using (bucket_id = 'product-assets' and public.current_user_is_admin())
with check (bucket_id = 'product-assets' and public.current_user_is_admin());

create policy "Users can read entitled private product assets"
on storage.objects for select
using (
  bucket_id = 'product-assets'
  and exists (
    select 1
    from public.product_assets
    where product_assets.storage_path = storage.objects.name
      and public.user_has_active_entitlement(product_assets.product_id)
  )
);
