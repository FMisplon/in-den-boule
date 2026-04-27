alter table public.event_ticket_orders
  add column if not exists tickets_issued_at timestamptz,
  add column if not exists confirmation_sent_at timestamptz;

create table if not exists public.event_tickets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  order_id uuid not null references public.event_ticket_orders(id) on delete cascade,
  event_slug text not null,
  event_title text not null,
  ticket_type_key text not null,
  ticket_type_title text not null,
  customer_name text not null,
  customer_email text not null,
  ticket_code text not null unique,
  qr_payload text not null,
  status text not null default 'valid',
  checked_in_at timestamptz
);

create index if not exists event_tickets_order_id_idx on public.event_tickets(order_id);
create index if not exists event_tickets_ticket_code_idx on public.event_tickets(ticket_code);

alter table public.event_tickets enable row level security;

grant usage on schema public to service_role;
grant select, insert, update on public.event_tickets to service_role;
