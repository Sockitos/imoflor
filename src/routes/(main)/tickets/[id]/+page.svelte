<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import PageSubtitle from '@shared/components/page-subtitle.svelte';
	import PageTitle from '@shared/components/page-title.svelte';
	import { Button } from '@shared/components/ui/button';
	import { Separator } from '@shared/components/ui/separator';
	import { dateFormatter } from '@shared/formatters';
	import TicketDeleteDialog from '@ticket/components/ticket-delete-dialog.svelte';
	import TicketForm from '@ticket/components/ticket-form.svelte';
	import { Link, Pencil, Trash } from 'lucide-svelte';

	let { data } = $props();
	let { ticket, updateTicketForm, deleteTicketForm } = $derived(data);

	let openForm = $state(page.url.searchParams.get('action') === 'edit');
	let openDeleteDialog = $state(false);
</script>

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
					{#if ticket.property}
						<div>
							<dt class="text-sm text-muted-foreground">Fraction</dt>
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
					{/if}
				</div>
			</dl>
		</div>
		<div class="col-span-2 flex flex-col gap-y-8"></div>
	</div>
</div>

<TicketForm data={updateTicketForm} action="?/update" bind:open={openForm} />

<TicketDeleteDialog data={deleteTicketForm} bind:open={openDeleteDialog} />
