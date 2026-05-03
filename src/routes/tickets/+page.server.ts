import { createTicketSchema, deleteTicketSchema } from '@/schemas/ticket';
import type { IdWithLabel, Ticket } from '@/types/types';
import { handleFormAction } from '@/utils';
import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	async function getTickets(): Promise<Ticket[]> {
		const { data: tickets, error: ticketsError } = await event.locals.supabase
			.from('tickets')
			.select(
				'*, property:properties!inner (id, label:address), fraction:fractions!inner (id, label:address)'
			);

		if (ticketsError) {
			return error(500, 'Error fetching tickets, please try again later.');
		}
		return tickets;
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

	return {
		tickets: await getTickets(),
		propertyOptions: await getPropertyOptions(),
		fractionOptions: await getFractionOptions(),
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
			const { error } = await event.locals.supabase.from('tickets').insert(form.data);

			if (error) {
				return fail(500, { message: error.message, success: false, form });
			}

			return { success: true, form };
		}),
};
