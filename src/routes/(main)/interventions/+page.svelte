<script lang="ts">
	import PageSubtitle from '@/components/page-subtitle.svelte';
	import PageTitle from '@/components/page-title.svelte';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import { PlusCircle } from 'lucide-svelte';
	import InterventionForm from './_components/intervention-form.svelte';
	import InterventionTable from './_components/intervention-table.svelte';

	let { data } = $props();
	let { interventions, createInterventionForm } = $derived(data);
	let openForm = $state(false);
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>Interventions ({interventions.length})</PageTitle>
			<PageSubtitle>Manage your interventions and Lorem Ipsum</PageSubtitle>
		</div>
		<Button onclick={() => (openForm = true)}>
			<PlusCircle class="mr-2 h-4 w-4" />
			Add Intervention
		</Button>
	</div>
	<Separator />
	<InterventionTable {interventions} />
</div>

<InterventionForm data={createInterventionForm} action="?/create" bind:open={openForm} />
