<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '@/components/ui/button';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import type { Tenant } from '@/types/types';
	import { MoreHorizontal } from 'lucide-svelte';
	import TenantDeleteDialog from './tenant-delete-dialog.svelte';

	interface Props {
		tenant: Tenant;
	}

	let { tenant }: Props = $props();
	let openDeleteDialog = $state(false);
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
		<DropdownMenu.Item onclick={() => goto(`/tenants/${tenant.id}`)}>Open</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={() => goto(`/tenants/${tenant.id}?action=edit`)}
			>Edit</DropdownMenu.Item
		>
		<DropdownMenu.Item onclick={() => (openDeleteDialog = true)}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<TenantDeleteDialog {tenant} data={page.data.deleteTenantForm} bind:open={openDeleteDialog} />
