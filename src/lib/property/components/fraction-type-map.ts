import { Building2, type Icon, Store, Warehouse } from 'lucide-svelte';
import type { ComponentType } from 'svelte';
import type { FractionType } from '../types';

export const typeMap: Record<FractionType, { label: string; icon: ComponentType<Icon> }> = {
	apartment: {
		label: 'Apartment',
		icon: Building2,
	},
	store: {
		label: 'Store',
		icon: Store,
	},
	garage: {
		label: 'Garage',
		icon: Warehouse,
	},
};
