-- =============================================================================
-- Addresses
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

CREATE TABLE public.addresses(
  id bigint GENERATED ALWAYS AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  created_by uuid NOT NULL REFERENCES public.users(id),
  updated_at timestamp with time zone NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_by uuid NOT NULL REFERENCES public.users(id),
  country text NOT NULL,
  region text NOT NULL,
  address text NOT NULL,
  postal_code text NOT NULL,
  city text NOT NULL,
  CONSTRAINT pk_addresses PRIMARY KEY (id)
);

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime(updated_at);

CREATE TRIGGER handle_created_by
  BEFORE INSERT ON public.addresses
  FOR EACH ROW
  EXECUTE PROCEDURE handle_created_by();

CREATE TRIGGER handle_updated_by
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_by();

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------

CREATE INDEX idx_addresses_created_by ON public.addresses(created_by);

CREATE INDEX idx_addresses_updated_by ON public.addresses(updated_by);

-- -----------------------------------------------------------------------------
-- Grants
-- -----------------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO authenticated, service_role;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_crud" ON public.addresses
  FOR ALL TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

