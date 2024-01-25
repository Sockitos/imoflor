<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import * as Sheet from '@/components/ui/sheet';
	import { PlusCircle } from 'lucide-svelte';
	import EmployeeForm from './_components/employee-form.svelte';
	import EmployeeTable from './_components/employee-table.svelte';

	export let data;
</script>

<div class="px-4 py-6 lg:px-8">
	<EmployeeTable employees={data.employees}>
		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]}>
					<PlusCircle class="mr-2 h-4 w-4" />
					Add Employee
				</Button>
			</Sheet.Trigger>
			<Sheet.Content class="overflow-y-auto sm:max-w-[40rem]">
				<Sheet.Header>
					<Sheet.Title>Add new employee</Sheet.Title>
					<Sheet.Description>Fill the form below to add a new employee.</Sheet.Description>
				</Sheet.Header>
				<Separator class="my-5" />
				<EmployeeForm form={data.createForm} />
			</Sheet.Content>
		</Sheet.Root>
	</EmployeeTable>
</div>
