-- =============================================
-- SCHEMA: Properties
-- DESCRIPTION: ...
-- =============================================
-- Enums
CREATE TYPE public.property_class AS enum(
  'urban',
  'rustic'
);

CREATE TYPE public.property_type AS enum(
  'building',
  'terrain',
  'house',
  'garages'
);

-- Tables
CREATE TABLE public.properties(
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  inserted_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  class property_class NOT NULL,
  type property_type NOT NULL,
  is_multi_unit boolean NOT NULL,
  matrix text NOT NULL,
  conservatory text NOT NULL,
  area double precision,
  tipology text,
  description text,
  patrimonial_value double precision,
  market_value double precision,
  country text NOT NULL,
  region text NOT NULL,
  address text NOT NULL,
  postal_code text NOT NULL,
  city text NOT NULL,
  sold boolean NOT NULL DEFAULT FALSE
);

