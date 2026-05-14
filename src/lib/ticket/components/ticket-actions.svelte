<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button } from '@shared/components/ui/button';
	import * as DropdownMenu from '@shared/components/ui/dropdown-menu';
	import { MoreHorizontal } from 'lucide-svelte';
	import type { Ticket } from '../types';
	import TicketDeleteDialog from './ticket-delete-dialog.svelte';
	import { priorityMap } from './ticket-priority-map';
	import { statusMap } from './ticket-status-map';

	interface Props {
		ticket: Ticket;
	}

	let { ticket }: Props = $props();
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
		<DropdownMenu.Item onclick={() => goto(resolve(`/tickets/${ticket.id}`))}
			>Open</DropdownMenu.Item
		>
		<DropdownMenu.Separator />
		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger>Status</DropdownMenu.SubTrigger>
			<DropdownMenu.SubContent>
				<DropdownMenu.RadioGroup value={ticket.status}>
					{#each Object.entries(statusMap) as [status, { label }] (status)}
						<DropdownMenu.RadioItem value={status}>
							{label}
						</DropdownMenu.RadioItem>
					{/each}
				</DropdownMenu.RadioGroup>
			</DropdownMenu.SubContent>
		</DropdownMenu.Sub>
		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger>Priority</DropdownMenu.SubTrigger>
			<DropdownMenu.SubContent>
				<DropdownMenu.RadioGroup value={ticket.priority}>
					{#each Object.entries(priorityMap) as [priority, { label }] (priority)}
						<DropdownMenu.RadioItem value={priority}>
							{label}
						</DropdownMenu.RadioItem>
					{/each}
				</DropdownMenu.RadioGroup>
			</DropdownMenu.SubContent>
		</DropdownMenu.Sub>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={() => goto(resolve(`/tickets/${ticket.id}?action=edit`))}
			>Edit</DropdownMenu.Item
		>
		<DropdownMenu.Item onclick={() => (openDeleteDialog = true)}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<TicketDeleteDialog data={page.data.deleteTicketForm} bind:open={openDeleteDialog} />
