-- =============================================================================
-- Profiles
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

CREATE TABLE public.profiles(
  id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  created_by uuid NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_by uuid NOT NULL,
  email text NOT NULL,
  display_name text NOT NULL,
  image text,
  CONSTRAINT pk_profiles PRIMARY KEY (id),
  CONSTRAINT fk_profiles_id FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_profiles_created_by FOREIGN KEY (created_by) REFERENCES public.users(id),
  CONSTRAINT fk_profiles_updated_by FOREIGN KEY (updated_by) REFERENCES public.users(id)
);

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime(updated_at);

CREATE TRIGGER handle_created_by
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE handle_created_by();

CREATE TRIGGER handle_updated_by
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_by();

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------

CREATE INDEX idx_profiles_created_by ON public.profiles(created_by);

CREATE INDEX idx_profiles_updated_by ON public.profiles(updated_by);

-- -----------------------------------------------------------------------------
-- Grants
-- -----------------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO service_role;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_row_select" ON public.profiles
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "own_row_insert" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "own_row_update" ON public.profiles
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

