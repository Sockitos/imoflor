import { command, getRequestEvent, query } from '$app/server';
import { error, } from '@sveltejs/kit';
import { z } from 'zod';
import { ticketStatusValues, type Ticket } from './types';


export const getTickets = query<Ticket[]>(async () => {
    const {
		locals: { supabase },
    } = getRequestEvent();
    
    const { data: tickets, error: ticketsError } = await supabase
			.from('tickets')
			.select('*, property:properties!inner (id, ...addresses(label:address))');

		if (ticketsError) {
			return error(500, 'Error fetching tickets, please try again later.');
    }
    
		return tickets;
});

const updateStatusSchema = z.object({
	id: z.number().min(1, 'ID is required'),
	status: z.enum(ticketStatusValues),
});

export const updateStatus = command(updateStatusSchema, async (data) => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { error: updateError } = await supabase
		.from('tickets')
		.update(data)
		.eq('id', data.id)
		.select();

	if (updateError) {
		return error(500, 'Error updating status, please try again later.');
	}

});