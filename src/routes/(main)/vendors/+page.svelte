<script lang="ts">
	import VendorForm from '@/vendor/components/vendor-form.svelte';
	import VendorTable from '@/vendor/components/vendor-table.svelte';
	import PageSubtitle from '@/shared/components/page-subtitle.svelte';
	import PageTitle from '@/shared/components/page-title.svelte';
	import { Button } from '@/shared/components/ui/button';
	import { Separator } from '@/shared/components/ui/separator';
	import { PlusCircle } from 'lucide-svelte';

	let { data } = $props();
	let { vendors, createVendorForm } = $derived(data);
	let openForm = $state(false);
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>Vendors ({vendors.length})</PageTitle>
			<PageSubtitle>Manage your vendors and Lorem Ipsum</PageSubtitle>
		</div>
		<Button onclick={() => (openForm = true)}>
			<PlusCircle class="mr-2 h-4 w-4" />
			Add Vendor
		</Button>
	</div>
	<Separator />
	<VendorTable {vendors} />
</div>

<VendorForm data={createVendorForm} action="?/create" bind:open={openForm} />
