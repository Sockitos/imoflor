import type { Movement, Vendor } from '@/types/types';
import { handleLoginRedirect } from '@/utils';
import { error, redirect } from '@sveltejs/kit';

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

	async function getMovements(nif: string): Promise<Movement[]> {
		const { data: movements, error: movementsError } = await event.locals.supabase
			.from('movements')
			.select('*')
			.eq('nif', nif);

		if (movementsError) {
			return error(500, 'Error fetching movements, please try again later.');
		}
		return movements;
	}

	const vendor = await getVendor();

	return {
		vendor: vendor,
		movements: await getMovements(vendor.nif),
	};
};
