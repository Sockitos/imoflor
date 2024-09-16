<script lang="ts">
	import PageSubtitle from '@/components/page-subtitle.svelte';
	import PageTitle from '@/components/page-title.svelte';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import { PlusCircle } from 'lucide-svelte';
	import PropertyForm from './_components/property-form.svelte';
	import PropertyTable from './_components/property-table.svelte';

	export let data;
	$: ({ properties, createForm } = data);
	let openForm = false;
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>Properties ({properties.length})</PageTitle>
			<PageSubtitle>Manage your properties and Lorem Ipsum</PageSubtitle>
		</div>
		<Button on:click={() => (openForm = true)}>
			<PlusCircle class="mr-2 h-4 w-4" />
			Add Property
		</Button>
	</div>
	<Separator />
	<PropertyTable {properties} />
</div>

<PropertyForm data={createForm} action="?/create" bind:open={openForm} />
