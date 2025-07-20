<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { deleteContractSchema, type DeleteContractSchema } from '@/schemas/contract';
	import type { Contract } from '@/types/types';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface Props {
		open?: boolean;
		contract: Contract;
		data: SuperValidated<Infer<DeleteContractSchema>>;
	}

	let { open = $bindable(false), contract, data }: Props = $props();

	const form = superForm(data, {
		id: contract.id.toString(),
		validators: zodClient(deleteContractSchema),
	});

	const { enhance } = form;
</script>

<AlertDialog.Root bind:open>
	<form method="POST" action="/contracts/{contract.id}?/delete" use:enhance>
		<input type="hidden" name="id" value={contract.id} />
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
