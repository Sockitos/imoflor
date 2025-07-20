<script lang="ts">
	import { page } from '$app/state';
	import PageSubtitle from '@/components/page-subtitle.svelte';
	import PageTitle from '@/components/page-title.svelte';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { Separator } from '@/components/ui/separator';
	import { areaFormatter, currencyFormatter } from '@/formatters';
	import { Pencil, PlusCircle, Trash } from 'lucide-svelte';
	import PropertyDeleteDialog from '../_components/property-delete-dialog.svelte';
	import PropertyForm from '../_components/property-form.svelte';
	import FractionForm from './_components/fraction-form.svelte';
	import FractionTable from './_components/fraction-table.svelte';

	let { data } = $props();
	let { property, fractions, updatePropertyForm, deletePropertyForm, createFractionForm } =
		$derived(data);

	let openForm = $state(page.url.searchParams.get('action') === 'edit');
	let openDeleteDialog = $state(false);
	let openFractionForm = $state(false);
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>Property #{property.id}</PageTitle>
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
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-muted-foreground text-sm">Class</dt>
							<dd>{property.class}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground text-sm">Type</dt>
							<dd>{property.type}</dd>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-muted-foreground text-sm">Matrix</dt>
							<dd>{property.matrix}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground text-sm">Conservatory</dt>
							<dd>{property.conservatory}</dd>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-muted-foreground text-sm">Area</dt>
							<dd>{areaFormatter(property.area)}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground text-sm">Tipology</dt>
							<dd>{property.tipology}</dd>
						</div>
					</div>
					<div>
						<dt class="text-muted-foreground text-sm">Description</dt>
						<dd>{property.description}</dd>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-muted-foreground text-sm">Patrimonial Value</dt>
							<dd>{currencyFormatter.format(property.patrimonial_value ?? 0)}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground text-sm">Market Value</dt>
							<dd>{currencyFormatter.format(property.market_value ?? 0)}</dd>
						</div>
					</div>
				</div>
				<div class="flex flex-col gap-y-2">
					<div class="text-lg font-semibold tracking-tight">Address</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-muted-foreground text-sm">Country</dt>
							<dd>{property.country}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground text-sm">Region</dt>
							<dd>{property.region}</dd>
						</div>
					</div>
					<div>
						<dt class="text-muted-foreground text-sm">Address</dt>
						<dd>{property.address}</dd>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-muted-foreground text-sm">Postal Code</dt>
							<dd>{property.postal_code}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground text-sm">City</dt>
							<dd>{property.city}</dd>
						</div>
					</div>
				</div>
			</dl>
			<Card.Root>
				<Card.Header class="pb-3">
					<Card.Title>Property's contracts</Card.Title>
					<Card.Description class="max-w-lg leading-relaxed text-balance">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua.
					</Card.Description>
				</Card.Header>
				<Card.Footer>
					<Button>List Contracts</Button>
				</Card.Footer>
			</Card.Root>
		</div>
		<div class="col-span-2 flex flex-col gap-y-6">
			<div class="flex items-start justify-between">
				<div>
					<h2 class="text-lg font-semibold">Fractions</h2>
					<p class="text-muted-foreground text-sm">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua.
					</p>
				</div>
				<Button onclick={() => (openFractionForm = true)}>
					<PlusCircle class="mr-2 h-4 w-4" />
					Add Fraction
				</Button>
			</div>
			<FractionTable {fractions} />
		</div>
	</div>
</div>

<PropertyForm data={updatePropertyForm} action="?/update" bind:open={openForm} />

<PropertyDeleteDialog {property} data={deletePropertyForm} bind:open={openDeleteDialog} />

<FractionForm
	data={createFractionForm}
	action="/properties/{property.id}/fractions?/create"
	bind:open={openFractionForm}
/>
