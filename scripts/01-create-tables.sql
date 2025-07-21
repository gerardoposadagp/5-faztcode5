-- Create roles table to store user roles
create table if not exists public.roles (
  id bigserial primary key,
  name text not null unique
);

-- Create user_profiles table to store public user data
create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  address text,
  phone_number text,
  age int,
  profile_status int default 0 not null, -- 0: incomplete, 1: complete
  active int default 1 not null -- 1: active, 0: inactive
);

-- Create a join table for user roles
create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id bigint not null references public.roles(id) on delete cascade,
  primary key (user_id, role_id)
);

-- Enable Row Level Security for the new tables
alter table public.user_profiles enable row level security;
alter table public.roles enable row level security;
alter table public.user_roles enable row level security;

-- Policies for user_profiles
-- Allow users to read their own profile
create policy "Allow individual read access" on public.user_profiles for select using (auth.uid() = user_id);
-- Allow users to update their own profile
create policy "Allow individual update access" on public.user_profiles for update using (auth.uid() = user_id);

-- Policies for roles
-- Allow authenticated users to read all roles
create policy "Allow authenticated read access" on public.roles for select using (auth.role() = 'authenticated');

-- Policies for user_roles
-- Allow users to read their own roles
create policy "Allow individual read access" on public.user_roles for select using (auth.uid() = user_id);
