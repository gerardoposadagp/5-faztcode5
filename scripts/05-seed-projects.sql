-- Seed the projects table with 50 sample entries
-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with an actual user_id from your auth.users table.
-- You can find a user_id by querying: SELECT id FROM auth.users LIMIT 1;

DO $$
DECLARE
  user_uuid uuid := 'YOUR_USER_ID_HERE'; -- <<< REPLACE THIS WITH A REAL USER ID
  project_name text;
  project_status text;
  project_progress integer;
  project_due_date date;
  i integer;
BEGIN
  IF user_uuid = 'YOUR_USER_ID_HERE' THEN
    RAISE EXCEPTION 'Please replace YOUR_USER_ID_HERE with a valid user_id from your auth.users table.';
  END IF;

  FOR i IN 1..50 LOOP
    project_name := 'Project ' || i;

    -- Randomly assign status
    SELECT CASE floor(random() * 4)
      WHEN 0 THEN 'Active'
      WHEN 1 THEN 'Completed'
      WHEN 2 THEN 'Pending'
      ELSE 'On Hold'
    END INTO project_status;

    -- Assign progress based on status
    IF project_status = 'Completed' THEN
      project_progress := 100;
    ELSE
      project_progress := floor(random() * 99); -- 0-98 for non-completed
    END IF;

    -- Generate a random due date within the next 180 days
    project_due_date := (NOW() + (random() * 180 || ' days')::interval)::date;

    INSERT INTO public.projects (user_id, name, status, progress, due_date)
    VALUES (user_uuid, project_name, project_status, project_progress, project_due_date);
  END LOOP;
END;
$$;
