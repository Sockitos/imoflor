<script lang="ts">
	import { currencyFormatter } from '@/formatters';
	import { AlertTriangle } from 'lucide-svelte';

	export let balance: number;

	$: formatted = currencyFormatter.format(balance);
</script>

<div class="flex flex-row items-center">
	{formatted}
	{#if balance < 0}
		<AlertTriangle class="ml-2 h-4 w-4 text-destructive"></AlertTriangle>
	{/if}
</div>
