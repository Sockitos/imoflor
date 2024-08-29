import {
	createContractSchema,
	deleteContractSchema,
	updateContractSchema,
} from '@/schemas/contract';
import { handleLoginRedirect } from '@/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleLoginRedirect(event));
	}

	async function getContracts() {
		const { data: contracts, error: contractsError } = await event.locals.supabase
			.from('contracts_view')
			.select(
				'*, tenants:tenants (id, label:name), fraction:fractions_view (id, label:address_full)'
			);

		if (contractsError) {
			return error(500, 'Error fetching contracts, please try again later.');
		}
		return contracts;
	}

	async function getFractionOptions() {
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
		createForm: await superValidate(zod(createContractSchema), {
			id: 'create',
		}),
		updateForm: await superValidate(zod(updateContractSchema), {
			id: 'update',
		}),
		deleteForm: await superValidate(zod(deleteContractSchema), {
			id: 'delete',
		}),
	};
};

export const actions = {
	create: async (event) => {
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			const errorMessage = 'Unauthorized.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(401, errorMessage);
		}

		const form = await superValidate(event.request, zod(createContractSchema), { id: 'create' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase.from('contracts_view').insert({
			fraction_id: form.data.fraction_id,
			start_date: form.data.start_date,
			end_date: form.data.end_date,
			type: form.data.type,
			data: form.data,
		});

		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		return { success: true, form };
	},
	update: async (event) => {
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			const errorMessage = 'Unauthorized.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(401, errorMessage);
		}

		const form = await superValidate(event.request, zod(updateContractSchema), { id: 'update' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('contracts_view')
			.update(form.data)
			.eq('id', form.data.id);

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
