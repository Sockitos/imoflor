import {
	PUBLIC_SUPABASE_PUBLISHABLE_KEY,
	PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import type { Database } from "@/types/supabase-types";
import { createServerClient } from "@supabase/ssr";
import { type Handle, redirect } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_PUBLISHABLE_KEY,
		{
			cookies: {
				getAll() {
					return event.cookies.getAll();
				},
				setAll(cookiesToSet, headers) {
					/**
					 * Note: You have to add the `path` variable to the
					 * set and remove method due to sveltekit's cookie API
					 * requiring this to be set, setting the path to an empty string
					 * will replicate previous/standard behavior (https://kit.svelte.dev/docs/types#public-types-cookies)
					 */
					cookiesToSet.forEach(({ name, value, options }) =>
						event.cookies.set(name, value, { ...options, path: "/" })
					);
					if (Object.keys(headers).length > 0) {
						event.setHeaders(headers);
					}
				},
			},
		},
	);

	const { data: claimsData, error: claimsError } = await event.locals.supabase
		.auth.getClaims();
	const claims = claimsError ? null : claimsData?.claims;

	if (!claims) {
		const redirectTo = event.url.pathname + event.url.search;
		return redirect(302, `/auth/login?redirectTo=${redirectTo}`);
	}

	if (event.url.pathname === "/auth/login") {
		return redirect(302, "/dashboard");
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === "content-range" || name === "x-supabase-api-version";
		},
	});
};
