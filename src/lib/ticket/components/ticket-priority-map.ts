import type { TicketPriority } from '../types';
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, type Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export const priorityMap: Record<
	TicketPriority,
	{ label: string; icon: ComponentType<Icon>; variant: 'secondary' | 'outline' | 'destructive' }
> = {
	low: {
		label: 'Low',
		icon: ArrowDownIcon,
		variant: 'secondary',
	},
	medium: {
		label: 'Medium',
		icon: ArrowRightIcon,
		variant: 'outline',
	},
	high: {
		label: 'High',
		icon: ArrowUpIcon,
		variant: 'destructive',
	},
};
