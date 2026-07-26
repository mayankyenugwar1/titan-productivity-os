create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 120),
  description text,
  category text not null check (category in ('Fitness', 'Study', 'Coding', 'Reading', 'Health', 'Mindfulness', 'Finance', 'Personal')),
  priority text not null check (priority in ('Low', 'Medium', 'High')),
  xp integer not null check (xp > 0 and xp <= 1000),
  frequency text not null default 'daily' check (frequency in ('daily', 'weekly')),
  weekly_days text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habit_completions (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_on date not null default current_date,
  completed_at timestamptz not null default now(),
  unique (habit_id, completed_on)
);

create index if not exists habits_user_id_idx on public.habits(user_id);
create index if not exists habit_completions_user_date_idx on public.habit_completions(user_id, completed_on desc);

alter table public.habits enable row level security;
alter table public.habit_completions enable row level security;

create policy "Users manage their own habits" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own habit completions" on public.habit_completions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
