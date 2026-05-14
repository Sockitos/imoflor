<script lang="ts">
	import { Button } from '@shared/components/ui/button';
	import * as Form from '@shared/components/ui/form';
	import { Input } from '@shared/components/ui/input';
	import { Separator } from '@shared/components/ui/separator';
	import * as Sheet from '@shared/components/ui/sheet';
	import { Textarea } from '@shared/components/ui/textarea';
	import { Loader2 } from 'lucide-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { createVendorSchema, type CreateVendorSchema } from '../schemas';

	interface Props {
		open?: boolean;
		data: SuperValidated<Infer<CreateVendorSchema>>;
		action: string;
	}

	let { open = $bindable(false), data, action }: Props = $props();

	const form = superForm(data, {
		validators: zod4Client(createVendorSchema),
		dataType: 'json',
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				open = false;
			}
		},
		invalidateAll: 'force',
	});

	const { form: formData, enhance, submitting } = form;
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto sm:max-w-3xl">
		<Sheet.Header>
			<Sheet.Title>Add new vendor</Sheet.Title>
			<Sheet.Description>Fill the form below to add a new vendor.</Sheet.Description>
		</Sheet.Header>
		<Separator class="my-5" />
		<form method="POST" use:enhance {action} class="px-4">
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Identification</h3>
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Name</Form.Label>
							<Input {...props} bind:value={$formData.name} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="tax_id_number">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Tax ID Number</Form.Label>
							<Input {...props} bind:value={$formData.tax_id_number} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="description">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Description</Form.Label>
							<Textarea {...props} bind:value={$formData.description} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="tags">
					<Form.Control>
						<Form.Label>Tags</Form.Label>
						<!-- <TagInput {...props} bind:value={$formData.tags} /> -->
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
			</div>
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Address</h3>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<input hidden bind:value={$formData.address.id} name="address.id" />
					<Form.Field {form} name="address.country">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Country</Form.Label>
								<Input {...props} bind:value={$formData.address.country} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="address.region">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Region</Form.Label>
								<Input {...props} bind:value={$formData.address.region} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				<Form.Field {form} name="address.address">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Address</Form.Label>
							<Input {...props} bind:value={$formData.address.address} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="address.postal_code">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Postal Code</Form.Label>
								<Input {...props} bind:value={$formData.address.postal_code} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="address.city">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>City</Form.Label>
								<Input {...props} bind:value={$formData.address.city} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
			</div>
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Contacts</h3>
				<Form.Field {form} name="website">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Website</Form.Label>
							<Input {...props} bind:value={$formData.website} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input {...props} bind:value={$formData.email} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="mobile">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Mobile</Form.Label>
								<Input {...props} bind:value={$formData.mobile} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="phone">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Phone</Form.Label>
								<Input {...props} bind:value={$formData.phone} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
			</div>
			<div class="flex flex-row items-center justify-end gap-4">
				<Button
					variant="ghost"
					onclick={(e) => {
						e.preventDefault();
						open = false;
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
		</form>
	</Sheet.Content>
</Sheet.Root>
