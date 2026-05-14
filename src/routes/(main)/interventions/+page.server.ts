import { createInterventionSchema, deleteInterventionSchema } from '@intervention/schemas';
import type { Intervention } from '@intervention/types';
import type { IdAndLabel } from '@shared/types';
import { handleFormAction } from '@shared/utils';
import { error, fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	async function getInterventions(): Promise<Intervention[]> {
		const { data: interventions, error: interventionsError } = await event.locals.supabase
			.from('interventions')
			.select(
				'*, ticket:tickets!inner (id, label:title), property:properties!inner (id, ...addresses(label:address))'
			);

		if (interventionsError) {
			return error(500, 'Error fetching interventions, please try again later.');
		}
		return interventions;
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

	async function getTicketOptions(): Promise<IdAndLabel[]> {
		const { data: tickets, error: ticketsError } = await event.locals.supabase
			.from('tickets')
			.select('id, label:title');

		if (ticketsError) {
			return error(500, 'Error fetching tickets, please try again later.');
		}
		return tickets;
	}

	return {
		interventions: await getInterventions(),
		propertyOptions: await getPropertyOptions(),
		ticketOptions: await getTicketOptions(),
		createInterventionForm: await superValidate(zod4(createInterventionSchema), {
			id: 'create-intervention',
		}),
		deleteInterventionForm: await superValidate(zod4(deleteInterventionSchema), {
			id: 'delete-intervention',
		}),
	};
};

export const actions = {
	create: async (event) =>
		handleFormAction(
			event,
			createInterventionSchema,
			'create-intervention',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase.from('interventions').insert(form.data);

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return { success: true, form };
			}
		),
};
