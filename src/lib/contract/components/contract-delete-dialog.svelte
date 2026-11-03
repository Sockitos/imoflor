<script lang="ts">
	import * as AlertDialog from '@/shared/components/ui/alert-dialog';
	import { deleteContract } from '../contract.remote';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { toastError, toastSuccess } from '@/shared/toast';

	interface Props {
		open?: boolean;
		contractId: number;
	}

	let { open = $bindable(false), contractId }: Props = $props();

	const deleteForm = $derived(deleteContract.for(contractId));

	let formElement: HTMLFormElement | undefined = $state();
</script>

<AlertDialog.Root bind:open>
	<form
		bind:this={formElement}
		{...deleteForm.enhance(async (f) => {
			try {
				if (await f.submit()) {
					toastSuccess('Contract deleted successfully');
					open = false;
				}
			} catch (error) {
				toastError(error);
			}
		})}
	>
		<input hidden {...deleteForm.fields.id.as('number', contractId)} />
	</form>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete this contract and remove its data
				from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				disabled={!!deleteForm.pending}
				onclick={() => formElement?.requestSubmit()}
			>
				{#if deleteForm.pending}
					<Spinner />
				{/if}
				Continue
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
