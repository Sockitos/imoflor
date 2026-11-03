import { command, form, getRequestEvent, query, requested } from '$app/server';
import { generateRankBetween } from '@/shared/utils';
import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { deleteInterventionSchema, interventionSchema } from './schemas';
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

export const getIntervention = query(z.number(), async (id): Promise<Intervention> => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: intervention, error: interventionError } = await supabase
		.from('interventions')
		.select(
			'*, ticket:tickets (id, label:title), property:properties!inner (id, ...addresses(label:address))'
		)
		.eq('id', id)
		.single();

	if (interventionError) {
		error(500, 'Error fetching intervention, please try again later.');
	}

	return intervention;
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

	const { error: transitionError } = await supabase.rpc('transition_intervention', {
		p_intervention_id: data.id,
		p_to_status: data.status,
		p_rank: data.rank,
	});

	if (transitionError) {
		error(500, transitionError.message || 'Error updating status, please try again later.');
	}

	await requested(getInterventions, 1).refreshAll();
});

export const upsertIntervention = form(interventionSchema, async (data) => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	if (data.id) {
		const { id, status, ...fields } = data;

		const { data: current, error: currentError } = await supabase
			.from('interventions')
			.select('status, rank')
			.eq('id', id)
			.single();

		if (currentError || !current) {
			error(500, currentError?.message ?? 'Intervention not found');
		}

		const { error: updateError } = await supabase.from('interventions').update(fields).eq('id', id);

		if (updateError) {
			error(500, updateError.message);
		}

		if (status !== current.status) {
			const { error: transitionError } = await supabase.rpc('transition_intervention', {
				p_intervention_id: id,
				p_to_status: status,
				p_rank: current.rank,
			});

			if (transitionError) {
				error(500, transitionError.message);
			}
		}

		getInterventions().refresh();
		getIntervention(id).refresh();
	} else {
		const { data: existing } = await supabase
			.from('interventions')
			.select('rank')
			.eq('status', data.status)
			.order('rank', { ascending: true });

		const bottomRank = existing?.[0]?.rank;
		const rank = generateRankBetween(undefined, bottomRank);

		const { id: _id, ...insertFields } = data;
		const { error: insertError } = await supabase
			.from('interventions')
			.insert({ ...insertFields, rank });

		if (insertError) {
			error(500, insertError.message);
		}

		getInterventions().refresh();
	}
});

export const deleteIntervention = form(deleteInterventionSchema, async ({ id }) => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { error: deleteError } = await supabase.from('interventions').delete().eq('id', id);

	if (deleteError) {
		error(500, deleteError.message);
	}

	getInterventions().refresh();

	return redirect(302, '/interventions');
});
