<script lang="ts">
	import ContractForm from '@/contract/components/contract-form.svelte';
	import ContractTable from '@/contract/components/contract-table.svelte';
	import { getContracts } from '@/contract/contract.remote';
	import PageSubtitle from '@/shared/components/page-subtitle.svelte';
	import PageTitle from '@/shared/components/page-title.svelte';
	import { Button } from '@/shared/components/ui/button';
	import { Separator } from '@/shared/components/ui/separator';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { PlusCircle } from 'lucide-svelte';

	let openForm = $state(false);
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>
				Contracts
				{#if getContracts().ready}
					({getContracts().current?.length})
				{/if}
			</PageTitle>
			<PageSubtitle>Manage your contracts and Lorem Ipsum</PageSubtitle>
		</div>

		{#if getContracts().ready}
			<Button onclick={() => (openForm = true)}>
				<PlusCircle class="mr-2 h-4 w-4" />
				Add Contract
			</Button>
		{/if}
	</div>
	<Separator />
	<svelte:boundary>
		{@const contracts = await getContracts()}

		<ContractTable {contracts} />

		{#snippet pending()}
			<div class="flex items-center justify-center">
				<Spinner class="size-6" />
			</div>
		{/snippet}

		{#snippet failed(_, reset)}
			<div class="flex flex-col items-center gap-y-4">
				<p class="text-sm text-destructive">Failed to load contracts.</p>
				<Button variant="outline" class="w-fit" onclick={reset}>Retry</Button>
			</div>
		{/snippet}
	</svelte:boundary>
</div>

<ContractForm bind:open={openForm} />
