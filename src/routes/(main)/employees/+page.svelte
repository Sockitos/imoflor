<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { PlusCircle } from 'lucide-svelte';
	import EmployeeForm from './_components/employee-form.svelte';
	import EmployeeTable from './_components/employee-table.svelte';

	export let data;
	$: ({ employees, createEmployeeForm } = data);
	let openForm = false;
</script>

<div class="container mx-auto py-10">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-3xl font-bold tracking-tight">Employees</h2>
			<p class="text-muted-foreground">Manage your employees and their information</p>
		</div>
		<Button onclick={() => (openForm = true)}>
			<PlusCircle class="mr-2 h-4 w-4" />
			Add Employee
		</Button>
	</div>
	<Separator class="my-6" />
	<EmployeeTable {employees} />
</div>

<EmployeeForm data={createEmployeeForm} action="?/create" bind:open={openForm} />
