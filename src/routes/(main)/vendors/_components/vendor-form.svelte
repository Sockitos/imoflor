<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { Separator } from '@/components/ui/separator';
	import * as Sheet from '@/components/ui/sheet';
	// import TagInput from '@/components/ui/tag-input/tag-input.svelte';
	import { Textarea } from '@/components/ui/textarea';
	import { createVendorSchema, type CreateVendorSchema } from '@/schemas/vendor';
	import { Loader2 } from 'lucide-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface Props {
		open?: boolean;
		data: SuperValidated<Infer<CreateVendorSchema>>;
		action: string;
	}

	let { open = $bindable(false), data, action }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(createVendorSchema),
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
	<Sheet.Content class="overflow-y-auto sm:max-w-[40rem]">
		<Sheet.Header>
			<Sheet.Title>Add new vendor</Sheet.Title>
			<Sheet.Description>Fill the form below to add a new vendor.</Sheet.Description>
		</Sheet.Header>
		<Separator class="my-5" />
		<form method="POST" use:enhance {action}>
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
					<Form.Field {form} name="country">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Country</Form.Label>
								<Input {...props} bind:value={$formData.country} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="region">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Region</Form.Label>
								<Input {...props} bind:value={$formData.region} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				<Form.Field {form} name="address">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Address</Form.Label>
							<Input {...props} bind:value={$formData.address} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="postal_code">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Postal Code</Form.Label>
								<Input {...props} bind:value={$formData.postal_code} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="city">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>City</Form.Label>
								<Input {...props} bind:value={$formData.city} />
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
					</Form.Field><Form.Field {form} name="phone">
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
