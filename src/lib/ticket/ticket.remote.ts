import { command, form, getRequestEvent, query, requested } from '$app/server';
import { generateRankBetween } from '@/shared/utils';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { z } from 'zod';
import { deleteTicketSchema, ticketSchema } from './schemas';
import { ticketStatusValues, type Ticket } from './types';

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

export const getTicket = query(z.number(), async (id): Promise<Ticket> => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: ticket, error: ticketError } = await supabase
		.from('tickets')
		.select('*, property:properties!inner (id, ...addresses(label:address)), interventions(id)')
		.eq('id', id)
		.single();

	if (ticketError) {
		error(500, 'Error fetching ticket, please try again later.');
	}

	const { interventions, ...rest } = ticket;

	return { ...rest, has_intervention: interventions.length > 0 };
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

export const upsertTicket = form(ticketSchema, async (data) => {
	const {
		locals: { supabase },
		cookies,
	} = getRequestEvent();

	if (data.id) {
		const { id, ...fields } = data;

		const { error: updateError } = await supabase.from('tickets').update(fields).eq('id', id);

		if (updateError) {
			setFlash({ type: 'error', message: updateError.message }, cookies);
			error(500, updateError.message);
		}

		setFlash({ type: 'success', message: 'Ticket updated successfully' }, cookies);
		getTickets().refresh();
		getTicket(id).refresh();
	} else {
		const { data: existing } = await supabase
			.from('tickets')
			.select('rank')
			.eq('status', data.status)
			.order('rank', { ascending: true });

		const bottomRank = existing?.[0]?.rank;
		const rank = generateRankBetween(undefined, bottomRank);

		const { error: insertError } = await supabase.from('tickets').insert({ ...data, rank });

		if (insertError) {
			setFlash({ type: 'error', message: insertError.message }, cookies);
			error(500, insertError.message);
		}

		setFlash({ type: 'success', message: 'Ticket created successfully' }, cookies);
		getTickets().refresh();
	}
});

export const deleteTicket = form(deleteTicketSchema, async ({ id }) => {
	const {
		locals: { supabase },
		cookies,
	} = getRequestEvent();

	const { error: deleteError } = await supabase.from('tickets').delete().eq('id', id);

	if (deleteError) {
		setFlash({ type: 'error', message: deleteError.message }, cookies);
		error(500, deleteError.message);
	}

	setFlash({ type: 'success', message: 'Ticket deleted successfully' }, cookies);
	getTickets().refresh();

	return redirect(302, '/tickets');
});
