<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button } from '@/components/ui/button';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import type { Property } from '@/types/types';
	import { MoreHorizontal } from 'lucide-svelte';
	import PropertyDeleteDialog from './property-delete-dialog.svelte';

	interface Props {
		property: Property;
	}

	let { property }: Props = $props();
	let openDeleteDialog = $state(false);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button variant="ghost" class="h-8 w-8 p-0" {...props}>
				<span class="sr-only">Open menu</span>
				<MoreHorizontal class="h-4 w-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => goto(resolve(`/properties/${property.id}`))}
			>Open</DropdownMenu.Item
		>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={() => goto(resolve(`/properties/${property.id}?action=edit`))}
			>Edit</DropdownMenu.Item
		>
		<DropdownMenu.Item onclick={() => (openDeleteDialog = true)}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<PropertyDeleteDialog {property} data={page.data.deletePropertyForm} bind:open={openDeleteDialog} />
