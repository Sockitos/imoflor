<script lang="ts">
	import PageSubtitle from '@/shared/components/page-subtitle.svelte';
	import PageTitle from '@/shared/components/page-title.svelte';
	import { Button } from '@/shared/components/ui/button';
	import { Separator } from '@/shared/components/ui/separator';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { CirclePlus } from 'lucide-svelte';
	import PropertyForm from '@/property/components/property-form.svelte';
	import PropertyTable from '@/property/components/property-table.svelte';
	import { getProperties } from '@/property/property.remote';

	let openForm = $state(false);
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>
				Properties
				{#if getProperties().ready}
					({getProperties().current?.length})
				{/if}
			</PageTitle>
			<PageSubtitle>Manage your properties and Lorem Ipsum</PageSubtitle>
		</div>
		{#if getProperties().ready}
			<Button onclick={() => (openForm = true)}>
				<CirclePlus class="mr-2 h-4 w-4" />
				Add Property
			</Button>
		{/if}
	</div>
	<Separator />
	<svelte:boundary>
		{@const properties = await getProperties()}

		<PropertyTable {properties} />

		{#snippet pending()}
			<div class="flex items-center justify-center">
				<Spinner class="size-6" />
			</div>
		{/snippet}

		{#snippet failed(_, reset)}
			<div class="flex flex-col items-center gap-y-4">
				<p class="text-sm text-destructive">Failed to load properties.</p>
				<Button variant="outline" class="w-fit" onclick={reset}>Retry</Button>
			</div>
		{/snippet}
	</svelte:boundary>
</div>

<PropertyForm bind:open={openForm} />
