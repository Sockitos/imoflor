import {
	createInterventionSchema,
	deleteInterventionSchema,
	updateInterventionSchema,
} from '@/schemas/intervention';
import { handleLoginRedirect } from '@/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	const session = await event.locals.getSession();
	if (!session) {
		return redirect(302, handleLoginRedirect(event));
	}

	async function getInterventions() {
		const { data: interventions, error: interventionsError } = await event.locals.supabase
			.from('interventions')
			.select(
				'*, ticket:tickets (id, label:title), property:properties (id, label:address), fraction:fractions_view (id, label:address)'
			);

		if (interventionsError) {
			console.log(interventionsError);
			return error(500, 'Error fetching interventions, please try again later.');
		}
		return interventions;
	}

	return {
		interventions: await getInterventions(),
		createForm: await superValidate(createInterventionSchema, {
			id: 'create',
		}),
		updateForm: await superValidate(updateInterventionSchema, {
			id: 'update',
		}),
		deleteForm: await superValidate(deleteInterventionSchema, {
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

		const form = await superValidate(event.request, createInterventionSchema, { id: 'create' });

		if (!form.valid) {
			return fail(400, { message: 'Invalid form.', success: false, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('interventions')
			.insert(form.data);

		if (supabaseError) {
			return fail(500, { message: supabaseError.message, success: false, form });
		}

		return redirect(302, '/tenants');
	},
	update: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			return error(401, 'Unauthorized');
		}

		const form = await superValidate(event.request, updateInterventionSchema, { id: 'update' });

		if (!form.valid) {
			return fail(400, { message: 'Invalid form.', success: false, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('interventions')
			.update(form.data)
			.eq('id', form.data.id);

		if (supabaseError) {
			return fail(500, { message: supabaseError.message, success: false, form });
		}

		return redirect(302, '/interventions');
	},
	delete: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			return error(401, 'Unauthorized');
		}

		const form = await superValidate(event.request, deleteInterventionSchema, { id: 'delete' });

		if (!form.valid) {
			return fail(400, { message: 'Invalid form.', success: false, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('interventions')
			.delete()
			.eq('id', form.data.id);

		if (supabaseError) {
			return fail(500, { message: supabaseError.message, success: false, form });
		}

		return redirect(302, '/interventions');
	},
};
