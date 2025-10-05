<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger,
	} from '$lib/components/ui/dropdown-menu';
	import type { Employee } from '@/types/types';
	import { MoreHorizontal } from 'lucide-svelte';
	import EmployeeDeleteDialog from './employee-delete-dialog.svelte';

	interface Props {
		employee: Employee;
	}

	let { employee }: Props = $props();
	let openDeleteDialog = $state(false);
</script>

<DropdownMenu>
	<DropdownMenuTrigger>
		{#snippet child({ props })}
			<Button variant="ghost" class="h-8 w-8 p-0" {...props}>
				<span class="sr-only">Open menu</span>
				<MoreHorizontal class="h-4 w-4" />
			</Button>
		{/snippet}
	</DropdownMenuTrigger>
	<DropdownMenuContent align="end">
		<DropdownMenuItem onclick={() => goto(resolve(`/employees/${employee.id}`))}
			>Open</DropdownMenuItem
		>
		<DropdownMenuSeparator />
		<DropdownMenuItem onclick={() => goto(resolve(`/employees/${employee.id}?action=edit`))}
			>Edit</DropdownMenuItem
		>
		<DropdownMenuItem onclick={() => (openDeleteDialog = true)}>Delete</DropdownMenuItem>
	</DropdownMenuContent>
</DropdownMenu>

<EmployeeDeleteDialog {employee} data={page.data.deleteEmployeeForm} bind:open={openDeleteDialog} />
