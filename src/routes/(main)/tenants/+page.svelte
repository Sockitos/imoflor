<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import * as Sheet from '@/components/ui/sheet';
	import { PlusCircle } from 'lucide-svelte';
	import TenantForm from './_components/tenant-form.svelte';
	import TenantTable from './_components/tenant-table.svelte';

	export let data;
</script>

<div class="px-4 py-6 lg:px-8">
	<TenantTable tenants={data.tenants}>
		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]}>
					<PlusCircle class="mr-2 h-4 w-4" />
					Add Tenant
				</Button>
			</Sheet.Trigger>
			<Sheet.Content class="overflow-y-auto sm:max-w-[40rem]">
				<Sheet.Header>
					<Sheet.Title>Add new tenant</Sheet.Title>
					<Sheet.Description>Fill the form below to add a new tenant.</Sheet.Description>
				</Sheet.Header>
				<Separator class="my-5" />
				<TenantForm form={data.createForm} />
			</Sheet.Content>
		</Sheet.Root>
	</TenantTable>
</div>
