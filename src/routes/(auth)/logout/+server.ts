import { error, redirect } from '@sveltejs/kit';

export const POST = async (event) => {
	const { error: logoutError } = await event.locals.supabase.auth.signOut();

	if (logoutError) {
		return error(500, 'Error logging you out. Please try again.');
	}

	return redirect(302, '/login');
};
