import { getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import type { PropertyOption } from './types';

export const getPropertyOptions = query<PropertyOption[]>(async () => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: properties, error: propertiesError } = await supabase
		.from('properties')
		.select(
			'id, matrix, type, ...addresses(address), children:properties!parent_id(id, matrix, type, ...addresses(address))'
		)
		.is('parent_id', null);

	if (propertiesError) {
		error(500, 'Error fetching properties, please try again later.');
	}

	return properties as unknown as PropertyOption[];
});
