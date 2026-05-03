import { createPropertySchema, deletePropertySchema } from '@/schemas/property';
import type { Property } from '@/types/types';
import { handleFormAction } from '@/utils';
import { error, fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	async function getProperties(): Promise<Property[]> {
		const { data: properties, error: propertiesError } = await event.locals.supabase
			.from('properties')
			.select('*');

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
				const { error } = await event.locals.supabase.from('properties').insert(form.data);

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return { success: true, form };
			}
		),
};
