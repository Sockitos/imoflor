<script lang="ts">
	import TicketForm from '@/ticket/components/ticket-form.svelte';
	import TicketKanbanCard from '@/ticket/components/ticket-kanban-card.svelte';
	import PageSubtitle from '@/shared/components/page-subtitle.svelte';
	import PageTitle from '@/shared/components/page-title.svelte';
	import { Button } from '@/shared/components/ui/button';
	import { Separator } from '@/shared/components/ui/separator';
	import { PlusCircle } from 'lucide-svelte';
	import KanbanBoard from '@/shared/components/kanban-board.svelte';
	import { ticketKanbanColumns } from '@/ticket/components/ticket-kanban-columns';
	import type { TicketStatus } from '@/ticket/types';
	import { getTickets } from '@/ticket/ticket.remote.js';
	import { Spinner } from '@/shared/components/ui/spinner';

	let { data } = $props();
	let { createTicketForm } = $derived(data);

	let openForm = $state(false);
	let defaultStatus = $state<TicketStatus | undefined>(undefined);

	function openTicketForm(status?: TicketStatus) {
		defaultStatus = status;
		openForm = true;
	}

	function onAddTicket() {
		openTicketForm();
	}

	function onAddCard(status: String) {
		openTicketForm(status as TicketStatus);
	}
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>
				Tickets
				{#if getTickets().ready}
					({getTickets().current?.length})
				{/if}
			</PageTitle>
			<PageSubtitle>Manage your tickets and Lorem Ipsum</PageSubtitle>
		</div>
		<Button onclick={onAddTicket}>
			<PlusCircle class="mr-2 h-4 w-4" />
			Add Ticket
		</Button>
	</div>
	<Separator />
	<svelte:boundary>
		{@const cards = (await getTickets()).map((t) => ({ ...t, columnId: t.status }))}

		<KanbanBoard columns={ticketKanbanColumns} {cards} {onAddCard}>
			{#snippet card(ticket)}
				<TicketKanbanCard {ticket} />
			{/snippet}
		</KanbanBoard>

		{#snippet pending()}
			<div class="flex items-center justify-center">
				<Spinner class="size-6" />
			</div>
		{/snippet}

		{#snippet failed(_, reset)}
			<div class="flex flex-col items-center gap-y-4">
				<p class="text-sm text-destructive">Failed to load tickets.</p>
				<Button variant="outline" class="w-fit" onclick={reset}>Retry</Button>
			</div>
		{/snippet}
	</svelte:boundary>
</div>

<TicketForm data={createTicketForm} action="?/create" bind:open={openForm} {defaultStatus} />
