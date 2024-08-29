<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Sheet from '@/components/ui/sheet';
	import { PlusCircle } from 'lucide-svelte';
	import ContractForm from './_components/contract-form.svelte';
	import ContractTable from './_components/contract-table.svelte';

	export let data;
	$: ({ contracts, createForm } = data);
</script>

<div class="px-4 py-6 lg:px-8">
	<ContractTable {contracts}>
		<ContractForm data={createForm}>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]}>
					<PlusCircle class="mr-2 h-4 w-4" />
					Add Contract
				</Button>
			</Sheet.Trigger>
		</ContractForm>
	</ContractTable>
</div>
