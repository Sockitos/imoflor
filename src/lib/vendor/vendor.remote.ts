import { form, getRequestEvent, query } from '$app/server';
import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { setFlash } from 'sveltekit-flash-message/server';
import { deleteByIdsSchema } from '@/shared/schemas';
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
		cookies,
	} = getRequestEvent();

	const { address: addressData, ...vendorData } = data;

	let addressId = addressData.id;
	if (addressId) {
		const { error: addressError } = await supabase
			.from('addresses')
			.update(addressData)
			.eq('id', addressId);

		if (addressError) {
			setFlash({ type: 'error', message: addressError.message }, cookies);
			error(500, addressError.message);
		}
	} else {
		const { data: insertedAddress, error: addressError } = await supabase
			.from('addresses')
			.insert(addressData)
			.select('id')
			.single();

		if (addressError) {
			setFlash({ type: 'error', message: addressError.message }, cookies);
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
			setFlash({ type: 'error', message: updateError.message }, cookies);
			error(500, updateError.message);
		}

		setFlash({ type: 'success', message: 'Vendor updated successfully' }, cookies);
		getVendors().refresh();
		getVendor(id).refresh();
	} else {
		const { error: insertError } = await supabase.from('vendors').insert({
			...vendorData,
			address_id: addressId,
		});

		if (insertError) {
			setFlash({ type: 'error', message: insertError.message }, cookies);
			error(500, insertError.message);
		}

		setFlash({ type: 'success', message: 'Vendor created successfully' }, cookies);
		getVendors().refresh();
	}
});

export const deleteVendor = form(deleteVendorSchema, async ({ id }) => {
	const {
		locals: { supabase },
		cookies,
	} = getRequestEvent();

	const { error: deleteError } = await supabase.from('vendors').delete().eq('id', id);

	if (deleteError) {
		setFlash({ type: 'error', message: deleteError.message }, cookies);
		error(500, deleteError.message);
	}

	setFlash({ type: 'success', message: 'Vendor deleted successfully' }, cookies);
	getVendors().refresh();

	return redirect(302, '/vendors');
});

export const deleteVendors = form(deleteByIdsSchema, async ({ ids }) => {
	const {
		locals: { supabase },
		cookies,
	} = getRequestEvent();

	const { error: deleteError } = await supabase.from('vendors').delete().in('id', ids);

	if (deleteError) {
		setFlash({ type: 'error', message: deleteError.message }, cookies);
		error(500, deleteError.message);
	}

	setFlash({ type: 'success', message: 'Vendors deleted successfully' }, cookies);
	getVendors().refresh();
});
