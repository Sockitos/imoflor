<script lang="ts">
	import type { ContractAccountType } from '@/types/types';
	import { typeMap } from './contract-account-type-map';

	export let type: ContractAccountType;

	$: ({ label, icon } = typeMap[type]);
</script>

<div class="flex items-center">
	<svelte:component this={icon} class="mr-2 h-4 w-4 text-muted-foreground" />
	<span>{label}</span>
</div>
