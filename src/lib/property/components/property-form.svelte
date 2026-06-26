<script lang="ts">
	import { Button } from '@/shared/components/ui/button';
	import * as Field from '@/shared/components/ui/field';
	import { Input } from '@/shared/components/ui/input';
	import * as Select from '@/shared/components/ui/select';
	import { Separator } from '@/shared/components/ui/separator';
	import * as Sheet from '@/shared/components/ui/sheet';
	import { Textarea } from '@/shared/components/ui/textarea';
	import { propertySchema } from '../schemas';
	import { upsertProperty } from '../property.remote';
	import {
		propertyClassOptions,
		propertyTypeOptions,
		type PropertyClass,
		type PropertyType,
	} from '../types';
	import type { Property } from '../types';
	import { Spinner } from '@/shared/components/ui/spinner';

	interface Props {
		open?: boolean;
		property?: Property;
	}

	let { open = $bindable(false), property }: Props = $props();

	const form = $derived(property != null ? upsertProperty.for(property.id) : upsertProperty);
	const isEdit = $derived(property != null);

	function isInvalid(issues?: { message?: string }[]) {
		return (issues?.length ?? 0) > 0;
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto data-[side=right]:sm:max-w-2xl">
		<Sheet.Header>
			<Sheet.Title>{isEdit ? 'Edit property' : 'Add new property'}</Sheet.Title>
			<Sheet.Description>
				{isEdit
					? 'Update the property details below.'
					: 'Fill the form below to add a new property.'}
			</Sheet.Description>
		</Sheet.Header>
		<Separator />
		<form
			{...form.preflight(propertySchema).enhance(async (f) => {
				try {
					if (await f.submit()) {
						open = false;
						if (!isEdit) f.form.reset();
					}
				} catch (err) {
					console.error(err);
				}
			})}
			class="flex flex-col gap-8 px-4"
		>
			{#if property?.id != null}
				<input hidden {...form.fields.id.as('number', property.id)} />
			{/if}

			<Field.FieldSet>
				<Field.FieldLegend>Information</Field.FieldLegend>
				<Field.FieldGroup>
					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.class.issues())}>
							<Field.FieldLabel>Class</Field.FieldLabel>
							<Field.FieldContent>
								<Select.Root
									type="single"
									value={form.fields.class.value() ?? property?.class}
									onValueChange={(v) => {
										if (v) form.fields.class.set(v as PropertyClass);
									}}
								>
									<Select.Trigger>
										{form.fields.class.value()
											? propertyClassOptions[form.fields.class.value()!]
											: property?.class
												? propertyClassOptions[property.class]
												: 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(propertyClassOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input
									hidden
									{...property != null
										? form.fields.class.as('text', property.class)
										: form.fields.class.as('text')}
								/>
								<Field.FieldError errors={form.fields.class.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.type.issues())}>
							<Field.FieldLabel>Type</Field.FieldLabel>
							<Field.FieldContent>
								<Select.Root
									type="single"
									value={form.fields.type.value() ?? property?.type}
									onValueChange={(v) => {
										if (v) form.fields.type.set(v as PropertyType);
									}}
								>
									<Select.Trigger>
										{form.fields.type.value()
											? propertyTypeOptions[form.fields.type.value()!]
											: property?.type
												? propertyTypeOptions[property.type]
												: 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(propertyTypeOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input
									hidden
									{...property != null
										? form.fields.type.as('text', property.type)
										: form.fields.type.as('text')}
								/>
								<Field.FieldError errors={form.fields.type.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.matrix.issues())}>
							<Field.FieldLabel>Matrix</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...property?.matrix != null
										? form.fields.matrix.as('text', property.matrix)
										: form.fields.matrix.as('text')}
								/>
								<Field.FieldError errors={form.fields.matrix.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.conservatory.issues())}>
							<Field.FieldLabel>Conservatory</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...property?.conservatory != null
										? form.fields.conservatory.as('text', property.conservatory)
										: form.fields.conservatory.as('text')}
								/>
								<Field.FieldError errors={form.fields.conservatory.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.area.issues())}>
							<Field.FieldLabel>Area</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...property?.area != null
										? form.fields.area.as('number', property.area)
										: form.fields.area.as('number')}
								/>
								<Field.FieldError errors={form.fields.area.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.tipology.issues())}>
							<Field.FieldLabel>Tipology</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...property?.tipology != null
										? form.fields.tipology.as('text', property.tipology)
										: form.fields.tipology.as('text')}
								/>
								<Field.FieldError errors={form.fields.tipology.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>

					<Field.Field data-invalid={isInvalid(form.fields.description.issues())}>
						<Field.FieldLabel>Description</Field.FieldLabel>
						<Field.FieldContent>
							<Textarea
								{...property?.description != null
									? form.fields.description.as('text', property.description)
									: form.fields.description.as('text')}
							/>
							<Field.FieldError errors={form.fields.description.issues()} />
						</Field.FieldContent>
					</Field.Field>

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.patrimonial_value.issues())}>
							<Field.FieldLabel>Patrimonial Value</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									step="any"
									{...property?.patrimonial_value != null
										? form.fields.patrimonial_value.as('number', property.patrimonial_value)
										: form.fields.patrimonial_value.as('number')}
								/>
								<Field.FieldError errors={form.fields.patrimonial_value.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.market_value.issues())}>
							<Field.FieldLabel>Market Value</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									step="any"
									{...property?.market_value != null
										? form.fields.market_value.as('number', property.market_value)
										: form.fields.market_value.as('number')}
								/>
								<Field.FieldError errors={form.fields.market_value.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>
				</Field.FieldGroup>
			</Field.FieldSet>

			<Field.FieldSet>
				<Field.FieldLegend>Address</Field.FieldLegend>
				<Field.FieldGroup>
					{#if property?.address.id != null}
						<input hidden {...form.fields.address.id.as('number', property.address.id)} />
					{/if}

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.address.country.issues())}>
							<Field.FieldLabel>Country</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...property?.address.country != null
										? form.fields.address.country.as('text', property.address.country)
										: form.fields.address.country.as('text')}
								/>
								<Field.FieldError errors={form.fields.address.country.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.address.region.issues())}>
							<Field.FieldLabel>Region</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...property?.address.region != null
										? form.fields.address.region.as('text', property.address.region)
										: form.fields.address.region.as('text')}
								/>
								<Field.FieldError errors={form.fields.address.region.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>

					<Field.Field data-invalid={isInvalid(form.fields.address.address.issues())}>
						<Field.FieldLabel>Address</Field.FieldLabel>
						<Field.FieldContent>
							<Input
								{...property?.address.address != null
									? form.fields.address.address.as('text', property.address.address)
									: form.fields.address.address.as('text')}
							/>
							<Field.FieldError errors={form.fields.address.address.issues()} />
						</Field.FieldContent>
					</Field.Field>

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.address.postal_code.issues())}>
							<Field.FieldLabel>Postal Code</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...property?.address.postal_code != null
										? form.fields.address.postal_code.as('text', property.address.postal_code)
										: form.fields.address.postal_code.as('text')}
								/>
								<Field.FieldError errors={form.fields.address.postal_code.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.address.city.issues())}>
							<Field.FieldLabel>City</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...property?.address.city != null
										? form.fields.address.city.as('text', property.address.city)
										: form.fields.address.city.as('text')}
								/>
								<Field.FieldError errors={form.fields.address.city.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>
				</Field.FieldGroup>
			</Field.FieldSet>

			<Sheet.Footer class="flex flex-row items-center justify-end gap-4 px-0 pt-0">
				<Button
					variant="ghost"
					onclick={(e) => {
						e.preventDefault();
						open = false;
					}}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={!!form.pending}>
					{#if form.pending}
						<Spinner />
					{/if}
					Submit
				</Button>
			</Sheet.Footer>
		</form>
	</Sheet.Content>
</Sheet.Root>
