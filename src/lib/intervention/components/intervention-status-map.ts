import type { InterventionStatus } from '../types';
import { CircleCheck, CircleDashed, CircleDot, CircleX, type Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export const statusMap: Record<InterventionStatus, { label: string; icon: ComponentType<Icon> }> = {
	not_started: {
		label: 'Not Started',
		icon: CircleDashed,
	},
	in_progress: {
		label: 'In Progress',
		icon: CircleDot,
	},
	completed: {
		label: 'Completed',
		icon: CircleCheck,
	},
	cancelled: {
		label: 'Cancelled',
		icon: CircleX,
	},
};
