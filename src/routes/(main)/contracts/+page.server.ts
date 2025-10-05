import { createContractSchema, deleteContractSchema } from '@/schemas/contract';
import type { Contract, IdWithLabel } from '@/types/types';
import { handleFormAction, handleLoginRedirect } from '@/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleLoginRedirect(event));
	}

	async function getContracts(): Promise<Contract[]> {
		const { data: contracts, error: contractsError } = await event.locals.supabase
			.from('contracts_view')
			.select(
				'*, tenants:tenants!inner (id, label:name), fraction:fractions_view!inner (id, label:address_full)'
			)
			.returns<Contract[]>(); // TODO: try not to use returns

		if (contractsError) {
			return error(500, 'Error fetching contracts, please try again later.');
		}
		return contracts;
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

	return {
		contracts: await getContracts(),
		fractionOptions: await getFractionOptions(),
		tenantOptions: await getTenantOptions(),
		createContractForm: await superValidate(zod4(createContractSchema), {
			id: 'create-contract',
		}),
		deleteContractForm: await superValidate(zod4(deleteContractSchema), {
			id: 'delete-contract',
		}),
	};
};

export const actions = {
	create: async (event) =>
		handleFormAction(
			event,
			createContractSchema,
			'create-contract',
			async (event, userId, form) => {
				const { data, error } = await event.locals.supabase
					.from('contracts_view')
					.insert({
						fraction_id: form.data.fraction_id,
						start_date: form.data.start_date,
						end_date: form.data.end_date,
						type: form.data.type,
						data: form.data,
					})
					.select()
					.single();

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				const { error: tenantError } = await event.locals.supabase.rpc('update_contract_tenants', {
					p_contract_id: data.id,
					p_tenants: [form.data.tenant_id],
				});

				if (tenantError) {
					setFlash({ type: 'error', message: tenantError.message }, event.cookies);
					return fail(500, { message: tenantError.message, form });
				}

				return { success: true, form };
			}
		),
};
