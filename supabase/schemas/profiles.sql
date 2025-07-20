-- =============================================
-- SCHEMA: Profiles
-- DESCRIPTION: ...
-- =============================================
-- Tables
CREATE TABLE public.profiles(
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  inserted_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  email text NOT NULL,
  display_name text NOT NULL,
  image text
);

-- Functions
CREATE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $$
BEGIN
  INSERT INTO public.profiles(id, email, display_name)
    VALUES(NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'display_name');
  RETURN new;
END;
$$;

-- Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- Buckets
INSERT INTO storage.buckets(id, name, public, allowed_mime_types)
  VALUES ('profiles', 'profiles', TRUE, '{"image/*"}');

