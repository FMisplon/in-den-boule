alter table public.gift_card_orders
  add column if not exists fulfillment_mode text not null default 'self',
  add column if not exists recipient_email text,
  add column if not exists pickup_in_store boolean not null default false,
  add column if not exists voucher_issued_at timestamptz,
  add column if not exists fulfillment_sent_at timestamptz;

create table if not exists public.gift_cards (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  order_id uuid not null references public.gift_card_orders(id) on delete cascade,
  voucher_code text not null unique,
  purchaser_name text not null,
  purchaser_email text not null,
  recipient_name text not null,
  recipient_email text,
  personal_message text,
  amount_cents integer not null,
  currency text not null default 'EUR',
  fulfillment_mode text not null default 'self',
  pickup_in_store boolean not null default false,
  qr_payload text not null,
  status text not null default 'active',
  redeemed_at timestamptz,
  redeemed_by text,
  redeem_note text
);

create index if not exists gift_cards_order_id_idx on public.gift_cards(order_id);
create index if not exists gift_cards_voucher_code_idx on public.gift_cards(voucher_code);

alter table public.gift_cards enable row level security;

grant usage on schema public to service_role;
grant select, insert, update on public.gift_cards to service_role;
