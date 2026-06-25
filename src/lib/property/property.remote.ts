import { getRequestEvent, query } from '$app/server';
import type { IdAndLabel } from '@/shared/types';
import { error } from '@sveltejs/kit';

export const getPropertyOptions = query<IdAndLabel[]>(async () => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: properties, error: propertiesError } = await supabase
		.from('properties')
		.select('id, ...addresses(label:address)');

	if (propertiesError) {
		error(500, 'Error fetching properties, please try again later.');
	}

	return properties;
});
