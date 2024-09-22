<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { cn } from '@/utils';
	import { ArrowDown, ArrowUp, CaretSort } from 'radix-icons-svelte';

	let className: string | undefined | null = undefined;
	export { className as class };
	export let props: {
		select: never;
		sort: {
			order: 'desc' | 'asc' | undefined;
			toggle: (event: Event) => void;
			clear: () => void;
			disabled: boolean;
		};
		filter: never;
	};

	function handleSortToggle(e: Event) {
		props.sort.toggle(e);
	}
</script>

{#if !props.sort.disabled}
	<div class={cn('flex items-center', className)}>
		<Button
			variant="ghost"
			class="-ml-3 h-8 data-[state=open]:bg-accent"
			on:click={handleSortToggle}
		>
			<slot />
			{#if props.sort.order === 'desc'}
				<ArrowDown class="ml-2 h-4 w-4" />
			{:else if props.sort.order === 'asc'}
				<ArrowUp class="ml-2 h-4 w-4" />
			{:else}
				<CaretSort class="ml-2 h-4 w-4" />
			{/if}
		</Button>
	</div>
{:else}
	<slot />
{/if}
