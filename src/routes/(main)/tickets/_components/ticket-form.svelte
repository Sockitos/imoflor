<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Form from '@/components/ui/form';
	import {
		createTicketSchema,
		updateTicketSchema,
		type CreateTicketSchema,
		type UpdateTicketSchema,
	} from '@/schemas/ticket';
	import { Loader2 } from 'lucide-svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	export let form: SuperValidated<CreateTicketSchema> | SuperValidated<UpdateTicketSchema>;
	const sForm = superForm(form);

	$: editing = !!form.data.id;
	$: submitting = sForm.submitting;
</script>

<Form.Root
	method="POST"
	action={editing ? '/tickets?/update' : '/tickets?/create'}
	controlled
	form={sForm}
	schema={editing ? updateTicketSchema : createTicketSchema}
	let:config
>
	<div class="space-y-4">
		<h3 class="text-lg font-medium">Identification</h3>
	</div>
	<div class="space-y-4">
		<h3 class="text-lg font-medium">Address</h3>
	</div>
	<div class="space-y-4">
		<h3 class="text-lg font-medium">Contacts</h3>
	</div>
	<div class="flex flex-row items-center justify-end gap-4">
		<Button
			variant={'ghost'}
			on:click={(e) => {
				e.preventDefault();
			}}
		>
			Cancel
		</Button>
		<Form.Button disabled={$submitting}>
			{#if $submitting}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Submit
		</Form.Button>
	</div>
</Form.Root>
