<script lang="ts">
	import * as AlertDialog from '@/shared/components/ui/alert-dialog';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { deleteMovements } from '../movement.remote';

	interface Props {
		open?: boolean;
		movementIds: number[];
		taxIdNumber: string;
		onSuccess: () => void;
	}

	let { open = $bindable(false), movementIds, taxIdNumber, onSuccess }: Props = $props();

	const deleteForm = $derived(deleteMovements.for(`${taxIdNumber}-${movementIds.toString()}`));

	let formElement: HTMLFormElement | undefined = $state();
</script>

<AlertDialog.Root bind:open>
	<form
		bind:this={formElement}
		{...deleteForm.enhance(async (f) => {
			if (await f.submit()) {
				open = false;
				onSuccess();
			}
		})}
	>
		{#each movementIds as id, i (id)}
			<input hidden {...deleteForm.fields.ids[i].as('number', id)} />
		{/each}
		<input hidden {...deleteForm.fields.tax_id_number.as('text', taxIdNumber)} />
	</form>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete {movementIds.length} movements and
				remove their data from our servers.
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
