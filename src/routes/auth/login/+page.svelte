<script lang="ts">
	import { signIn } from '@/auth/auth.remote';
	import * as Card from '@/shared/components/ui/card';
	import * as Field from '@/shared/components/ui/field';
	import { Input } from '@/shared/components/ui/input';
	import { Button } from '@/shared/components/ui/button';
	import { signInSchema } from '@/auth/schemas';
	import { Spinner } from '@/shared/components/ui/spinner';

	function isInvalid(issues?: { message?: string }[]) {
		return (issues?.length ?? 0) > 0;
	}
</script>

<div class="container mx-auto flex h-screen flex-col items-center justify-center">
	<Card.Root class="w-96">
		<Card.Header>
			<Card.Title>Welcome!</Card.Title>
			<Card.Description>Login to enter the dashboard</Card.Description>
		</Card.Header>
		<Card.Content>
			<form
				{...signIn.preflight(signInSchema).enhance(async (f) => {
					try {
						await f.submit();
					} catch (err) {
						console.error(err);
					}
				})}
				onfocusout={() => signIn.validate()}
				class="flex flex-col gap-4"
			>
				<Field.Field data-invalid={isInvalid(signIn.fields.email.issues())}>
					<Field.FieldLabel>Email</Field.FieldLabel>
					<Field.FieldContent>
						<Input type="email" {...signIn.fields.email.as('text')} />
						<Field.FieldError errors={signIn.fields.email.issues()} />
					</Field.FieldContent>
				</Field.Field>

				<Field.Field data-invalid={isInvalid(signIn.fields.password.issues())}>
					<Field.FieldLabel>Password</Field.FieldLabel>
					<Field.FieldContent>
						<Input type="password" {...signIn.fields.password.as('text')} />
						<Field.FieldError errors={signIn.fields.password.issues()} />
					</Field.FieldContent>
				</Field.Field>

				<Button type="submit" class="mt-5" disabled={!!signIn.pending}>
					{#if signIn.pending}
						<Spinner />
					{/if}
					Submit
				</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
