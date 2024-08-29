<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import * as Sheet from '@/components/ui/sheet';
	import { areaFormatter, currencyFormatter } from '@/formatters';
	import { PlusCircle } from 'lucide-svelte';
	import FractionForm from './_components/fraction-form.svelte';
	import FractionTable from './_components/fraction-table.svelte';

	export let data;
	$: ({ property, fractions, createFractionForm } = data);
</script>

<div class="grid grid-cols-3 gap-x-6 px-4 py-6 lg:px-8">
	<div class="col-span-2">
		<FractionTable {fractions}>
			<FractionForm data={createFractionForm}>
				<Sheet.Trigger asChild let:builder>
					<Button builders={[builder]}>
						<PlusCircle class="mr-2 h-4 w-4" />
						Add Fraction
					</Button>
				</Sheet.Trigger>
			</FractionForm>
		</FractionTable>
	</div>
	<div class="flex flex-col gap-y-6">
		<Card.Root>
			<Card.Header>
				<Card.Title>Property #{data.property.id}</Card.Title>
				<Card.Description>Last updated in 01/01/2024</Card.Description>
			</Card.Header>
			<Card.Content>
				<dl class="flex flex-col gap-y-4 text-sm">
					<div class="flex flex-col gap-y-2">
						<div class="font-medium">Information</div>
						<div>
							<dt class="text-muted-foreground">Type</dt>
							<dd>{data.property.type}</dd>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-muted-foreground">Matrix</dt>
								<dd>{data.property.matrix}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground">Conservatory</dt>
								<dd>{data.property.conservatory}</dd>
							</div>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-muted-foreground">Area</dt>
								<dd>{areaFormatter(data.property.area)}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground">Tipology</dt>
								<dd>{data.property.tipology}</dd>
							</div>
						</div>
						<div>
							<dt class="text-muted-foreground">Description</dt>
							<dd>{data.property.description}</dd>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-muted-foreground">Patrimonial Value</dt>
								<dd>{currencyFormatter.format(data.property.patrimonial_value ?? 0)}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground">Market Value</dt>
								<dd>{currencyFormatter.format(data.property.market_value ?? 0)}</dd>
							</div>
						</div>
					</div>
					<div class="flex flex-col gap-y-2">
						<div class="font-medium">Address</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-muted-foreground">Country</dt>
								<dd>{data.property.country}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground">Region</dt>
								<dd>{data.property.region}</dd>
							</div>
						</div>
						<div>
							<dt class="text-muted-foreground">Address</dt>
							<dd>{data.property.address}</dd>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-muted-foreground">Postal Code</dt>
								<dd>{data.property.postal_code}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground">City</dt>
								<dd>{data.property.city}</dd>
							</div>
						</div>
					</div>
				</dl>
			</Card.Content>
		</Card.Root>
		<Card.Root class="sm:col-span-2">
			<Card.Header class="pb-3">
				<Card.Title>Property's contracts</Card.Title>
				<Card.Description class="max-w-lg text-balance leading-relaxed">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua.
				</Card.Description>
			</Card.Header>
			<Card.Footer>
				<Button>List Contracts</Button>
			</Card.Footer>
		</Card.Root>
	</div>
</div>
