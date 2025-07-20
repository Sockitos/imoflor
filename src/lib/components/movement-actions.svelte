<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import type { Movement } from '@/types/types';
	import { MoreHorizontal } from 'lucide-svelte';

	interface Props {
		movement: Movement;
	}

	let { movement: _movement }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button variant="ghost" size="icon" {...props}>
				<MoreHorizontal class="h-4 w-4" />
				<span class="sr-only">Open menu</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item>Edit</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
