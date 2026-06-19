<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import PageSubtitle from '@/shared/components/page-subtitle.svelte';
	import PageTitle from '@/shared/components/page-title.svelte';
	import { Button } from '@/shared/components/ui/button';
	import { Separator } from '@/shared/components/ui/separator';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { dateFormatter } from '@/shared/formatters';
	import TicketDeleteDialog from '@/ticket/components/ticket-delete-dialog.svelte';
	import TicketForm from '@/ticket/components/ticket-form.svelte';
	import { getTicket } from '@/ticket/ticket.remote';
	import { Link, Pencil, Trash } from 'lucide-svelte';

	let openForm = $state(false);
	let openDeleteDialog = $state(false);
</script>

<svelte:boundary>
	{@const ticket = await getTicket(Number(page.params.id))}

	<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
		<div class="flex flex-row items-start justify-between">
			<div>
				<PageTitle>Ticket #{ticket.id}</PageTitle>
				<PageSubtitle>Last updated in 01/01/2024</PageSubtitle>
			</div>
			<div class="flex flex-row gap-x-4">
				<Button onclick={() => (openForm = true)} variant="outline">
					<Pencil class="mr-2 h-4 w-4" />
					Edit
				</Button>
				<Button onclick={() => (openDeleteDialog = true)} variant="destructive">
					<Trash class="mr-2 h-4 w-4" />
					Delete
				</Button>
			</div>
		</div>
		<Separator />
		<div class="grid grid-cols-1 gap-y-12 xl:grid-cols-3 xl:gap-x-6">
			<div class="flex flex-col gap-y-12">
				<dl class="flex flex-col gap-y-8">
					<div class="flex flex-col gap-y-2">
						<div class="text-lg font-semibold tracking-tight">Information</div>
						<div>
							<dt class="text-sm text-muted-foreground">Date</dt>
							<dd>{dateFormatter(ticket.date)}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Title</dt>
							<dd>{ticket.title}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Description</dt>
							<dd>{ticket.description}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Property</dt>
							<dd class="flex flex-row items-center gap-x-2">
								{ticket.property.label}
								<Button
									size="icon"
									variant="ghost"
									href={resolve(`/properties/${ticket.property.id}`)}
								>
									<Link class="h-4 w-4" />
								</Button>
							</dd>
						</div>
					</div>
				</dl>
			</div>
			<div class="col-span-2 flex flex-col gap-y-8"></div>
		</div>
	</div>

	<TicketForm {ticket} bind:open={openForm} />

	<TicketDeleteDialog ticketId={ticket.id} bind:open={openDeleteDialog} />

	{#snippet pending()}
		<div class="flex items-center justify-center px-4 py-6 lg:px-8">
			<Spinner class="size-6" />
		</div>
	{/snippet}

	{#snippet failed(_, reset)}
		<div class="flex flex-col items-center gap-y-4 px-4 py-6 lg:px-8">
			<p class="text-sm text-destructive">Failed to load ticket.</p>
			<Button variant="outline" class="w-fit" onclick={reset}>Retry</Button>
		</div>
	{/snippet}
</svelte:boundary>
