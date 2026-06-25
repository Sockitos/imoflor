import { command, getRequestEvent, query, requested } from '$app/server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { ticketStatusValues, type Ticket } from './types';
import type { IdAndLabel } from '@/shared/types';

export const getTickets = query<Ticket[]>(async () => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: tickets, error: ticketsError } = await supabase
		.from('tickets')
		.select('*, property:properties!inner (id, ...addresses(label:address))');

	if (ticketsError) {
		error(500, 'Error fetching tickets, please try again later.');
	}

	return tickets;
});

const updateStatusSchema = z.object({
	id: z.number().min(1, 'ID is required'),
	status: z.enum(ticketStatusValues),
	rank: z.string().min(1, 'Rank is required'),
});

export const updateStatus = command(updateStatusSchema, async (data) => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { error: updateError } = await supabase
		.from('tickets')
		.update({ status: data.status, rank: data.rank })
		.eq('id', data.id);

	if (updateError) {
		error(500, 'Error updating status, please try again later.');
	}

	await requested(getTickets, 1).refreshAll();
});

export const getTicketOptions = query<IdAndLabel[]>(async () => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: tickets, error: ticketsError } = await supabase
		.from('tickets')
		.select('id, label:title');

	if (ticketsError) {
		error(500, 'Error fetching tickets, please try again later.');
	}

	return tickets;
});
