import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	redirect(302, `/properties/${event.params.id}`);
};
