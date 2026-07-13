CREATE FUNCTION public.delete_contract_account_items(
  p_contract_id bigint,
  p_ids bigint[],
  p_types text[]
)
  RETURNS void
  AS $$
BEGIN
  DELETE FROM public.due_notes
  WHERE contract_id = p_contract_id
    AND id IN (
      SELECT unnest_id
      FROM unnest(p_ids, p_types) AS t(unnest_id, unnest_type)
      WHERE unnest_type = 'due_note'
    );
  DELETE FROM public.rent_payments_view
  WHERE contract_id = p_contract_id
    AND id IN (
      SELECT unnest_id
      FROM unnest(p_ids, p_types) AS t(unnest_id, unnest_type)
      WHERE unnest_type = 'payment'
    );
  DELETE FROM public.installment_payments_view
  WHERE contract_id = p_contract_id
    AND id IN (
      SELECT unnest_id
      FROM unnest(p_ids, p_types) AS t(unnest_id, unnest_type)
      WHERE unnest_type = 'payment'
    );
END;
$$
LANGUAGE plpgsql;
