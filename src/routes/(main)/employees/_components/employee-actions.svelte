<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '@/components/ui/button';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import type { Employee } from '@/types/types';
	import { MoreHorizontal } from 'lucide-svelte';
	import EmployeeDeleteDialog from './employee-delete-dialog.svelte';
	import EmployeeForm from './employee-form.svelte';

	export let employee: Employee;
	let openSheet = false;
	let openDeleteDialog = false;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" class="h-8 w-8 p-0" builders={[builder]}>
			<span class="sr-only">Open menu</span>
			<MoreHorizontal class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item href={`/employees/${employee.id}`}>Open</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={() => (openSheet = true)}>Edit</DropdownMenu.Item>
		<DropdownMenu.Item on:click={() => (openDeleteDialog = true)}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<EmployeeForm data={$page.data.updateForm} bind:open={openSheet} />

<EmployeeDeleteDialog {employee} data={$page.data.deleteForm} bind:open={openDeleteDialog} />
