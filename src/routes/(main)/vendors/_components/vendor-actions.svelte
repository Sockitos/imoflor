<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '@/components/ui/button';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import type { Vendor } from '@/types/types';
	import { MoreHorizontal } from 'lucide-svelte';
	import VendorDeleteDialog from './vendor-delete-dialog.svelte';
	import VendorForm from './vendor-form.svelte';

	export let vendor: Vendor;
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
		<DropdownMenu.Item href={`/vendors/${vendor.id}`}>Open</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={() => (openSheet = true)}>Edit</DropdownMenu.Item>
		<DropdownMenu.Item on:click={() => (openDeleteDialog = true)}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<VendorForm data={$page.data.updateForm} bind:open={openSheet} />

<VendorDeleteDialog {vendor} data={$page.data.deleteForm} bind:open={openDeleteDialog} />
