<script lang="ts">
	import type { InterventionStatus } from '@/types';
	import { statusMap } from './intervention-status-map';

	export let status: InterventionStatus;

	$: ({ label, icon } = statusMap[status]);
</script>

<div class="flex items-center">
	<svelte:component this={icon} class="mr-2 h-4 w-4 text-muted-foreground" />
	<span>{label}</span>
</div>
