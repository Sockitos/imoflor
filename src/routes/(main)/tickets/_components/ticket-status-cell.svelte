<script lang="ts">
	import type { TicketStatus } from '@/types/types';
	import { statusMap } from './ticket-status-map';

	export let status: TicketStatus;

	$: ({ label, icon } = statusMap[status]);
</script>

<div class="flex items-center">
	<svelte:component this={icon} class="mr-2 h-4 w-4 text-muted-foreground" />
	<span>{label}</span>
</div>
