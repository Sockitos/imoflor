<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { deleteVendorSchema, type DeleteVendorSchema } from '@/schemas/vendor';
	import type { Vendor } from '@/types/types';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	interface Props {
		open?: boolean;
		vendor: Vendor;
		data: SuperValidated<Infer<DeleteVendorSchema>>;
	}

	let { open = $bindable(false), vendor, data }: Props = $props();

	const form = superForm(data, {
		id: vendor.id.toString(),
		validators: zod4Client(deleteVendorSchema),
	});

	const { enhance } = form;
</script>

<AlertDialog.Root bind:open>
	<form method="POST" action="/vendors/{vendor.id}?/delete" use:enhance>
		<input type="hidden" name="id" value={vendor.id} />
	</form>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete this vendor and remove their data
				from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={form.submit}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
