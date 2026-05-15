import { getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

export const getMovements = query(z.string(), async (tax_id_number) => {
	const event = getRequestEvent();

	const { data: movements, error: movementsError } = await event.locals.supabase
		.from('movements')
		.select('*')
		.eq('tax_id_number', tax_id_number);

	if (movementsError) {
		return error(500, 'Error fetching movements, please try again later.');
	}

	return movements;
});
