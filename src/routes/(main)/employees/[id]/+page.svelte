<script lang="ts">
	import { page } from '$app/state';
	import MovementTable from '@/components/movement-table.svelte';
	import PageSubtitle from '@/components/page-subtitle.svelte';
	import PageTitle from '@/components/page-title.svelte';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { Separator } from '@/components/ui/separator';
	import { dateFormatter } from '@/formatters';
	import { Pencil, PlusCircle, Trash } from 'lucide-svelte';
	import EmployeeDeleteDialog from '../_components/employee-delete-dialog.svelte';
	import EmployeeForm from '../_components/employee-form.svelte';

	let { data } = $props();
	let { employee, movements, updateEmployeeForm, deleteEmployeeForm } = $derived(data);

	let openForm = $state(page.url.searchParams.get('action') === 'edit');
	let openDeleteDialog = $state(false);
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>Employee #{employee.id}</PageTitle>
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
					<div class="text-lg font-semibold tracking-tight">Identification</div>
					<div>
						<dt class="text-muted-foreground text-sm">Name</dt>
						<dd>{employee.name}</dd>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-muted-foreground text-sm">Gender</dt>
							<dd>{employee.gender}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground text-sm">Marital Status</dt>
							<dd>{employee.marital_status}</dd>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-muted-foreground text-sm">Nationality</dt>
							<dd>{employee.nationality}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground text-sm">Birth Date</dt>
							<dd>{dateFormatter(employee.birth_date)}</dd>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-muted-foreground text-sm">ID Type</dt>
							<dd>{employee.id_type}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground text-sm">ID Expiration Date</dt>
							<dd>{dateFormatter(employee.id_expiration_date)}</dd>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-muted-foreground text-sm">ID Number</dt>
							<dd>{employee.id_number}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground text-sm">SS Number</dt>
							<dd>{employee.tax_id_number}</dd>
						</div>
					</div>
					<div>
						<dt class="text-muted-foreground text-sm">SS Number</dt>
						<dd>{employee.ss_number}</dd>
					</div>
				</div>
				<div class="flex flex-col gap-y-2">
					<div class="text-lg font-semibold tracking-tight">Address</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-muted-foreground text-sm">Country</dt>
							<dd>{employee.country}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground text-sm">Region</dt>
							<dd>{employee.region}</dd>
						</div>
					</div>
					<div>
						<dt class="text-muted-foreground text-sm">Address</dt>
						<dd>{employee.address}</dd>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-muted-foreground text-sm">Postal Code</dt>
							<dd>{employee.postal_code}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground text-sm">City</dt>
							<dd>{employee.city}</dd>
						</div>
					</div>
				</div>
				<div>
					<div class="flex flex-col gap-y-2">
						<div class="text-lg font-semibold tracking-tight">Contacts</div>
						<div>
							<dt class="text-muted-foreground text-sm">Email</dt>
							<dd>{employee.email}</dd>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-muted-foreground text-sm">Mobile</dt>
								<dd>{employee.phone}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground text-sm">Phone</dt>
								<dd>{employee.phone}</dd>
							</div>
						</div>
					</div>
				</div>
			</dl>
			<Card.Root>
				<Card.Header class="pb-3">
					<Card.Title>Employee's contracts</Card.Title>
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
					<h2 class="text-lg font-semibold">Movements</h2>
					<p class="text-muted-foreground text-sm">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua.
					</p>
				</div>
				<Button>
					<PlusCircle class="mr-2 h-4 w-4" />
					Movement
				</Button>
			</div>
			<MovementTable {movements} />
		</div>
	</div>
</div>

<EmployeeForm data={updateEmployeeForm} action="?/update" bind:open={openForm} />

<EmployeeDeleteDialog {employee} data={deleteEmployeeForm} bind:open={openDeleteDialog} />
