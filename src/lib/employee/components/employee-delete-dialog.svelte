<script lang="ts">
	import * as AlertDialog from '@/shared/components/ui/alert-dialog';
	import { deleteEmployee } from '../employee.remote';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { submitWithToast } from '@/shared/toast';

	interface Props {
		open?: boolean;
		employeeId: number;
	}

	let { open = $bindable(false), employeeId }: Props = $props();

	const deleteForm = $derived(deleteEmployee.for(employeeId));
	let formElement: HTMLFormElement | undefined = $state();
</script>

<AlertDialog.Root bind:open>
	<form
		bind:this={formElement}
		{...deleteForm.enhance(async (f) => {
			if (await submitWithToast(() => f.submit(), 'Employee deleted successfully')) {
				open = false;
			}
		})}
	>
		<input hidden {...deleteForm.fields.id.as('number', employeeId)} />
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
