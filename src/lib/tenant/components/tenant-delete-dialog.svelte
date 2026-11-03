<script lang="ts">
	import * as AlertDialog from '@/shared/components/ui/alert-dialog';
	import { deleteTenant } from '../tenant.remote';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { toastError } from '@/shared/toast';
	import { toast } from 'svelte-sonner';

	interface Props {
		open?: boolean;
		tenantId: number;
	}

	let { open = $bindable(false), tenantId }: Props = $props();

	const deleteForm = $derived(deleteTenant.for(tenantId));

	let formElement: HTMLFormElement | undefined = $state();
</script>

<AlertDialog.Root bind:open>
	<form
		bind:this={formElement}
		{...deleteForm.enhance(async (f) => {
			try {
				if (await f.submit()) {
					toast.success('Tenant deleted successfully');
					open = false;
				}
			} catch (error) {
				toastError(error);
			}
		})}
	>
		<input hidden {...deleteForm.fields.id.as('number', tenantId)} />
	</form>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete this tenant and remove their data
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
