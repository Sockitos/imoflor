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

	let { data } = $props();
	let { tickets, createTicketForm } = $derived(data);
	let openForm = $state(false);
	let defaultStatus = $state<TicketStatus | undefined>(undefined);

	const kanbanCards = $derived(tickets.map((t) => ({ ...t, columnId: t.status })));

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
			<PageTitle>Tickets ({tickets.length})</PageTitle>
			<PageSubtitle>Manage your tickets and Lorem Ipsum</PageSubtitle>
		</div>
		<Button onclick={onAddTicket}>
			<PlusCircle class="mr-2 h-4 w-4" />
			Add Ticket
		</Button>
	</div>
	<Separator />
	<KanbanBoard columns={ticketKanbanColumns} cards={kanbanCards} {onAddCard}>
		{#snippet card(c)}
			<TicketKanbanCard ticket={c} />
		{/snippet}
	</KanbanBoard>
</div>

<TicketForm data={createTicketForm} action="?/create" bind:open={openForm} {defaultStatus} />
