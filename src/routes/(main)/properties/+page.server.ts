import { createPropertySchema, deletePropertySchema } from '@/property/schemas';
import type { Property } from '@/property/types';
import { handleFormAction } from '@/shared/utils';
import { error, fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	async function getProperties(): Promise<Property[]> {
		const { data: properties, error: propertiesError } = await event.locals.supabase
			.from('properties')
			.select('*, address:addresses(*)');

		if (propertiesError) {
			return error(500, 'Error fetching properties, please try again later.');
		}
		return properties;
	}

	return {
		properties: await getProperties(),
		createPropertyForm: await superValidate(zod4(createPropertySchema), {
			id: 'create-property',
		}),
		deletePropertyForm: await superValidate(zod4(deletePropertySchema), {
			id: 'delete-property',
		}),
	};
};

export const actions = {
	create: async (event) =>
		handleFormAction(
			event,
			createPropertySchema,
			'create-property',
			async (event, userId, form) => {
				const { address: addressData, ...propertyData } = form.data;

				const { data: address, error: addressError } = await event.locals.supabase
					.from('addresses')
					.insert(addressData)
					.select('id')
					.single();

				if (addressError) {
					setFlash({ type: 'error', message: addressError.message }, event.cookies);
					return fail(500, { message: addressError.message, form });
				}

				const { error } = await event.locals.supabase.from('properties').insert({
					...propertyData,
					address_id: address.id,
				});

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return { success: true, form };
			}
		),
};
