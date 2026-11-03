-- =============================================================================
-- Interventions
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------

CREATE TYPE public.intervention_type AS ENUM(
  'new',
  'renovation',
  'maintenance'
);

CREATE TYPE public.intervention_status AS ENUM(
  'not_started',
  'in_progress',
  'completed',
  'cancelled'
);

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

CREATE TABLE public.interventions(
  id bigint GENERATED ALWAYS AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  created_by uuid NOT NULL REFERENCES public.users(id),
  updated_at timestamp with time zone NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_by uuid NOT NULL REFERENCES public.users(id),
  type public.intervention_type NOT NULL,
  status public.intervention_status NOT NULL,
  start_date date,
  end_date date,
  description text NOT NULL,
  property_id bigint NOT NULL,
  ticket_id bigint,
  rank text COLLATE "C" NOT NULL,
  CONSTRAINT pk_interventions PRIMARY KEY (id),
  CONSTRAINT fk_interventions_property_id FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE RESTRICT,
  CONSTRAINT fk_interventions_ticket_id FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE SET NULL,
  CONSTRAINT uq_interventions_status_rank UNIQUE (status, rank)
);

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.interventions
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime(updated_at);

CREATE TRIGGER handle_created_by
  BEFORE INSERT ON public.interventions
  FOR EACH ROW
  EXECUTE PROCEDURE handle_created_by();

CREATE TRIGGER handle_updated_by
  BEFORE UPDATE ON public.interventions
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_by();

CREATE TABLE public.intervention_status_transitions(
  from_status public.intervention_status NOT NULL,
  to_status public.intervention_status NOT NULL,
  CONSTRAINT pk_intervention_status_transitions PRIMARY KEY (from_status, to_status)
);

INSERT INTO public.intervention_status_transitions(from_status, to_status)
VALUES
  ('not_started', 'in_progress'),
  ('not_started', 'cancelled'),
  ('in_progress', 'not_started'),
  ('in_progress', 'completed'),
  ('in_progress', 'cancelled'),
  ('cancelled', 'not_started');

CREATE TABLE public.intervention_status_history(
  id bigint GENERATED ALWAYS AS IDENTITY,
  intervention_id bigint NOT NULL,
  from_status public.intervention_status,
  to_status public.intervention_status NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  created_by uuid NOT NULL REFERENCES public.users(id),
  CONSTRAINT pk_intervention_status_history PRIMARY KEY (id),
  CONSTRAINT fk_intervention_status_history_intervention_id FOREIGN KEY (intervention_id) REFERENCES public.interventions(id) ON DELETE CASCADE
);

CREATE TABLE public.intervention_expenses(
  id bigint GENERATED ALWAYS AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  created_by uuid NOT NULL REFERENCES public.users(id),
  updated_at timestamp with time zone NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_by uuid NOT NULL REFERENCES public.users(id),
  intervention_id bigint NOT NULL,
  movement_id bigint NOT NULL,
  CONSTRAINT pk_intervention_expenses PRIMARY KEY (id),
  CONSTRAINT fk_intervention_expenses_intervention_id FOREIGN KEY (intervention_id) REFERENCES public.interventions(id) ON DELETE CASCADE,
  CONSTRAINT fk_intervention_expenses_movement_id FOREIGN KEY (movement_id) REFERENCES public.movements(id) ON DELETE RESTRICT
);

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.intervention_expenses
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime(updated_at);

CREATE TRIGGER handle_created_by
  BEFORE INSERT ON public.intervention_expenses
  FOR EACH ROW
  EXECUTE PROCEDURE handle_created_by();

CREATE TRIGGER handle_updated_by
  BEFORE UPDATE ON public.intervention_expenses
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_by();

-- -----------------------------------------------------------------------------
-- Views
-- -----------------------------------------------------------------------------

CREATE VIEW public.intervention_expenses_view
  WITH (security_invoker = TRUE) AS
SELECT
  ie.intervention_id,
  ie.id,
  ie.created_at,
  ie.created_by,
  ie.updated_at,
  ie.updated_by,
  m.value,
  m.occurred_at,
  m.description
FROM
  public.intervention_expenses ie
  JOIN public.movements m ON ie.movement_id = m.id;

-- -----------------------------------------------------------------------------
-- Functions
-- -----------------------------------------------------------------------------

CREATE FUNCTION public.record_initial_intervention_status()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path = ''
  AS $$
