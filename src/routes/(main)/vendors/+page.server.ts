import { handleFormAction } from '@shared/utils';
import { error, fail } from '@sveltejs/kit';
import { createVendorSchema, deleteVendorSchema } from '@vendor/schemas';
import type { Vendor } from '@vendor/types';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	async function getVendors(): Promise<Vendor[]> {
		const { data: vendors, error: vendorsError } = await event.locals.supabase
			.from('vendors')
			.select('*, address:addresses(*)');

		if (vendorsError) {
			return error(500, 'Error fetching vendors, please try again later.');
		}
		return vendors;
	}

	return {
		vendors: await getVendors(),
		createVendorForm: await superValidate(zod4(createVendorSchema), {
			id: 'create-vendor',
		}),
		deleteVendorForm: await superValidate(zod4(deleteVendorSchema), {
			id: 'delete-vendor',
		}),
	};
};

export const actions = {
	create: async (event) =>
		handleFormAction(event, createVendorSchema, 'create-vendor', async (event, userId, form) => {
			const { address: addressData, ...vendorData } = form.data;

			const { data: insertedAddress, error: addressError } = await event.locals.supabase
				.from('addresses')
				.insert(addressData)
				.select('id')
				.single();

			if (addressError) {
				setFlash({ type: 'error', message: addressError.message }, event.cookies);
				return fail(500, { message: addressError.message, form });
			}

			const { error } = await event.locals.supabase
				.from('vendors')
				.insert({ ...vendorData, address_id: insertedAddress?.id });

			if (error) {
				setFlash({ type: 'error', message: error.message }, event.cookies);
				return fail(500, { message: error.message, form });
			}

			return { success: true, form };
		}),
};
