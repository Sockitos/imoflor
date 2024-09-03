<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { areaFormatter, currencyFormatter } from '@/formatters';

	export let data;
	$: ({ property } = data);
</script>

<div class="grid grid-cols-3 gap-x-6 px-4 py-6 lg:px-8">
	<div class="col-span-2"></div>
	<div class="flex flex-col gap-y-6">
		<Card.Root>
			<Card.Header>
				<Card.Title>Property #{property.id}</Card.Title>
				<Card.Description>Last updated in 01/01/2024</Card.Description>
			</Card.Header>
			<Card.Content>
				<dl class="flex flex-col gap-y-4 text-sm">
					<div class="flex flex-col gap-y-2">
						<div class="font-medium">Information</div>
						<div>
							<dt class="text-muted-foreground">Type</dt>
							<dd>{property.type}</dd>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-muted-foreground">Matrix</dt>
								<dd>{property.matrix}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground">Conservatory</dt>
								<dd>{property.conservatory}</dd>
							</div>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-muted-foreground">Area</dt>
								<dd>{areaFormatter(property.area)}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground">Tipology</dt>
								<dd>{property.tipology}</dd>
							</div>
						</div>
						<div>
							<dt class="text-muted-foreground">Description</dt>
							<dd>{property.description}</dd>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-muted-foreground">Patrimonial Value</dt>
								<dd>{currencyFormatter.format(property.patrimonial_value ?? 0)}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground">Market Value</dt>
								<dd>{currencyFormatter.format(property.market_value ?? 0)}</dd>
							</div>
						</div>
					</div>
					<div class="flex flex-col gap-y-2">
						<div class="font-medium">Address</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-muted-foreground">Country</dt>
								<dd>{property.country}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground">Region</dt>
								<dd>{property.region}</dd>
							</div>
						</div>
						<div>
							<dt class="text-muted-foreground">Address</dt>
							<dd>{property.address}</dd>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-muted-foreground">Postal Code</dt>
								<dd>{property.postal_code}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground">City</dt>
								<dd>{property.city}</dd>
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
