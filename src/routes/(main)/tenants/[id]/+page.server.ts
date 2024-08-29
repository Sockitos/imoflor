import type { Movement, Tenant } from '@/types/types';
import { handleLoginRedirect } from '@/utils';
import { error, redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleLoginRedirect(event));
	}

	async function getTenant(): Promise<Tenant> {
		const { data: contract, error: contractError } = await event.locals.supabase
			.from('tenants')
			.select('*')
			.eq('id', event.params.id)
			.single();

		if (contractError) {
			return error(500, 'Error fetching tenant, please try again later.');
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

	const tenant = await getTenant();

	return {
		tenant: tenant,
		movements: await getMovements(tenant.nif),
	};
};
