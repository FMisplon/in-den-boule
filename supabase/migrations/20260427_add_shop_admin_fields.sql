alter table public.gift_card_orders
  add column if not exists product_slug text,
  add column if not exists product_title text,
  add column if not exists admin_status text not null default 'new',
  add column if not exists handled_at timestamptz,
  add column if not exists handled_by text,
  add column if not exists admin_note text;

grant usage on schema public to service_role;
grant select, insert, update on public.gift_card_orders to service_role;
