import { createTicketSchema, deleteTicketSchema } from '@/schemas/ticket';
import type { IdWithLabel, Ticket } from '@/types/types';
import { error } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return error(401, 'Unauthorized');
	}

	async function getTicket(): Promise<Ticket> {
		const { data: ticket, error: ticketError } = await event.locals.supabase
			.from('tickets')
			.select(
				'*, property:properties!inner (id, label:address), fraction:fractions!inner (id, label:address)'
			)
			.eq('id', event.params.id)
			.single();

		if (ticketError) {
			return error(500, 'Error fetching ticket, please try again later.');
		}
		return ticket;
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

	const ticket = await getTicket();

	return {
		ticket: ticket,
		propertyOptions: await getPropertyOptions(),
		fractionOptions: await getFractionOptions(),
		updateForm: await superValidate(ticket, zod(createTicketSchema), {
			id: 'update',
		}),
		deleteForm: await superValidate(zod(deleteTicketSchema), {
			id: 'delete',
		}),
	};
};

export const actions = {
	update: async (event) => {
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			return error(401, 'Unauthorized');
		}

		const form = await superValidate(event.request, zod(createTicketSchema), { id: 'update' });

		if (!form.valid) {
			return fail(400, { message: 'Invalid form.', success: false, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('tickets')
			.update(form.data)
			.eq('id', event.params.id);

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
