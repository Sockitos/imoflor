import { createVendorSchema, deleteVendorSchema } from '@/schemas/vendor';
import type { Movement, Vendor } from '@/types/types';
import { handleLoginRedirect } from '@/utils';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleLoginRedirect(event));
	}

	async function getVendor(): Promise<Vendor> {
		const { data: vendor, error: vendorError } = await event.locals.supabase
			.from('vendors')
			.select('*')
			.eq('id', event.params.id)
			.single();

		if (vendorError) {
			return error(500, 'Error fetching vendor, please try again later.');
		}
		return vendor;
	}

	async function getMovements(tax_id_number: string): Promise<Movement[]> {
		const { data: movements, error: movementsError } = await event.locals.supabase
			.from('movements')
			.select('*')
			.eq('tax_id_number', tax_id_number);

		if (movementsError) {
			return error(500, 'Error fetching movements, please try again later.');
		}
		return movements;
	}

	const vendor = await getVendor();

	return {
		vendor: vendor,
		movements: await getMovements(vendor.tax_id_number),
		updateForm: await superValidate(vendor, zod(createVendorSchema), {
			id: 'update',
		}),
		deleteForm: await superValidate(zod(deleteVendorSchema), {
			id: 'delete',
		}),
	};
};

export const actions = {
	update: async (event) => {
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			const errorMessage = 'Unauthorized.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(401, errorMessage);
		}

		const form = await superValidate(event.request, zod(createVendorSchema), { id: 'update' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('vendors')
			.update(form.data)
			.eq('id', event.params.id);

		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		return { success: true, form };
	},
	delete: async (event) => {
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			const errorMessage = 'Unauthorized.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(401, errorMessage);
		}

		const form = await superValidate(event.request, zod(deleteVendorSchema), { id: 'delete' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('vendors')
			.delete()
			.eq('id', form.data.id);

		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		return { success: true, form };
	},
};