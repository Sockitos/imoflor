import type { IdAndLabel } from '@/shared/types';
import { handleFormAction } from '@/shared/utils';
import { createTicketSchema, deleteTicketSchema } from '@/ticket/schemas';
import type { Ticket } from '@/ticket/types';
import { error, fail } from '@sveltejs/kit';
import { BASE_62_DIGITS, generateKeyBetween } from 'fractional-indexing';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	async function getTickets(): Promise<Ticket[]> {
		const { data: tickets, error: ticketsError } = await event.locals.supabase
			.from('tickets')
			.select('*, property:properties!inner (id, ...addresses(label:address))');

		if (ticketsError) {
			return error(500, 'Error fetching tickets, please try again later.');
		}
		return tickets;
	}

	async function getPropertyOptions(): Promise<IdAndLabel[]> {
		const { data: properties, error: propertiesError } = await event.locals.supabase
			.from('properties')
			.select('id, ...addresses(label:address)');

		if (propertiesError) {
			return error(500, 'Error fetching properties, please try again later.');
		}
		return properties;
	}

	return {
		tickets: await getTickets(),
		propertyOptions: await getPropertyOptions(),
		createTicketForm: await superValidate(zod4(createTicketSchema), {
			id: 'create-ticket',
		}),
		deleteTicketForm: await superValidate(zod4(deleteTicketSchema), {
			id: 'delete-ticket',
		}),
	};
};

export const actions = {
	create: async (event) =>
		handleFormAction(event, createTicketSchema, 'create-ticket', async (event, userId, form) => {
			const { error } = await event.locals.supabase
				.from('tickets')
				// TODO: Need to check this rank generation, it might not be correct
				.insert({ ...form.data, rank: generateKeyBetween(undefined, undefined, BASE_62_DIGITS) });

			if (error) {
				return fail(500, {
					message: error.message,
					success: false,
					form,
				});
			}

			return { success: true, form };
		}),
};
