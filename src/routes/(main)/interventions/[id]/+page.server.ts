import { createInterventionSchema, deleteInterventionSchema } from '@/schemas/intervention';
import type { IdWithLabel, Intervention } from '@/types/types';
import { handleFormAction } from '@/utils';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return error(401, 'Unauthorized');
	}

	async function getIntervention(): Promise<Intervention> {
		const { data: interventions, error: interventionsError } = await event.locals.supabase
			.from('interventions')
			.select(
				'*, ticket:tickets!inner (id, label:title), property:properties!inner (id, label:address), fraction:fractions_view!inner (id, label:address)'
			)
			.eq('id', event.params.id)
			.single();

		if (interventionsError) {
			return error(500, 'Error fetching interventions, please try again later.');
		}
		return interventions;
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

	async function getTicketOptions(): Promise<IdWithLabel[]> {
		const { data: tickets, error: ticketsError } = await event.locals.supabase
			.from('tickets')
			.select('id, label:title');

		if (ticketsError) {
			return error(500, 'Error fetching tickets, please try again later.');
		}
		return tickets;
	}

	const intervention = await getIntervention();

	return {
		intervention: intervention,
		propertyOptions: await getPropertyOptions(),
		fractionOptions: await getFractionOptions(),
		ticketOptions: await getTicketOptions(),
		updateInterventionForm: await superValidate(intervention, zod(createInterventionSchema), {
			id: 'update-intervention',
		}),
		deleteInterventionForm: await superValidate(zod(deleteInterventionSchema), {
			id: 'delete-intervention',
		}),
	};
};

export const actions = {
	update: async (event) =>
		handleFormAction(
			event,
			createInterventionSchema,
			'update-intervention',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase
					.from('interventions')
					.update(form.data)
					.eq('id', event.params.id);

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return { success: true, form };
			}
		),
	delete: async (event) =>
		handleFormAction(
			event,
			deleteInterventionSchema,
			'delete-intervention',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase
					.from('interventions')
					.delete()
					.eq('id', form.data.id);

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return { success: true, form };
			}
		),
};
