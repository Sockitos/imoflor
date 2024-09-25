import type { ContractAccountType } from '@/types/types';
import { FileClock, FileKey2, type Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export const typeMap: Record<ContractAccountType, { label: string; icon: ComponentType<Icon> }> = {
	due_note: {
		label: 'Due Note',
		icon: FileClock,
	},
	rent_payment: {
		label: 'Payment',
		icon: FileKey2,
	},
	installment_payment: {
		label: 'Payment',
		icon: FileKey2,
	},
};