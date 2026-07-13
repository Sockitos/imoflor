import { form, getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { z } from 'zod';
import { deleteMovementsSchema } from './schemas';
import type { Movement } from './types';

export const getMovements = query<z.ZodString, Movement[]>(z.string(), async (tax_id_number) => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: movements, error: movementsError } = await supabase
		.from('movements')
		.select('*')
		.eq('tax_id_number', tax_id_number);

	if (movementsError) {
		error(500, 'Error fetching movements, please try again later.');
	}

	return movements;
});

export const deleteMovements = form(deleteMovementsSchema, async ({ ids, tax_id_number }) => {
	const {
		locals: { supabase },
		cookies,
	} = getRequestEvent();

	const { error: deleteError } = await supabase.from('movements').delete().in('id', ids);

	if (deleteError) {
		setFlash({ type: 'error', message: deleteError.message }, cookies);
		error(500, deleteError.message);
	}

	setFlash({ type: 'success', message: 'Movements deleted successfully' }, cookies);
	getMovements(tax_id_number).refresh();
});
