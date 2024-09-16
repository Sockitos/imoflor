<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { deletePropertySchema, type DeletePropertySchema } from '@/schemas/property';
	import type { Property } from '@/types/types';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let open = false;
	export let property: Property;
	export let data: SuperValidated<Infer<DeletePropertySchema>>;

	const form = superForm(data, {
		id: property.id.toString(),
		validators: zodClient(deletePropertySchema),
	});

	const { enhance } = form;
</script>

<AlertDialog.Root bind:open>
	<form method="POST" action="/properties/{property.id}?/delete" use:enhance>
		<input type="hidden" name="id" value={property.id} />
	</form>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete this property and remove their
				data from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action on:click={form.submit}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
