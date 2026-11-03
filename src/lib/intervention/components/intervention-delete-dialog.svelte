<script lang="ts">
	import * as AlertDialog from '@/shared/components/ui/alert-dialog';
	import { deleteIntervention } from '../intervention.remote';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { toastError } from '@/shared/toast';
	import { toast } from 'svelte-sonner';

	interface Props {
		open?: boolean;
		interventionId: number;
	}

	let { open = $bindable(false), interventionId }: Props = $props();

	const deleteForm = $derived(deleteIntervention.for(interventionId));

	let formElement: HTMLFormElement | undefined = $state();
</script>

<AlertDialog.Root bind:open>
	<form
		bind:this={formElement}
		{...deleteForm.enhance(async (f) => {
			try {
				if (await f.submit()) {
					toast.success('Intervention deleted successfully');
					open = false;
				}
			} catch (error) {
				toastError(error);
			}
		})}
	>
		<input hidden {...deleteForm.fields.id.as('number', interventionId)} />
	</form>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete this intervention and remove its
				data from our servers.
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
