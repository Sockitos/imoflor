<script lang="ts">
	import * as AlertDialog from '@/shared/components/ui/alert-dialog';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { deleteContractSchema, type DeleteContractSchema } from '../schemas';

	interface Props {
		open?: boolean;
		data: SuperValidated<Infer<DeleteContractSchema>>;
		/** When set (e.g. from the contracts table), syncs `id` into the form; omit on the contract detail page where `load` pre-fills `id`. */
		recordId?: number;
	}

	let { open = $bindable(false), data, recordId }: Props = $props();

	const form = superForm(data, {
		validators: zod4Client(deleteContractSchema),
	});

	const { form: formData, enhance } = form;

	$effect(() => {
		if (recordId != null) {
			$formData.id = recordId;
		}
	});
</script>

<AlertDialog.Root bind:open>
	<form method="POST" action="/contracts/{$formData.id}?/delete" use:enhance>
		<input type="hidden" name="id" bind:value={$formData.id} />
	</form>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete this contract and remove their
				data from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={form.submit}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
