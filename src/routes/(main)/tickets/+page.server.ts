import { createTicketSchema, deleteTicketSchema } from '@/schemas/ticket';
import type { IdWithLabel, Ticket } from '@/types/types';
import { handleFormAction, handleLoginRedirect } from '@/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleLoginRedirect(event));
	}

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
		createTicketForm: await superValidate(zod(createTicketSchema), {
			id: 'create-ticket',
		}),
		deleteTicketForm: await superValidate(zod(deleteTicketSchema), {
			id: 'delete-ticket',
		}),
	};
};

export const actions = {
	create: async (event) =>
		handleFormAction(event, createTicketSchema, 'create-ticket', async (event, userId, form) => {
			const { error: supabaseError } = await event.locals.supabase
				.from('tickets')
				.insert(form.data);

			if (supabaseError) {
				return fail(500, { message: supabaseError.message, success: false, form });
			}

			return { success: true, form };
		}),
};
