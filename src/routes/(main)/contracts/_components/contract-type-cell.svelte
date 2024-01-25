<script lang="ts">
	import type { ContractType } from '@/types';
	import { typeMap } from './contract-type-map';

	export let type: ContractType;

	$: ({ label, icon } = typeMap[type]);
</script>

<div class="flex items-center">
	<svelte:component this={icon} class="mr-2 h-4 w-4 text-muted-foreground" />
	<span>{label}</span>
</div>
