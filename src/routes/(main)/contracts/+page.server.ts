import {
	createContractSchema,
	deleteContractSchema,
	updateContractSchema,
} from '@/schemas/contract';
import { handleLoginRedirect } from '@/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	const session = await event.locals.getSession();
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

	return {
		contracts: await getContracts(),
		createForm: await superValidate(createContractSchema, {
			id: 'create',
		}),
		updateForm: await superValidate(updateContractSchema, {
			id: 'update',
		}),
		deleteForm: await superValidate(deleteContractSchema, {
			id: 'delete',
		}),
	};
};

export const actions = {
	create: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			return error(401, 'Unauthorized');
		}

		const form = await superValidate(event.request, createContractSchema, { id: 'create' });

		if (!form.valid) {
			return fail(400, { message: 'Invalid form.', success: false, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('contracts')
			.insert(form.data);

		if (supabaseError) {
			return fail(500, { message: supabaseError.message, success: false, form });
		}

		return redirect(302, '/contracts');
	},
	update: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			return error(401, 'Unauthorized');
		}

		const form = await superValidate(event.request, updateContractSchema, { id: 'update' });

		if (!form.valid) {
			return fail(400, { message: 'Invalid form.', success: false, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('contracts_view')
			.update(form.data)
			.eq('id', form.data.id);

		if (supabaseError) {
			return fail(500, { message: supabaseError.message, success: false, form });
		}

		return redirect(302, '/contracts');
	},
	delete: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			return error(401, 'Unauthorized');
		}

		const form = await superValidate(event.request, deleteContractSchema, { id: 'delete' });

		if (!form.valid) {
			return fail(400, { message: 'Invalid form.', success: false, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('contracts_view')
			.delete()
			.eq('id', form.data.id);

		if (supabaseError) {
			return fail(500, { message: supabaseError.message, success: false, form });
		}

		return redirect(302, '/contracts');
	},
};
