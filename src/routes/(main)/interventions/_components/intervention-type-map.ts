import type { InterventionType } from '@/types';
import { Drill, HardHat, Wrench, type Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export const typeMap: Record<InterventionType, { label: string; icon: ComponentType<Icon> }> = {
	new: {
		label: 'New',
		icon: HardHat,
	},
	renovation: {
		label: 'Renovation',
		icon: Drill,
	},
	maintenance: {
		label: 'Maintenance',
		icon: Wrench,
	},
};
