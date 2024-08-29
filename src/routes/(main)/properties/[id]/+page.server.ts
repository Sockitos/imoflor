import {
	createFractionSchema,
	deleteFractionSchema,
	updateFractionSchema,
} from '@/schemas/fraction';
import type { Fraction, Property } from '@/types/types';
import { handleLoginRedirect } from '@/utils';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

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

	async function getFractions(): Promise<Fraction[]> {
		const { data: fractions, error: fractionsError } = await event.locals.supabase
			.from('fractions_view')
			.select('*')
			.eq('property_id', event.params.id);

		if (fractionsError) {
			return error(500, 'Error fetching fractions, please try again later.');
		}
		return fractions;
	}

	return {
		property: await getProperty(),
		fractions: await getFractions(),
		createFractionForm: await superValidate(zod(createFractionSchema), {
			id: 'create',
		}),
		updateFractionForm: await superValidate(zod(updateFractionSchema), {
			id: 'update',
		}),
		deleteFractionForm: await superValidate(zod(deleteFractionSchema), {
			id: 'delete',
		}),
	};
};
