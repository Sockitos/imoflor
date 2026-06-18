<script lang="ts">
	import { page } from '$app/state';
	import { getEmployee } from '@/employee/employee.remote';
	import EmployeeDeleteDialog from '@/employee/components/employee-delete-dialog.svelte';
	import EmployeeForm from '@/employee/components/employee-form.svelte';
	import { getMovements } from '@/movement/movement.remote';
	import MovementTable from '@/movement/components/movement-table.svelte';
	import PageSubtitle from '@/shared/components/page-subtitle.svelte';
	import PageTitle from '@/shared/components/page-title.svelte';
	import { Button } from '@/shared/components/ui/button';
	import * as Card from '@/shared/components/ui/card';
	import { Separator } from '@/shared/components/ui/separator';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { dateFormatter } from '@/shared/formatters';
	import { genderOptions, maritalStatusOptions } from '@/shared/types';
	import { salaryTypeOptions } from '@/employee/types';
	import { Pencil, PlusCircle, Trash } from 'lucide-svelte';

	let openForm = $state(false);
	let openDeleteDialog = $state(false);
</script>

<svelte:boundary>
	{@const employee = await getEmployee(Number(page.params.id))}

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
						<div class="text-lg font-semibold tracking-tight">Position</div>
						<div>
							<dt class="text-sm text-muted-foreground">Job Title</dt>
							<dd>{employee.position}</dd>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-sm text-muted-foreground">Salary Type</dt>
								<dd>{salaryTypeOptions[employee.salary_type]}</dd>
							</div>
							<div>
								<dt class="text-sm text-muted-foreground">Salary</dt>
								<dd>{employee.salary}</dd>
							</div>
						</div>
					</div>
					<div class="flex flex-col gap-y-2">
						<div class="text-lg font-semibold tracking-tight">Identification</div>
						<div>
							<dt class="text-sm text-muted-foreground">Name</dt>
							<dd>{employee.name}</dd>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-sm text-muted-foreground">Gender</dt>
								<dd>{genderOptions[employee.gender]}</dd>
							</div>
							<div>
								<dt class="text-sm text-muted-foreground">Marital Status</dt>
								<dd>{maritalStatusOptions[employee.marital_status]}</dd>
							</div>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-sm text-muted-foreground">Nationality</dt>
								<dd>{employee.nationality}</dd>
							</div>
							<div>
								<dt class="text-sm text-muted-foreground">Birth Date</dt>
								<dd>{dateFormatter(employee.birth_date)}</dd>
							</div>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-sm text-muted-foreground">ID Type</dt>
								<dd>{employee.id_type}</dd>
							</div>
							<div>
								<dt class="text-sm text-muted-foreground">ID Expiration Date</dt>
								<dd>{dateFormatter(employee.id_expiration_date)}</dd>
							</div>
						</div>
						<div class="grid grid-cols-3 gap-y-2">
							<div>
								<dt class="text-sm text-muted-foreground">ID Number</dt>
								<dd>{employee.id_number}</dd>
							</div>
							<div>
								<dt class="text-sm text-muted-foreground">Tax ID Number</dt>
								<dd>{employee.tax_id_number}</dd>
							</div>
							<div>
								<dt class="text-sm text-muted-foreground">SS Number</dt>
								<dd>{employee.ss_number}</dd>
							</div>
						</div>
					</div>
					<div class="flex flex-col gap-y-2">
						<div class="text-lg font-semibold tracking-tight">Address</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-sm text-muted-foreground">Country</dt>
								<dd>{employee.address?.country}</dd>
							</div>
							<div>
								<dt class="text-sm text-muted-foreground">Region</dt>
								<dd>{employee.address?.region}</dd>
							</div>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Address</dt>
							<dd>{employee.address?.address}</dd>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-sm text-muted-foreground">Postal Code</dt>
								<dd>{employee.address?.postal_code}</dd>
							</div>
							<div>
								<dt class="text-sm text-muted-foreground">City</dt>
								<dd>{employee.address?.city}</dd>
							</div>
						</div>
					</div>
					<div class="flex flex-col gap-y-2">
						<div class="text-lg font-semibold tracking-tight">Contacts</div>
						<div>
							<dt class="text-sm text-muted-foreground">Email</dt>
							<dd>{employee.email}</dd>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-sm text-muted-foreground">Mobile</dt>
								<dd>{employee.mobile}</dd>
							</div>
							<div>
								<dt class="text-sm text-muted-foreground">Phone</dt>
								<dd>{employee.phone}</dd>
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
						<p class="text-sm text-muted-foreground">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
							incididunt ut labore et dolore magna aliqua.
						</p>
					</div>
					{#if getMovements(employee.tax_id_number).ready}
						<Button>
							<PlusCircle class="mr-2 h-4 w-4" />
							Movement
						</Button>
					{/if}
				</div>
				<svelte:boundary>
					{@const movements = await getMovements(employee.tax_id_number)}

					<MovementTable {movements} />

					{#snippet pending()}
						<div class="flex items-center justify-center px-4 py-6 lg:px-8">
							<Spinner class="size-6" />
						</div>
					{/snippet}

					{#snippet failed(_, reset)}
						<div class="flex flex-col items-center gap-y-4 px-4 py-6 lg:px-8">
							<p class="text-sm text-destructive">Failed to load movements.</p>
							<Button variant="outline" class="w-fit" onclick={reset}>Retry</Button>
						</div>
					{/snippet}
				</svelte:boundary>
			</div>
		</div>
	</div>

	<EmployeeForm {employee} bind:open={openForm} />

	<EmployeeDeleteDialog employeeId={employee.id} bind:open={openDeleteDialog} />

	{#snippet pending()}
		<div class="flex items-center justify-center px-4 py-6 lg:px-8">
			<Spinner class="size-6" />
		</div>
	{/snippet}

	{#snippet failed(_, reset)}
		<div class="flex flex-col items-center gap-y-4 px-4 py-6 lg:px-8">
			<p class="text-sm text-destructive">Failed to load employee.</p>
			<Button variant="outline" class="w-fit" onclick={reset}>Retry</Button>
		</div>
	{/snippet}
</svelte:boundary>
