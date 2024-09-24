<script lang="ts">
	import { page } from '$app/stores';
	import PageSubtitle from '@/components/page-subtitle.svelte';
	import PageTitle from '@/components/page-title.svelte';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import dayjs from 'dayjs';
	import { Link, Pencil, Trash } from 'lucide-svelte';
	import InterventionDeleteDialog from '../_components/intervention-delete-dialog.svelte';
	import InterventionForm from '../_components/intervention-form.svelte';

	export let data;
	$: ({ intervention, updateInterventionForm, deleteInterventionForm } = data);

	let openForm = $page.url.searchParams.get('action') === 'edit';
	let openDeleteDialog = false;
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>Intervention #{intervention.id}</PageTitle>
			<PageSubtitle>Last updated in 01/01/2024</PageSubtitle>
		</div>
		<div class="flex flex-row gap-x-4">
			<Button on:click={() => (openForm = true)} variant="outline">
				<Pencil class="mr-2 h-4 w-4" />
				Edit
			</Button>
			<Button on:click={() => (openDeleteDialog = true)} variant="destructive">
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
						<dd>{intervention.type}</dd>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">Status</dt>
						<dd>{intervention.status}</dd>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">Start Date</dt>
						<dd>{dayjs(intervention.start_date).format('DD/MM/YYYY')}</dd>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">End Date</dt>
						<dd>{dayjs(intervention.end_date).format('DD/MM/YYYY')}</dd>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">Description</dt>
						<dd>{intervention.description}</dd>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">Property</dt>
						<dd class="flex flex-row items-center gap-x-2">
							{intervention.property.label}
							<Button size="iconsm" variant="ghost" href="/properties/{intervention.property.id}">
								<Link class="h-4 w-4" />
							</Button>
						</dd>
					</div>
					{#if intervention.fraction}
						<div>
							<dt class="text-sm text-muted-foreground">Fraction</dt>
							<dd class="flex flex-row items-center gap-x-2">
								{intervention.fraction.label}
								<Button size="iconsm" variant="ghost" href="/fractions/{intervention.fraction.id}">
									<Link class="h-4 w-4" />
								</Button>
							</dd>
						</div>
					{/if}
					{#if intervention.ticket}
						<div>
							<dt class="text-sm text-muted-foreground">Ticket</dt>
							<dd class="flex flex-row items-center gap-x-2">
								{intervention.ticket.label}
								<Button size="iconsm" variant="ghost" href="/tickets/{intervention.ticket.id}">
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

<InterventionForm data={updateInterventionForm} action="?/update" bind:open={openForm} />

<InterventionDeleteDialog
	{intervention}
	data={deleteInterventionForm}
	bind:open={openDeleteDialog}
/>
