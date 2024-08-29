import type { Contract, ContractAccountItem } from '@/types/types';
import { handleLoginRedirect } from '@/utils';
import { error, redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleLoginRedirect(event));
	}

	async function getContract(): Promise<Contract> {
		const { data: contract, error: contractError } = await event.locals.supabase
			.from('contracts_view')
			.select(
				'*, tenants:tenants (id, label:name), fraction:fractions_view (id, label:address_full)'
			)
			.eq('id', event.params.id)
			.single();

		if (contractError) {
			return error(500, 'Error fetching contract, please try again later.');
		}
		return contract;
	}

	async function getContractAccount(): Promise<ContractAccountItem[]> {
		const { data: contractAccount, error: contractAccountError } = await event.locals.supabase
			.from('contracts_accounts_view')
			.select('*')
			.eq('contract_id', event.params.id);

		if (contractAccountError) {
			return error(500, 'Error fetching contract account, please try again later.');
		}
		return contractAccount;
	}

	return {
		contract: await getContract(),
		contractAccount: await getContractAccount(),
	};
};
