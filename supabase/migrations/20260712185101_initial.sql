SET check_function_bodies = false;
CREATE EXTENSION moddatetime WITH SCHEMA extensions;
CREATE EXTENSION pg_cron WITH SCHEMA pg_catalog;
CREATE TYPE public.contract_type AS ENUM ('renting', 'lending');
CREATE TYPE public.gender AS ENUM ('male', 'female', 'other');
CREATE TYPE public.intervention_status AS ENUM ('not_started', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.intervention_type AS ENUM ('new', 'renovation', 'maintenance');
CREATE TYPE public.marital_status AS ENUM ('single', 'married', 'union', 'divorced', 'widowed');
CREATE TYPE public.movement_type AS ENUM ('rent', 'installment_amortization', 'installment_interest', 'intervention', 'other');
CREATE TYPE public.property_class AS ENUM ('urban', 'rustic');
CREATE TYPE public.property_type AS ENUM ('building', 'terrain', 'house', 'garages', 'apartment', 'store', 'garage');
CREATE TYPE public.salary_type AS ENUM ('hourly', 'monthly');
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'cancelled');
CREATE FUNCTION public.handle_audit_columns()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_by := COALESCE(NEW.created_by,(SELECT auth.uid()));
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.updated_by :=(SELECT auth.uid());
  END IF;
  RETURN NEW;
END;
$function$;
CREATE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
GRANT ALL ON FUNCTION public.handle_new_user() TO supabase_auth_admin;
CREATE FUNCTION public.insert_contract()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
  contract_id bigint;
  inserted_contract public.contracts_view % ROWTYPE;
BEGIN
  INSERT INTO public.contracts(type, start_date, end_date, property_id)
    VALUES (NEW.type, NEW.start_date, NEW.end_date, NEW.property_id)
  RETURNING
    id INTO contract_id;
  IF NEW.type = 'renting' THEN
    INSERT INTO public.renting_contracts(id)
      VALUES (contract_id);
    INSERT INTO public.rent_updates(contract_id, update_date, rent)
      VALUES (contract_id, NEW.start_date,(NEW.data ->> 'rent')::numeric);
  ELSIF NEW.type = 'lending' THEN
    INSERT INTO public.lending_contracts(id, sale_value, down_payment, yearly_raise)
      VALUES (contract_id,(NEW.data ->> 'sale_value')::numeric,(NEW.data ->> 'down_payment')::numeric,(NEW.data ->> 'yearly_raise')::numeric);
    INSERT INTO public.installment_updates(contract_id, update_date, installment, interest)
      VALUES (contract_id, NEW.start_date,(NEW.data ->> 'installment')::numeric,(NEW.data ->> 'interest')::numeric);
  END IF;
  SELECT
    * INTO inserted_contract
  FROM
    public.contracts_view
  WHERE
    id = contract_id;
  RETURN inserted_contract;
END;
$function$;
CREATE FUNCTION public.insert_installment_payment()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
  interest_movement_id bigint;
  amortization_movement_id bigint;
BEGIN
  INSERT INTO public.movements(type, value, occurred_at, description)
    VALUES ('installment_interest'::public.movement_type, NEW.interest, NEW.paid_at, NEW.description)
  RETURNING
    id INTO interest_movement_id;
  IF NEW.amortization > 0 THEN
    INSERT INTO public.movements(type, value, occurred_at, description)
      VALUES ('installment_amortization'::public.movement_type, NEW.amortization, NEW.paid_at, NEW.description)
    RETURNING
      id INTO amortization_movement_id;
  END IF;
  INSERT INTO public.installment_payments(contract_id, interest_movement_id, amortization_movement_id, extra_debt)
    VALUES (NEW.contract_id, interest_movement_id, amortization_movement_id, NEW.extra_debt);
  RETURN NEW;
END;
$function$;
CREATE FUNCTION public.insert_intervention_payment()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
  movement_id bigint;
BEGIN
  INSERT INTO public.movements(type, value, occurred_at, description)
    VALUES ('intervention'::public.movement_type, NEW.value, NEW.paid_at, NEW.description)
  RETURNING
    id INTO movement_id;
  INSERT INTO public.intervention_payments(intervention_id, movement_id)
    VALUES (NEW.intervention_id, movement_id);
  RETURN NEW;
END;
$function$;
CREATE FUNCTION public.insert_rent_payment()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
  movement_id bigint;
BEGIN
  INSERT INTO public.movements(type, value, occurred_at, description)
    VALUES ('rent'::public.movement_type, NEW.value, NEW.paid_at, NEW.description)
  RETURNING
    id INTO movement_id;
  INSERT INTO public.rent_payments(contract_id, movement_id)
    VALUES (NEW.contract_id, movement_id);
  RETURN NEW;
END;
$function$;
CREATE FUNCTION public.record_initial_intervention_status()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.intervention_status_history(intervention_id, from_status, to_status, created_by)
    VALUES (NEW.id, NULL, NEW.status, NEW.created_by);
  RETURN NEW;
END;
$function$;
CREATE FUNCTION public.record_initial_ticket_status()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.ticket_status_history(ticket_id, from_status, to_status, created_by)
    VALUES (NEW.id, NULL, NEW.status, NEW.created_by);
  RETURN NEW;
END;
$function$;
CREATE FUNCTION public.remove_installment_payment()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  DELETE FROM public.installment_payments
  WHERE id = OLD.id;
  DELETE FROM public.movements
  WHERE id = OLD.interest_movement_id;
  DELETE FROM public.movements
  WHERE id = OLD.amortization_movement_id;
  RETURN OLD;
END;
$function$;
CREATE FUNCTION public.remove_intervention_payment()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  DELETE FROM public.intervention_payments
  WHERE id = OLD.id;
  DELETE FROM public.movements
  WHERE id = OLD.movement_id;
  RETURN OLD;
END;
$function$;
CREATE FUNCTION public.remove_rent_payment()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  DELETE FROM public.rent_payments
  WHERE id = OLD.id;
  DELETE FROM public.movements
  WHERE id = OLD.movement_id;
  RETURN OLD;
