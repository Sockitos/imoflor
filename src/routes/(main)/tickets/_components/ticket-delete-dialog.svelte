<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { deleteTicketSchema, type DeleteTicketSchema } from '@/schemas/ticket';
	import type { Ticket } from '@/types/types';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	interface Props {
		open?: boolean;
		ticket: Ticket;
		data: SuperValidated<Infer<DeleteTicketSchema>>;
	}

	let { open = $bindable(false), ticket, data }: Props = $props();

	const form = superForm(data, {
		id: ticket.id.toString(),
		validators: zod4Client(deleteTicketSchema),
	});

	const { enhance } = form;
</script>

<AlertDialog.Root bind:open>
	<form method="POST" action="/tickets/{ticket.id}?/delete" use:enhance>
		<input type="hidden" name="id" value={ticket.id} />
	</form>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete this ticket and remove their data
				from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={form.submit}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
