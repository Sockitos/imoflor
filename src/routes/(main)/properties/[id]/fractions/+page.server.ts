import { createFractionSchema } from '@/schemas/fraction';
import { handleFormAction } from '@/utils';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail } from 'sveltekit-superforms';

export const actions = {
	create: async (event) =>
		handleFormAction(
			event,
			createFractionSchema,
			'create-fraction',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase.from('fractions').insert({
					property_id: Number(event.params.id),
					...form.data,
				});

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return { success: true, form };
			}
		),
};
