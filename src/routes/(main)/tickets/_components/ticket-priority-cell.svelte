<script lang="ts">
	import type { TicketPriority } from '@/types/types';
	import { priorityMap } from './ticket-priority-map';

	export let priority: TicketPriority;

	$: ({ label, icon } = priorityMap[priority]);
</script>

<div class="flex items-center">
	<svelte:component this={icon} class="mr-2 h-4 w-4 text-muted-foreground" />
	<span>{label}</span>
</div>
