import dayjs from 'dayjs';
import type { LendingContract } from './types';

export function calculateInterest(contract: LendingContract, date: string | undefined): number {
	const { debt, extra_debt, last_payment_date, interest } = contract.data;

	const daysSinceLastPayment = dayjs(date).diff(last_payment_date ?? contract.start_date, 'day');
	return debt * (interest / 365) * daysSinceLastPayment + extra_debt;
}
