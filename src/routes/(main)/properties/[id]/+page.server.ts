import { createFractionSchema, deleteFractionSchema } from '@/schemas/fraction';
import { createPropertySchema, deletePropertySchema } from '@/schemas/property';
import type { Fraction, Property } from '@/types/types';
import { handleFormAction, handleLoginRedirect } from '@/utils';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

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

	async function getFractions(): Promise<Fraction[]> {
		const { data: fractions, error: fractionsError } = await event.locals.supabase
			.from('fractions_view')
			.select('*')
			.eq('property_id', Number(event.params.id));

		if (fractionsError) {
			return error(500, 'Error fetching fractions, please try again later.');
		}
		return fractions;
	}

	const property = await getProperty();

	return {
		property: property,
		fractions: await getFractions(),
		updatePropertyForm: await superValidate(property, zod4(createPropertySchema), {
			id: 'update-property',
		}),
		deletePropertyForm: await superValidate(zod4(deletePropertySchema), {
			id: 'delete-property',
		}),
		createFractionForm: await superValidate(zod4(createFractionSchema), {
			id: 'create-fraction',
		}),
		deleteFractionForm: await superValidate(zod4(deleteFractionSchema), {
			id: 'delete-fraction',
		}),
	};
};

export const actions = {
	update: async (event) =>
		handleFormAction(
			event,
			createPropertySchema,
			'update-property',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase
					.from('properties')
					.update(form.data)
					.eq('id', Number(event.params.id));

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
			deletePropertySchema,
			'delete-property',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase
					.from('properties')
					.delete()
					.eq('id', form.data.id);

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return redirect(302, '/properties');
			}
		),
};
