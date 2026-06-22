<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button } from '@/shared/components/ui/button';
	import * as DropdownMenu from '@/shared/components/ui/dropdown-menu';
	import { Ellipsis } from 'lucide-svelte';
	import type { Fraction } from '../types';
	import FractionDeleteDialog from './fraction-delete-dialog.svelte';
	import FractionForm from './fraction-form.svelte';

	interface Props {
		fraction: Fraction;
	}

	let { fraction }: Props = $props();
	let openForm = $state(false);
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
		<DropdownMenu.Item
			onclick={() => goto(resolve(`/properties/${fraction.parent_id}/fractions/${fraction.id}`))}
		>
			Open
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={() => (openForm = true)}>Edit</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => (openDeleteDialog = true)}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<FractionForm bind:open={openForm} {fraction} />

<FractionDeleteDialog
	fractionId={fraction.id}
	parentId={fraction.parent_id}
	bind:open={openDeleteDialog}
/>
