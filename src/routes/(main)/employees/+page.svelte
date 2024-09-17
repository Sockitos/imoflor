<script lang="ts">
	import PageSubtitle from '@/components/page-subtitle.svelte';
	import PageTitle from '@/components/page-title.svelte';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import { PlusCircle } from 'lucide-svelte';
	import EmployeeForm from './_components/employee-form.svelte';
	import EmployeeTable from './_components/employee-table.svelte';

	export let data;
	$: ({ employees, createEmployeeForm } = data);
	let openForm = false;
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>Employees ({employees.length})</PageTitle>
			<PageSubtitle>Manage your employees and Lorem Ipsum</PageSubtitle>
		</div>
		<Button on:click={() => (openForm = true)}>
			<PlusCircle class="mr-2 h-4 w-4" />
			Add Employee
		</Button>
	</div>
	<Separator />
	<EmployeeTable {employees} />
</div>

<EmployeeForm data={createEmployeeForm} action="?/create" bind:open={openForm} />
