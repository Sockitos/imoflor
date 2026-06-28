<script lang="ts">
	import { currencyFormatter } from '@/shared/formatters';
	import { TriangleAlert } from 'lucide-svelte';

	interface Props {
		balance: number;
	}

	let { balance }: Props = $props();

	let formatted = $derived(currencyFormatter.format(balance));
</script>

<div class="flex flex-row items-center">
	{formatted}
	{#if balance < 0}
		<TriangleAlert class="ml-2 h-4 w-4 text-destructive" />
	{/if}
</div>
