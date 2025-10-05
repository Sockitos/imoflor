<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button } from '@/components/ui/button';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import type { Vendor } from '@/types/types';
	import { MoreHorizontal } from 'lucide-svelte';
	import VendorDeleteDialog from './vendor-delete-dialog.svelte';

	interface Props {
		vendor: Vendor;
	}

	let { vendor }: Props = $props();
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
		<DropdownMenu.Item onclick={() => goto(resolve(`/vendors/${vendor.id}`))}
			>Open</DropdownMenu.Item
		>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={() => goto(resolve(`/vendors/${vendor.id}?action=edit`))}
			>Edit</DropdownMenu.Item
		>
		<DropdownMenu.Item onclick={() => (openDeleteDialog = true)}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<VendorDeleteDialog {vendor} data={page.data.deleteVendorForm} bind:open={openDeleteDialog} />
