import type { MovementType } from '@/types/types';
import { ReceiptText, type Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export const typeMap: Record<MovementType, { label: string; icon: ComponentType<Icon> }> = {
	rent: {
		label: 'Rent',
		icon: ReceiptText,
	},
	installment_amortization: {
		label: 'Installment Amortization',
		icon: ReceiptText,
	},
	installment_interest: {
		label: 'Installment Interest',
		icon: ReceiptText,
	},
	installment_extra_amortization: {
		label: 'Installment Extra Amortization',
		icon: ReceiptText,
	},
	intervention: {
		label: 'Intervention',
		icon: ReceiptText,
	},
	other: {
		label: 'Other',
		icon: ReceiptText,
	},
};
