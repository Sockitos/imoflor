<script lang="ts">
	import { page } from '$app/state';
	import MovementTable from '@/components/movement-table.svelte';
	import PageSubtitle from '@/components/page-subtitle.svelte';
	import PageTitle from '@/components/page-title.svelte';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import { Pencil, PlusCircle, Trash } from 'lucide-svelte';
	import VendorDeleteDialog from '../_components/vendor-delete-dialog.svelte';
	import VendorForm from '../_components/vendor-form.svelte';

	let { data } = $props();
	let { vendor, movements, updateVendorForm, deleteVendorForm } = $derived(data);

	let openForm = $state(page.url.searchParams.get('action') === 'edit');
	let openDeleteDialog = $state(false);
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>Vendor #{vendor.id}</PageTitle>
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
						<dd>{vendor.name}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground text-sm">Tax ID Number</dt>
						<dd>{vendor.tax_id_number}</dd>
					</div>
				</div>
				<div class="flex flex-col gap-y-2">
					<div class="text-lg font-semibold tracking-tight">Address</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-muted-foreground text-sm">Country</dt>
							<dd>{vendor.country}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground text-sm">Region</dt>
							<dd>{vendor.region}</dd>
						</div>
					</div>
					<div>
						<dt class="text-muted-foreground text-sm">Address</dt>
						<dd>{vendor.address}</dd>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-muted-foreground text-sm">Postal Code</dt>
							<dd>{vendor.postal_code}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground text-sm">City</dt>
							<dd>{vendor.city}</dd>
						</div>
					</div>
				</div>
				<div>
					<div class="flex flex-col gap-y-2">
						<div class="text-lg font-semibold tracking-tight">Contacts</div>
						<div>
							<dt class="text-muted-foreground text-sm">Email</dt>
							<dd>{vendor.email}</dd>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-muted-foreground text-sm">Mobile</dt>
								<dd>{vendor.phone}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground text-sm">Phone</dt>
								<dd>{vendor.phone}</dd>
							</div>
						</div>
					</div>
				</div>
			</dl>
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

<VendorForm data={updateVendorForm} action="?/update" bind:open={openForm} />

<VendorDeleteDialog {vendor} data={deleteVendorForm} bind:open={openDeleteDialog} />
