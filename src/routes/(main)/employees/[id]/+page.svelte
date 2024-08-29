<script lang="ts">
	import MovementTable from '@/components/movement-table.svelte';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { dateFormatter } from '@/formatters';

	export let data;
</script>

<div class="grid grid-cols-3 gap-x-6 px-4 py-6 lg:px-8">
	<div class="col-span-2">
		<MovementTable movements={data.movements} />
	</div>
	<div class="flex flex-col gap-y-6">
		<Card.Root>
			<Card.Header>
				<Card.Title>Employee #{data.employee.id}</Card.Title>
				<Card.Description>Last updated in 01/01/2024</Card.Description>
			</Card.Header>
			<Card.Content>
				<dl class="flex flex-col gap-y-4 text-sm">
					<div class="flex flex-col gap-y-2">
						<div class="font-medium">Identification</div>
						<div>
							<dt class="text-muted-foreground">Name</dt>
							<dd>{data.employee.name}</dd>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-muted-foreground">Gender</dt>
								<dd>{data.employee.gender}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground">Marital Status</dt>
								<dd>{data.employee.marital_status}</dd>
							</div>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-muted-foreground">Nationality</dt>
								<dd>{data.employee.nationality}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground">Birth Date</dt>
								<dd>{dateFormatter(data.employee.birth_date)}</dd>
							</div>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-muted-foreground">ID Type</dt>
								<dd>{data.employee.id_type}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground">ID Expiration Date</dt>
								<dd>{dateFormatter(data.employee.id_expiration_date)}</dd>
							</div>
						</div>
						<div class="grid grid-cols-3 gap-y-2">
							<div>
								<dt class="text-muted-foreground">ID Number</dt>
								<dd>{data.employee.id_number}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground">SS Number</dt>
								<dd>{data.employee.ss_number}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground">F Number</dt>
								<dd>{data.employee.nif}</dd>
							</div>
						</div>
					</div>
					<div class="flex flex-col gap-y-2">
						<div class="font-medium">Address</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-muted-foreground">Country</dt>
								<dd>{data.employee.country}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground">Region</dt>
								<dd>{data.employee.region}</dd>
							</div>
						</div>
						<div>
							<dt class="text-muted-foreground">Address</dt>
							<dd>{data.employee.address}</dd>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-muted-foreground">Postal Code</dt>
								<dd>{data.employee.postal_code}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground">City</dt>
								<dd>{data.employee.city}</dd>
							</div>
						</div>
					</div>
					<div>
						<div class="flex flex-col gap-y-2">
							<div class="font-medium">Contacts</div>
							<div>
								<dt class="text-muted-foreground">Email</dt>
								<dd>{data.employee.email}</dd>
							</div>
							<div class="grid grid-cols-2 gap-y-2">
								<div>
									<dt class="text-muted-foreground">mobile</dt>
									<dd>{data.employee.phone}</dd>
								</div>
								<div>
									<dt class="text-muted-foreground">Phone</dt>
									<dd>{data.employee.phone}</dd>
								</div>
							</div>
						</div>
					</div>
				</dl>
			</Card.Content>
		</Card.Root>
		<Card.Root class="sm:col-span-2">
			<Card.Header class="pb-3">
				<Card.Title>Tenant's contracts</Card.Title>
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
