import { signInSchema } from '@/schemas/sign-in';
import { handleFormAction } from '@/utils';
import { fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => {
	return {
		form: await superValidate(zod4(signInSchema), { id: 'sign-in' }),
	};
};

export const actions = {
	default: (event) =>
		handleFormAction(
			event,
			signInSchema,
			'sign-in',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase.auth.signInWithPassword({
					email: form.data.email,
					password: form.data.password,
				});

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return redirect(302, '/');
			},
			{ requireAuth: false }
		),
};
