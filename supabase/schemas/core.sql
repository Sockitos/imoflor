-- =============================================
-- SCHEMA: Core
-- DESCRIPTION: ...
-- =============================================
-- Enums
CREATE TYPE public.gender AS enum(
  'male',
  'female',
  'other'
);

CREATE TYPE public.marital_status AS enum(
  'single',
  'married',
  'union',
  'divorced',
  'widowed'
);

-- Extensions
CREATE EXTENSION moddatetime WITH SCHEMA extensions;

CREATE EXTENSION pg_cron WITH SCHEMA extensions;

GRANT usage ON SCHEMA cron TO postgres;

GRANT ALL privileges ON ALL tables IN SCHEMA cron TO postgres;

