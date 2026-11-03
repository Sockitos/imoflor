import { form, getRequestEvent, query } from '$app/server';
import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { deleteVendorSchema, vendorSchema } from './schemas';
import type { Vendor } from './types';

export const getVendors = query<Vendor[]>(async () => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: vendors, error: vendorsError } = await supabase
		.from('vendors')
		.select('*, address:addresses(*)');

	if (vendorsError) {
		error(500, 'Error fetching vendors, please try again later.');
	}

	return vendors;
});

export const getVendor = query(z.number(), async (id): Promise<Vendor> => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: vendor, error: vendorError } = await supabase
		.from('vendors')
		.select('*, address:addresses(*)')
		.eq('id', id)
		.single();

	if (vendorError) {
		error(500, 'Error fetching vendor, please try again later.');
	}

	return vendor;
});

export const upsertVendor = form(vendorSchema, async (data) => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { address: addressData, ...vendorData } = data;
	const { id: existingAddressId, ...addressFields } = addressData;

	let addressId = existingAddressId;
	if (addressId) {
		const { error: addressError } = await supabase
			.from('addresses')
			.update(addressFields)
			.eq('id', addressId);

		if (addressError) {
			error(500, addressError.message);
		}
	} else {
		const { data: insertedAddress, error: addressError } = await supabase
			.from('addresses')
			.insert(addressFields)
			.select('id')
			.single();

		if (addressError) {
			error(500, addressError.message);
		}

		addressId = insertedAddress.id;
	}

	if (vendorData.id) {
		const { id, ...fields } = vendorData;

		const { error: updateError } = await supabase
			.from('vendors')
			.update({ ...fields, address_id: addressId })
			.eq('id', id);

		if (updateError) {
			error(500, updateError.message);
		}

		getVendors().refresh();
		getVendor(id).refresh();
	} else {
		const { id: _id, ...insertFields } = vendorData;
		const { error: insertError } = await supabase.from('vendors').insert({
			...insertFields,
			address_id: addressId,
		});

		if (insertError) {
			error(500, insertError.message);
		}

		getVendors().refresh();
	}
});

export const deleteVendor = form(deleteVendorSchema, async ({ id }) => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { error: deleteError } = await supabase.from('vendors').delete().eq('id', id);

	if (deleteError) {
		error(500, deleteError.message);
	}

	getVendors().refresh();

	return redirect(302, '/vendors');
});
