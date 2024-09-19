import type { Profile } from '@/types/types';
import { error } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, safeGetSession }, cookies }) => {
	const { session, user } = await safeGetSession();

	async function getProfile(userId: string): Promise<Profile> {
		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', userId)
			.single();

		if (profileError) {
			console.log('Error fetching profile:', profileError.message);
			return error(500, 'Error fetching profile, please try again later.');
		}

		if (profile.image) {
			profile.image = supabase.storage.from('profiles').getPublicUrl(profile.image).data.publicUrl;
		}

		return profile;
	}

	return {
		session,
		user,
		profile: user ? await getProfile(user.id) : null,
		cookies: cookies.getAll(),
	};
};
