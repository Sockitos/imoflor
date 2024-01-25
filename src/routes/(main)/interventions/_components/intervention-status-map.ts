import type { InterventionStatus } from '@/types';
import { CheckCircle2, CircleDashed, CircleDot, XCircle, type Icon } from 'lucide-svelte';
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
	finished: {
		label: 'Finished',
		icon: CheckCircle2,
	},
	cancelled: {
		label: 'Cancelled',
		icon: XCircle,
	},
};
