import {
	createFractionSchema,
	createPropertySchema,
	deleteFractionSchema,
	deletePropertySchema,
} from '@property/schemas';
import type { Fraction, Property } from '@property/types';
import { handleFormAction } from '@shared/utils';
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

	async function getFractions(): Promise<Fraction[]> {
		const { data: fractions, error: fractionsError } = await event.locals.supabase
			.from('properties')
			.select('*, address:addresses(*)')
			.eq('parent_id', Number(event.params.id));

		if (fractionsError) {
			return error(500, 'Error fetching fractions, please try again later.');
		}
		return fractions as unknown as Fraction[];
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
		createFractionForm: await superValidate(
			{
				parent_id: property.id,
				class: property.class,
				matrix: property.matrix,
				conservatory: property.conservatory,
				type: 'apartment',
				fraction: '',
				area: null,
				tipology: null,
				description: null,
				patrimonial_value: null,
				market_value: null,
				address: property.address,
			},
			zod4(createFractionSchema),
			{
				id: 'create-fraction',
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
			createPropertySchema,
			'update-property',
			async (event, userId, form) => {
				const { address: addressData, ...propertyData } = form.data;
				const { id: addressId, ...addressFields } = addressData;

				if (addressId) {
					const { error: addressError } = await event.locals.supabase
						.from('addresses')
						.update(addressFields)
						.eq('id', addressId);

					if (addressError) {
						setFlash({ type: 'error', message: addressError.message }, event.cookies);
						return fail(500, { message: addressError.message, form });
					}
				} else {
					const { data: address, error: addressError } = await event.locals.supabase
						.from('addresses')
						.insert(addressFields)
						.select('id')
						.single();

					if (addressError) {
						setFlash({ type: 'error', message: addressError.message }, event.cookies);
						return fail(500, { message: addressError.message, form });
					}

					Object.assign(propertyData, { address_id: address?.id });
				}

				const { error } = await event.locals.supabase
					.from('properties')
					.update(propertyData)
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
	createFraction: async (event) =>
		handleFormAction(
			event,
			createFractionSchema,
			'create-fraction',
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
						setFlash({ type: 'error', message: parentError.message }, event.cookies);
						return fail(500, { message: parentError.message, form });
					}
					addressId = parent.address_id;
				}

				const { error } = await event.locals.supabase.from('properties').insert({
					...fractionData,
					address_id: addressId,
				});

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return { success: true, form };
			}
		),
};
