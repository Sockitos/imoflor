import { getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import type { IdAndLabel } from '@/shared/types';

export const getPropertyOptions = query(async (): Promise<IdAndLabel[]> => {
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
