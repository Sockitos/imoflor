<script lang="ts">
	import PageSubtitle from '@/components/page-subtitle.svelte';
	import PageTitle from '@/components/page-title.svelte';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import { Spinner } from '@/components/ui/spinner';
	import { PlusCircle } from 'lucide-svelte';
	import TenantForm from '@tenants/components/tenant-form.svelte';
	import TenantTable from '@tenants/components/tenant-table.svelte';
	import { getTenants } from '@/tenants/remotes/tenants.remote.js';

	let { data } = $props();
	let { createTenantForm } = $derived(data);

	const tenants = getTenants();

	let openForm = $state(false);
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle
				>Tenants
				{#if tenants.ready}
					({tenants.current?.length})
				{/if}
			</PageTitle>
			<PageSubtitle>Manage your tenants and Lorem Ipsum</PageSubtitle>
		</div>
		<Button onclick={() => (openForm = true)}>
			<PlusCircle class="mr-2 h-4 w-4" />
			Add Tenant
		</Button>
	</div>
	<Separator />
	<svelte:boundary>
		<TenantTable tenants={(await tenants) ?? []} />
		{#snippet pending()}
			<div class="flex items-center justify-center">
				<Spinner class="size-6" />
			</div>
		{/snippet}

		{#snippet failed(_, reset)}
			<div class="flex flex-col items-center gap-y-4">
				<p class="text-sm text-destructive">Failed to load tenants.</p>
				<Button variant="outline" class="w-fit" onclick={reset}>Retry</Button>
			</div>
		{/snippet}
	</svelte:boundary>
</div>

<TenantForm data={createTenantForm} action="?/create" bind:open={openForm} />
