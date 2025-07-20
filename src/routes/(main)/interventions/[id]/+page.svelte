<script lang="ts">
	import { page } from '$app/state';
	import PageSubtitle from '@/components/page-subtitle.svelte';
	import PageTitle from '@/components/page-title.svelte';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import dayjs from 'dayjs';
	import { Link, Pencil, PlusCircle, Trash } from 'lucide-svelte';
	import InterventionDeleteDialog from '../_components/intervention-delete-dialog.svelte';
	import InterventionForm from '../_components/intervention-form.svelte';
	import ExpensesTable from './_components/expenses-table.svelte';

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
						<dt class="text-muted-foreground text-sm">Type</dt>
						<dd>{intervention.type}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground text-sm">Status</dt>
						<dd>{intervention.status}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground text-sm">Start Date</dt>
						<dd>{dayjs(intervention.start_date).format('DD/MM/YYYY')}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground text-sm">End Date</dt>
						<dd>{dayjs(intervention.end_date).format('DD/MM/YYYY')}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground text-sm">Description</dt>
						<dd>{intervention.description}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground text-sm">Property</dt>
						<dd class="flex flex-row items-center gap-x-2">
							{intervention.property.label}
							<Button size="icon" variant="ghost" href="/properties/{intervention.property.id}">
								<Link class="h-4 w-4" />
							</Button>
						</dd>
					</div>
					{#if intervention.fraction}
						<div>
							<dt class="text-muted-foreground text-sm">Fraction</dt>
							<dd class="flex flex-row items-center gap-x-2">
								{intervention.fraction.label}
								<Button size="icon" variant="ghost" href="/fractions/{intervention.fraction.id}">
									<Link class="h-4 w-4" />
								</Button>
							</dd>
						</div>
					{/if}
					{#if intervention.ticket}
						<div>
							<dt class="text-muted-foreground text-sm">Ticket</dt>
							<dd class="flex flex-row items-center gap-x-2">
								{intervention.ticket.label}
								<Button size="icon" variant="ghost" href="/tickets/{intervention.ticket.id}">
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
					<p class="text-muted-foreground text-sm">
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

<InterventionDeleteDialog
	{intervention}
	data={deleteInterventionForm}
	bind:open={openDeleteDialog}
/>
