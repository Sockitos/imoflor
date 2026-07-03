import type { TicketStatus } from '../types';
import { CircleCheck, CircleDashed, CircleDot, CircleX, type Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export const statusMap: Record<TicketStatus, { label: string; icon: ComponentType<Icon> }> = {
	open: {
		label: 'Open',
		icon: CircleDashed,
	},
	in_progress: {
		label: 'In Progress',
		icon: CircleDot,
	},
	resolved: {
		label: 'Resolved',
		icon: CircleCheck,
	},
	cancelled: {
		label: 'Cancelled',
		icon: CircleX,
	},
};
