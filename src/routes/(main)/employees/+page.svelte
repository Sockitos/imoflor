<script lang="ts">
	import EmployeeForm from '@/employee/components/employee-form.svelte';
	import EmployeeTable from '@/employee/components/employee-table.svelte';
	import PageSubtitle from '@/shared/components/page-subtitle.svelte';
	import PageTitle from '@/shared/components/page-title.svelte';
	import { Button } from '@/shared/components/ui/button';
	import { Separator } from '@/shared/components/ui/separator';
	import { PlusCircle } from 'lucide-svelte';

	let { data } = $props();
	let { employees, createEmployeeForm } = $derived(data);
	let openForm = $state(false);
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>Employees ({employees.length})</PageTitle>
			<PageSubtitle>Manage your employees and Lorem Ipsum</PageSubtitle>
		</div>
		<Button onclick={() => (openForm = true)}>
			<PlusCircle class="mr-2 h-4 w-4" />
			Add Employee
		</Button>
	</div>
	<Separator />
	<EmployeeTable {employees} />
</div>

<EmployeeForm data={createEmployeeForm} action="?/create" bind:open={openForm} />
