import {
	createInterventionSchema,
	deleteInterventionSchema,
	updateInterventionSchema,
} from '@/schemas/intervention';
import type { IdWithLabel, Intervention } from '@/types/types';
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

	async function getInterventions(): Promise<Intervention[]> {
		const { data: interventions, error: interventionsError } = await event.locals.supabase
			.from('interventions')
			.select(
				'*, ticket:tickets!inner (id, label:title), property:properties!inner (id, label:address), fraction:fractions_view!inner (id, label:address)'
			);

		if (interventionsError) {
			return error(500, 'Error fetching interventions, please try again later.');
		}
		return interventions;
	}

	async function getPropertyOptions(): Promise<IdWithLabel[]> {
		const { data: properties, error: propertiesError } = await event.locals.supabase
			.from('properties')
			.select('id, label:address');

		if (propertiesError) {
			return error(500, 'Error fetching properties, please try again later.');
		}
		return properties;
	}

	async function getFractionOptions(): Promise<IdWithLabel[]> {
		const { data: fractions, error: fractionsError } = await event.locals.supabase
			.from('fractions')
			.select('id, label:address');

		if (fractionsError) {
			return error(500, 'Error fetching fractions, please try again later.');
		}
		return fractions;
	}

	async function getTicketOptions(): Promise<IdWithLabel[]> {
		const { data: tickets, error: ticketsError } = await event.locals.supabase
			.from('tickets')
			.select('id, label:title');

		if (ticketsError) {
			return error(500, 'Error fetching tickets, please try again later.');
		}
		return tickets;
	}

	return {
		interventions: await getInterventions(),
		propertyOptions: await getPropertyOptions(),
		fractionOptions: await getFractionOptions(),
		ticketOptions: await getTicketOptions(),
		createForm: await superValidate(zod(createInterventionSchema), {
			id: 'create',
		}),
		updateForm: await superValidate(zod(updateInterventionSchema), {
			id: 'update',
		}),
		deleteForm: await superValidate(zod(deleteInterventionSchema), {
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

		const form = await superValidate(event.request, zod(createInterventionSchema), {
			id: 'create',
		});

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('interventions')
			.insert(form.data);

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

		const form = await superValidate(event.request, zod(updateInterventionSchema), {
			id: 'update',
		});

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('interventions')
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

		const form = await superValidate(event.request, zod(deleteInterventionSchema), {
			id: 'delete',
		});

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('interventions')
			.delete()
			.eq('id', form.data.id);

		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		return { success: true, form };
	},
};
