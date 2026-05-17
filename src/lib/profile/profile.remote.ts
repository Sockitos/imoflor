import { getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';

export const getProfile = query(async () => {
	const supabase = getRequestEvent().locals.supabase;
	const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
	const claims = claimsError ? null : claimsData?.claims;
	if (!claims) {
		return error(401, 'Unauthorized');
	}

	const { data: profileData, error: profileError } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', claims.sub)
		.single();
	if (profileError) {
		console.error(profileError);
		return error(500, 'Error fetching profile, please try again later.');
	}

	return profileData;
});
