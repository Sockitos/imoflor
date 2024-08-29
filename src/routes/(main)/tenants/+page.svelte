<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Sheet from '@/components/ui/sheet';
	import { PlusCircle } from 'lucide-svelte';
	import TenantForm from './_components/tenant-form.svelte';
	import TenantTable from './_components/tenant-table.svelte';

	export let data;
	$: ({ tenants, createForm } = data);
</script>

<div class="px-4 py-6 lg:px-8">
	<TenantTable {tenants}>
		<TenantForm data={createForm}>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]}>
					<PlusCircle class="mr-2 h-4 w-4" />
					Add Tenant
				</Button>
			</Sheet.Trigger>
		</TenantForm>
	</TenantTable>
</div>
