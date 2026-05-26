/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RouteId as AppRouteId } from '$app/types';
import type { ActionFailure, RequestEvent } from '@sveltejs/kit';
import { type ClassValue, clsx } from 'clsx';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, type Infer, superValidate, type SuperValidated } from 'sveltekit-superforms';
import { zod4, type ZodValidationSchema } from 'sveltekit-superforms/adapters';
import { twMerge } from 'tailwind-merge';
import { BASE_62_DIGITS, generateKeyBetween } from 'fractional-indexing';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;

export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
	ref?: U | null;
};

export function handleLoginRedirect(event: { url: URL }) {
	const redirectTo = event.url.pathname + event.url.search;
	if (!redirectTo || redirectTo === '/') {
		return '/auth/login';
	}

	return `/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`;
}

type MaybePromise<T> = T | Promise<T>;

export type FormAction<
	T extends Record<string, any>,
	Params extends Partial<Record<string, string>> = Partial<Record<string, string>>,
	OutputData extends Record<string, any> | void = Record<string, any> | void,
	RouteId extends AppRouteId = AppRouteId,
	RequireAuth extends boolean = true,
> = (
	event: RequestEvent<Params, RouteId>,
	userId: RequireAuth extends true ? string : undefined,
	form: SuperValidated<T>
) => MaybePromise<OutputData>;

interface HandleFormActionOptions<RequireAuth extends boolean> {
	requireAuth?: RequireAuth;
}

export async function handleFormAction<
	Schema extends ZodValidationSchema,
	Params extends Partial<Record<string, string>> = Partial<Record<string, string>>,
	OutputData extends Record<string, any> | void = Record<string, any> | void,
	RouteId extends AppRouteId = AppRouteId,
	RequireAuth extends boolean = true,
>(
	event: RequestEvent<Params, RouteId>,
	schema: Schema,
	formId: string,
	action: FormAction<Infer<Schema, 'zod4'>, Params, OutputData, RouteId, RequireAuth>,
	options?: HandleFormActionOptions<RequireAuth>
): Promise<
	OutputData | ActionFailure<{ message: string; form: SuperValidated<Infer<Schema, 'zod4'>> }>
> {
	const { requireAuth = true as RequireAuth } = options ?? {};

	const form = await superValidate(event.request, zod4(schema), {
		id: formId,
	});

	if (!form.valid) {
		const errorMessage = 'Invalid form.';
		setFlash({ type: 'error', message: errorMessage }, event.cookies);
		return fail(400, { message: errorMessage, form });
	}

	if (requireAuth) {
		const { data: claimsData, error: claimsError } = await event.locals.supabase.auth.getClaims();
		const claims = claimsError ? null : claimsData?.claims;
		if (!claims) {
			setFlash({ type: 'error', message: 'Unauthorized' }, event.cookies);
			return fail(401, { message: 'Unauthorized', form });
		}

		const result = await action(
			event,
			claims.sub as RequireAuth extends true ? string : undefined,
			form
		);
		return result;
	} else {
		const result = await action(
			event,
			undefined as RequireAuth extends true ? string : undefined,
			form
		);
		return result;
	}
}

export function generateRankBetween(
	upperRank: string | undefined = undefined,
	bottomRank: string | undefined = undefined
): string {
	return generateKeyBetween(upperRank, bottomRank, BASE_62_DIGITS);
}
