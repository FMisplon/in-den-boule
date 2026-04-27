create table if not exists public.reservation_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  reservation_date date not null,
  reservation_time text not null,
  party_size text not null,
  name text not null,
  email text not null,
  note text
);

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null
);

create table if not exists public.venue_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  event_type text not null,
  preferred_date date not null,
  guest_count text not null,
  message text
);

create table if not exists public.gift_card_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  purchaser_name text not null,
  purchaser_email text not null,
  recipient_name text not null,
  personal_message text,
  amount_cents integer not null,
  currency text not null default 'EUR',
  status text not null default 'created',
  mollie_payment_id text
);

alter table public.reservation_requests enable row level security;
alter table public.contact_requests enable row level security;
alter table public.venue_requests enable row level security;
alter table public.gift_card_orders enable row level security;

grant usage on schema public to service_role;

grant select, insert on public.reservation_requests to service_role;
grant select, insert on public.contact_requests to service_role;
grant select, insert on public.venue_requests to service_role;
grant select, insert, update on public.gift_card_orders to service_role;
