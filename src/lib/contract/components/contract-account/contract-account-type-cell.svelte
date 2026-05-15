<script lang="ts">
	import type { ContractAccountType } from '../../types';
	import { typeMap } from './contract-account-type-map';

	interface Props {
		type: ContractAccountType;
	}

	let { type }: Props = $props();

	let { label, icon } = $derived(typeMap[type]);

	const SvelteComponent = $derived(icon);
</script>

<div class="flex items-center">
	<SvelteComponent class="mr-2 h-4 w-4 text-muted-foreground" />
	<span>{label}</span>
</div>
