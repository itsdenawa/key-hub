insert into public.categories (
  id,
  name,
  slug,
  description,
  image_path,
  is_active,
  sort_order
)
values
  (
    '00000000-0000-4000-8000-100000000001',
    'Productivity',
    'productivity',
    'Templates and systems for sharper solo workflows.',
    'automation-key.png',
    true,
    1
  ),
  (
    '00000000-0000-4000-8000-100000000002',
    'Design',
    'design',
    'UI kits, tokens, and premium design resources.',
    'design-vault.png',
    true,
    2
  ),
  (
    '00000000-0000-4000-8000-100000000003',
    'Developer',
    'developer',
    'Code starters, launch kits, and developer assets.',
    'dev-pack.png',
    true,
    3
  )
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  image_path = excluded.image_path,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into public.products (
  id,
  category_id,
  title,
  slug,
  description,
  long_description,
  price_cents,
  currency,
  status,
  rating,
  delivery,
  file_types,
  license,
  created_at
)
values
  (
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-100000000003',
    'Launch Kit Pro',
    'launch-kit-pro',
    'A polished launch checklist, boilerplate, and release notes pack.',
    'Launch Kit Pro gives independent builders a compact operating system for shipping digital products: release templates, preflight checklists, customer email copy, and a lightweight analytics planning sheet.',
    4900,
    'usd',
    'active',
    4.9,
    'Instant ZIP download',
    array['MD', 'TS', 'PDF'],
    'Solo commercial license',
    '2026-06-01T09:00:00.000Z'
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8000-100000000002',
    'Design Vault',
    'design-vault',
    'Design tokens, landing patterns, and component specs for SaaS teams.',
    'Design Vault contains a focused collection of product-ready tokens, UI patterns, and specification docs for teams that need a calm, premium interface foundation without starting from a blank canvas.',
    7900,
    'usd',
    'active',
    4.8,
    'Instant Figma and ZIP download',
    array['FIG', 'JSON', 'MD'],
    'Team commercial license',
    '2026-06-07T11:30:00.000Z'
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    '00000000-0000-4000-8000-100000000001',
    'Automation Key',
    'automation-key',
    'Reusable automations for support, content ops, and billing reviews.',
    'Automation Key bundles practical workflow recipes, prompt patterns, and importable checklists for keeping operational work moving without inventing every process from scratch.',
    3900,
    'usd',
    'active',
    4.7,
    'Instant ZIP download',
    array['MD', 'CSV', 'JSON'],
    'Solo commercial license',
    '2026-06-13T14:10:00.000Z'
  ),
  (
    '00000000-0000-4000-8000-000000000004',
    '00000000-0000-4000-8000-100000000003',
    'API Starter Pack',
    'api-starter-pack',
    'Typed API client patterns, auth guards, and webhook examples.',
    'API Starter Pack is a compact set of TypeScript examples and docs for teams building authenticated SaaS APIs, webhook consumers, and dashboard integrations.',
    5900,
    'usd',
    'active',
    4.8,
    'Instant repository download',
    array['TS', 'MD', 'YAML'],
    'Team commercial license',
    '2026-06-18T16:45:00.000Z'
  )
on conflict (slug) do update
set
  category_id = excluded.category_id,
  title = excluded.title,
  description = excluded.description,
  long_description = excluded.long_description,
  price_cents = excluded.price_cents,
  currency = excluded.currency,
  status = excluded.status,
  rating = excluded.rating,
  delivery = excluded.delivery,
  file_types = excluded.file_types,
  license = excluded.license;

insert into public.product_images (product_id, storage_path, alt, sort_order)
values
  (
    '00000000-0000-4000-8000-000000000001',
    'launch-kit-pro.png',
    'Launch Kit Pro cover',
    1
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'design-vault.png',
    'Design Vault cover',
    1
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    'automation-key.png',
    'Automation Key cover',
    1
  ),
  (
    '00000000-0000-4000-8000-000000000004',
    'dev-pack.png',
    'API Starter Pack cover',
    1
  )
on conflict (product_id, storage_path) do update
set
  alt = excluded.alt,
  sort_order = excluded.sort_order;

insert into public.product_assets (
  product_id,
  storage_path,
  filename,
  size_mb,
  version,
  is_active
)
values
  (
    '00000000-0000-4000-8000-000000000001',
    'launch-kit-pro/latest.zip',
    'launch-kit-pro.zip',
    18,
    'latest',
    true
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'design-vault/latest.zip',
    'design-vault.zip',
    42,
    'latest',
    true
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    'automation-key/latest.zip',
    'automation-key.zip',
    11,
    'latest',
    true
  ),
  (
    '00000000-0000-4000-8000-000000000004',
    'api-starter-pack/latest.zip',
    'api-starter-pack.zip',
    24,
    'latest',
    true
  )
on conflict (product_id, version) do update
set
  storage_path = excluded.storage_path,
  filename = excluded.filename,
  size_mb = excluded.size_mb,
  is_active = excluded.is_active;
