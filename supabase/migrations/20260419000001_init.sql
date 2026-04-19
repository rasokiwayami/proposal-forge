create extension if not exists "pgcrypto";

-- profiles
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  bio text,
  skills text[] default '{}',
  hourly_rate_min int,
  hourly_rate_max int,
  portfolio_urls jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- proposals
create table proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  job_title text not null,
  job_description text not null,
  job_url text,
  platform text check (platform in ('crowdworks','lancers','coconala','other')) default 'other',
  status text check (status in ('draft','submitted','won','lost')) default 'draft',
  proposed_price int,
  proposed_deadline_days int,
  final_text text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  submitted_at timestamptz
);

-- proposal_agents_output
create table proposal_agents_output (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid references proposals on delete cascade,
  agent_name text,
  output_markdown text,
  created_at timestamptz default now()
);

-- win_patterns
create table win_patterns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  pattern_text text,
  tag text,
  used_count int default 0,
  created_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
alter table proposals enable row level security;
alter table proposal_agents_output enable row level security;
alter table win_patterns enable row level security;

create policy "users can manage own profile" on profiles for all using (auth.uid() = id);
create policy "users can manage own proposals" on proposals for all using (auth.uid() = user_id);
create policy "users can manage own agent outputs" on proposal_agents_output for all
  using (exists (select 1 from proposals where proposals.id = proposal_agents_output.proposal_id and proposals.user_id = auth.uid()));
create policy "users can manage own win patterns" on win_patterns for all using (auth.uid() = user_id);

-- updated_at trigger
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on profiles
  for each row execute function handle_updated_at();
create trigger proposals_updated_at before update on proposals
  for each row execute function handle_updated_at();

-- auto create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- indexes
create index on proposals(user_id, created_at desc);
create index on proposal_agents_output(proposal_id);
