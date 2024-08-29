<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Command from '@/components/ui/command';
	import * as Popover from '@/components/ui/popover';
	import type { IdWithLabel } from '@/types/types';
	import { cn } from '@/utils';
	import { tick } from 'svelte';
	import CaretSort from 'svelte-radix/CaretSort.svelte';
	import Check from 'svelte-radix/Check.svelte';

	export let options: IdWithLabel[];
	export let value: number | undefined | null;

	let open = false;

	$: selectedValue = options.find((p) => p.id === value)?.label ?? 'Select...';

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="w-full flex-1 justify-between px-3 font-normal"
		>
			{selectedValue}
			<CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-full p-0 md:w-[200px] lg:w-[300px]">
		<Command.Root>
			<Command.Input placeholder="Search options..." />
			<Command.List>
				<Command.Empty>No options found.</Command.Empty>
				{#each options as option}
					<Command.Item
						value={option.id.toString()}
						class="aria-selected:bg-primary aria-selected:text-primary-foreground"
						onSelect={() => {
							value = option.id;
							closeAndFocusTrigger(ids.trigger);
						}}
					>
						{option.label}
						<Check
							class={cn('ml-auto h-4 w-4', value === option.id ? 'opacity-100' : 'opacity-0')}
						/>
					</Command.Item>
				{/each}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
