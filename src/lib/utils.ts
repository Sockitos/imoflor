/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LendingContract } from '@/types/types';
import type { ActionFailure, LoadEvent, RequestEvent, ServerLoadEvent } from '@sveltejs/kit';
import { clsx, type ClassValue } from 'clsx';
import dayjs from 'dayjs';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { twMerge } from 'tailwind-merge';
import type { ZodTypeAny } from 'zod';

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
	Schema extends ZodTypeAny,
	Params extends Partial<Record<string, string>> = Partial<Record<string, string>>,
	OutputData extends Record<string, any> | void = Record<string, any> | void,
	RouteId extends string | null = string | null,
	RequireAuth extends boolean = true,
> = (
	event: RequestEvent<Params, RouteId>,
	userId: RequireAuth extends true ? string : undefined,
	form: SuperValidated<Infer<Schema>>
) => MaybePromise<OutputData>;

interface HandleFormActionOptions<RequireAuth extends boolean> {
	requireAuth?: RequireAuth;
}

function assertUserId<RequireAuth extends boolean>(
	userId: string | null | undefined,
	requireAuth: RequireAuth
): asserts userId is RequireAuth extends true ? string : undefined {
	if (requireAuth && typeof userId !== 'string') {
		throw new Error('User ID must be a string when authentication is required.');
	}
}

export async function handleFormAction<
	Schema extends ZodTypeAny,
	Params extends Partial<Record<string, string>>,
	OutputData extends Record<string, any> | void,
	RouteId extends string | null,
	RequireAuth extends boolean = true,
>(
	event: RequestEvent<Params, RouteId>,
	schema: Schema,
	formId: string,
	action: FormAction<Schema, Params, OutputData, RouteId, RequireAuth>,
	options?: HandleFormActionOptions<RequireAuth>
): Promise<OutputData | ActionFailure<{ message: string }>> {
	const { requireAuth = true as RequireAuth } = options ?? {};
	let userId: string | undefined = undefined;

	const form = await superValidate(event.request, zod(schema), { id: formId });

	if (requireAuth) {
		const { session, user } = await event.locals.safeGetSession();

		if (!session || !user) {
			setFlash({ type: 'error', message: 'Unauthorized' }, event.cookies);
			return fail(401, { message: 'Unauthorized', form });
		}

		userId = user.id;
	}

	assertUserId(userId, requireAuth);

	if (!form.valid) {
		const errorMessage = 'Invalid form.';
		setFlash({ type: 'error', message: errorMessage }, event.cookies);
		return fail(400, { message: errorMessage, form });
	}

	const result = await action(event, userId, form as SuperValidated<Infer<Schema>>);

	return result;
}

export function calculateInterest(contract: LendingContract, date: string): number {
	const { debt, extra_debt, last_payment_date, interest } = contract.data;

	const daysSinceLastPayment = dayjs(date).diff(last_payment_date ?? contract.start_date, 'day');
	return debt * (interest / 365) * daysSinceLastPayment + extra_debt;
}
