-- =============================================================================
-- Core
-- Shared enums, extensions, and audit helpers.
--
-- Feature files follow this layout:
--   Enums → Tables → Triggers → Indexes → Functions → Views → Grants → Row Level Security
--
-- Audit columns (every table):
--   created_at, created_by, updated_at, updated_by
--   created_by / updated_by → public.users(id)
-- Access model: shared — authenticated users have full CRUD on all rows.
--
-- Formatting: SQL keywords and built-in functions are UPPERCASE; identifiers
-- and types remain lowercase (e.g. timestamp with time zone, public.users).
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

CREATE OR REPLACE FUNCTION public.handle_audit_columns()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY INVOKER
  SET search_path = ''
  AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_by := COALESCE(NEW.created_by,(SELECT auth.uid()));
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.updated_by :=(SELECT auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

