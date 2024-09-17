<script lang="ts">
	import PageSubtitle from '@/components/page-subtitle.svelte';
	import PageTitle from '@/components/page-title.svelte';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import { PlusCircle } from 'lucide-svelte';
	import VendorForm from './_components/vendor-form.svelte';
	import VendorTable from './_components/vendor-table.svelte';

	export let data;
	$: ({ vendors, createVendorForm } = data);
	let openForm = false;
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>Vendors ({vendors.length})</PageTitle>
			<PageSubtitle>Manage your vendors and Lorem Ipsum</PageSubtitle>
		</div>
		<Button on:click={() => (openForm = true)}>
			<PlusCircle class="mr-2 h-4 w-4" />
			Add Vendor
		</Button>
	</div>
	<Separator />
	<VendorTable {vendors} />
</div>

<VendorForm data={createVendorForm} action="?/create" bind:open={openForm} />
