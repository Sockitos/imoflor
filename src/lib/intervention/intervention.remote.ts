import { command, form, getRequestEvent, query, requested } from '$app/server';
import { generateRankBetween } from '@/shared/utils';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
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

	const { error: updateError } = await supabase
		.from('interventions')
		.update({ status: data.status, rank: data.rank })
		.eq('id', data.id);

	if (updateError) {
		error(500, 'Error updating status, please try again later.');
	}

	await requested(getInterventions, 1).refreshAll();
});

export const upsertIntervention = form(interventionSchema, async (data) => {
	const {
		locals: { supabase },
		cookies,
	} = getRequestEvent();

	if (data.id) {
		const { id, ...fields } = data;

		const { error: updateError } = await supabase
			.from('interventions')
			.update(fields)
			.eq('id', id);

		if (updateError) {
			setFlash({ type: 'error', message: updateError.message }, cookies);
			error(500, updateError.message);
		}

		setFlash({ type: 'success', message: 'Intervention updated successfully' }, cookies);
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

		const { error: insertError } = await supabase
			.from('interventions')
			.insert({ ...data, rank });

		if (insertError) {
			setFlash({ type: 'error', message: insertError.message }, cookies);
			error(500, insertError.message);
		}

		setFlash({ type: 'success', message: 'Intervention created successfully' }, cookies);
		getInterventions().refresh();
	}
});

export const deleteIntervention = form(deleteInterventionSchema, async ({ id }) => {
	const {
		locals: { supabase },
		cookies,
	} = getRequestEvent();

	const { error: deleteError } = await supabase.from('interventions').delete().eq('id', id);

	if (deleteError) {
		setFlash({ type: 'error', message: deleteError.message }, cookies);
		error(500, deleteError.message);
	}

	setFlash({ type: 'success', message: 'Intervention deleted successfully' }, cookies);
	getInterventions().refresh();

	return redirect(302, '/interventions');
});
