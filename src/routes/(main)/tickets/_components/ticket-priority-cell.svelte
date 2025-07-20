<script lang="ts">
	import type { TicketPriority } from '@/types/types';
	import { priorityMap } from './ticket-priority-map';

	interface Props {
		priority: TicketPriority;
	}

	let { priority }: Props = $props();

	let { label, icon } = $derived(priorityMap[priority]);

	const SvelteComponent = $derived(icon);
</script>

<div class="flex items-center">
	<SvelteComponent class="text-muted-foreground mr-2 h-4 w-4" />
	<span>{label}</span>
</div>
