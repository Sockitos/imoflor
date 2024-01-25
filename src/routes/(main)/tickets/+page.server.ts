import { createTicketSchema, deleteTicketSchema, updateTicketSchema } from '@/schemas/ticket';
import { handleLoginRedirect } from '@/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	const session = await event.locals.getSession();
	if (!session) {
		return redirect(302, handleLoginRedirect(event));
	}

	async function getTickets() {
		const { data: tickets, error: ticketsError } = await event.locals.supabase
			.from('tickets')
			.select('*, property:properties (id, label:address)');

		if (ticketsError) {
			return error(500, 'Error fetching tickets, please try again later.');
		}
		return tickets;
	}

	return {
		tickets: await getTickets(),
		createForm: await superValidate(createTicketSchema, {
			id: 'create',
		}),
		updateForm: await superValidate(updateTicketSchema, {
			id: 'update',
		}),
		deleteForm: await superValidate(deleteTicketSchema, {
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

		const form = await superValidate(event.request, createTicketSchema, { id: 'create' });

		if (!form.valid) {
			return fail(400, { message: 'Invalid form.', success: false, form });
		}

		const { error: supabaseError } = await event.locals.supabase.from('tickets').insert(form.data);

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

		const form = await superValidate(event.request, updateTicketSchema, { id: 'update' });

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

		return redirect(302, '/tickets');
	},
	delete: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			return error(401, 'Unauthorized');
		}

		const form = await superValidate(event.request, deleteTicketSchema, { id: 'delete' });

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

		return redirect(302, '/tickets');
	},
};
