<script lang="ts">
	import { Button } from '@shared/components/ui/button';
	import * as Form from '@shared/components/ui/form';
	import { Input } from '@shared/components/ui/input';
	import * as Select from '@shared/components/ui/select';
	import { Separator } from '@shared/components/ui/separator';
	import * as Sheet from '@shared/components/ui/sheet';
	import { Textarea } from '@shared/components/ui/textarea';
	import { Loader2 } from 'lucide-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { createFractionSchema, type CreateFractionSchema } from '../schemas';
	import { fractionTypeOptions, propertyClassOptions } from '../types';

	interface Props {
		open?: boolean;
		data: SuperValidated<Infer<CreateFractionSchema>>;
		action: string;
	}

	let { open = $bindable(false), data, action }: Props = $props();

	const form = superForm(data, {
		validators: zod4Client(createFractionSchema),
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
			<Sheet.Title>Add new fraction</Sheet.Title>
			<Sheet.Description>Fill the form below to add a new fraction.</Sheet.Description>
		</Sheet.Header>
		<Separator class="my-5" />
		<form method="POST" use:enhance {action} class="px-4">
			<input hidden bind:value={$formData.parent_id} name="parent_id" />
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Information</h3>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="class">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Class</Form.Label>
								<Select.Root {...props} type="single" bind:value={$formData.class}>
									<Select.Trigger {...props}>
										{propertyClassOptions[$formData.class] ?? 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(propertyClassOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input hidden bind:value={$formData.class} name={props.name} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="type">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Type</Form.Label>
								<Select.Root {...props} type="single" bind:value={$formData.type}>
									<Select.Trigger {...props}>
										{fractionTypeOptions[$formData.type] ?? 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(fractionTypeOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input hidden bind:value={$formData.type} name={props.name} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="matrix">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Matrix</Form.Label>
								<Input {...props} bind:value={$formData.matrix} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="conservatory">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Conservatory</Form.Label>
								<Input {...props} bind:value={$formData.conservatory} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				<Form.Field {form} name="area">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Area</Form.Label>
							<Input type="number" {...props} bind:value={$formData.area} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="tipology">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Tipology</Form.Label>
							<Input {...props} bind:value={$formData.tipology} />
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
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="patrimonial_value">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Patrimonial Value</Form.Label>
								<Input
									type="number"
									step="any"
									{...props}
									bind:value={$formData.patrimonial_value}
								/>
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="market_value">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Market Value</Form.Label>
								<Input type="number" step="any" {...props} bind:value={$formData.market_value} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
			</div>
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Address</h3>
				<input hidden bind:value={$formData.address.id} name="address.id" />
				<div class="grid grid-cols-2 items-start gap-x-4 gap-y-3">
					<Form.Field {form} name="address.country">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Country</Form.Label>
								<Input
									{...props}
									readonly
									bind:value={$formData.address.country}
									class="cursor-default bg-muted/40 text-muted-foreground"
								/>
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="address.region">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Region</Form.Label>
								<Input
									{...props}
									readonly
									bind:value={$formData.address.region}
									class="cursor-default bg-muted/40 text-muted-foreground"
								/>
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				<div class="grid grid-cols-2 items-start gap-x-4 gap-y-3">
					<Form.Field {form} name="address.address">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Street address</Form.Label>
								<Input
									{...props}
									readonly
									bind:value={$formData.address.address}
									class="cursor-default bg-muted/40 text-muted-foreground"
								/>
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="fraction">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Fraction</Form.Label>
								<Input {...props} bind:value={$formData.fraction} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				<div class="grid grid-cols-2 items-start gap-x-4 gap-y-3">
					<Form.Field {form} name="address.postal_code">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Postal code</Form.Label>
								<Input
									{...props}
									readonly
									bind:value={$formData.address.postal_code}
									class="cursor-default bg-muted/40 text-muted-foreground"
								/>
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="address.city">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>City</Form.Label>
								<Input
									{...props}
									readonly
									bind:value={$formData.address.city}
									class="cursor-default bg-muted/40 text-muted-foreground"
								/>
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
