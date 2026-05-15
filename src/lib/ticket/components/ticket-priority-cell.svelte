<script lang="ts">
	import type { TicketPriority } from '../types';
	import { priorityMap } from './ticket-priority-map';

	interface Props {
		priority: TicketPriority;
	}

	let { priority }: Props = $props();

	let { label, icon } = $derived(priorityMap[priority]);

	const SvelteComponent = $derived(icon);
</script>

<div class="flex items-center">
	<SvelteComponent class="mr-2 h-4 w-4 text-muted-foreground" />
	<span>{label}</span>
</div>
