<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { deleteInterventionSchema, type DeleteInterventionSchema } from '@/schemas/intervention';
	import type { Intervention } from '@/types/types';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	interface Props {
		open?: boolean;
		intervention: Intervention;
		data: SuperValidated<Infer<DeleteInterventionSchema>>;
	}

	let { open = $bindable(false), intervention, data }: Props = $props();

	const form = superForm(data, {
		id: intervention.id.toString(),
		validators: zod4Client(deleteInterventionSchema),
	});

	const { enhance } = form;
</script>

<AlertDialog.Root bind:open>
	<form method="POST" action="/interventions/{intervention.id}?/delete" use:enhance>
		<input type="hidden" name="id" value={intervention.id} />
	</form>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete this intervention and remove
				their data from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={form.submit}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
