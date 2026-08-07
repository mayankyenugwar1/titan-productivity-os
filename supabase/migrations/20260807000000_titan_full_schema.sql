-- TITAN OS Complete Supabase Production Schema Migration
-- Ensures all tables, columns, indexes, and Row Level Security (RLS) policies exist for any new user deployment.

-- 1. Create habits table with all category types & duration metadata
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 120),
  description text,
  category text not null,
  priority text not null check (priority in ('Low', 'Medium', 'High')),
  xp integer not null check (xp > 0 and xp <= 1000),
  frequency text not null default 'daily' check (frequency in ('daily', 'weekly')),
  weekly_days text[] not null default '{}',
  duration text,
  estimated_minutes integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure duration and estimated_minutes columns exist if table was created with older schema
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'habits' and column_name = 'duration') then
    alter table public.habits add column duration text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'habits' and column_name = 'estimated_minutes') then
    alter table public.habits add column estimated_minutes integer;
  end if;
end $$;

-- 2. Create habit_completions table
create table if not exists public.habit_completions (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_on date not null default current_date,
  completed_at timestamptz not null default now(),
  unique (habit_id, completed_on)
);

-- 3. Indexes for high-performance querying
create index if not exists habits_user_id_idx on public.habits(user_id);
create index if not exists habit_completions_user_date_idx on public.habit_completions(user_id, completed_on desc);

-- 4. Enable Row Level Security (RLS)
alter table public.habits enable row level security;
alter table public.habit_completions enable row level security;

-- 5. Comprehensive RLS policies allowing authenticated users to manage their own data
drop policy if exists "Users manage their own habits" on public.habits;
create policy "Users manage their own habits" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users manage their own habit completions" on public.habit_completions;
create policy "Users manage their own habit completions" on public.habit_completions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
