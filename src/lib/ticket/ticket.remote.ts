import { command, form, getRequestEvent, query, requested } from '$app/server';
import { generateRankBetween } from '@/shared/utils';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { z } from 'zod';
import { deleteTicketSchema, ticketSchema } from './schemas';
import { ticketStatusValues, type Ticket, type TicketOption } from './types';

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
		.select('*, property:properties!inner (id, ...addresses(label:address))')
		.eq('id', id)
		.single();

	if (ticketError) {
		error(500, 'Error fetching ticket, please try again later.');
	}

	return ticket;
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

	const { error: transitionError } = await supabase.rpc('transition_ticket', {
		p_ticket_id: data.id,
		p_to_status: data.status,
		p_rank: data.rank,
	});

	if (transitionError) {
		error(500, transitionError.message || 'Error updating status, please try again later.');
	}

	await requested(getTickets, 1).refreshAll();
});

export const upsertTicket = form(ticketSchema, async (data) => {
	const {
		locals: { supabase },
		cookies,
	} = getRequestEvent();

	if (data.id) {
		const { id, status, ...fields } = data;

		const { data: current, error: currentError } = await supabase
			.from('tickets')
			.select('status, rank')
			.eq('id', id)
			.single();

		if (currentError || !current) {
			setFlash({ type: 'error', message: currentError?.message ?? 'Ticket not found' }, cookies);
			error(500, currentError?.message ?? 'Ticket not found');
		}

		const { error: updateError } = await supabase.from('tickets').update(fields).eq('id', id);

		if (updateError) {
			setFlash({ type: 'error', message: updateError.message }, cookies);
			error(500, updateError.message);
		}

		if (status !== current.status) {
			const { error: transitionError } = await supabase.rpc('transition_ticket', {
				p_ticket_id: id,
				p_to_status: status,
				p_rank: current.rank,
			});

			if (transitionError) {
				setFlash({ type: 'error', message: transitionError.message }, cookies);
				error(500, transitionError.message);
			}
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

		const { id: _id, ...insertFields } = data;
		const { error: insertError } = await supabase.from('tickets').insert({ ...insertFields, rank });

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

export const getTicketOptions = query<TicketOption[]>(async () => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: tickets, error: ticketsError } = await supabase.from('tickets').select('id, title');

	if (ticketsError) {
		error(500, 'Error fetching tickets, please try again later.');
	}

	return tickets;
});
