import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const POST = async ({ cookies, locals }) => {
	const { error: logoutError } = await locals.supabase.auth.signOut();

	if (logoutError) {
		const errorMessage = 'Error logging you out. Please try again.';
		setFlash({ type: 'error', message: errorMessage }, cookies);
		return error(500, { message: errorMessage });
	}

	return redirect(302, '/login');
};
