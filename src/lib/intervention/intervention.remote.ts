import { command, getRequestEvent, query, requested } from '$app/server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { interventionStatusValues, type Intervention } from './types';

export const getInterventions = query<Intervention[]>(async () => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: interventions, error: interventionsError } = await supabase
		.from('interventions')
		.select(
			'*, ticket:tickets (id, label:title), property:properties!inner (id, ...addresses(label:address))'
		);

	if (interventionsError) {
		error(500, 'Error fetching interventions, please try again later.');
	}

	return interventions;
});

const updateStatusSchema = z.object({
	id: z.number().min(1, 'ID is required'),
	status: z.enum(interventionStatusValues),
	rank: z.string().min(1, 'Rank is required'),
});

export const updateStatus = command(updateStatusSchema, async (data) => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { error: updateError } = await supabase
		.from('interventions')
		.update({ status: data.status, rank: data.rank })
		.eq('id', data.id);

	if (updateError) {
		error(500, 'Error updating status, please try again later.');
	}

	await requested(getInterventions, 1).refreshAll();
});
