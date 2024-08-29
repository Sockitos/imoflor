import type { FractionType } from '@/types/types';
import { Building2, Home, LandPlot, Store, Warehouse, type Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';

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
	house: {
		label: 'House',
		icon: Home,
	},
	terrain: {
		label: 'Terrain',
		icon: LandPlot,
	},
};
