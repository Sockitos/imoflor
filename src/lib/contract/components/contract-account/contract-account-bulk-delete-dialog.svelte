<script lang="ts">
	import * as AlertDialog from '@/shared/components/ui/alert-dialog';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { deleteContractAccountItems } from '../../contract.remote';

	interface Props {
		open?: boolean;
		items: { id: number; type: string }[];
		contractId: number;
		onSuccess: () => void;
	}

	let { open = $bindable(false), items, contractId, onSuccess }: Props = $props();

	const ids = $derived(items.map((i) => i.id));

	const deleteForm = $derived(deleteContractAccountItems.for(`${contractId}-${ids.toString()}`));

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
		{#each items as item, i ((item.id, item.type))}
			<input hidden {...deleteForm.fields.ids[i].as('number', item.id)} />
			<input hidden {...deleteForm.fields.types[i].as('text', item.type)} />
		{/each}
		<input hidden {...deleteForm.fields.contract_id.as('number', contractId)} />
	</form>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete {items.length} account items and remove
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
