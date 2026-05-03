<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { deleteTenantSchema, type DeleteTenantSchema } from '@/schemas/tenant';
	import type { Tenant } from '@/types/types';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	interface Props {
		open?: boolean;
		tenant: Tenant;
		data: SuperValidated<Infer<DeleteTenantSchema>>;
	}

	let { open = $bindable(false), tenant, data }: Props = $props();

	const form = superForm(data, {
		id: tenant.id.toString(),
		validators: zod4Client(deleteTenantSchema),
	});

	const { enhance } = form;
</script>

<AlertDialog.Root bind:open>
	<form method="POST" action="/tenants/{tenant.id}?/delete" use:enhance>
		<input type="hidden" name="id" value={tenant.id} />
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
