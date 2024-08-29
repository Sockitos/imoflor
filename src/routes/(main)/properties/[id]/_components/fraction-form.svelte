<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '@/components/ui/button';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import * as Select from '@/components/ui/select';
	import { Separator } from '@/components/ui/separator';
	import * as Sheet from '@/components/ui/sheet';
	import { Textarea } from '@/components/ui/textarea';
	import { createFractionSchema, type CreateFractionSchema } from '@/schemas/fraction';
	import type { FractionType } from '@/types/types';
	import type { Selected } from 'bits-ui';
	import { Loader2 } from 'lucide-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';

	export let open = false;
	export let data: SuperValidated<Infer<CreateFractionSchema>>;

	const form = superForm(data, {
		validators: zodClient(createFractionSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				open = false;
			}
		},
	});

	const { form: formData, enhance, submitting } = form;

	$: editing = false;

	function getTypeFromValue(v: Selected<unknown>): FractionType {
		return v.value as FractionType;
	}

	$: propertyId = $page.params.id;
</script>

<Sheet.Root bind:open>
	<slot />
	<Sheet.Content class="overflow-y-auto sm:max-w-[40rem]">
		<Sheet.Header>
			<Sheet.Title>Add new fraction</Sheet.Title>
			<Sheet.Description>Fill the form below to add a new fraction.</Sheet.Description>
		</Sheet.Header>
		<Separator class="my-5" />
		<form
			method="POST"
			use:enhance
			action={editing
				? `/properties/${propertyId}/fractions?/update`
				: `/properties/${propertyId}/fractions?/create`}
		>
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Information</h3>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="type">
						<Form.Control let:attrs>
							<Form.Label>Type</Form.Label>
							<Select.Root
								{...attrs}
								onSelectedChange={(v) => {
									if (v) {
										$formData.type = getTypeFromValue(v);
									}
								}}
							>
								<Select.Trigger {...attrs}>
									<Select.Value placeholder="Select" />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="apartment">Apartment</Select.Item>
									<Select.Item value="store">Store</Select.Item>
									<Select.Item value="garage">Garage</Select.Item>
									<Select.Item value="house">House</Select.Item>
									<Select.Item value="terrain">Terrain</Select.Item>
								</Select.Content>
							</Select.Root>
							<input hidden bind:value={$formData.type} name={attrs.name} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
				</div>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="matrix">
						<Form.Control let:attrs>
							<Form.Label>Matrix</Form.Label>
							<Input {...attrs} bind:value={$formData.matrix} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="conservatory">
						<Form.Control let:attrs>
							<Form.Label>Conservatory</Form.Label>
							<Input {...attrs} bind:value={$formData.conservatory} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
				</div>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="area">
						<Form.Control let:attrs>
							<Form.Label>Area</Form.Label>
							<Input type="number" {...attrs} bind:value={$formData.area} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="tipology">
						<Form.Control let:attrs>
							<Form.Label>Tipology</Form.Label>
							<Input {...attrs} bind:value={$formData.tipology} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
				</div>
				<Form.Field {form} name="description">
					<Form.Control let:attrs>
						<Form.Label>Description</Form.Label>
						<Textarea {...attrs} bind:value={$formData.description} />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="patrimonial_value">
						<Form.Control let:attrs>
							<Form.Label>Patrimonial Value</Form.Label>
							<Input type="number" step="any" {...attrs} bind:value={$formData.patrimonial_value} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="market_value">
						<Form.Control let:attrs>
							<Form.Label>Market Value</Form.Label>
							<Input type="number" step="any" {...attrs} bind:value={$formData.market_value} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
				</div>
			</div>
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Address</h3>
				<Form.Field {form} name="address">
					<Form.Control let:attrs>
						<Form.Label>Address</Form.Label>
						<Input {...attrs} bind:value={$formData.address} />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
			</div>
			<div class="flex flex-row items-center justify-end gap-4">
				<Button
					variant={'ghost'}
					on:click={(e) => {
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
