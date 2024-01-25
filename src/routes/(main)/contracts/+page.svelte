<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import * as Sheet from '@/components/ui/sheet';
	import { PlusCircle } from 'lucide-svelte';
	import ContractForm from './_components/contract-form.svelte';
	import ContractTable from './_components/contract-table.svelte';

	export let data;
</script>

<div class="px-4 py-6 lg:px-8">
	<ContractTable contracts={data.contracts}>
		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]}>
					<PlusCircle class="mr-2 h-4 w-4" />
					Add Contract
				</Button>
			</Sheet.Trigger>
			<Sheet.Content class="sm:max-w-[40rem]">
				<Sheet.Header>
					<Sheet.Title>Add new contract</Sheet.Title>
					<Sheet.Description>Fill the form below to add a new contract.</Sheet.Description>
				</Sheet.Header>
				<Separator class="my-5" />
				<ContractForm form={data.createForm} />
			</Sheet.Content>
		</Sheet.Root>
	</ContractTable>
</div>
