import { createFractionSchema, deleteFractionSchema } from '@/schemas/fraction';
import type { Fraction, Property } from '@/types/types';
import { handleFormAction, handleLoginRedirect } from '@/utils';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
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
			.eq('id', Number(event.params.id))
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
			.eq('id', Number(event.params.fid))
			.single();

		if (fractionError) {
			return error(500, 'Error fetching fraction, please try again later.');
		}
		return fraction;
	}

	const fraction = await getFraction();

	return {
		property: await getProperty(),
		fraction: fraction,
		updateFractionForm: await superValidate(fraction, zod(createFractionSchema), {
			id: 'update-fraction',
		}),
		deleteFractionForm: await superValidate(zod(deleteFractionSchema), {
			id: 'delete-fraction',
		}),
	};
};

export const actions = {
	update: async (event) =>
		handleFormAction(
			event,
			createFractionSchema,
			'update-fraction',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase
					.from('fractions')
					.update({ property_id: Number(event.params.id), ...form.data })
					.eq('id', Number(event.params.fid));

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return { success: true, form };
			}
		),
	delete: async (event) =>
		handleFormAction(
			event,
			deleteFractionSchema,
			'delete-fraction',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase
					.from('fractions')
					.delete()
					.eq('id', Number(event.params.id));

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return redirect(302, `/properties/${event.params.id}`);
			}
		),
};
