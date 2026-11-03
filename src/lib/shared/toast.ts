import { isHttpError, isRedirect } from '@sveltejs/kit';
import { toast } from 'svelte-sonner';

const fallbackMessage = 'Something went wrong. Please try again.';

export function toastSuccess(message: string) {
	toast.success(message);
}

export function toastError(error: unknown, fallback = fallbackMessage) {
	if (isRedirect(error)) throw error;
	toast.error(messageFrom(error, fallback));
}

function messageFrom(error: unknown, fallback: string) {
	if (isHttpError(error)) {
		const message = messageFromBody(error.body);
		if (message) return message;
	}

	if (error instanceof Error && error.message) return error.message;
	return fallback;
}

function messageFromBody(body: unknown) {
	if (typeof body === 'string') return body || undefined;
	if (isRecord(body) && typeof body.message === 'string') return body.message || undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object';
}
