<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import * as Select from '@/components/ui/select';
	import { Separator } from '@/components/ui/separator';
	import * as Sheet from '@/components/ui/sheet';
	import { Textarea } from '@/components/ui/textarea';
	import {
		classOptions,
		createPropertySchema,
		typeOptions,
		type CreatePropertySchema,
	} from '@/schemas/property';
	import { Loader2 } from 'lucide-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let open = false;
	export let data: SuperValidated<Infer<CreatePropertySchema>>;
	export let action: string;

	const form = superForm(data, {
		validators: zodClient(createPropertySchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				open = false;
			}
		},
		invalidateAll: 'force',
	});

	const { form: formData, enhance, submitting } = form;

	$: selectedClass = $formData.class
		? {
				value: $formData.class,
				label: classOptions[$formData.class],
			}
		: undefined;

	$: selectedType = $formData.type
		? {
				value: $formData.type,
				label: typeOptions[$formData.type],
			}
		: undefined;
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto sm:max-w-[40rem]">
		<Sheet.Header>
			<Sheet.Title>Add new property</Sheet.Title>
			<Sheet.Description>Fill the form below to add a new property.</Sheet.Description>
		</Sheet.Header>
		<Separator class="my-5" />
		<form method="POST" use:enhance {action}>
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Information</h3>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="class">
						<Form.Control let:attrs>
							<Form.Label>Class</Form.Label>
							<Select.Root
								{...attrs}
								selected={selectedClass}
								onSelectedChange={(v) => {
									if (v) {
										$formData.class = v.value;
									}
								}}
							>
								<Select.Trigger>
									<Select.Value placeholder="Select" />
								</Select.Trigger>
								<Select.Content>
									{#each Object.entries(classOptions) as [value, label]}
										<Select.Item {value} {label} />
									{/each}
								</Select.Content>
							</Select.Root>
							<input hidden bind:value={$formData.class} name="class" />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
					<input hidden bind:value={$formData.is_multi_unit} name="is_multi_unit" />
					<Form.Field {form} name="type">
						<Form.Control let:attrs>
							<Form.Label>Type</Form.Label>
							<Select.Root
								{...attrs}
								selected={selectedType}
								onSelectedChange={(v) => {
									if (v) {
										$formData.type = v.value;
										if ($formData.type === 'building' || $formData.type === 'garages') {
											$formData.is_multi_unit = true;
										} else {
											$formData.is_multi_unit = false;
										}
									}
								}}
							>
								<Select.Trigger {...attrs}>
									<Select.Value placeholder="Select" />
								</Select.Trigger>
								<Select.Content>
									{#each Object.entries(typeOptions) as [value, label]}
										<Select.Item {value} {label} />
									{/each}
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
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="country">
						<Form.Control let:attrs>
							<Form.Label>Country</Form.Label>
							<Input {...attrs} bind:value={$formData.country} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="region">
						<Form.Control let:attrs>
							<Form.Label>Region</Form.Label>
							<Input {...attrs} bind:value={$formData.region} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
				</div>
				<Form.Field {form} name="address">
					<Form.Control let:attrs>
						<Form.Label>Address</Form.Label>
						<Input {...attrs} bind:value={$formData.address} />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="postal_code">
						<Form.Control let:attrs>
							<Form.Label>Postal Code</Form.Label>
							<Input {...attrs} bind:value={$formData.postal_code} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="city">
						<Form.Control let:attrs>
							<Form.Label>City</Form.Label>
							<Input {...attrs} bind:value={$formData.city} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
				</div>
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
