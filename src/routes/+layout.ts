import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '@/types/supabase-types';
import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';

export const load = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = isBrowser()
		? createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
				global: {
					fetch,
				},
			})
		: createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
				global: {
					fetch,
				},
				cookies: {
					getAll() {
						return data.cookies;
					},
				},
			});

	/**
	 * `getClaims` validates the JWT signature locally (for asymmetric keys) once
	 * the relevant signing keys are available or cached, and returns the decoded
	 * claims. While an initial or periodic network request may be required to
	 * fetch or refresh keys, this is both faster and safer than `getSession`,
	 * which does not validate the JWT.
	 */
	const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
	const claims = claimsError ? null : claimsData?.claims;

	return { ...data, supabase, claims };
};
