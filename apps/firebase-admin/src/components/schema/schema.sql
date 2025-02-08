-- Part 1: Extensions
create extension if not exists postgis;
create extension if not exists btree_gist;

-- Part 2: Create the function
create or replace function create_import_tables() returns void language plpgsql as $$
begin
  -- Enable required extensions
  create extension if not exists postgis;
  create extension if not exists btree_gist;

  -- Base reference tables
  execute 'create table if not exists public.regions (
    id text primary key,
    data jsonb not null
  )';

  execute 'create table if not exists public.trusts (
    id text primary key,
    data jsonb not null
  )';

  execute 'create table if not exists public.establishment_types (
    id text primary key,
    data jsonb not null
  )';

  execute 'create table if not exists public.education_phases (
    id text primary key,
    data jsonb not null
  )';

  -- Location-aware tables
  execute 'create table if not exists public.locations (
    id text primary key,
    data jsonb not null,
    geom geometry(Point, 4326) generated always as (
      st_setsrid(st_makepoint(
        (data->>''longitude'')::float,
        (data->>''latitude'')::float
      ), 4326)
    ) stored
  )';
  execute 'create index if not exists locations_geom_idx on locations using gist(geom)';

  execute 'create table if not exists public.quadrants (
    id text primary key,
    data jsonb not null,
    bounds geometry(Polygon, 4326) generated always as (
      st_makeenvelope(
        (data->''bounds''->''west'')::float,
        (data->''bounds''->''south'')::float,
        (data->''bounds''->''east'')::float,
        (data->''bounds''->''north'')::float,
        4326
      )
    ) stored
  )';
  execute 'create index if not exists quadrants_bounds_idx on quadrants using gist(bounds)';

  -- Schools and related tables
  execute 'create table if not exists public.schools (
    id text primary key,
    data jsonb not null,
    region_id text generated always as ((data->>''regionId'')::text) stored references regions(id),
    trust_id text generated always as ((data->>''trustId'')::text) stored references trusts(id),
    establishment_type_id text generated always as ((data->>''establishmentTypeId'')::text) stored references establishment_types(id),
    education_phase_id text generated always as ((data->>''educationPhaseId'')::text) stored references education_phases(id),
    location_id text generated always as ((data->>''locationId'')::text) stored references locations(id)
  )';

  execute 'create index if not exists schools_region_id_idx on schools(region_id)';
  execute 'create index if not exists schools_trust_id_idx on schools(trust_id)';
  execute 'create index if not exists schools_establishment_type_id_idx on schools(establishment_type_id)';
  execute 'create index if not exists schools_education_phase_id_idx on schools(education_phase_id)';
  execute 'create index if not exists schools_location_id_idx on schools(location_id)';

  -- KS4 Results tables
  execute 'create table if not exists public.ks4_results (
    id text primary key,
    data jsonb not null,
    school_id text generated always as ((data->>''schoolId'')::text) stored references schools(id)
  )';
  execute 'create index if not exists ks4_results_school_id_idx on ks4_results(school_id)';

  execute 'create table if not exists public.ks4_results_demographics (
    id text primary key,
    data jsonb not null,
    school_id text generated always as ((data->>''schoolId'')::text) stored references schools(id)
  )';
  execute 'create index if not exists ks4_results_demographics_school_id_idx on ks4_results_demographics(school_id)';

  execute 'create table if not exists public.ks4_results_details (
    id text primary key,
    data jsonb not null,
    school_id text generated always as ((data->>''schoolId'')::text) stored references schools(id)
  )';
  execute 'create index if not exists ks4_results_details_school_id_idx on ks4_results_details(school_id)';

  -- KS4 Destinations tables
  execute 'create table if not exists public.ks4_destinations (
    id text primary key,
    data jsonb not null,
    school_id text generated always as ((data->>''schoolId'')::text) stored references schools(id)
  )';
  execute 'create index if not exists ks4_destinations_school_id_idx on ks4_destinations(school_id)';

  execute 'create table if not exists public.ks4_destinations_details (
    id text primary key,
    data jsonb not null,
    school_id text generated always as ((data->>''schoolId'')::text) stored references schools(id)
  )';
  execute 'create index if not exists ks4_destinations_details_school_id_idx on ks4_destinations_details(school_id)';

  -- KS5 Destinations tables
  execute 'create table if not exists public.ks5_destinations (
    id text primary key,
    data jsonb not null,
    school_id text generated always as ((data->>''schoolId'')::text) stored references schools(id)
  )';
  execute 'create index if not exists ks5_destinations_school_id_idx on ks5_destinations(school_id)';

  execute 'create table if not exists public.ks5_destinations_stats (
    id text primary key,
    data jsonb not null,
    school_id text generated always as ((data->>''schoolId'')::text) stored references schools(id)
  )';
  execute 'create index if not exists ks5_destinations_stats_school_id_idx on ks5_destinations_stats(school_id)';

  -- KS5 HE Destinations table
  execute 'create table if not exists public.ks5_he_destinations (
    id text primary key,
    data jsonb not null,
    school_id text generated always as ((data->>''schoolId'')::text) stored references schools(id)
  )';
  execute 'create index if not exists ks5_he_destinations_school_id_idx on ks5_he_destinations(school_id)';

  -- Add GIN indexes for jsonb columns to speed up JSON queries
  execute 'create index if not exists schools_data_gin_idx on schools using gin (data jsonb_path_ops)';
  execute 'create index if not exists ks4_results_data_gin_idx on ks4_results using gin (data jsonb_path_ops)';
  execute 'create index if not exists ks5_destinations_data_gin_idx on ks5_destinations using gin (data jsonb_path_ops)';
end; $$;
-- Create the import_batch function
create or replace function public.import_batch(
  imports jsonb -- Array of {table_name, records} objects
) returns void language plpgsql security definer as $$
declare
  import_item jsonb;
  table_name text;
  records jsonb;
begin
  for import_item in select * from jsonb_array_elements(imports)
  loop
    table_name := import_item->>'table_name';
    records := import_item->'records';
    
    execute format(
      'insert into public.%I (id, data) 
       select r->>''id'', 
              (r - ''id'')::jsonb as data
       from jsonb_array_elements($1) as r
       on conflict (id) do update 
       set data = excluded.data',
      table_name
    ) using records;
  end loop;
end;
$$;


-- Grant execute permission
grant execute on function public.import_batch to postgres, anon, authenticated, service_role;

-- Grant schema usage
grant usage on schema public to postgres, anon, authenticated, service_role;

-- Grant ability to create objects
grant create on schema public to postgres, anon, authenticated, service_role;

-- Grant all privileges on all tables
grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;

-- Grant all privileges on all functions
grant all privileges on all functions in schema public to postgres, anon, authenticated, service_role;

-- Grant all privileges on all sequences
grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;

-- Set default privileges for future objects
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;