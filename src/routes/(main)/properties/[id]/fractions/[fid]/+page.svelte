<script lang="ts">
	import { page } from '$app/stores';
	import PageSubtitle from '@/components/page-subtitle.svelte';
	import PageTitle from '@/components/page-title.svelte';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { Separator } from '@/components/ui/separator';
	import { areaFormatter, currencyFormatter } from '@/formatters';
	import { Pencil, Trash } from 'lucide-svelte';
	import FractionDeleteDialog from '../../_components/fraction-delete-dialog.svelte';
	import FractionForm from '../../_components/fraction-form.svelte';

	export let data;
	$: ({ property, fraction, updateForm, deleteForm } = data);

	let openForm = $page.url.searchParams.get('action') === 'edit';
	let openDeleteDialog = false;
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>Fraction #{fraction.id}</PageTitle>
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
						<dd>{fraction.type}</dd>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-sm text-muted-foreground">Matrix</dt>
							<dd>{fraction.matrix}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Conservatory</dt>
							<dd>{fraction.conservatory}</dd>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-sm text-muted-foreground">Area</dt>
							<dd>{areaFormatter(fraction.area)}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Tipology</dt>
							<dd>{fraction.tipology}</dd>
						</div>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">Description</dt>
						<dd>{fraction.description}</dd>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-sm text-muted-foreground">Patrimonial Value</dt>
							<dd>{currencyFormatter.format(fraction.patrimonial_value ?? 0)}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Market Value</dt>
							<dd>{currencyFormatter.format(fraction.market_value ?? 0)}</dd>
						</div>
					</div>
				</div>
				<div class="flex flex-col gap-y-2">
					<div class="text-lg font-semibold tracking-tight">Address</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-sm text-muted-foreground">Country</dt>
							<dd>{property.country}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Region</dt>
							<dd>{property.region}</dd>
						</div>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">Address</dt>
						<dd>{property.address} - {fraction.address}</dd>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-sm text-muted-foreground">Postal Code</dt>
							<dd>{property.postal_code}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">City</dt>
							<dd>{property.city}</dd>
						</div>
					</div>
				</div>
			</dl>
			<Card.Root>
				<Card.Header class="pb-3">
					<Card.Title>Fraction's contracts</Card.Title>
					<Card.Description class="max-w-lg text-balance leading-relaxed">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua.
					</Card.Description>
				</Card.Header>
				<Card.Footer>
					<Button>List Contracts</Button>
				</Card.Footer>
			</Card.Root>
		</div>
	</div>
</div>

<FractionForm data={updateForm} action="?/update" bind:open={openForm} />

<FractionDeleteDialog {fraction} data={deleteForm} bind:open={openDeleteDialog} />
