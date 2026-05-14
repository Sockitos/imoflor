<script lang="ts">
	import { page } from '$app/state';
	import MovementTable from '@/movement/components/movement-table.svelte';
	import TenantDeleteDialog from '@/tenant/components/tenant-delete-dialog.svelte';
	import TenantForm from '@/tenant/components/tenant-form.svelte';
	import PageSubtitle from '@/shared/components/page-subtitle.svelte';
	import PageTitle from '@/shared/components/page-title.svelte';
	import { Button } from '@/shared/components/ui/button';
	import * as Card from '@/shared/components/ui/card';
	import { Separator } from '@/shared/components/ui/separator';
	import { dateFormatter } from '@/shared/formatters';
	import { genderOptions, maritalStatusOptions } from '@/shared/types';
	import { Pencil, PlusCircle, Trash } from 'lucide-svelte';

	let { data } = $props();
	let { tenant, movements, updateTenantForm, deleteTenantForm } = $derived(data);

	let openForm = $state(page.url.searchParams.get('action') === 'edit');
	let openDeleteDialog = $state(false);
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>Tenant #{tenant.id}</PageTitle>
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
						<dt class="text-sm text-muted-foreground">Name</dt>
						<dd>{tenant.name}</dd>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-sm text-muted-foreground">Gender</dt>
							<dd>{genderOptions[tenant.gender]}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Marital Status</dt>
							<dd>{maritalStatusOptions[tenant.marital_status]}</dd>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-sm text-muted-foreground">Nationality</dt>
							<dd>{tenant.nationality}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Birth Date</dt>
							<dd>{dateFormatter(tenant.birth_date)}</dd>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-sm text-muted-foreground">ID Type</dt>
							<dd>{tenant.id_type}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">ID Expiration Date</dt>
							<dd>{dateFormatter(tenant.id_expiration_date)}</dd>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-sm text-muted-foreground">ID Number</dt>
							<dd>{tenant.id_number}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Tax ID Number</dt>
							<dd>{tenant.tax_id_number}</dd>
						</div>
					</div>
				</div>
				<div class="flex flex-col gap-y-2">
					<div class="text-lg font-semibold tracking-tight">Address</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-sm text-muted-foreground">Country</dt>
							<dd>{tenant.address?.country}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Region</dt>
							<dd>{tenant.address?.region}</dd>
						</div>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">Address</dt>
						<dd>{tenant.address?.address}</dd>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-sm text-muted-foreground">Postal Code</dt>
							<dd>{tenant.address?.postal_code}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">City</dt>
							<dd>{tenant.address?.city}</dd>
						</div>
					</div>
				</div>
				<div>
					<div class="flex flex-col gap-y-2">
						<div class="text-lg font-semibold tracking-tight">Contacts</div>
						<div>
							<dt class="text-sm text-muted-foreground">Email</dt>
							<dd>{tenant.email}</dd>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-sm text-muted-foreground">Mobile</dt>
								<dd>{tenant.phone}</dd>
							</div>
							<div>
								<dt class="text-sm text-muted-foreground">Phone</dt>
								<dd>{tenant.phone}</dd>
							</div>
						</div>
					</div>
				</div>
			</dl>
			<Card.Root>
				<Card.Header class="pb-3">
					<Card.Title>Tenant's contracts</Card.Title>
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
				<Button>
					<PlusCircle class="mr-2 h-4 w-4" />
					Movement
				</Button>
			</div>
			<MovementTable {movements} />
		</div>
	</div>
</div>

<TenantForm data={updateTenantForm} action="?/update" bind:open={openForm} />

<TenantDeleteDialog data={deleteTenantForm} bind:open={openDeleteDialog} />
