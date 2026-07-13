CREATE OR REPLACE FUNCTION public.remove_rent_payment()
  RETURNS TRIGGER
  AS $$
DECLARE
  v_movement_id bigint;
BEGIN
  SELECT movement_id INTO v_movement_id
  FROM public.rent_payments
  WHERE id = OLD.id;

  DELETE FROM public.rent_payments
  WHERE id = OLD.id;

  DELETE FROM public.movements
  WHERE id = v_movement_id;

  RETURN old;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.remove_installment_payment()
  RETURNS TRIGGER
  AS $$
DECLARE
  v_interest_movement_id bigint;
  v_amortization_movement_id bigint;
BEGIN
  SELECT interest_movement_id, amortization_movement_id
    INTO v_interest_movement_id, v_amortization_movement_id
  FROM public.installment_payments
  WHERE id = OLD.id;

  DELETE FROM public.installment_payments
  WHERE id = OLD.id;

  DELETE FROM public.movements
  WHERE id = v_interest_movement_id;

  DELETE FROM public.movements
  WHERE id = v_amortization_movement_id;

  RETURN old;
END;
$$
LANGUAGE plpgsql;
