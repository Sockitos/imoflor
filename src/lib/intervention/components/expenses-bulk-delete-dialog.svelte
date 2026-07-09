<script lang="ts">
	import * as AlertDialog from '@/shared/components/ui/alert-dialog';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { deleteExpenses } from '../intervention.remote';

	interface Props {
		open?: boolean;
		expenseIds: number[];
		onSuccess: () => void;
	}

	let { open = $bindable(false), expenseIds, onSuccess }: Props = $props();

	const deleteForm = $derived(deleteExpenses.for(expenseIds.toString()));

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
		{#each expenseIds as id, i (id)}
			<input hidden {...deleteForm.fields.ids[i].as('number', id)} />
		{/each}
	</form>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete {expenseIds.length} expenses and remove
				their data from our servers.
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
