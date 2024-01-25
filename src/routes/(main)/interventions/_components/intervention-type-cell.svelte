<script lang="ts">
	import type { InterventionType } from '@/types';
	import { typeMap } from './intervention-type-map';

	export let type: InterventionType;

	$: ({ label, icon } = typeMap[type]);
</script>

<div class="flex items-center">
	<svelte:component this={icon} class="mr-2 h-4 w-4 text-muted-foreground" />
	<span>{label}</span>
</div>
