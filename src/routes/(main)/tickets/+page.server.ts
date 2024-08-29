import { createTicketSchema, deleteTicketSchema, updateTicketSchema } from '@/schemas/ticket';
import { handleLoginRedirect } from '@/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleLoginRedirect(event));
	}

	async function getTickets() {
		const { data: tickets, error: ticketsError } = await event.locals.supabase
			.from('tickets')
			.select('*, property:properties (id, label:address), fraction:fractions (id, label:address)');

		if (ticketsError) {
			return error(500, 'Error fetching tickets, please try again later.');
		}
		return tickets;
	}

	async function getPropertyOptions() {
		const { data: properties, error: propertiesError } = await event.locals.supabase
			.from('properties')
			.select('id, label:address');

		if (propertiesError) {
			return error(500, 'Error fetching properties, please try again later.');
		}
		return properties;
	}

	async function getFractionOptions() {
		const { data: fractions, error: fractionsError } = await event.locals.supabase
			.from('fractions')
			.select('id, label:address');

		if (fractionsError) {
			return error(500, 'Error fetching fractions, please try again later.');
		}
		return fractions;
	}

	return {
		tickets: await getTickets(),
		propertyOptions: await getPropertyOptions(),
		fractionOptions: await getFractionOptions(),
		createForm: await superValidate(zod(createTicketSchema), {
			id: 'create',
		}),
		updateForm: await superValidate(zod(updateTicketSchema), {
			id: 'update',
		}),
		deleteForm: await superValidate(zod(deleteTicketSchema), {
			id: 'delete',
		}),
	};
};

export const actions = {
	create: async (event) => {
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			return error(401, 'Unauthorized');
		}

		const form = await superValidate(event.request, zod(createTicketSchema), { id: 'create' });

		if (!form.valid) {
			return fail(400, { message: 'Invalid form.', success: false, form });
		}

		const { error: supabaseError } = await event.locals.supabase.from('tickets').insert(form.data);

		if (supabaseError) {
			return fail(500, { message: supabaseError.message, success: false, form });
		}

		return { success: true, form };
	},
	update: async (event) => {
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			return error(401, 'Unauthorized');
		}

		const form = await superValidate(event.request, zod(updateTicketSchema), { id: 'update' });

		if (!form.valid) {
			return fail(400, { message: 'Invalid form.', success: false, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('tickets')
			.update(form.data)
			.eq('id', form.data.id);

		if (supabaseError) {
			return fail(500, { message: supabaseError.message, success: false, form });
		}

		return { success: true, form };
	},
	delete: async (event) => {
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			return error(401, 'Unauthorized');
		}

		const form = await superValidate(event.request, zod(deleteTicketSchema), { id: 'delete' });

		if (!form.valid) {
			return fail(400, { message: 'Invalid form.', success: false, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('tickets')
			.delete()
			.eq('id', form.data.id);

		if (supabaseError) {
			return fail(500, { message: supabaseError.message, success: false, form });
		}

		return { success: true, form };
	},
};
