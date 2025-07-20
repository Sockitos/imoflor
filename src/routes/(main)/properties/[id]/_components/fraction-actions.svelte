<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '@/components/ui/button';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import type { Fraction } from '@/types/types';
	import { MoreHorizontal } from 'lucide-svelte';
	import FractionDeleteDialog from './fraction-delete-dialog.svelte';

	interface Props {
		fraction: Fraction;
	}

	let { fraction }: Props = $props();
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
		<DropdownMenu.Item
			onclick={() => goto(`/properties/${fraction.property_id}/fractions/${fraction.id}`)}
		>
			Open
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item
			onclick={() =>
				goto(`/properties/${fraction.property_id}/fractions/${fraction.id}?action=edit`)}
		>
			Edit
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => (openDeleteDialog = true)}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<FractionDeleteDialog {fraction} data={page.data.deleteFractionForm} bind:open={openDeleteDialog} />
