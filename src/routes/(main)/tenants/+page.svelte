<script lang="ts">
	import PageSubtitle from '@/components/page-subtitle.svelte';
	import PageTitle from '@/components/page-title.svelte';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import { PlusCircle } from 'lucide-svelte';
	import TenantForm from './_components/tenant-form.svelte';
	import TenantTable from './_components/tenant-table.svelte';

	export let data;
	$: ({ tenants, createTenantForm } = data);
	let openForm = false;
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>Tenants ({tenants.length})</PageTitle>
			<PageSubtitle>Manage your tenants and Lorem Ipsum</PageSubtitle>
		</div>
		<Button on:click={() => (openForm = true)}>
			<PlusCircle class="mr-2 h-4 w-4" />
			Add Tenant
		</Button>
	</div>
	<Separator />
	<TenantTable {tenants} />
</div>

<TenantForm data={createTenantForm} action="?/create" bind:open={openForm} />
