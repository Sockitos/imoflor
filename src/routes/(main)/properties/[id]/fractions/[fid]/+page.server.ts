import { createFractionSchema, deleteFractionSchema } from '@/property/schemas';
import type { Fraction, Property } from '@/property/types';
import { handleFormAction } from '@/shared/utils';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	async function getProperty(): Promise<Property> {
		const { data: property, error: propertyError } = await event.locals.supabase
			.from('properties')
			.select('*, address:addresses(*)')
			.eq('id', Number(event.params.id))
			.single();

		if (propertyError) {
			return error(500, 'Error fetching property, please try again later.');
		}
		return property;
	}

	async function getFraction(): Promise<Fraction> {
		const { data: fraction, error: fractionError } = await event.locals.supabase
			.from('properties')
			.select('*, address:addresses(*)')
			.eq('parent_id', Number(event.params.id))
			.eq('id', Number(event.params.fid))
			.single();

		if (fractionError) {
			return error(500, 'Error fetching fraction, please try again later.');
		}
		return fraction as unknown as Fraction;
	}

	const property = await getProperty();
	const fraction = await getFraction();

	return {
		property,
		fraction,
		updateFractionForm: await superValidate(
			{
				parent_id: fraction.parent_id,
				class: fraction.class,
				type: fraction.type,
				matrix: fraction.matrix,
				conservatory: fraction.conservatory,
				area: fraction.area,
				tipology: fraction.tipology,
				description: fraction.description,
				patrimonial_value: fraction.patrimonial_value ?? null,
				market_value: fraction.market_value ?? null,
				fraction: fraction.fraction,
				address: property.address,
			},
			zod4(createFractionSchema),
			{
				id: 'update-fraction',
			}
		),
		deleteFractionForm: await superValidate(zod4(deleteFractionSchema), {
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
				const { address: addressData, ...fractionData } = form.data;
				const parentId = Number(event.params.id);

				let addressId = addressData.id;
				if (addressId == null) {
					const { data: parent, error: parentError } = await event.locals.supabase
						.from('properties')
						.select('address_id')
						.eq('id', parentId)
						.single();

					if (parentError) {
						setFlash(
							{
								type: 'error',
								message: parentError.message,
							},
							event.cookies
						);
						return fail(500, {
							message: parentError.message,
							form,
						});
					}
					addressId = parent.address_id;
				}

				const { error } = await event.locals.supabase
					.from('properties')
					.update({
						...fractionData,
						address_id: addressId,
					})
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
					.from('properties')
					.delete()
					.eq('id', Number(event.params.fid));

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return redirect(302, `/properties/${event.params.id}`);
			}
		),
};
