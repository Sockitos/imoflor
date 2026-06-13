import { form, getRequestEvent, query } from '$app/server';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { z } from 'zod';
import { deleteFractionSchema, deletePropertySchema, fractionSchema, propertySchema } from './schemas';
import type { Fraction, Property } from './types';

export const getProperties = query<Property[]>(async () => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: properties, error: propertiesError } = await supabase
		.from('properties')
		.select('*, address:addresses(*)')
		.is('parent_id', null);

	if (propertiesError) {
		error(500, 'Error fetching properties, please try again later.');
	}

	return properties;
});

export const getProperty = query(z.number(), async (id): Promise<Property> => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: property, error: propertyError } = await supabase
		.from('properties')
		.select('*, address:addresses(*)')
		.eq('id', id)
		.single();

	if (propertyError) {
		error(500, 'Error fetching property, please try again later.');
	}

	return property;
});

export const upsertProperty = form(propertySchema, async (data) => {
	const {
		locals: { supabase },
		cookies,
	} = getRequestEvent();

	const { address: addressData, ...propertyData } = data;

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
		const { data: address, error: addressError } = await supabase
			.from('addresses')
			.insert(addressData)
			.select('id')
			.single();

		if (addressError) {
			setFlash({ type: 'error', message: addressError.message }, cookies);
			error(500, addressError.message);
		}

		addressId = address.id;
	}

	if (propertyData.id) {
		const { id, ...fields } = propertyData;

		const { error: updateError } = await supabase
			.from('properties')
			.update({ ...fields, address_id: addressId })
			.eq('id', id);

		if (updateError) {
			setFlash({ type: 'error', message: updateError.message }, cookies);
			error(500, updateError.message);
		}

		setFlash({ type: 'success', message: 'Property updated successfully' }, cookies);
		getProperties().refresh();
		getProperty(id).refresh();
	} else {
		const { error: insertError } = await supabase.from('properties').insert({
			...propertyData,
			address_id: addressId,
		});

		if (insertError) {
			setFlash({ type: 'error', message: insertError.message }, cookies);
			error(500, insertError.message);
		}

		setFlash({ type: 'success', message: 'Property created successfully' }, cookies);
		getProperties().refresh();
	}
});

export const deleteProperty = form(deletePropertySchema, async ({ id }) => {
	const {
		locals: { supabase },
		cookies,
	} = getRequestEvent();

	const { error: deleteError } = await supabase.from('properties').delete().eq('id', id);

	if (deleteError) {
		setFlash({ type: 'error', message: deleteError.message }, cookies);
		error(500, deleteError.message);
	}

	setFlash({ type: 'success', message: 'Property deleted successfully' }, cookies);
	getProperties().refresh();

	return redirect(302, '/properties');
});

export const getFractions = query(z.number(), async (parentId): Promise<Fraction[]> => {
	const {
		locals: { supabase },
	} = getRequestEvent();


	const { data: fractions, error: fractionsError } = await supabase
		.from('properties')
		.select('*, address:addresses(*)')
		.eq('parent_id', parentId);

	if (fractionsError) {
		error(500, 'Error fetching fractions, please try again later.');
	}

	return fractions as unknown as Fraction[];
});

export const getFraction = query(z.number(), async (fid): Promise<Fraction> => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: fraction, error: fractionError } = await supabase
		.from('properties')
		.select('*, address:addresses(*)')
		.eq('id', fid)
		.single();

	if (fractionError) {
		error(500, 'Error fetching fraction, please try again later.');
	}

	return fraction as unknown as Fraction;
});

export const upsertFraction = form(fractionSchema, async (data) => {
	const {
		locals: { supabase },
		cookies,
	} = getRequestEvent();

	const { address: addressData, ...fractionData } = data;

	let addressId = addressData.id;
	if (addressId == null) {
		const { data: parent, error: parentError } = await supabase
			.from('properties')
			.select('address_id')
			.eq('id', fractionData.parent_id)
			.single();

		if (parentError) {
			setFlash({ type: 'error', message: parentError.message }, cookies);
			error(500, parentError.message);
		}

		addressId = parent.address_id;
	}

	if (fractionData.id) {
		const { id, ...fields } = fractionData;

		const { error: updateError } = await supabase
			.from('properties')
			.update({ ...fields, address_id: addressId })
			.eq('id', id);

		if (updateError) {
			setFlash({ type: 'error', message: updateError.message }, cookies);
			error(500, updateError.message);
		}

		setFlash({ type: 'success', message: 'Fraction updated successfully' }, cookies);
		getFractions(fractionData.parent_id).refresh();
		getFraction(id).refresh();
	} else {
		const { error: insertError } = await supabase.from('properties').insert({
			...fractionData,
			address_id: addressId,
		});

		if (insertError) {
			setFlash({ type: 'error', message: insertError.message }, cookies);
			error(500, insertError.message);
		}

		setFlash({ type: 'success', message: 'Fraction created successfully' }, cookies);
		getFractions(fractionData.parent_id).refresh();
	}
});

export const deleteFraction = form(deleteFractionSchema, async ({ id, parent_id }) => {
	const {
		locals: { supabase },
		cookies,
	} = getRequestEvent();

	const { error: deleteError } = await supabase.from('properties').delete().eq('id', id);

	if (deleteError) {
		setFlash({ type: 'error', message: deleteError.message }, cookies);
		error(500, deleteError.message);
	}

	setFlash({ type: 'success', message: 'Fraction deleted successfully' }, cookies);
	getFractions(parent_id).refresh();

	return redirect(302, `/properties/${parent_id}`);
});
