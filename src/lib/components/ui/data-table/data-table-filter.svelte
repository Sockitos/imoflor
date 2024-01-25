<script lang="ts">
	import { cn } from '$lib/utils';
	import Badge from '@/components/ui/badge/badge.svelte';
	import { Button } from '@/components/ui/button';
	import * as Command from '@/components/ui/command';
	import * as Popover from '@/components/ui/popover';
	import { Separator } from '@/components/ui/separator';
	import type { Icon } from 'lucide-svelte';
	import { Check, PlusCircled } from 'radix-icons-svelte';
	import type { ComponentType } from 'svelte';

	export let filterValues: string[] = [];
	export let counts: Record<string, number> = {};
	export let title: string;
	export let options: { value: string; label: string; icon?: ComponentType<Icon> | undefined }[] =
		[];

	let open = false;

	const handleSelect = (currentValue: string) => {
		if (Array.isArray(filterValues) && filterValues.includes(currentValue)) {
			filterValues = filterValues.filter((v) => v !== currentValue);
		} else {
			filterValues = [...(Array.isArray(filterValues) ? filterValues : []), currentValue];
		}
	};
</script>

<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" class="border-dashed">
			<PlusCircled class="mr-2 h-4 w-4" />
			{title}

			{#if filterValues.length > 0}
				<Separator orientation="vertical" class="mx-2 h-4" />
				<Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">
					{filterValues.length}
				</Badge>
				<div class="hidden space-x-1 lg:flex">
					{#if filterValues.length > 2}
						<Badge variant="secondary" class="rounded-sm px-1 font-normal">
							{filterValues.length} Selected
						</Badge>
					{:else}
						{#each filterValues as option}
							<Badge variant="secondary" class="rounded-sm px-1 font-normal">
								{options.find((o) => o.value === option)?.label}
							</Badge>
						{/each}
					{/if}
				</div>
			{/if}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0" align="start" side="bottom">
		<Command.Root>
			<Command.Input placeholder={title} />
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>
				<Command.Group>
					{#each options as option}
						<Command.Item
							value={option.value}
							onSelect={(currentValue) => {
								handleSelect(currentValue);
							}}
						>
							<div
								class={cn(
									'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
									filterValues.includes(option.value)
										? 'bg-primary text-primary-foreground'
										: 'opacity-50 [&_svg]:invisible'
								)}
							>
								<Check className={cn('h-4 w-4')} />
							</div>
							<svelte:component this={option.icon} class="mr-2 h-4 w-4 text-muted-foreground" />
							<span>
								{option.label}
							</span>
							<span class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
								{counts[option.value] ?? 0}
							</span>
						</Command.Item>
					{/each}
				</Command.Group>
				{#if filterValues.length > 0}
					<Command.Separator />
					<Command.Item
						class="justify-center text-center"
						onSelect={() => {
							filterValues = [];
						}}
					>
						Clear filters
					</Command.Item>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
