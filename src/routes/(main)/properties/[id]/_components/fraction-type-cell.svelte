<script lang="ts">
	import type { FractionType } from '@/types/types';
	import { typeMap } from './fraction-type-map';

	export let type: FractionType;

	$: ({ label, icon } = typeMap[type]);
</script>

<div class="flex items-center">
	<svelte:component this={icon} class="mr-2 h-4 w-4 text-muted-foreground" />
	<span>{label}</span>
</div>
