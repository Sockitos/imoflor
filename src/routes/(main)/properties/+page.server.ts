import { createPropertySchema, deletePropertySchema } from '@/schemas/property';
import type { Property } from '@/types/types';
import { handleLoginRedirect } from '@/utils';
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
		createForm: await superValidate(zod(createPropertySchema), {
			id: 'create',
		}),
		deleteForm: await superValidate(zod(deletePropertySchema), {
			id: 'delete',
		}),
	};
};

export const actions = {
	create: async (event) => {
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			const errorMessage = 'Unauthorized.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(401, errorMessage);
		}

		const form = await superValidate(event.request, zod(createPropertySchema), { id: 'create' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('properties')
			.insert(form.data);

		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		return { success: true, form };
	},
};
