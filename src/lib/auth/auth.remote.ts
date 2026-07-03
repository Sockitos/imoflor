import { form, getRequestEvent } from '$app/server';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { signInSchema } from './schemas';

export const signIn = form(signInSchema, async ({ email, password }) => {
	const {
		cookies,
		locals: { supabase },
		url,
	} = getRequestEvent();

	const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

	if (signInError) {
		setFlash({ type: 'error', message: signInError.message }, cookies);
		error(500, signInError.message);
	}

	return redirect(302, url.searchParams.get('redirectTo') ?? '/dashboard');
});
