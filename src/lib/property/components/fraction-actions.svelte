<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button } from '@/shared/components/ui/button';
	import * as DropdownMenu from '@/shared/components/ui/dropdown-menu';
	import { MoreHorizontal } from 'lucide-svelte';
	import type { Fraction } from '../types';
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
			<Button variant="ghost" size="icon" {...props}>
				<MoreHorizontal class="h-4 w-4" />
				<span class="sr-only">Open menu</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item
			onclick={() => goto(resolve(`/properties/${fraction.parent_id}/fractions/${fraction.id}`))}
		>
			Open
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item
			onclick={() =>
				goto(resolve(`/properties/${fraction.parent_id}/fractions/${fraction.id}?action=edit`))}
		>
			Edit
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => (openDeleteDialog = true)}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<FractionDeleteDialog
	propertyId={fraction.parent_id}
	data={page.data.deleteFractionForm}
	bind:open={openDeleteDialog}
/>
