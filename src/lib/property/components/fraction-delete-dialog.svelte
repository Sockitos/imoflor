<script lang="ts">
	import * as AlertDialog from '@/shared/components/ui/alert-dialog';
	import { deleteFraction } from '../property.remote';
	import { Spinner } from '@/shared/components/ui/spinner';

	interface Props {
		open?: boolean;
		fractionId: number;
		parentId: number;
	}

	let { open = $bindable(false), fractionId, parentId }: Props = $props();

	const deleteForm = $derived(deleteFraction.for(fractionId));

	let formElement: HTMLFormElement | undefined = $state();
</script>

<AlertDialog.Root bind:open>
	<form
		bind:this={formElement}
		{...deleteForm.enhance(async (f) => {
			if (await f.submit()) {
				open = false;
			}
		})}
	>
		<input hidden {...deleteForm.fields.id.as('number', fractionId)} />
		<input hidden {...deleteForm.fields.parent_id.as('number', parentId)} />
	</form>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete this fraction and all its data
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
