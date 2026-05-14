<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button } from '@shared/components/ui/button';
	import * as DropdownMenu from '@shared/components/ui/dropdown-menu';
	import { MoreHorizontal } from 'lucide-svelte';
	import type { Intervention } from '../types';
	import InterventionDeleteDialog from './intervention-delete-dialog.svelte';
	import { statusMap } from './intervention-status-map';

	interface Props {
		intervention: Intervention;
	}

	let { intervention }: Props = $props();
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
		<DropdownMenu.Item onclick={() => goto(resolve(`/interventions/${intervention.id}`))}
			>Open</DropdownMenu.Item
		>
		<DropdownMenu.Separator />
		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger>Status</DropdownMenu.SubTrigger>
			<DropdownMenu.SubContent>
				<DropdownMenu.RadioGroup value={intervention.status}>
					{#each Object.entries(statusMap) as [status, { label }] (status)}
						<DropdownMenu.RadioItem value={status}>
							{label}
						</DropdownMenu.RadioItem>
					{/each}
				</DropdownMenu.RadioGroup>
			</DropdownMenu.SubContent>
		</DropdownMenu.Sub>
		<DropdownMenu.Separator />
		<DropdownMenu.Item
			onclick={() => goto(resolve(`/interventions/${intervention.id}?action=edit`))}
			>Edit</DropdownMenu.Item
		>
		<DropdownMenu.Item onclick={() => (openDeleteDialog = true)}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<InterventionDeleteDialog data={page.data.deleteInterventionForm} bind:open={openDeleteDialog} />
