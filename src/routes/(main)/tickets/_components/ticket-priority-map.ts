import type { TicketPriority } from '@/types';
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, type Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export const priorityMap: Record<TicketPriority, { label: string; icon: ComponentType<Icon> }> = {
	low: {
		label: 'Low',
		icon: ArrowDownIcon,
	},
	medium: {
		label: 'Medium',
		icon: ArrowRightIcon,
	},
	high: {
		label: 'High',
		icon: ArrowUpIcon,
	},
};
