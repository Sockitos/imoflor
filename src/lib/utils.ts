/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RouteId as AppRouteId } from '$app/types';
import type { LendingContract } from '@/types/types';
import type { ActionFailure, LoadEvent, RequestEvent, ServerLoadEvent } from '@sveltejs/kit';
import { clsx, type ClassValue } from 'clsx';
import dayjs from 'dayjs';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { zod4, type ZodValidationSchema } from 'sveltekit-superforms/adapters';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;

export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function handleLoginRedirect(event: LoadEvent | ServerLoadEvent) {
	const redirectTo = event.url.pathname + event.url.search;
	return `/login?redirectTo=${redirectTo}`;
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
		const { session, user } = await event.locals.safeGetSession();
		if (!session || !user) {
			setFlash({ type: 'error', message: 'Unauthorized' }, event.cookies);
			return fail(401, { message: 'Unauthorized', form });
		}

		const result = await action(
			event,
			user.id as RequireAuth extends true ? string : undefined,
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

export function calculateInterest(contract: LendingContract, date: string): number {
	const { debt, extra_debt, last_payment_date, interest } = contract.data;

	const daysSinceLastPayment = dayjs(date).diff(last_payment_date ?? contract.start_date, 'day');
	return debt * (interest / 365) * daysSinceLastPayment + extra_debt;
}
