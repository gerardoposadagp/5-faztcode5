-- Create projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  status text not null default 'Pending', -- e.g., 'Active', 'Completed', 'Pending', 'On Hold'
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  due_date date,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security for projects table
alter table public.projects enable row level security;

-- Policies for projects
-- Allow authenticated users to insert projects
create policy "Allow authenticated users to create projects" on public.projects for insert with check (auth.uid() = user_id);
-- Allow users to read their own projects
create policy "Allow individual read access to projects" on public.projects for select using (auth.uid() = user_id);
-- Allow users to update their own projects
create policy "Allow individual update access to projects" on public.projects for update using (auth.uid() = user_id);
-- Allow users to delete their own projects
create policy "Allow individual delete access to projects" on public.projects for delete using (auth.uid() = user_id);
