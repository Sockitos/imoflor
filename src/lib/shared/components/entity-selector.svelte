<script lang="ts" generics="TEntity extends EntityOption">
	import { Button } from '@/shared/components/ui/button';
	import * as Command from '@/shared/components/ui/command';
	import * as Popover from '@/shared/components/ui/popover';
	import { useId } from 'bits-ui';
	import { tick, type Snippet } from 'svelte';
	import CaretSort from 'svelte-radix/CaretSort.svelte';
	import type { EntityOption } from '../types';
	import type { Id } from '../types';

	interface Props {
		entityId?: Id;
		entities: TEntity[];
		entityBuilder: Snippet<[{ entity: TEntity; isSelected: boolean }]>;
	}

	let { entityId = $bindable(), entities, entityBuilder }: Props = $props();

	let open = $state(false);

	let selectedValue = $derived(entities.find((p) => p.id === entityId));

	let triggerId = useId();

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

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				id={triggerId}
				variant="outline"
				role="combobox"
				aria-expanded={open}
				class="w-full justify-between px-3 font-normal"
			>
				{#if selectedValue != null}
					{@render entityBuilder({ entity: selectedValue, isSelected: true })}
				{:else}
					Select...
				{/if}
				<CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-full p-0 md:w-[300px] lg:w-[400px]">
		<Command.Root class="gap-2">
			<Command.Input placeholder="Search options..." />
			<Command.List>
				<Command.Empty>No options found.</Command.Empty>
				{#each entities as entity (entity.id)}
					<Command.Item
						class="aria-selected:bg-primary aria-selected:text-primary-foreground"
						data-checked={entityId === entity.id}
						onSelect={() => {
							entityId = entity.id;
							closeAndFocusTrigger(triggerId);
						}}
					>
						{@render entityBuilder({ entity, isSelected: false })}
					</Command.Item>
				{/each}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
