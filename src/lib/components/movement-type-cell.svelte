<script lang="ts">
	import type { MovementType } from '@/types/types';
	import { typeMap } from './movement-type-map';

	export let type: MovementType;

	$: ({ label, icon } = typeMap[type]);
</script>

<div class="flex items-center">
	<svelte:component this={icon} class="mr-2 h-4 w-4 text-muted-foreground" />
	<span>{label}</span>
</div>
