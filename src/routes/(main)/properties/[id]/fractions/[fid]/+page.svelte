<script lang="ts">
	import { page } from '$app/state';
	import FractionDeleteDialog from '@/property/components/fraction-delete-dialog.svelte';
	import FractionForm from '@/property/components/fraction-form.svelte';
	import { getFraction, getProperty } from '@/property/property.remote';
	import { fractionTypeOptions, propertyClassOptions } from '@/property/types';
	import PageSubtitle from '@/shared/components/page-subtitle.svelte';
	import PageTitle from '@/shared/components/page-title.svelte';
	import { Button } from '@/shared/components/ui/button';
	import * as Card from '@/shared/components/ui/card';
	import { Separator } from '@/shared/components/ui/separator';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { areaFormatter, currencyFormatter } from '@/shared/formatters';
	import { Pencil, Trash } from 'lucide-svelte';

	let openForm = $state(false);
	let openDeleteDialog = $state(false);
</script>

<svelte:boundary>
	{@const property = await getProperty(Number(page.params.id))}
	{@const fraction = await getFraction(Number(page.params.fid))}

	<div class="flex flex-col gap-y-6 overflow-y-auto px-4 py-6 lg:px-8">
		<div class="flex flex-row items-start justify-between">
			<div>
				<PageTitle>Fraction #{fraction.id}</PageTitle>
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
								<dt class="text-sm text-muted-foreground">Class</dt>
								<dd>{propertyClassOptions[fraction.class]}</dd>
							</div>
							<div>
								<dt class="text-sm text-muted-foreground">Type</dt>
								<dd>{fractionTypeOptions[fraction.type]}</dd>
							</div>
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
								<dd>{property.address.country}</dd>
							</div>
							<div>
								<dt class="text-sm text-muted-foreground">Region</dt>
								<dd>{property.address.region}</dd>
							</div>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Address</dt>
							<dd>{property.address.address} — {fraction.fraction}</dd>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-sm text-muted-foreground">Postal Code</dt>
								<dd>{property.address.postal_code}</dd>
							</div>
							<div>
								<dt class="text-sm text-muted-foreground">City</dt>
								<dd>{property.address.city}</dd>
							</div>
						</div>
					</div>
				</dl>
				<Card.Root>
					<Card.Header class="pb-3">
						<Card.Title>Fraction's contracts</Card.Title>
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
		</div>
	</div>

	<FractionForm bind:open={openForm} {fraction} />

	<FractionDeleteDialog
		bind:open={openDeleteDialog}
		fractionId={fraction.id}
		parentId={fraction.parent_id}
	/>

	{#snippet pending()}
		<div class="flex items-center justify-center px-4 py-6 lg:px-8">
			<Spinner class="size-6" />
		</div>
	{/snippet}

	{#snippet failed(_, reset)}
		<div class="flex flex-col items-center gap-y-4 px-4 py-6 lg:px-8">
			<p class="text-sm text-destructive">Failed to load fraction.</p>
			<Button variant="outline" class="w-fit" onclick={reset}>Retry</Button>
		</div>
	{/snippet}
</svelte:boundary>
