create table if not exists public.training_users (
  id uuid primary key default gen_random_uuid(),
  nickname text not null check (char_length(btrim(nickname)) between 1 and 32),
  nickname_key text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.test_attempts (
  id text primary key,
  user_id uuid not null references public.training_users (id),
  user_nickname text not null,
  total_questions integer not null check (total_questions > 0),
  score integer not null check (score >= 0 and score <= total_questions),
  percentage integer not null check (percentage between 0 and 100),
  time_taken_seconds integer not null check (time_taken_seconds >= 0),
  started_at timestamptz not null,
  completed_at timestamptz not null,
  answers jsonb not null
);

create index if not exists test_attempts_user_completed_idx
  on public.test_attempts (user_id, completed_at desc);

alter table public.training_users enable row level security;
alter table public.test_attempts enable row level security;

grant usage on schema public to anon, authenticated;

drop policy if exists "Anyone can read training attempts"
  on public.test_attempts;
create policy "Anyone can read training attempts"
  on public.test_attempts for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can submit training attempts"
  on public.test_attempts;
create policy "Anyone can submit training attempts"
  on public.test_attempts for insert
  to anon, authenticated
  with check (true);

create or replace function public.get_or_create_training_user(p_nickname text)
returns table (id uuid, nickname text, created_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_nickname text := btrim(p_nickname);
  saved_user public.training_users%rowtype;
begin
  if normalized_nickname is null
    or char_length(normalized_nickname) not between 1 and 32 then
    raise exception 'Nickname must be between 1 and 32 characters';
  end if;

  insert into public.training_users (nickname, nickname_key)
  values (normalized_nickname, lower(normalized_nickname))
  on conflict (nickname_key) do update
    set nickname_key = excluded.nickname_key
  returning * into saved_user;

  return query
    select saved_user.id, saved_user.nickname, saved_user.created_at;
end;
$$;

revoke all on function public.get_or_create_training_user(text) from public;
grant execute on function public.get_or_create_training_user(text)
  to anon, authenticated;

create or replace function public.get_training_leaderboard()
returns table (
  user_id uuid,
  nickname text,
  best_score integer,
  best_percentage integer,
  tests_taken bigint,
  best_time_taken_seconds integer
)
language sql
stable
security definer
set search_path = ''
as $$
  with ranked_attempts as (
    select
      attempt.user_id,
      attempt.user_nickname,
      attempt.score,
      attempt.percentage,
      attempt.time_taken_seconds,
      count(*) over (partition by attempt.user_id) as tests_taken,
      row_number() over (
        partition by attempt.user_id
        order by
          attempt.percentage desc,
          attempt.time_taken_seconds asc,
          attempt.completed_at asc
      ) as personal_rank
    from public.test_attempts as attempt
  )
  select
    ranked.user_id,
    ranked.user_nickname,
    ranked.score,
    ranked.percentage,
    ranked.tests_taken,
    ranked.time_taken_seconds
  from ranked_attempts as ranked
  where ranked.personal_rank = 1
  order by ranked.percentage desc, ranked.time_taken_seconds asc
  limit 20;
$$;

revoke all on function public.get_training_leaderboard() from public;
grant execute on function public.get_training_leaderboard()
  to anon, authenticated;

grant select, insert on public.test_attempts to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'test_attempts'
  ) then
    alter publication supabase_realtime add table public.test_attempts;
  end if;
end;
$$;
