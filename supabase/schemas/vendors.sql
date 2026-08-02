-- =============================================================================
-- Vendors
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

CREATE TABLE public.vendors(
  id bigint GENERATED ALWAYS AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  created_by uuid NOT NULL REFERENCES public.users(id),
  updated_at timestamp with time zone NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_by uuid NOT NULL REFERENCES public.users(id),
  name text NOT NULL,
  tax_id_number text NOT NULL,
  description text,
  tags text[] NOT NULL DEFAULT '{}'::text[],
  address_id bigint NOT NULL,
  email text,
  mobile text,
  phone text,
  website text,
  CONSTRAINT pk_vendors PRIMARY KEY (id),
  CONSTRAINT fk_vendors_address_id FOREIGN KEY (address_id) REFERENCES public.addresses(id) ON DELETE RESTRICT,
  CONSTRAINT uq_vendors_tax_id_number UNIQUE (tax_id_number)
);

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime(updated_at);

CREATE TRIGGER handle_created_by
  BEFORE INSERT ON public.vendors
  FOR EACH ROW
  EXECUTE PROCEDURE handle_created_by();

CREATE TRIGGER handle_updated_by
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_by();

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------

CREATE INDEX idx_vendors_created_by ON public.vendors(created_by);

CREATE INDEX idx_vendors_updated_by ON public.vendors(updated_by);

CREATE INDEX idx_vendors_address_id ON public.vendors(address_id);

CREATE INDEX idx_vendors_tags ON public.vendors USING gin(tags);

-- -----------------------------------------------------------------------------
-- Grants
-- -----------------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendors TO authenticated, service_role;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_crud" ON public.vendors
  FOR ALL TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

