import { error, redirect } from '@sveltejs/kit';

export const POST = async ({ locals }) => {
	const { error: logoutError } = await locals.supabase.auth.signOut();

	if (logoutError) {
		const errorMessage = 'Error logging you out. Please try again.';
		return error(500, { message: errorMessage });
	}

	return redirect(302, '/auth/login');
};
