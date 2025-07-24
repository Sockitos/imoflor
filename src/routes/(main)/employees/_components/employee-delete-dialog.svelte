<script lang="ts">
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle,
	} from '$lib/components/ui/alert-dialog';
	import { deleteEmployeeSchema, type DeleteEmployeeSchema } from '@/schemas/employee';
	import type { Employee } from '@/types/types';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface Props {
		open?: boolean;
		employee: Employee;
		data: SuperValidated<Infer<DeleteEmployeeSchema>>;
	}

	let { open = $bindable(false), employee, data }: Props = $props();

	const form = superForm(data, {
		id: employee.id.toString(),
		validators: zodClient(deleteEmployeeSchema),
	});

	const { enhance } = form;
</script>

<AlertDialog bind:open>
	<form method="POST" action="/employees/{employee.id}?/delete" use:enhance>
		<input type="hidden" name="id" value={employee.id} />
	</form>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
			<AlertDialogDescription>
				This action cannot be undone. This will permanently delete this employee and remove their
				data from our servers.
			</AlertDialogDescription>
		</AlertDialogHeader>
		<AlertDialogFooter>
			<AlertDialogCancel>Cancel</AlertDialogCancel>
			<AlertDialogAction onclick={form.submit}>Continue</AlertDialogAction>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
