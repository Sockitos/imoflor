import { createContractSchema, deleteContractSchema } from '@/schemas/contract';
import type { Contract, ContractAccountItem, IdWithLabel } from '@/types/types';
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

	async function getContract(): Promise<Contract> {
		const { data: contract, error: contractError } = await event.locals.supabase
			.from('contracts_view')
			.select(
				'*, tenants:tenants!inner (id, label:name), fraction:fractions_view!inner (id, label:address_full)'
			)
			.eq('id', event.params.id)
			.returns<Contract[]>() // TODO: try not to use returns
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

	async function getFractionOptions(): Promise<IdWithLabel[]> {
		const { data: fractions, error: fractionsError } = await event.locals.supabase
			.from('fractions_view')
			.select('id, label:address_full');

		if (fractionsError) {
			return error(500, 'Error fetching fractions, please try again later.');
		}
		return fractions;
	}

	async function getTenantOptions() {
		const { data: tenants, error: tenantsError } = await event.locals.supabase
			.from('tenants')
			.select('id, label:name');

		if (tenantsError) {
			return error(500, 'Error fetching tenants, please try again later.');
		}
		return tenants;
	}

	const contract = await getContract();

	return {
		contract: contract,
		contractAccount: await getContractAccount(),
		fractionOptions: await getFractionOptions(),
		tenantOptions: await getTenantOptions(),
		updateForm: await superValidate(
			{
				type: contract.type,
				fraction_id: contract.fraction.id,
				start_date: contract.start_date,
				end_date: contract.end_date,
				tenant_id: contract.tenants[0].id,
				...contract.data,
			},
			zod(createContractSchema),
			{
				id: 'update',
			}
		),
		deleteForm: await superValidate(zod(deleteContractSchema), {
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

		const form = await superValidate(event.request, zod(createContractSchema), { id: 'update' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('contracts_view')
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

		const form = await superValidate(event.request, zod(deleteContractSchema), { id: 'delete' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('contracts')
			.delete()
			.eq('id', form.data.id);

		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		return { success: true, form };
	},
};
