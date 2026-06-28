<script lang="ts">
	import { signInSchema } from '@/auth/schemas';
	import * as Card from '@/shared/components/ui/card';
	import * as Form from '@/shared/components/ui/form';
	import { Input } from '@/shared/components/ui/input';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zod4Client(signInSchema),
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
						<Spinner />
					{/if}
					Submit
				</Form.Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
