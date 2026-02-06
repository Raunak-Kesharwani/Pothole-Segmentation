-- Create a table for public profiles (linked to auth.users)
-- NOTE: Using 'users' as table name to match existing application references
create table users (
  id uuid references auth.users not null,
  email text,
  name text,
  role text default 'citizen' check (role in ('citizen', 'admin', 'worker')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Establish RLS (Row Level Security) for users
alter table users enable row level security;

create policy "Public profiles are viewable by everyone."
  on users for select
  using ( true );

create policy "Users can insert their own profile."
  on users for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on users for update
  using ( auth.uid() = id );

-- Create Reports Table
create table reports (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) not null,
  image_url text,
  complaint_text text,
  severity text check (severity in ('low', 'medium', 'high', 'critical')),
  status text default 'pending' check (status in ('pending', 'assigned', 'fixed', 'rejected')),
  latitude float,
  longitude float,
  ai_summary text,
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Reports
alter table reports enable row level security;

create policy "Users can view their own reports"
  on reports for select
  using ( auth.uid() = user_id );

create policy "Admins can view all reports"
  on reports for select
  using ( exists (select 1 from users where id = auth.uid() and role = 'admin') );

create policy "Workers can view assigned reports"
  on reports for select
  using ( exists (select 1 from tasks where worker_id = auth.uid() and report_id = reports.id) );

create policy "Users can insert reports"
  on reports for insert
  with check ( auth.uid() = user_id );

-- Create Tasks Table (for Workers)
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  report_id uuid references reports(id) not null,
  worker_id uuid references users(id) not null,
  status text default 'assigned' check (status in ('assigned', 'in_progress', 'completed')),
  wage decimal(10, 2),
  progress integer default 0,
  before_image text,
  after_image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Tasks
alter table tasks enable row level security;

create policy "Admins can manage tasks"
  on tasks for all
  using ( exists (select 1 from users where id = auth.uid() and role = 'admin') );

create policy "Workers can view their tasks"
  on tasks for select
  using ( worker_id = auth.uid() );

create policy "Workers can update their tasks"
  on tasks for update
  using ( worker_id = auth.uid() );

-- Storage Buckets (Execute via Dashboard usually, but documenting naming)
-- Bucket: 'pothole-images' (public)
-- Bucket: 'proofs' (public)
