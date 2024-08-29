import type { Fraction, Property } from '@/types/types';
import { handleLoginRedirect } from '@/utils';
import { error, redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleLoginRedirect(event));
	}

	async function getProperty(): Promise<Property> {
		const { data: property, error: propertyError } = await event.locals.supabase
			.from('properties')
			.select('*')
			.eq('id', event.params.id)
			.single();

		if (propertyError) {
			return error(500, 'Error fetching property, please try again later.');
		}
		return property;
	}

	async function getFraction(): Promise<Fraction> {
		const { data: fraction, error: fractionError } = await event.locals.supabase
			.from('fractions_view')
			.select('*')
			.eq('id', event.params.id)
			.single();

		if (fractionError) {
			return error(500, 'Error fetching fraction, please try again later.');
		}
		return fraction;
	}

	return {
		property: await getProperty(),
		fraction: await getFraction(),
	};
};
