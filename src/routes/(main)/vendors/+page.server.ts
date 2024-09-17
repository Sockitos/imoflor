import { createVendorSchema, deleteVendorSchema } from '@/schemas/vendor';
import type { Vendor } from '@/types/types';
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

	async function getVendors(): Promise<Vendor[]> {
		const { data: vendors, error: vendorsError } = await event.locals.supabase
			.from('vendors')
			.select('*');

		if (vendorsError) {
			const errorMessage = 'Error fetching vendors, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, 'Error fetching vendors, please try again later.');
		}
		return vendors;
	}

	return {
		vendors: await getVendors(),
		createVendorForm: await superValidate(zod(createVendorSchema), {
			id: 'create-vendor',
		}),
		deleteVendorForm: await superValidate(zod(deleteVendorSchema), {
			id: 'delete-vendor',
		}),
	};
};

export const actions = {
	create: async (event) =>
		handleFormAction(event, createVendorSchema, 'create-vendor', async (event, userId, form) => {
			const { error: supabaseError } = await event.locals.supabase
				.from('vendors')
				.insert(form.data);

			if (supabaseError) {
				setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
				return fail(500, { message: supabaseError.message, form });
			}

			return { success: true, form };
		}),
};
