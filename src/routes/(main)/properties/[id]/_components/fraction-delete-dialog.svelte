<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { deleteFractionSchema, type DeleteFractionSchema } from '@/schemas/fraction';
	import type { Fraction } from '@/types/types';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface Props {
		open?: boolean;
		fraction: Fraction;
		data: SuperValidated<Infer<DeleteFractionSchema>>;
	}

	let { open = $bindable(false), fraction, data }: Props = $props();

	const form = superForm(data, {
		id: fraction.id.toString(),
		validators: zodClient(deleteFractionSchema),
	});

	const { enhance } = form;
</script>

<AlertDialog.Root bind:open>
	<form
		method="POST"
		action="/properties/{fraction.property_id}/fractions/{fraction.id}?/delete"
		use:enhance
	>
		<input type="hidden" name="id" value={fraction.id} />
	</form>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete this fraction and remove their
				data from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={form.submit}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
