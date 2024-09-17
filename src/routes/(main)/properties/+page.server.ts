import { createPropertySchema, deletePropertySchema } from '@/schemas/property';
import type { Property } from '@/types/types';
import { handleFormAction, handleLoginRedirect } from '@/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleLoginRedirect(event));
	}

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
		createPropertyForm: await superValidate(zod(createPropertySchema), {
			id: 'create-property',
		}),
		deletePropertyForm: await superValidate(zod(deletePropertySchema), {
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
				const { error: supabaseError } = await event.locals.supabase
					.from('properties')
					.insert(form.data);

				if (supabaseError) {
					setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
					return fail(500, { message: supabaseError.message, form });
				}

				return { success: true, form };
			}
		),
};
