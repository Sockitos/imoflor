<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '@/components/ui/button';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import type { Fraction } from '@/types/types';
	import { MoreHorizontal } from 'lucide-svelte';
	import FractionDeleteDialog from './fraction-delete-dialog.svelte';

	export let fraction: Fraction;
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
		<DropdownMenu.Item href={`/properties/${fraction.property_id}/fractions/${fraction.id}`}>
			Open
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item
			href="/properties/{fraction.property_id}/fractions/{fraction.id}?action=edit"
		>
			Edit
		</DropdownMenu.Item>
		<DropdownMenu.Item on:click={() => (openDeleteDialog = true)}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<FractionDeleteDialog
	{fraction}
	data={$page.data.deleteFractionForm}
	bind:open={openDeleteDialog}
/>
