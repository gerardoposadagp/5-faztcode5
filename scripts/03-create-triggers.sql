-- This function is triggered when a new user signs up.
-- It creates a corresponding user_profile and assigns the default 'user' role.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  user_role_id bigint;
begin
  -- Create a profile for the new user with default values
  insert into public.user_profiles (user_id, profile_status, active)
  values (new.id, 0, 1);

  -- Get the ID for the 'user' role
  select id into user_role_id from public.roles where name = 'user';

  -- Assign the 'user' role to the new user
  insert into public.user_roles (user_id, role_id)
  values (new.id, user_role_id);

  return new;
end;
$$;

-- Create the trigger on the auth.users table
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
