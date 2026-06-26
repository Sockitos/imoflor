<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button } from '@/shared/components/ui/button';
	import * as DropdownMenu from '@/shared/components/ui/dropdown-menu';
	import { Ellipsis } from 'lucide-svelte';
	import type { Employee } from '../types';
	import EmployeeDeleteDialog from './employee-delete-dialog.svelte';
	import EmployeeForm from './employee-form.svelte';

	interface Props {
		employee: Employee;
	}

	let { employee }: Props = $props();
	let openForm = $state(false);
	let openDeleteDialog = $state(false);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button variant="ghost" size="icon" {...props}>
				<Ellipsis />
				<span class="sr-only">Open menu</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => goto(resolve(`/employees/${employee.id}`))}>
			Open
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={() => (openForm = true)}>Edit</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => (openDeleteDialog = true)}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<EmployeeForm {employee} bind:open={openForm} />
<EmployeeDeleteDialog employeeId={employee.id} bind:open={openDeleteDialog} />
