<script lang="ts">
	import * as AlertDialog from '@/shared/components/ui/alert-dialog';
	import { deleteTenants } from '../tenant.remote';
	import { Spinner } from '@/shared/components/ui/spinner';

	interface Props {
		open?: boolean;
		tenantIds: number[];
		onSuccess: () => void;
	}

	let { open = $bindable(false), tenantIds, onSuccess }: Props = $props();

	const deleteForm = $derived(deleteTenants.for(tenantIds.toString()));

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
		{#each tenantIds as id, i}
			<input hidden {...deleteForm.fields.ids[i].as('number', id)} />
		{/each}
	</form>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete {tenantIds.length} tenants and remove
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
