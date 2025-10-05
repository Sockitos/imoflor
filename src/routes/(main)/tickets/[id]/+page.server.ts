import { createTicketSchema, deleteTicketSchema } from '@/schemas/ticket';
import type { IdWithLabel, Ticket } from '@/types/types';
import { handleFormAction } from '@/utils';
import { error, redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

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
			.eq('id', Number(event.params.id))
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
		updateTicketForm: await superValidate(ticket, zod4(createTicketSchema), {
			id: 'update-ticket',
		}),
		deleteTicketForm: await superValidate(zod4(deleteTicketSchema), {
			id: 'delete-ticket',
		}),
	};
};

export const actions = {
	update: async (event) =>
		handleFormAction(event, createTicketSchema, 'update-ticket', async (event, userId, form) => {
			const { error } = await event.locals.supabase
				.from('tickets')
				.update(form.data)
				.eq('id', Number(event.params.id));

			if (error) {
				return fail(500, { message: error.message, form });
			}

			return { success: true, form };
		}),
	delete: async (event) =>
		handleFormAction(event, deleteTicketSchema, 'delete-ticket', async (event, userId, form) => {
			const { error } = await event.locals.supabase.from('tickets').delete().eq('id', form.data.id);

			if (error) {
				return fail(500, { message: error.message, form });
			}

			return redirect(302, '/tickets');
		}),
};
