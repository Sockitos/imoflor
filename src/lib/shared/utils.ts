/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	CalendarDate,
	DateFormatter,
	getLocalTimeZone,
	parseAbsolute,
	parseDate,
	type DateValue,
} from '@internationalized/date';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { generateKeyBetween } from 'fractional-indexing';

/** Format a calendar value as Postgres `date` (YYYY-MM-DD). */
export function toPlainDateString(
	value: { year: number; month: number; day: number } | null | undefined
): string | undefined {
	if (!value) return undefined;
	return `${value.year}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`;
}

/** Parse a Postgres `date` or ISO timestamp into a CalendarDate. */
export function parsePlainDate(value: string | null | undefined): CalendarDate | undefined {
	if (!value) return undefined;
	return parseDate(value.slice(0, 10));
}

/** Parse an ISO timestamp into a zoned date in the local timezone. */
export function parseTimestamp(value: string | null | undefined) {
	if (!value) return undefined;
	return parseAbsolute(value, getLocalTimeZone());
}

const longDate = new DateFormatter('en-US', { dateStyle: 'long' });

/** Format a calendar date or zoned timestamp for a date-picker button. */
export function dateLabel(value: DateValue | null | undefined) {
	return value ? longDate.format(value.toDate(getLocalTimeZone())) : 'Pick a date';
}

export function isInvalid(issues?: readonly { message?: string }[] | null) {
	return (issues?.length ?? 0) > 0;
}

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

export function generateRankBetween(
	upperRank: string | undefined = undefined,
	bottomRank: string | undefined = undefined
): string {
	return generateKeyBetween(upperRank, bottomRank);
}
