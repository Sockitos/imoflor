<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Sheet from '@/components/ui/sheet';
	import { PlusCircle } from 'lucide-svelte';
	import EmployeeForm from './_components/employee-form.svelte';
	import EmployeeTable from './_components/employee-table.svelte';

	export let data;
	$: ({ employees, createForm } = data);
</script>

<div class="px-4 py-6 lg:px-8">
	<EmployeeTable {employees}>
		<EmployeeForm data={createForm}>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]}>
					<PlusCircle class="mr-2 h-4 w-4" />
					Add Employee
				</Button>
			</Sheet.Trigger>
		</EmployeeForm>
	</EmployeeTable>
</div>
