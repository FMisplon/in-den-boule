alter table public.reservation_requests
  add column if not exists status text not null default 'new',
  add column if not exists handled_at timestamptz,
  add column if not exists handled_by text,
  add column if not exists admin_note text;

grant select, insert, update on public.reservation_requests to service_role;