END;
$function$;
CREATE FUNCTION public.update_contract_tenants(p_contract_id bigint, p_tenants bigint[])
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  DELETE FROM public.contracts_tenants
  WHERE contract_id = p_contract_id;
  INSERT INTO public.contracts_tenants(contract_id, tenant_id)
  SELECT
    p_contract_id,
    unnest(p_tenants);
END;
$function$;
GRANT ALL ON FUNCTION public.update_contract_tenants(bigint, bigint[]) TO authenticated;
GRANT ALL ON FUNCTION public.update_contract_tenants(bigint, bigint[]) TO service_role;
CREATE FUNCTION public.update_contract()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
  contract_id bigint;
  updated_contract public.contracts_view % ROWTYPE;
BEGIN
  contract_id := NEW.id;
  UPDATE
    public.contracts
  SET
    start_date = NEW.start_date,
    end_date = NEW.end_date,
    property_id = NEW.property_id
  WHERE
    id = contract_id;
  IF NEW.type = 'renting' THEN
    INSERT INTO public.rent_updates(contract_id, update_date, rent)
      VALUES (contract_id, NEW.start_date,(NEW.data ->> 'rent')::numeric);
  ELSIF NEW.type = 'lending' THEN
    UPDATE
      public.lending_contracts
    SET
      sale_value =(NEW.data ->> 'sale_value')::numeric,
      down_payment =(NEW.data ->> 'down_payment')::numeric,
      yearly_raise =(NEW.data ->> 'yearly_raise')::numeric
    WHERE
      id = contract_id;
    INSERT INTO public.installment_updates(contract_id, update_date, installment, interest)
      VALUES (contract_id, NEW.start_date,(NEW.data ->> 'installment')::numeric,(NEW.data ->> 'interest')::numeric);
  END IF;
  SELECT
    * INTO updated_contract
  FROM
    public.contracts_view
  WHERE
    id = contract_id;
  RETURN updated_contract;
END;
$function$;
CREATE FUNCTION public.validate_property_parent()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
  parent_type public.property_type;
BEGIN
  IF NEW.parent_id IS NULL THEN
    IF NEW.type NOT IN ('building'::public.property_type, 'garages'::public.property_type) AND EXISTS (
      SELECT
        1
      FROM
        public.properties
      WHERE
        parent_id = NEW.id) THEN
      RAISE EXCEPTION 'property type % cannot have fractions', NEW.type;
    END IF;
    RETURN NEW;
  END IF;
  SELECT
    type INTO parent_type
  FROM
    public.properties
  WHERE
    id = NEW.parent_id;
  IF parent_type IS NULL THEN
    RAISE EXCEPTION 'parent property % does not exist', NEW.parent_id;
  END IF;
  IF parent_type NOT IN ('building'::public.property_type, 'garages'::public.property_type) THEN
    RAISE EXCEPTION 'property type % cannot have fractions', parent_type;
  END IF;
  RETURN NEW;
