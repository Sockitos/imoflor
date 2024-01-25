import type { ContractType } from '@/types';
import { FileClock, FileKey2, type Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export const typeMap: Record<ContractType, { label: string; icon: ComponentType<Icon> }> = {
	renting: {
		label: 'Renting',
		icon: FileClock,
	},
	lending: {
		label: 'Leasing',
		icon: FileKey2,
	},
};
