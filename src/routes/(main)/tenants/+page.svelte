<script lang="ts">
	import TenantForm from '@/tenant/components/tenant-form.svelte';
	import TenantTable from '@/tenant/components/tenant-table.svelte';
	import PageSubtitle from '@/shared/components/page-subtitle.svelte';
	import PageTitle from '@/shared/components/page-title.svelte';
	import { Button } from '@/shared/components/ui/button';
	import { Separator } from '@/shared/components/ui/separator';
	import { PlusCircle } from 'lucide-svelte';
	import { getTenants } from '@/tenant/tenant.remote';
	import Spinner from '@/shared/components/ui/spinner/spinner.svelte';

	let openForm = $state(false);
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle
				>Tenants
				{#if getTenants().ready}
					({getTenants().current?.length})
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
		{@const tenants = await getTenants()}

		<TenantTable {tenants} />

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

<TenantForm bind:open={openForm} />
