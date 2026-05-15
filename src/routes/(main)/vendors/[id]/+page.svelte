<script lang="ts">
	import { page } from '$app/state';
	import MovementTable from '@/movement/components/movement-table.svelte';
	import VendorDeleteDialog from '@/vendor/components/vendor-delete-dialog.svelte';
	import VendorForm from '@/vendor/components/vendor-form.svelte';
	import PageSubtitle from '@/shared/components/page-subtitle.svelte';
	import PageTitle from '@/shared/components/page-title.svelte';
	import { Badge } from '@/shared/components/ui/badge';
	import { Button } from '@/shared/components/ui/button';
	import { Separator } from '@/shared/components/ui/separator';
	import { Pencil, PlusCircle, Trash } from 'lucide-svelte';

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
						<dt class="text-sm text-muted-foreground">Name</dt>
						<dd>{vendor.name}</dd>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">Tax ID Number</dt>
						<dd>{vendor.tax_id_number}</dd>
					</div>
					{#if vendor.description}
						<div>
							<dt class="text-sm text-muted-foreground">Description</dt>
							<dd>{vendor.description}</dd>
						</div>
					{/if}
					{#if vendor.tags?.length}
						<div>
							<dt class="text-sm text-muted-foreground">Tags</dt>
							<dd class="flex flex-row flex-wrap gap-1 pt-1">
								{#each vendor.tags as tag (tag)}
									<Badge variant="outline">{tag}</Badge>
								{/each}
							</dd>
						</div>
					{/if}
				</div>
				<div class="flex flex-col gap-y-2">
					<div class="text-lg font-semibold tracking-tight">Address</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-sm text-muted-foreground">Country</dt>
							<dd>{vendor.address?.country}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Region</dt>
							<dd>{vendor.address?.region}</dd>
						</div>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">Address</dt>
						<dd>{vendor.address?.address}</dd>
					</div>
					<div class="grid grid-cols-2 gap-y-2">
						<div>
							<dt class="text-sm text-muted-foreground">Postal Code</dt>
							<dd>{vendor.address?.postal_code}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">City</dt>
							<dd>{vendor.address?.city}</dd>
						</div>
					</div>
				</div>
				<div>
					<div class="flex flex-col gap-y-2">
						<div class="text-lg font-semibold tracking-tight">Contacts</div>
						{#if vendor.website}
							<div>
								<dt class="text-sm text-muted-foreground">Website</dt>
								<dd>{vendor.website}</dd>
							</div>
						{/if}
						<div>
							<dt class="text-sm text-muted-foreground">Email</dt>
							<dd>{vendor.email}</dd>
						</div>
						<div class="grid grid-cols-2 gap-y-2">
							<div>
								<dt class="text-sm text-muted-foreground">Mobile</dt>
								<dd>{vendor.mobile}</dd>
							</div>
							<div>
								<dt class="text-sm text-muted-foreground">Phone</dt>
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

<VendorForm data={updateVendorForm} action="?/update" bind:open={openForm} />

<VendorDeleteDialog data={deleteVendorForm} bind:open={openDeleteDialog} />
