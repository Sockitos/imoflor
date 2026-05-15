<script lang="ts">
	import * as AlertDialog from '@/shared/components/ui/alert-dialog';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { deleteEmployeeSchema, type DeleteEmployeeSchema } from '../schemas';

	interface Props {
		open?: boolean;
		data: SuperValidated<Infer<DeleteEmployeeSchema>>;
	}

	let { open = $bindable(false), data }: Props = $props();

	const form = superForm(data, {
		validators: zod4Client(deleteEmployeeSchema),
	});

	const { form: formData, enhance } = form;
</script>

<AlertDialog.Root bind:open>
	<form method="POST" action="/employees/{$formData.id}?/delete" use:enhance>
		<input type="hidden" name="id" bind:value={$formData.id} />
	</form>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete this employee and remove their
				data from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={form.submit}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
