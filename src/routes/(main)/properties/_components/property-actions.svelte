<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '@/components/ui/button';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import type { Property } from '@/types/types';
	import { MoreHorizontal } from 'lucide-svelte';
	import PropertyDeleteDialog from './property-delete-dialog.svelte';
	import PropertyForm from './property-form.svelte';

	export let property: Property;
	let openSheet = false;
	let openDeleteDialog = false;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" class="h-8 w-8 p-0" builders={[builder]}>
			<span class="sr-only">Open menu</span>
			<MoreHorizontal class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item href={`/properties/${property.id}`}>Open</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={() => (openSheet = true)}>Edit</DropdownMenu.Item>
		<DropdownMenu.Item on:click={() => (openDeleteDialog = true)}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<PropertyForm data={$page.data.updateForm} bind:open={openSheet} />

<PropertyDeleteDialog {property} data={$page.data.deleteForm} bind:open={openDeleteDialog} />
