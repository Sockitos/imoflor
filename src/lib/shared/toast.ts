import { isHttpError, isRedirect } from '@sveltejs/kit';
import { toast } from 'svelte-sonner';

const fallbackMessage = 'Something went wrong. Please try again.';

export function toastError(error: unknown, fallback = fallbackMessage) {
	if (isRedirect(error)) throw error;
	toast.error(messageFrom(error, fallback));
}

export async function submitWithToast(
	submit: () => Promise<boolean | void>,
	successMessage?: string
) {
	try {
		const ok = await submit();
		if (!ok) return false;
		if (successMessage) toast.success(successMessage);
		return true;
	} catch (error) {
		if (isRedirect(error)) throw error;
		toastError(error);
		return false;
	}
}

function messageFrom(error: unknown, fallback: string) {
	if (isHttpError(error)) {
		const body = error.body;
		if (typeof body === 'string' && body) return body;
		if (
			body &&
			typeof body === 'object' &&
			'message' in body &&
			typeof body.message === 'string' &&
			body.message
		) {
			return body.message;
		}
	}

	if (error instanceof Error && error.message) return error.message;
	return fallback;
}
