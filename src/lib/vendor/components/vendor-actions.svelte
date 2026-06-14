<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button } from '@/shared/components/ui/button';
	import * as DropdownMenu from '@/shared/components/ui/dropdown-menu';
	import { Ellipsis } from 'lucide-svelte';
	import type { Vendor } from '../types';
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
			<Button variant="ghost" size="icon" {...props}>
				<Ellipsis />
				<span class="sr-only">Open menu</span>
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

<VendorDeleteDialog vendorId={vendor.id} bind:open={openDeleteDialog} />
