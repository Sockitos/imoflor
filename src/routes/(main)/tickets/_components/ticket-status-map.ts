import type { TicketStatus } from '@/types/types';
import { CheckCircle2, CircleDashed, CircleDot, XCircle, type Icon } from 'lucide-svelte';
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
		icon: CheckCircle2,
	},
	cancelled: {
		label: 'Cancelled',
		icon: XCircle,
	},
};
