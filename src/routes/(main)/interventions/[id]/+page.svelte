<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import ExpensesTable from '@intervention/components/expenses-table.svelte';
	import InterventionDeleteDialog from '@intervention/components/intervention-delete-dialog.svelte';
	import InterventionForm from '@intervention/components/intervention-form.svelte';
	import { interventionStatusOptions, interventionTypeOptions } from '@intervention/types';
	import PageSubtitle from '@shared/components/page-subtitle.svelte';
	import PageTitle from '@shared/components/page-title.svelte';
	import { Button } from '@shared/components/ui/button';
	import { Separator } from '@shared/components/ui/separator';
	import { dateFormatter } from '@shared/formatters';
	import { Link, Pencil, PlusCircle, Trash } from 'lucide-svelte';

	let { data } = $props();
	let { intervention, updateInterventionForm, deleteInterventionForm } = $derived(data);

	let openForm = $state(page.url.searchParams.get('action') === 'edit');
	let openDeleteDialog = $state(false);
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>Intervention #{intervention.id}</PageTitle>
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
						<dt class="text-sm text-muted-foreground">Type</dt>
						<dd>{interventionTypeOptions[intervention.type]}</dd>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">Status</dt>
						<dd>{interventionStatusOptions[intervention.status]}</dd>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">Start Date</dt>
						<dd>{dateFormatter(intervention.start_date)}</dd>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">End Date</dt>
						<dd>{dateFormatter(intervention.end_date)}</dd>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">Description</dt>
						<dd>{intervention.description}</dd>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">Property</dt>
						<dd class="flex flex-row items-center gap-x-2">
							{intervention.property.label}
							<Button
								size="icon"
								variant="ghost"
								href={resolve(`/properties/${intervention.property.id}`)}
							>
								<Link class="h-4 w-4" />
							</Button>
						</dd>
					</div>
					{#if intervention.ticket}
						<div>
							<dt class="text-sm text-muted-foreground">Ticket</dt>
							<dd class="flex flex-row items-center gap-x-2">
								{intervention.ticket.label}
								<Button
									size="icon"
									variant="ghost"
									href={resolve(`/tickets/${intervention.ticket.id}`)}
								>
									<Link class="h-4 w-4" />
								</Button>
							</dd>
						</div>
					{/if}
				</div>
			</dl>
		</div>
		<div class="col-span-2 flex flex-col gap-y-8">
			<div class="flex items-start justify-between">
				<div>
					<h2 class="text-lg font-semibold">Expenses</h2>
					<p class="text-sm text-muted-foreground">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua.
					</p>
				</div>
				<Button>
					<PlusCircle class="mr-2 h-4 w-4" />
					Expense
				</Button>
			</div>
			<ExpensesTable expenses={[]} />
		</div>
	</div>
</div>

<InterventionForm data={updateInterventionForm} action="?/update" bind:open={openForm} />

<InterventionDeleteDialog data={deleteInterventionForm} bind:open={openDeleteDialog} />
