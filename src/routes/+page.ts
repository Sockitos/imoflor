import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { claims } = await parent();
	if (claims) {
		redirect(302, '/dashboard');
	}

	return redirect(302, '/auth/login');
};
