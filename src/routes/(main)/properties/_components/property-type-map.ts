import type { PropertyType } from '@/types/types';
import { Building2, Home, LandPlot, Warehouse, type Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export const typeMap: Record<PropertyType, { label: string; icon: ComponentType<Icon> }> = {
	building: {
		label: 'Building',
		icon: Building2,
	},
	terrain: {
		label: 'Terrain',
		icon: LandPlot,
	},
	house: {
		label: 'House',
		icon: Home,
	},
	garages: {
		label: 'Garages',
		icon: Warehouse,
	},
};
