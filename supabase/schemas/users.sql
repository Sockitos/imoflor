-- =============================================================================
-- Users
-- Application user records mirrored from auth.users. Used for audit FKs.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

CREATE TABLE public.users(
  id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  created_by uuid,
  updated_at timestamp with time zone NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_by uuid,
  email text NOT NULL,
  CONSTRAINT pk_users PRIMARY KEY (id),
  CONSTRAINT fk_users_id FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_users_created_by FOREIGN KEY (created_by) REFERENCES public.users(id),
  CONSTRAINT fk_users_updated_by FOREIGN KEY (updated_by) REFERENCES public.users(id)
);

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime(updated_at);

CREATE TRIGGER handle_audit_columns
  BEFORE INSERT OR UPDATE ON public.users
  FOR EACH ROW
  EXECUTE PROCEDURE handle_audit_columns();

-- -----------------------------------------------------------------------------
-- Functions
-- -----------------------------------------------------------------------------

CREATE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
BEGIN
  INSERT INTO public.users(id, email)
    VALUES (NEW.id, NEW.email);
  INSERT INTO public.profiles(id, email, display_name)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(
        NEW.raw_app_meta_data ->> 'display_name',
        SPLIT_PART(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;

-- -----------------------------------------------------------------------------
-- Triggers
-- -----------------------------------------------------------------------------

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Grants
-- -----------------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated, service_role;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_row_select" ON public.users
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "own_row_update" ON public.users
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

