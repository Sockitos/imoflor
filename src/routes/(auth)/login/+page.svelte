<script lang="ts">
	import * as Card from '@/components/ui/card';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { signInSchema } from '@/schemas/sign-in';
	import { Loader2 } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(signInSchema),
	});

	const { form: formData, enhance, submitting } = form;
</script>

<div class="container flex h-screen w-screen flex-col items-center justify-center">
	<Card.Root class="w-96">
		<Card.Header>
			<Card.Title>Welcome!</Card.Title>
			<Card.Description>Login to enter the dashboard</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="POST" use:enhance>
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input {...props} bind:value={$formData.email} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Password</Form.Label>
							<Input type="password" {...props} bind:value={$formData.password} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Button class="mt-5" disabled={$submitting}>
					{#if $submitting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Submit
				</Form.Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