END;
$function$;
CREATE TABLE public.addresses (id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid, country text NOT NULL, region text NOT NULL, address text NOT NULL, postal_code text NOT NULL, city text NOT NULL);
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ADD CONSTRAINT pk_addresses PRIMARY KEY (id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.addresses TO anon;
GRANT ALL ON public.addresses TO authenticated;
GRANT ALL ON public.addresses TO service_role;
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE POLICY authenticated_crud ON public.addresses TO authenticated USING (true) WITH CHECK (true);
CREATE TABLE public.contracts (id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid, type public.contract_type NOT NULL, start_date date NOT NULL, end_date date, property_id bigint NOT NULL, is_active boolean DEFAULT true NOT NULL);
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ADD CONSTRAINT ck_contracts_end_date CHECK (end_date IS NULL OR end_date >= start_date);
ALTER TABLE public.contracts ADD CONSTRAINT pk_contracts PRIMARY KEY (id);
ALTER TABLE public.contracts ADD CONSTRAINT uq_contracts_id_type UNIQUE (id, type);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.contracts TO anon;
GRANT ALL ON public.contracts TO authenticated;
GRANT ALL ON public.contracts TO service_role;
CREATE INDEX idx_contracts_property_id ON public.contracts (property_id);
CREATE UNIQUE INDEX idx_contracts_property_id_active ON public.contracts (property_id) WHERE is_active;
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE POLICY authenticated_crud ON public.contracts TO authenticated USING (true) WITH CHECK (true);
CREATE TABLE public.contracts_tenants (contract_id bigint NOT NULL, tenant_id bigint NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid);
ALTER TABLE public.contracts_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts_tenants ADD CONSTRAINT fk_contracts_tenants_contract_id FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE;
ALTER TABLE public.contracts_tenants ADD CONSTRAINT pk_contracts_tenants PRIMARY KEY (contract_id, tenant_id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.contracts_tenants TO anon;
GRANT ALL ON public.contracts_tenants TO authenticated;
GRANT ALL ON public.contracts_tenants TO service_role;
CREATE INDEX idx_contracts_tenants_tenant_id ON public.contracts_tenants (tenant_id);
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.contracts_tenants FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE POLICY authenticated_crud ON public.contracts_tenants TO authenticated USING (true) WITH CHECK (true);
CREATE TABLE public.due_notes (id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid, contract_id bigint NOT NULL, due_date date NOT NULL, value numeric(15,2) NOT NULL);
ALTER TABLE public.due_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.due_notes ADD CONSTRAINT fk_due_notes_contract_id FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE;
ALTER TABLE public.due_notes ADD CONSTRAINT pk_due_notes PRIMARY KEY (id);
ALTER TABLE public.due_notes ADD CONSTRAINT uq_due_notes_contract_due_date UNIQUE (contract_id, due_date);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.due_notes TO anon;
GRANT ALL ON public.due_notes TO authenticated;
GRANT ALL ON public.due_notes TO service_role;
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.due_notes FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE POLICY authenticated_crud ON public.due_notes TO authenticated USING (true) WITH CHECK (true);
CREATE TABLE public.employees (id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid, name text NOT NULL, gender public.gender NOT NULL, marital_status public.marital_status NOT NULL, nationality text NOT NULL, birth_date date, id_type text NOT NULL, id_expiration_date date, id_number text NOT NULL, tax_id_number text NOT NULL, ss_number text NOT NULL, address_id bigint NOT NULL, email text, mobile text, phone text, "position" text NOT NULL, salary_type public.salary_type NOT NULL, salary numeric(15,2) NOT NULL);
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ADD CONSTRAINT fk_employees_address_id FOREIGN KEY (address_id) REFERENCES public.addresses(id);
ALTER TABLE public.employees ADD CONSTRAINT pk_employees PRIMARY KEY (id);
ALTER TABLE public.employees ADD CONSTRAINT uq_employees_tax_id_number UNIQUE (tax_id_number);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.employees TO anon;
GRANT ALL ON public.employees TO authenticated;
GRANT ALL ON public.employees TO service_role;
CREATE INDEX idx_employees_address_id ON public.employees (address_id);
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE POLICY authenticated_crud ON public.employees TO authenticated USING (true) WITH CHECK (true);
CREATE TABLE public.installment_payments (id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid, contract_id bigint NOT NULL, interest_movement_id bigint NOT NULL, amortization_movement_id bigint, extra_debt numeric(15,2));
ALTER TABLE public.installment_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installment_payments ADD CONSTRAINT pk_installment_payments PRIMARY KEY (id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.installment_payments TO anon;
GRANT ALL ON public.installment_payments TO authenticated;
GRANT ALL ON public.installment_payments TO service_role;
CREATE INDEX idx_installment_payments_amortization_movement_id ON public.installment_payments (amortization_movement_id);
CREATE INDEX idx_installment_payments_contract_id ON public.installment_payments (contract_id);
CREATE INDEX idx_installment_payments_interest_movement_id ON public.installment_payments (interest_movement_id);
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.installment_payments FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE POLICY authenticated_crud ON public.installment_payments TO authenticated USING (true) WITH CHECK (true);
CREATE TABLE public.installment_updates (id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid, update_date date NOT NULL, installment numeric(15,2) NOT NULL, interest numeric(15,2) NOT NULL, contract_id bigint NOT NULL);
ALTER TABLE public.installment_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installment_updates ADD CONSTRAINT pk_installment_updates PRIMARY KEY (id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.installment_updates TO anon;
GRANT ALL ON public.installment_updates TO authenticated;
GRANT ALL ON public.installment_updates TO service_role;
CREATE INDEX idx_installment_updates_contract_created_at ON public.installment_updates (contract_id, created_at DESC);
CREATE INDEX idx_installment_updates_contract_update_date ON public.installment_updates (contract_id, update_date DESC);
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.installment_updates FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE POLICY authenticated_crud ON public.installment_updates TO authenticated USING (true) WITH CHECK (true);
CREATE TABLE public.intervention_payments (id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid, intervention_id bigint NOT NULL, movement_id bigint NOT NULL);
ALTER TABLE public.intervention_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_payments ADD CONSTRAINT pk_intervention_payments PRIMARY KEY (id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.intervention_payments TO anon;
GRANT ALL ON public.intervention_payments TO authenticated;
GRANT ALL ON public.intervention_payments TO service_role;
CREATE INDEX idx_intervention_payments_movement_id ON public.intervention_payments (movement_id);
CREATE INDEX idx_intervention_payments_intervention_id ON public.intervention_payments (intervention_id);
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.intervention_payments FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE POLICY authenticated_crud ON public.intervention_payments TO authenticated USING (true) WITH CHECK (true);
CREATE TABLE public.intervention_status_history (id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, intervention_id bigint NOT NULL, from_status public.intervention_status, to_status public.intervention_status NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid);
ALTER TABLE public.intervention_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_status_history ADD CONSTRAINT pk_intervention_status_history PRIMARY KEY (id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.intervention_status_history TO anon;
GRANT INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.intervention_status_history TO authenticated;
GRANT INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.intervention_status_history TO service_role;
CREATE INDEX idx_intervention_status_history_intervention_id_created_at ON public.intervention_status_history (intervention_id, created_at);
CREATE INDEX idx_intervention_status_history_status ON public.intervention_status_history (intervention_id, to_status, created_at);
CREATE POLICY authenticated_insert ON public.intervention_status_history FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY authenticated_select ON public.intervention_status_history FOR SELECT TO authenticated USING (true);
CREATE TABLE public.intervention_status_transitions (from_status public.intervention_status NOT NULL, to_status public.intervention_status NOT NULL);
ALTER TABLE public.intervention_status_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_status_transitions ADD CONSTRAINT pk_intervention_status_transitions PRIMARY KEY (from_status, to_status);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.intervention_status_transitions TO anon;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.intervention_status_transitions TO authenticated;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.intervention_status_transitions TO service_role;
CREATE POLICY authenticated_select ON public.intervention_status_transitions FOR SELECT TO authenticated USING (true);
CREATE TABLE public.interventions (id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid, type public.intervention_type NOT NULL, status public.intervention_status NOT NULL, start_date date, end_date date, description text NOT NULL, property_id bigint NOT NULL, ticket_id bigint, rank text COLLATE "C" NOT NULL);
CREATE FUNCTION public.transition_intervention(p_intervention_id bigint, p_to_status public.intervention_status, p_rank text)
 RETURNS public.interventions
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
  v_intervention public.interventions;
BEGIN
  IF p_rank IS NULL OR p_rank = '' THEN
    RAISE EXCEPTION 'Rank is required';
  END IF;
  SELECT
    *
  INTO v_intervention
  FROM
    public.interventions
  WHERE
    id = p_intervention_id
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Intervention not found: %', p_intervention_id;
  END IF;
  IF v_intervention.status IS NOT DISTINCT FROM p_to_status AND v_intervention.rank IS NOT DISTINCT FROM p_rank THEN
    RETURN v_intervention;
  END IF;
  IF v_intervention.status IS DISTINCT FROM p_to_status THEN
    IF NOT EXISTS (
      SELECT
        1
      FROM
        public.intervention_status_transitions
      WHERE
        from_status = v_intervention.status
        AND to_status = p_to_status) THEN
      RAISE EXCEPTION 'Invalid intervention status transition from % to %', v_intervention.status, p_to_status;
    END IF;
    INSERT INTO public.intervention_status_history(intervention_id, from_status, to_status, created_by)
      VALUES (p_intervention_id, v_intervention.status, p_to_status,(SELECT auth.uid()));
  END IF;
  UPDATE
    public.interventions
  SET
    status = p_to_status,
    rank = p_rank
  WHERE
    id = p_intervention_id;
  SELECT
    *
  INTO v_intervention
  FROM
    public.interventions
  WHERE
    id = p_intervention_id;
  RETURN v_intervention;
END;
$function$;
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interventions ADD CONSTRAINT pk_interventions PRIMARY KEY (id);
ALTER TABLE public.intervention_payments ADD CONSTRAINT fk_intervention_payments_intervention_id FOREIGN KEY (intervention_id) REFERENCES public.interventions(id) ON DELETE CASCADE;
ALTER TABLE public.intervention_status_history ADD CONSTRAINT fk_intervention_status_history_intervention_id FOREIGN KEY (intervention_id) REFERENCES public.interventions(id) ON DELETE CASCADE;
ALTER TABLE public.interventions ADD CONSTRAINT uq_interventions_status_rank UNIQUE (status, rank);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.interventions TO anon;
GRANT ALL ON public.interventions TO authenticated;
GRANT ALL ON public.interventions TO service_role;
CREATE INDEX idx_interventions_property_id ON public.interventions (property_id);
CREATE INDEX idx_interventions_ticket_id ON public.interventions (ticket_id);
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.interventions FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE TRIGGER record_initial_intervention_status AFTER INSERT ON public.interventions FOR EACH ROW EXECUTE FUNCTION public.record_initial_intervention_status();
CREATE POLICY authenticated_crud ON public.interventions TO authenticated USING (true) WITH CHECK (true);
CREATE TABLE public.lending_contracts (id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid, contract_type public.contract_type GENERATED ALWAYS AS ('lending'::public.contract_type) STORED NOT NULL, sale_value numeric(15,2) NOT NULL, down_payment numeric(15,2) NOT NULL, yearly_raise numeric(15,2) NOT NULL);
ALTER TABLE public.lending_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lending_contracts ADD CONSTRAINT ck_lending_contracts_values CHECK (down_payment >= 0::numeric AND sale_value >= down_payment);
ALTER TABLE public.lending_contracts ADD CONSTRAINT fk_lending_contracts_id_contract_type FOREIGN KEY (id, contract_type) REFERENCES public.contracts(id, type) ON DELETE CASCADE;
ALTER TABLE public.lending_contracts ADD CONSTRAINT pk_lending_contracts PRIMARY KEY (id);
ALTER TABLE public.installment_payments ADD CONSTRAINT fk_installment_payments_contract_id FOREIGN KEY (contract_id) REFERENCES public.lending_contracts(id) ON DELETE CASCADE;
ALTER TABLE public.installment_updates ADD CONSTRAINT fk_installment_updates_contract_id FOREIGN KEY (contract_id) REFERENCES public.lending_contracts(id) ON DELETE CASCADE;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.lending_contracts TO anon;
GRANT ALL ON public.lending_contracts TO authenticated;
GRANT ALL ON public.lending_contracts TO service_role;
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.lending_contracts FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE POLICY authenticated_crud ON public.lending_contracts TO authenticated USING (true) WITH CHECK (true);
CREATE TABLE public.movements (id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid, type public.movement_type NOT NULL, occurred_at timestamp with time zone NOT NULL, value numeric(15,2) NOT NULL, tax_id_number text, description text);
ALTER TABLE public.movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movements ADD CONSTRAINT pk_movements PRIMARY KEY (id);
ALTER TABLE public.installment_payments ADD CONSTRAINT fk_installment_payments_amortization_movement_id FOREIGN KEY (amortization_movement_id) REFERENCES public.movements(id);
ALTER TABLE public.installment_payments ADD CONSTRAINT fk_installment_payments_interest_movement_id FOREIGN KEY (interest_movement_id) REFERENCES public.movements(id);
ALTER TABLE public.intervention_payments ADD CONSTRAINT fk_intervention_payments_movement_id FOREIGN KEY (movement_id) REFERENCES public.movements(id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.movements TO anon;
GRANT ALL ON public.movements TO authenticated;
GRANT ALL ON public.movements TO service_role;
CREATE INDEX idx_movements_tax_id_number ON public.movements (tax_id_number) WHERE tax_id_number IS NOT NULL;
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.movements FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE POLICY authenticated_crud ON public.movements TO authenticated USING (true) WITH CHECK (true);
CREATE TABLE public.profiles (id uuid NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid, email text NOT NULL, display_name text NOT NULL, image text);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ADD CONSTRAINT pk_profiles PRIMARY KEY (id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.profiles TO anon;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE POLICY own_row_insert ON public.profiles FOR INSERT TO authenticated WITH CHECK ((( SELECT auth.uid() AS uid) = id));
CREATE POLICY own_row_select ON public.profiles FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = id));
CREATE POLICY own_row_update ON public.profiles FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = id)) WITH CHECK ((( SELECT auth.uid() AS uid) = id));
CREATE TABLE public.properties (id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid, class public.property_class NOT NULL, type public.property_type NOT NULL, matrix text NOT NULL, conservatory text NOT NULL, area numeric(15,2), tipology text, fraction text, description text, patrimonial_value numeric(15,2), market_value numeric(15,2), address_id bigint NOT NULL, sold boolean DEFAULT false NOT NULL, parent_id bigint);
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ADD CONSTRAINT ck_properties_fraction_required_with_parent CHECK (parent_id IS NULL OR NULLIF(TRIM(BOTH FROM fraction), ''::text) IS NOT NULL);
ALTER TABLE public.properties ADD CONSTRAINT ck_properties_parent_id_not_self CHECK (parent_id IS NULL OR parent_id <> id);
ALTER TABLE public.properties ADD CONSTRAINT fk_properties_address_id FOREIGN KEY (address_id) REFERENCES public.addresses(id);
ALTER TABLE public.properties ADD CONSTRAINT pk_properties PRIMARY KEY (id);
ALTER TABLE public.contracts ADD CONSTRAINT fk_contracts_property_id FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;
ALTER TABLE public.interventions ADD CONSTRAINT fk_interventions_property_id FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;
ALTER TABLE public.properties ADD CONSTRAINT fk_properties_parent_id FOREIGN KEY (parent_id) REFERENCES public.properties(id) ON DELETE CASCADE;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.properties TO anon;
GRANT ALL ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;
CREATE INDEX idx_properties_address_id ON public.properties (address_id);
CREATE INDEX idx_properties_parent_id ON public.properties (parent_id);
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE TRIGGER validate_property_parent BEFORE INSERT OR UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.validate_property_parent();
CREATE POLICY authenticated_crud ON public.properties TO authenticated USING (true) WITH CHECK (true);
CREATE TABLE public.rent_payments (id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid, contract_id bigint NOT NULL, movement_id bigint NOT NULL);
ALTER TABLE public.rent_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rent_payments ADD CONSTRAINT fk_rent_payments_movement_id FOREIGN KEY (movement_id) REFERENCES public.movements(id);
ALTER TABLE public.rent_payments ADD CONSTRAINT pk_rent_payments PRIMARY KEY (id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.rent_payments TO anon;
GRANT ALL ON public.rent_payments TO authenticated;
GRANT ALL ON public.rent_payments TO service_role;
CREATE INDEX idx_rent_payments_movement_id ON public.rent_payments (movement_id);
CREATE INDEX idx_rent_payments_contract_id ON public.rent_payments (contract_id);
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.rent_payments FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE POLICY authenticated_crud ON public.rent_payments TO authenticated USING (true) WITH CHECK (true);
CREATE TABLE public.rent_updates (id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid, update_date date NOT NULL, rent numeric(15,2) NOT NULL, contract_id bigint NOT NULL);
ALTER TABLE public.rent_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rent_updates ADD CONSTRAINT pk_rent_updates PRIMARY KEY (id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.rent_updates TO anon;
GRANT ALL ON public.rent_updates TO authenticated;
GRANT ALL ON public.rent_updates TO service_role;
CREATE INDEX idx_rent_updates_contract_created_at ON public.rent_updates (contract_id, created_at DESC);
CREATE INDEX idx_rent_updates_contract_update_date ON public.rent_updates (contract_id, update_date DESC);
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.rent_updates FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE POLICY authenticated_crud ON public.rent_updates TO authenticated USING (true) WITH CHECK (true);
CREATE TABLE public.renting_contracts (id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid, contract_type public.contract_type GENERATED ALWAYS AS ('renting'::public.contract_type) STORED NOT NULL);
ALTER TABLE public.renting_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.renting_contracts ADD CONSTRAINT fk_renting_contracts_id_contract_type FOREIGN KEY (id, contract_type) REFERENCES public.contracts(id, type) ON DELETE CASCADE;
ALTER TABLE public.renting_contracts ADD CONSTRAINT pk_renting_contracts PRIMARY KEY (id);
ALTER TABLE public.rent_payments ADD CONSTRAINT fk_rent_payments_contract_id FOREIGN KEY (contract_id) REFERENCES public.renting_contracts(id) ON DELETE CASCADE;
ALTER TABLE public.rent_updates ADD CONSTRAINT fk_rent_updates_contract_id FOREIGN KEY (contract_id) REFERENCES public.renting_contracts(id) ON DELETE CASCADE;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.renting_contracts TO anon;
GRANT ALL ON public.renting_contracts TO authenticated;
GRANT ALL ON public.renting_contracts TO service_role;
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.renting_contracts FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE POLICY authenticated_crud ON public.renting_contracts TO authenticated USING (true) WITH CHECK (true);
CREATE TABLE public.tenants (id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid, name text NOT NULL, gender public.gender NOT NULL, marital_status public.marital_status NOT NULL, nationality text NOT NULL, birth_date date, id_type text NOT NULL, id_expiration_date date, id_number text NOT NULL, tax_id_number text NOT NULL, address_id bigint NOT NULL, email text, mobile text, phone text);
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ADD CONSTRAINT fk_tenants_address_id FOREIGN KEY (address_id) REFERENCES public.addresses(id);
ALTER TABLE public.tenants ADD CONSTRAINT pk_tenants PRIMARY KEY (id);
ALTER TABLE public.contracts_tenants ADD CONSTRAINT fk_contracts_tenants_tenant_id FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.tenants ADD CONSTRAINT uq_tenants_tax_id_number UNIQUE (tax_id_number);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.tenants TO anon;
GRANT ALL ON public.tenants TO authenticated;
GRANT ALL ON public.tenants TO service_role;
CREATE INDEX idx_tenants_address_id ON public.tenants (address_id);
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE POLICY authenticated_crud ON public.tenants TO authenticated USING (true) WITH CHECK (true);
CREATE TABLE public.ticket_status_history (id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, ticket_id bigint NOT NULL, from_status public.ticket_status, to_status public.ticket_status NOT NULL);
ALTER TABLE public.ticket_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_status_history ADD CONSTRAINT pk_ticket_status_history PRIMARY KEY (id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.ticket_status_history TO anon;
GRANT INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.ticket_status_history TO authenticated;
GRANT INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.ticket_status_history TO service_role;
CREATE INDEX idx_ticket_status_history_ticket_id_to_status_created_at ON public.ticket_status_history (ticket_id, to_status, created_at);
CREATE INDEX idx_ticket_status_history_ticket_id_created_at ON public.ticket_status_history (ticket_id, created_at);
CREATE POLICY authenticated_insert ON public.ticket_status_history FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY authenticated_select ON public.ticket_status_history FOR SELECT TO authenticated USING (true);
CREATE TABLE public.ticket_status_transitions (from_status public.ticket_status NOT NULL, to_status public.ticket_status NOT NULL);
ALTER TABLE public.ticket_status_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_status_transitions ADD CONSTRAINT pk_ticket_status_transitions PRIMARY KEY (from_status, to_status);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.ticket_status_transitions TO anon;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.ticket_status_transitions TO authenticated;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.ticket_status_transitions TO service_role;
CREATE POLICY authenticated_select ON public.ticket_status_transitions FOR SELECT TO authenticated USING (true);
CREATE TABLE public.tickets (id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid, priority public.ticket_priority NOT NULL, status public.ticket_status NOT NULL, title text NOT NULL, description text NOT NULL, property_id bigint NOT NULL, rank text COLLATE "C" NOT NULL);
CREATE FUNCTION public.transition_ticket(p_ticket_id bigint, p_to_status public.ticket_status, p_rank text)
 RETURNS public.tickets
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
  v_ticket public.tickets;
BEGIN
  IF p_rank IS NULL OR p_rank = '' THEN
    RAISE EXCEPTION 'Rank is required';
  END IF;
  SELECT
    *
  INTO v_ticket
  FROM
    public.tickets
  WHERE
    id = p_ticket_id
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Ticket not found: %', p_ticket_id;
  END IF;
  IF v_ticket.status IS NOT DISTINCT FROM p_to_status AND v_ticket.rank IS NOT DISTINCT FROM p_rank THEN
    RETURN v_ticket;
  END IF;
  IF v_ticket.status IS DISTINCT FROM p_to_status THEN
    IF NOT EXISTS (
      SELECT
        1
      FROM
        public.ticket_status_transitions
      WHERE
        from_status = v_ticket.status
        AND to_status = p_to_status) THEN
      RAISE EXCEPTION 'Invalid ticket status transition from % to %', v_ticket.status, p_to_status;
    END IF;
    INSERT INTO public.ticket_status_history(ticket_id, from_status, to_status, created_by)
      VALUES (p_ticket_id, v_ticket.status, p_to_status,(SELECT auth.uid()));
  END IF;
  UPDATE
    public.tickets
  SET
    status = p_to_status,
    rank = p_rank
  WHERE
    id = p_ticket_id;
  SELECT
    *
  INTO v_ticket
  FROM
    public.tickets
  WHERE
    id = p_ticket_id;
  RETURN v_ticket;
END;
$function$;
GRANT ALL ON FUNCTION public.transition_ticket(bigint, public.ticket_status, text) TO authenticated;
GRANT ALL ON FUNCTION public.transition_ticket(bigint, public.ticket_status, text) TO service_role;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ADD CONSTRAINT fk_tickets_property_id FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;
ALTER TABLE public.tickets ADD CONSTRAINT pk_tickets PRIMARY KEY (id);
ALTER TABLE public.interventions ADD CONSTRAINT fk_interventions_ticket_id FOREIGN KEY (ticket_id) REFERENCES public.tickets(id);
ALTER TABLE public.ticket_status_history ADD CONSTRAINT fk_ticket_status_history_ticket_id FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE;
ALTER TABLE public.tickets ADD CONSTRAINT uq_tickets_status_rank UNIQUE (status, rank);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.tickets TO anon;
GRANT ALL ON public.tickets TO authenticated;
GRANT ALL ON public.tickets TO service_role;
CREATE INDEX idx_tickets_property_id ON public.tickets (property_id);
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE TRIGGER record_initial_ticket_status AFTER INSERT ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.record_initial_ticket_status();
CREATE POLICY authenticated_crud ON public.tickets TO authenticated USING (true) WITH CHECK (true);
CREATE TABLE public.users (id uuid NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid, email text NOT NULL);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ADD CONSTRAINT fk_users_id FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.users ADD CONSTRAINT pk_users PRIMARY KEY (id);
ALTER TABLE public.addresses ADD CONSTRAINT addresses_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.addresses ADD CONSTRAINT addresses_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
ALTER TABLE public.contracts ADD CONSTRAINT contracts_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.contracts ADD CONSTRAINT contracts_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
ALTER TABLE public.contracts_tenants ADD CONSTRAINT contracts_tenants_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.contracts_tenants ADD CONSTRAINT contracts_tenants_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
ALTER TABLE public.due_notes ADD CONSTRAINT due_notes_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.due_notes ADD CONSTRAINT due_notes_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
ALTER TABLE public.employees ADD CONSTRAINT employees_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.employees ADD CONSTRAINT employees_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
ALTER TABLE public.installment_payments ADD CONSTRAINT installment_payments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.installment_payments ADD CONSTRAINT installment_payments_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
ALTER TABLE public.installment_updates ADD CONSTRAINT installment_updates_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.installment_updates ADD CONSTRAINT installment_updates_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
ALTER TABLE public.intervention_payments ADD CONSTRAINT intervention_payments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.intervention_payments ADD CONSTRAINT intervention_payments_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
ALTER TABLE public.intervention_status_history ADD CONSTRAINT intervention_status_history_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.interventions ADD CONSTRAINT interventions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.interventions ADD CONSTRAINT interventions_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
ALTER TABLE public.lending_contracts ADD CONSTRAINT lending_contracts_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.lending_contracts ADD CONSTRAINT lending_contracts_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
ALTER TABLE public.movements ADD CONSTRAINT movements_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.movements ADD CONSTRAINT movements_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
ALTER TABLE public.profiles ADD CONSTRAINT fk_profiles_created_by FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.profiles ADD CONSTRAINT fk_profiles_id FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE public.profiles ADD CONSTRAINT fk_profiles_updated_by FOREIGN KEY (updated_by) REFERENCES public.users(id);
ALTER TABLE public.properties ADD CONSTRAINT properties_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.properties ADD CONSTRAINT properties_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
ALTER TABLE public.rent_payments ADD CONSTRAINT rent_payments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.rent_payments ADD CONSTRAINT rent_payments_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
ALTER TABLE public.rent_updates ADD CONSTRAINT rent_updates_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.rent_updates ADD CONSTRAINT rent_updates_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
ALTER TABLE public.renting_contracts ADD CONSTRAINT renting_contracts_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.renting_contracts ADD CONSTRAINT renting_contracts_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
ALTER TABLE public.tenants ADD CONSTRAINT tenants_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.tenants ADD CONSTRAINT tenants_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
ALTER TABLE public.ticket_status_history ADD CONSTRAINT ticket_status_history_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.tickets ADD CONSTRAINT tickets_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.tickets ADD CONSTRAINT tickets_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
ALTER TABLE public.users ADD CONSTRAINT fk_users_created_by FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.users ADD CONSTRAINT fk_users_updated_by FOREIGN KEY (updated_by) REFERENCES public.users(id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.users TO anon;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE POLICY own_row_select ON public.users FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = id));
CREATE POLICY own_row_update ON public.users FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = id)) WITH CHECK ((( SELECT auth.uid() AS uid) = id));
CREATE TABLE public.vendors (id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, created_by uuid, updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, updated_by uuid, name text NOT NULL, tax_id_number text NOT NULL, description text, tags text[] DEFAULT '{}'::text[] NOT NULL, address_id bigint NOT NULL, email text, mobile text, phone text, website text);
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ADD CONSTRAINT fk_vendors_address_id FOREIGN KEY (address_id) REFERENCES public.addresses(id);
ALTER TABLE public.vendors ADD CONSTRAINT pk_vendors PRIMARY KEY (id);
ALTER TABLE public.vendors ADD CONSTRAINT uq_vendors_tax_id_number UNIQUE (tax_id_number);
ALTER TABLE public.vendors ADD CONSTRAINT vendors_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE public.vendors ADD CONSTRAINT vendors_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.vendors TO anon;
GRANT ALL ON public.vendors TO authenticated;
GRANT ALL ON public.vendors TO service_role;
CREATE INDEX idx_vendors_address_id ON public.vendors (address_id);
CREATE TRIGGER handle_audit_columns BEFORE INSERT OR UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.handle_audit_columns();
CREATE POLICY authenticated_crud ON public.vendors TO authenticated USING (true) WITH CHECK (true);
CREATE VIEW public.installment_payments_view WITH (security_invoker=true) AS SELECT ip.contract_id,
    ip.id,
    i.occurred_at AS paid_at,
    i.value AS interest,
    COALESCE(a.value, (0)::numeric) AS amortization,
    ip.extra_debt,
    i.description
   FROM ((public.installment_payments ip
     LEFT JOIN public.movements a ON ((ip.amortization_movement_id = a.id)))
     LEFT JOIN public.movements i ON ((ip.interest_movement_id = i.id)));
CREATE TRIGGER insert_installment_payment INSTEAD OF INSERT ON public.installment_payments_view FOR EACH ROW EXECUTE FUNCTION public.insert_installment_payment();
CREATE TRIGGER remove_installment_payment INSTEAD OF DELETE ON public.installment_payments_view FOR EACH ROW EXECUTE FUNCTION public.remove_installment_payment();
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.installment_payments_view TO anon;
GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.installment_payments_view TO authenticated;
GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.installment_payments_view TO service_role;
CREATE VIEW public.intervention_payments_view WITH (security_invoker=true) AS SELECT ip.intervention_id,
    ip.id,
    m.value,
    m.occurred_at AS paid_at,
    m.description
   FROM (public.intervention_payments ip
     JOIN public.movements m ON ((ip.movement_id = m.id)));
CREATE TRIGGER insert_intervention_payment INSTEAD OF INSERT ON public.intervention_payments_view FOR EACH ROW EXECUTE FUNCTION public.insert_intervention_payment();
CREATE TRIGGER remove_intervention_payment INSTEAD OF DELETE ON public.intervention_payments_view FOR EACH ROW EXECUTE FUNCTION public.remove_intervention_payment();
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.intervention_payments_view TO anon;
GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.intervention_payments_view TO authenticated;
GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.intervention_payments_view TO service_role;
CREATE VIEW public.lending_contracts_debts_view WITH (security_invoker=true) AS SELECT lc.id,
    ((lc.sale_value - lc.down_payment) - COALESCE(sum(ip.amortization), (0)::numeric)) AS debt,
    COALESCE(( SELECT ip_1.extra_debt
           FROM public.installment_payments_view ip_1
          WHERE (ip_1.contract_id = lc.id)
          ORDER BY ip_1.paid_at DESC
         LIMIT 1), (0)::numeric) AS extra_debt,
    max(ip.paid_at) AS last_paid_at
   FROM (public.lending_contracts lc
     LEFT JOIN public.installment_payments_view ip ON ((lc.id = ip.contract_id)))
  GROUP BY lc.id;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.lending_contracts_debts_view TO anon;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.lending_contracts_debts_view TO authenticated;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.lending_contracts_debts_view TO service_role;
CREATE VIEW public.lending_contracts_view WITH (security_invoker=true) AS SELECT lc.id,
    lc.created_at,
    lc.created_by,
    lc.updated_at,
    lc.updated_by,
    lc.contract_type,
    lc.sale_value,
    lc.down_payment,
    lc.yearly_raise,
    lcd.debt,
    lcd.extra_debt,
    lcd.last_paid_at,
    COALESCE(active_updates.installment, (0)::numeric) AS installment,
    COALESCE(active_updates.interest, (0)::numeric) AS interest,
        CASE
            WHEN (last_updates.update_date IS NULL) THEN NULL::json
            ELSE json_build_object('update_date', last_updates.update_date, 'installment', COALESCE(last_updates.installment, (0)::numeric), 'interest', COALESCE(last_updates.interest, (0)::numeric))
        END AS next_update
   FROM (((public.lending_contracts lc
     LEFT JOIN public.lending_contracts_debts_view lcd ON ((lc.id = lcd.id)))
     LEFT JOIN ( SELECT DISTINCT ON (iu.contract_id) iu.contract_id,
            iu.installment,
            iu.interest,
            iu.update_date
           FROM public.installment_updates iu
          ORDER BY iu.contract_id, iu.created_at DESC) last_updates ON ((lc.id = last_updates.contract_id)))
     LEFT JOIN ( SELECT DISTINCT ON (iu.contract_id) iu.contract_id,
            iu.installment,
            iu.interest,
            iu.update_date
           FROM public.installment_updates iu
          WHERE (iu.update_date <= CURRENT_DATE)
          ORDER BY iu.contract_id, iu.update_date DESC) active_updates ON ((lc.id = active_updates.contract_id)));
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.lending_contracts_view TO anon;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.lending_contracts_view TO authenticated;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.lending_contracts_view TO service_role;
CREATE VIEW public.rent_payments_view WITH (security_invoker=true) AS SELECT rp.contract_id,
    rp.id,
    m.value,
    m.occurred_at AS paid_at,
    m.description
   FROM (public.rent_payments rp
     JOIN public.movements m ON ((rp.movement_id = m.id)));
CREATE TRIGGER insert_rent_payment INSTEAD OF INSERT ON public.rent_payments_view FOR EACH ROW EXECUTE FUNCTION public.insert_rent_payment();
CREATE TRIGGER remove_rent_payment INSTEAD OF DELETE ON public.rent_payments_view FOR EACH ROW EXECUTE FUNCTION public.remove_rent_payment();
CREATE VIEW public.contracts_accounts_view WITH (security_invoker=true) AS SELECT dn.contract_id,
    dn.id,
    'due_note'::text AS type,
    ((dn.due_date)::timestamp without time zone AT TIME ZONE 'UTC'::text) AS date,
    (('-1'::integer)::numeric * dn.value) AS value
   FROM public.due_notes dn
UNION
 SELECT rp.contract_id,
    rp.id,
    'payment'::text AS type,
    rp.paid_at AS date,
    rp.value
   FROM public.rent_payments_view rp
UNION
 SELECT ip.contract_id,
    ip.id,
    'payment'::text AS type,
    ip.paid_at AS date,
    (ip.interest + ip.amortization) AS value
   FROM public.installment_payments_view ip;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.contracts_accounts_view TO anon;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.contracts_accounts_view TO authenticated;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.contracts_accounts_view TO service_role;
CREATE VIEW public.contracts_balances_view WITH (security_invoker=true) AS SELECT c.id AS contract_id,
    COALESCE(sum(ca.value), (0)::numeric) AS balance
   FROM (public.contracts c
     LEFT JOIN public.contracts_accounts_view ca ON ((c.id = ca.contract_id)))
  GROUP BY c.id;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.contracts_balances_view TO anon;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.contracts_balances_view TO authenticated;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.contracts_balances_view TO service_role;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.rent_payments_view TO anon;
GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.rent_payments_view TO authenticated;
GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.rent_payments_view TO service_role;
CREATE VIEW public.renting_contracts_view WITH (security_invoker=true) AS SELECT rc.id,
    rc.created_at,
    rc.created_by,
    rc.updated_at,
    rc.updated_by,
    rc.contract_type,
    COALESCE(active_updates.rent, (0)::numeric) AS rent,
        CASE
            WHEN (next_updates.update_date IS NULL) THEN NULL::json
            ELSE json_build_object('update_date', next_updates.update_date, 'rent', next_updates.rent)
        END AS next_update
   FROM ((public.renting_contracts rc
     LEFT JOIN ( SELECT DISTINCT ON (ru.contract_id) ru.contract_id,
            ru.rent,
            ru.update_date
           FROM public.rent_updates ru
          WHERE (ru.update_date <= CURRENT_DATE)
          ORDER BY ru.contract_id, ru.update_date DESC) active_updates ON ((rc.id = active_updates.contract_id)))
     LEFT JOIN ( SELECT DISTINCT ON (ru.contract_id) ru.contract_id,
            ru.rent,
            ru.update_date
           FROM public.rent_updates ru
          WHERE (ru.update_date > CURRENT_DATE)
          ORDER BY ru.contract_id, ru.created_at DESC) next_updates ON ((rc.id = next_updates.contract_id)));
CREATE VIEW public.contracts_view WITH (security_invoker=true) AS SELECT c.id,
    c.created_at,
    c.created_by,
    c.updated_at,
    c.updated_by,
    c.type,
    c.start_date,
    c.end_date,
    c.property_id,
    c.is_active,
    cb.balance,
        CASE
            WHEN (c.type = 'lending'::public.contract_type) THEN ( SELECT to_json(lcv.*) AS to_json
               FROM public.lending_contracts_view lcv
              WHERE (lcv.id = c.id))
            WHEN (c.type = 'renting'::public.contract_type) THEN ( SELECT to_json(rcv.*) AS to_json
               FROM public.renting_contracts_view rcv
              WHERE (rcv.id = c.id))
            ELSE NULL::json
        END AS data
   FROM (public.contracts c
     LEFT JOIN public.contracts_balances_view cb ON ((c.id = cb.contract_id)));
CREATE TRIGGER insert_contract INSTEAD OF INSERT ON public.contracts_view FOR EACH ROW EXECUTE FUNCTION public.insert_contract();
CREATE TRIGGER update_contract INSTEAD OF UPDATE ON public.contracts_view FOR EACH ROW EXECUTE FUNCTION public.update_contract();
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.contracts_view TO anon;
GRANT ALL ON public.contracts_view TO authenticated;
GRANT ALL ON public.contracts_view TO service_role;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.renting_contracts_view TO anon;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.renting_contracts_view TO authenticated;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.renting_contracts_view TO service_role;
