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
	import { getTickets, updateStatus } from '@/ticket/ticket.remote.js';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { generateRankBetween } from '@/shared/utils';
	import { toast } from 'svelte-sonner';

	let { data } = $props();
	let { createTicketForm } = $derived(data);

	let openForm = $state(false);
	let defaultStatus = $state<TicketStatus | undefined>(undefined);

	let tickets = $derived(getTickets());

	let cards = $derived(tickets.current?.map((t) => ({ ...t, columnId: t.status })) ?? []);

	function openTicketForm(status?: TicketStatus) {
		defaultStatus = status;
		openForm = true;
	}

	function onAddTicket() {
		openTicketForm();
	}

	function onAddCard(status: string) {
		openTicketForm(status as TicketStatus);
	}

	async function onMoveCard(
		id: number,
		columnId: string,
		rank1: string | undefined,
		rank2: string | undefined
	) {
		const status = columnId as TicketStatus;
		const rank = generateRankBetween(rank1, rank2);

		try {
			await updateStatus({ id, status, rank }).updates(
				getTickets().withOverride((tickets) =>
					tickets.map((ticket) => (ticket.id === id ? { ...ticket, status, rank } : ticket))
				)
			);
		} catch {
			toast.error('Failed to move ticket. Please try again.');
		}
	}
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>
				Tickets
				{#if tickets.ready}
					({tickets.current?.length})
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
	{#if tickets.error}
		<div class="flex flex-col items-center gap-y-4">
			<p class="text-sm text-destructive">Failed to load tickets.</p>
			<Button variant="outline" class="w-fit" onclick={() => tickets.refresh()}>Retry</Button>
		</div>
	{:else if !tickets.ready}
		<div class="flex items-center justify-center">
			<Spinner class="size-6" />
		</div>
	{:else}
		<KanbanBoard columns={ticketKanbanColumns} {cards} {onAddCard} {onMoveCard}>
			{#snippet card(ticket)}
				<TicketKanbanCard {ticket} />
			{/snippet}
		</KanbanBoard>
	{/if}
</div>

<TicketForm data={createTicketForm} action="?/create" bind:open={openForm} {defaultStatus} />
