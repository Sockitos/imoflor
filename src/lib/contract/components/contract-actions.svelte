<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button } from '@shared/components/ui/button';
	import * as DropdownMenu from '@shared/components/ui/dropdown-menu';
	import { MoreHorizontal } from 'lucide-svelte';
	import type { Contract } from '../types';
	import ContractDeleteDialog from './contract-delete-dialog.svelte';

	interface Props {
		contract: Contract;
	}

	let { contract }: Props = $props();
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
		<DropdownMenu.Item onclick={() => goto(resolve(`/contracts/${contract.id}`))}
			>Open</DropdownMenu.Item
		>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={() => goto(resolve(`/contracts/${contract.id}?action=edit`))}
			>Edit</DropdownMenu.Item
		>
		<DropdownMenu.Item onclick={() => (openDeleteDialog = true)}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<ContractDeleteDialog
	recordId={contract.id}
	data={page.data.deleteContractForm}
	bind:open={openDeleteDialog}
/>
