<script lang="ts">
	import * as Card from '@/components/ui/card';
	import * as Form from '@/components/ui/form';
	import { signInSchema, type SignInSchema } from '@/schemas/sign-in';
	import { Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import type { ActionData } from './$types';

	export let form: SuperValidated<SignInSchema> & ActionData;
	export let data;
	const sForm = superForm(data.form);
	$: submitting = sForm.submitting;

	$: if (form?.success === false) {
		toast.error(form?.message ?? 'Something went wrong');
	}
</script>

<div class="container flex h-screen w-screen flex-col items-center justify-center">
	<Card.Root class="w-96">
		<Card.Header>
			<Card.Title>Welcome!</Card.Title>
			<Card.Description>Login to enter the dashboard</Card.Description>
		</Card.Header>
		<Card.Content>
			<Form.Root method="POST" controlled form={sForm} schema={signInSchema} let:config>
				<Form.Field {config} name="email">
					<Form.Item>
						<Form.Label>Email</Form.Label>
						<Form.Input />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="password">
					<Form.Item>
						<Form.Label>Password</Form.Label>
						<Form.Input type="password" />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Button class="mt-5" disabled={$submitting}>
					{#if $submitting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Submit
				</Form.Button>
			</Form.Root>
		</Card.Content>
	</Card.Root>
</div>
