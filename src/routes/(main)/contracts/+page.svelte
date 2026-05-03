<script lang="ts">
	import PageSubtitle from '@/components/page-subtitle.svelte';
	import PageTitle from '@/components/page-title.svelte';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import { PlusCircle } from 'lucide-svelte';
	import ContractForm from './_components/contract-form.svelte';
	import ContractTable from './_components/contract-table.svelte';

	let { data } = $props();
	let { contracts, createContractForm } = $derived(data);
	let openForm = $state(false);
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>Contracts ({contracts.length})</PageTitle>
			<PageSubtitle>Manage your contracts and Lorem Ipsum</PageSubtitle>
		</div>
		<Button onclick={() => (openForm = true)}>
			<PlusCircle class="mr-2 h-4 w-4" />
			Add Contract
		</Button>
	</div>
	<Separator />
	<ContractTable {contracts} />
</div>

<ContractForm data={createContractForm} action="?/create" bind:open={openForm} />
