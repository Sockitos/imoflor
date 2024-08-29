<script lang="ts">
	import type { PropertyType } from '@/types/types';
	import { typeMap } from './property-type-map';

	export let type: PropertyType;

	$: ({ label, icon } = typeMap[type]);
</script>

<div class="flex items-center">
	<svelte:component this={icon} class="mr-2 h-4 w-4 text-muted-foreground" />
	<span>{label}</span>
</div>
