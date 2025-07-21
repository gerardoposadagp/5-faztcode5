-- Insert the predefined roles into the roles table
insert into public.roles (name) values
('sysadmin'),
('admin'),
('user')
on conflict (name) do nothing;
