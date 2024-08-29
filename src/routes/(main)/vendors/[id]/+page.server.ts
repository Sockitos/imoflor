import type { Movement, Vendor } from '@/types/types';
import { handleLoginRedirect } from '@/utils';
import { error, redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleLoginRedirect(event));
	}

	async function getVendor(): Promise<Vendor> {
		const { data: contract, error: contractError } = await event.locals.supabase
			.from('vendors')
			.select('*')
			.eq('id', event.params.id)
			.single();

		if (contractError) {
			return error(500, 'Error fetching vendor, please try again later.');
		}
		return contract;
	}

	async function getMovements(nif: string): Promise<Movement[]> {
		const { data: contractAccount, error: contractAccountError } = await event.locals.supabase
			.from('movements')
			.select('*')
			.eq('nif', nif);

		if (contractAccountError) {
			return error(500, 'Error fetching movements, please try again later.');
		}
		return contractAccount;
	}

	const vendor = await getVendor();

	return {
		vendor: vendor,
		movements: await getMovements(vendor.nif),
	};
};
