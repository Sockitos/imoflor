-- =============================================================================
-- Movements
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------

CREATE TYPE public.movement_type AS ENUM(
  'rent',
  'installment_amortization',
  'installment_interest',
  'intervention',
  'other'
);

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

CREATE TABLE public.movements(
  id bigint GENERATED ALWAYS AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  created_by uuid NOT NULL REFERENCES public.users(id),
  updated_at timestamp with time zone NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_by uuid NOT NULL REFERENCES public.users(id),
  type public.movement_type NOT NULL,
  occurred_at timestamp with time zone NOT NULL,
  value numeric(15, 2) NOT NULL,
  tax_id_number text,
  description text,
  CONSTRAINT pk_movements PRIMARY KEY (id),
  CONSTRAINT ck_movements_value_non_negative CHECK (value >= 0)
);

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.movements
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime(updated_at);

CREATE TRIGGER handle_created_by
  BEFORE INSERT ON public.movements
  FOR EACH ROW
  EXECUTE PROCEDURE handle_created_by();

CREATE TRIGGER handle_updated_by
  BEFORE UPDATE ON public.movements
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_by();

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------

CREATE INDEX idx_movements_created_by ON public.movements(created_by);

CREATE INDEX idx_movements_updated_by ON public.movements(updated_by);

CREATE INDEX idx_movements_tax_id_number ON public.movements(tax_id_number)
  WHERE tax_id_number IS NOT NULL;

-- -----------------------------------------------------------------------------
-- Grants
-- -----------------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON public.movements TO authenticated, service_role;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

ALTER TABLE public.movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_crud" ON public.movements
  FOR ALL TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

