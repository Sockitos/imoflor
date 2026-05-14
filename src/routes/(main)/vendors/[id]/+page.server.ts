import type { Movement } from '@movement/types';
import { handleFormAction } from '@shared/utils';
import { error, redirect } from '@sveltejs/kit';
import { deleteVendorSchema, updateVendorSchema } from '@vendor/schemas';
import type { Vendor } from '@vendor/types';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	async function getVendor(): Promise<Vendor> {
		const { data: vendor, error: vendorError } = await event.locals.supabase
			.from('vendors')
			.select('*, address:addresses(*)')
			.eq('id', Number(event.params.id))
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
	const vendorFormData = { ...vendor, address: vendor.address ?? {} };

	return {
		vendor: vendor,
		movements: await getMovements(vendor.tax_id_number),
		updateVendorForm: await superValidate(vendorFormData, zod4(updateVendorSchema), {
			id: 'update-vendor',
		}),
		deleteVendorForm: await superValidate(
			{ id: Number(event.params.id) },
			zod4(deleteVendorSchema),
			{
				id: 'delete-vendor',
			}
		),
	};
};

export const actions = {
	update: async (event) =>
		handleFormAction(event, updateVendorSchema, 'update-vendor', async (event, userId, form) => {
			const { address: addressData, ...vendorData } = form.data;
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
				const { data: insertedAddress, error: addressError } = await event.locals.supabase
					.from('addresses')
					.insert(addressFields)
					.select('id')
					.single();

				if (addressError) {
					setFlash({ type: 'error', message: addressError.message }, event.cookies);
					return fail(500, { message: addressError.message, form });
				}

				Object.assign(vendorData, { address_id: insertedAddress?.id });
			}

			const { error } = await event.locals.supabase
				.from('vendors')
				.update(vendorData)
				.eq('id', Number(event.params.id));

			if (error) {
				setFlash({ type: 'error', message: error.message }, event.cookies);
				return fail(500, { message: error.message, form });
			}

			return { success: true, form };
		}),
	delete: async (event) =>
		handleFormAction(event, deleteVendorSchema, 'delete-vendor', async (event, userId, form) => {
			const { error } = await event.locals.supabase.from('vendors').delete().eq('id', form.data.id);

			if (error) {
				setFlash({ type: 'error', message: error.message }, event.cookies);
				return fail(500, { message: error.message, form });
			}

			return redirect(302, '/vendors');
		}),
};
