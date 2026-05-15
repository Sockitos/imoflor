<script lang="ts">
<<<<<<<< HEAD:src/lib/tenants/components/tenant-delete-dialog.svelte
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { deleteTenantSchema, type DeleteTenantSchema } from '@/tenants/schemas/tenant';
	import type { Tenant } from '@/types/types';
========
	import * as AlertDialog from '@/shared/components/ui/alert-dialog';
>>>>>>>> origin/master:src/lib/tenant/components/tenant-delete-dialog.svelte
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { deleteTenantSchema, type DeleteTenantSchema } from '../schemas';

	interface Props {
		open?: boolean;
		data: SuperValidated<Infer<DeleteTenantSchema>>;
	}

	let { open = $bindable(false), data }: Props = $props();

	const form = superForm(data, {
		validators: zod4Client(deleteTenantSchema),
	});

	const { form: formData, enhance } = form;
</script>

<AlertDialog.Root bind:open>
	<form method="POST" action="/tenants/{$formData.id}?/delete" use:enhance>
		<input type="hidden" name="id" bind:value={$formData.id} />
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
			<AlertDialog.Action onclick={form.submit}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
