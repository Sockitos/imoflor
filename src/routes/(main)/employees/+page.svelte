<script lang="ts">
	import EmployeeForm from '@/employee/components/employee-form.svelte';
	import EmployeeTable from '@/employee/components/employee-table.svelte';
	import { getEmployees } from '@/employee/employee.remote';
	import PageSubtitle from '@/shared/components/page-subtitle.svelte';
	import PageTitle from '@/shared/components/page-title.svelte';
	import { Button } from '@/shared/components/ui/button';
	import { Separator } from '@/shared/components/ui/separator';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { PlusCircle } from 'lucide-svelte';

	let openForm = $state(false);
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>
				Employees
				{#if getEmployees().ready}
					({getEmployees().current?.length})
				{/if}
			</PageTitle>
			<PageSubtitle>Manage your employees and Lorem Ipsum</PageSubtitle>
		</div>
		<Button onclick={() => (openForm = true)}>
			<PlusCircle class="mr-2 h-4 w-4" />
			Add Employee
		</Button>
	</div>
	<Separator />
	<svelte:boundary>
		{@const employees = await getEmployees()}

		<EmployeeTable {employees} />

		{#snippet pending()}
			<div class="flex items-center justify-center">
				<Spinner class="size-6" />
			</div>
		{/snippet}

		{#snippet failed(_, reset)}
			<div class="flex flex-col items-center gap-y-4">
				<p class="text-sm text-destructive">Failed to load employees.</p>
				<Button variant="outline" class="w-fit" onclick={reset}>Retry</Button>
			</div>
		{/snippet}
	</svelte:boundary>
</div>

<EmployeeForm bind:open={openForm} />