BEGIN
  INSERT INTO public.intervention_status_history(intervention_id, from_status, to_status, created_by)
    VALUES (NEW.id, NULL, NEW.status, NEW.created_by);
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.transition_intervention(
  p_intervention_id bigint,
  p_to_status public.intervention_status,
  p_rank text
)
  RETURNS public.interventions
  LANGUAGE plpgsql
  SECURITY INVOKER
  SET search_path = ''
  AS $$
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
      VALUES (p_intervention_id, v_intervention.status, p_to_status, COALESCE(auth.uid(), public.system_user_id()));
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
$$;

CREATE FUNCTION public.insert_intervention_expense()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path = ''
  AS $$
DECLARE
  movement_id bigint;
BEGIN
  INSERT INTO public.movements(type, value, occurred_at, description)
    VALUES ('intervention'::public.movement_type, NEW.value, NEW.occurred_at, NEW.description)
  RETURNING
    id INTO movement_id;
  INSERT INTO public.intervention_expenses(intervention_id, movement_id)
    VALUES (NEW.intervention_id, movement_id);
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.remove_intervention_expense()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path = ''
  AS $$
DECLARE
  v_movement_id bigint;
BEGIN
  SELECT
    movement_id
  INTO v_movement_id
  FROM
    public.intervention_expenses
  WHERE
    id = OLD.id;
  DELETE FROM public.intervention_expenses
  WHERE id = OLD.id;
  DELETE FROM public.movements
  WHERE id = v_movement_id;
  RETURN OLD;
END;
$$;

-- -----------------------------------------------------------------------------
-- Triggers
-- -----------------------------------------------------------------------------

CREATE TRIGGER record_initial_intervention_status
  AFTER INSERT ON public.interventions
  FOR EACH ROW
  EXECUTE PROCEDURE public.record_initial_intervention_status();

CREATE TRIGGER insert_intervention_expense
  INSTEAD OF INSERT ON public.intervention_expenses_view
  FOR EACH ROW
  EXECUTE PROCEDURE public.insert_intervention_expense();

CREATE TRIGGER remove_intervention_expense
  INSTEAD OF DELETE ON public.intervention_expenses_view
  FOR EACH ROW
  EXECUTE PROCEDURE public.remove_intervention_expense();

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------

CREATE INDEX idx_interventions_created_by ON public.interventions(created_by);

CREATE INDEX idx_interventions_updated_by ON public.interventions(updated_by);

CREATE INDEX idx_interventions_property_id ON public.interventions(property_id);

CREATE INDEX idx_interventions_ticket_id ON public.interventions(ticket_id);

CREATE INDEX idx_intervention_status_history_created_by ON public.intervention_status_history(created_by);

CREATE INDEX idx_intervention_status_history_intervention_id_created_at ON public.intervention_status_history(intervention_id, created_at);

CREATE INDEX idx_intervention_status_history_status ON public.intervention_status_history(intervention_id, to_status, created_at);

CREATE INDEX idx_intervention_expenses_created_by ON public.intervention_expenses(created_by);

CREATE INDEX idx_intervention_expenses_updated_by ON public.intervention_expenses(updated_by);

CREATE INDEX idx_intervention_expenses_intervention_id ON public.intervention_expenses(intervention_id);

CREATE INDEX idx_intervention_expenses_movement_id ON public.intervention_expenses(movement_id);

-- -----------------------------------------------------------------------------
-- Grants
-- -----------------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON public.interventions TO authenticated, service_role;
GRANT SELECT ON public.intervention_status_transitions TO authenticated, service_role;
GRANT SELECT, INSERT ON public.intervention_status_history TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.intervention_expenses TO authenticated, service_role;
GRANT SELECT, INSERT, DELETE ON public.intervention_expenses_view TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.transition_intervention(bigint, public.intervention_status, text) TO authenticated, service_role;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_crud" ON public.interventions
  FOR ALL TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

ALTER TABLE public.intervention_status_transitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_select" ON public.intervention_status_transitions
  FOR SELECT TO authenticated
  USING (TRUE);

ALTER TABLE public.intervention_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_select" ON public.intervention_status_history
  FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "authenticated_insert" ON public.intervention_status_history
  FOR INSERT TO authenticated
  WITH CHECK (TRUE);

ALTER TABLE public.intervention_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_crud" ON public.intervention_expenses
  FOR ALL TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);
