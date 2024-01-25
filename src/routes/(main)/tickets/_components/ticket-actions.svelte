<script lang="ts">
	import { page } from '$app/stores';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '@/components/ui/button';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { Separator } from '@/components/ui/separator';
	import * as Sheet from '@/components/ui/sheet';
	import type { Ticket } from '@/types';
	import { MoreHorizontal } from 'lucide-svelte';
	import TicketForm from './ticket-form.svelte';
	import { priorityMap } from './ticket-priority-map';
	import { statusMap } from './ticket-status-map';

	export let ticket: Ticket;
	let openSheet = false;
	let openAlertDialog = false;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" class="h-8 w-8 p-0" builders={[builder]}>
			<span class="sr-only">Open menu</span>
			<MoreHorizontal class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item href={`/tickets/${ticket.id}`}>Open</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger>Status</DropdownMenu.SubTrigger>
			<DropdownMenu.SubContent>
				<DropdownMenu.RadioGroup value={ticket.status}>
					{#each Object.entries(statusMap) as [status, { label }]}
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
					{#each Object.entries(priorityMap) as [priority, { label }]}
						<DropdownMenu.RadioItem value={priority}>
							{label}
						</DropdownMenu.RadioItem>
					{/each}
				</DropdownMenu.RadioGroup>
			</DropdownMenu.SubContent>
		</DropdownMenu.Sub>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={() => (openSheet = true)}>Edit</DropdownMenu.Item>
		<DropdownMenu.Item on:click={() => (openAlertDialog = true)}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<Sheet.Root bind:open={openSheet}>
	<Sheet.Content class="sm:max-w-[40rem]">
		<Sheet.Header>
			<Sheet.Title>Add new ticket</Sheet.Title>
			<Sheet.Description>Fill the form below to add a new ticket.</Sheet.Description>
		</Sheet.Header>
		<Separator class="my-5" />
		<TicketForm form={$page.data.updateForm} />
	</Sheet.Content>
</Sheet.Root>

<AlertDialog.Root bind:open={openAlertDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete this ticket and remove their data
				from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
