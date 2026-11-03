import type { ContractAccountType } from '../../types';
import { FileClock, FileKey, type Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export const typeMap: Record<ContractAccountType, { label: string; icon: ComponentType<Icon> }> = {
	due_note: {
		label: 'Due Note',
		icon: FileClock,
	},
	rent_payment: {
		label: 'Rent Payment',
		icon: FileKey,
	},
	installment_payment: {
		label: 'Installment Payment',
		icon: FileKey,
	},
};
