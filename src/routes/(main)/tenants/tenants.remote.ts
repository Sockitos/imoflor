import { getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';

export const getTenants = query(async () => {
	const event = getRequestEvent();

	const { data: tenants, error: tenantsError } = await event.locals.supabase
		.from('tenants')
		.select('*');

	if (tenantsError) {
		return error(500, 'Error fetching tenants, please try again later.');
	}

	return tenants;
});
