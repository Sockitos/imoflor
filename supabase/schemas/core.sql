-- =============================================================================
-- Core
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------

CREATE TYPE public.gender AS ENUM(
  'male',
  'female',
  'other'
);

CREATE TYPE public.marital_status AS ENUM(
  'single',
  'married',
  'union',
  'divorced',
  'widowed'
);

-- -----------------------------------------------------------------------------
-- Extensions
-- -----------------------------------------------------------------------------

CREATE EXTENSION moddatetime WITH SCHEMA extensions;

CREATE EXTENSION pg_cron WITH SCHEMA extensions;

GRANT USAGE ON SCHEMA cron TO postgres;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- -----------------------------------------------------------------------------
-- Audit helpers
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.system_user_id()
  RETURNS uuid
  LANGUAGE sql
  IMMUTABLE
  PARALLEL SAFE
  SET search_path = ''
  AS $$
  SELECT
    '00000000-0000-0000-0000-000000000001'::uuid;
$$;

CREATE OR REPLACE FUNCTION public.handle_created_by()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY INVOKER
  SET search_path = ''
  AS $$
BEGIN
  NEW.created_by := COALESCE(NEW.created_by, auth.uid(), public.system_user_id());
  NEW.updated_by := COALESCE(NEW.updated_by, NEW.created_by);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_updated_by()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY INVOKER
  SET search_path = ''
  AS $$
BEGIN
  NEW.updated_by := COALESCE(auth.uid(), public.system_user_id());
  RETURN NEW;
END;
$$;

