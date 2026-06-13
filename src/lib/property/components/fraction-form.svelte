<script lang="ts">
	import { Button } from '@/shared/components/ui/button';
	import * as Field from '@/shared/components/ui/field';
	import { Input } from '@/shared/components/ui/input';
	import * as Select from '@/shared/components/ui/select';
	import { Separator } from '@/shared/components/ui/separator';
	import * as Sheet from '@/shared/components/ui/sheet';
	import { Textarea } from '@/shared/components/ui/textarea';
	import { fractionSchema } from '../schemas';
	import { upsertFraction } from '../property.remote';
	import {
		fractionTypeOptions,
		propertyClassOptions,
		type FractionType,
		type PropertyClass,
	} from '../types';
	import type { Fraction, Property } from '../types';
	import { Spinner } from '@/shared/components/ui/spinner';

	interface Props {
		open?: boolean;
		property: Property;
		fraction?: Fraction;
	}

	let { open = $bindable(false), property, fraction }: Props = $props();

	const form = $derived(fraction != null ? upsertFraction.for(fraction.id) : upsertFraction);
	const isEdit = $derived(fraction != null);

	function isInvalid(issues?: { message?: string }[]) {
		return (issues?.length ?? 0) > 0;
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto data-[side=right]:sm:max-w-2xl">
		<Sheet.Header>
			<Sheet.Title>{isEdit ? 'Edit fraction' : 'Add new fraction'}</Sheet.Title>
			<Sheet.Description>
				{isEdit
					? 'Update the fraction details below.'
					: 'Fill the form below to add a new fraction.'}
			</Sheet.Description>
		</Sheet.Header>
		<Separator />
		<form
			{...form.preflight(fractionSchema).enhance(async (f) => {
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
			{#if fraction?.id != null}
				<input hidden {...form.fields.id.as('number', fraction.id)} />
			{/if}
			<input hidden {...form.fields.parent_id.as('number', fraction?.parent_id ?? property.id)} />

			<Field.FieldSet>
				<Field.FieldLegend>Information</Field.FieldLegend>
				<Field.FieldGroup>
					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.class.issues())}>
							<Field.FieldLabel>Class</Field.FieldLabel>
							<Field.FieldContent>
								<Select.Root
									type="single"
									value={form.fields.class.value() ?? fraction?.class ?? property.class}
									onValueChange={(v) => {
										if (v) form.fields.class.set(v as PropertyClass);
									}}
								>
									<Select.Trigger>
										{form.fields.class.value()
											? propertyClassOptions[form.fields.class.value()!]
											: propertyClassOptions[fraction?.class ?? property.class]}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(propertyClassOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input
									hidden
									{...form.fields.class.as('text', fraction?.class ?? property.class)}
								/>
								<Field.FieldError errors={form.fields.class.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.type.issues())}>
							<Field.FieldLabel>Type</Field.FieldLabel>
							<Field.FieldContent>
								<Select.Root
									type="single"
									value={form.fields.type.value() ?? fraction?.type}
									onValueChange={(v) => {
										if (v) form.fields.type.set(v as FractionType);
									}}
								>
									<Select.Trigger>
										{form.fields.type.value()
											? fractionTypeOptions[form.fields.type.value()!]
											: fraction?.type
												? fractionTypeOptions[fraction.type]
												: 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(fractionTypeOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input
									hidden
									{...fraction != null
										? form.fields.type.as('text', fraction.type)
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
								<Input {...form.fields.matrix.as('text', fraction?.matrix ?? property.matrix)} />
								<Field.FieldError errors={form.fields.matrix.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.conservatory.issues())}>
							<Field.FieldLabel>Conservatory</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...form.fields.conservatory.as(
										'text',
										fraction?.conservatory ?? property.conservatory
									)}
								/>
								<Field.FieldError errors={form.fields.conservatory.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>

					<Field.Field data-invalid={isInvalid(form.fields.area.issues())}>
						<Field.FieldLabel>Area</Field.FieldLabel>
						<Field.FieldContent>
							<Input
								{...(fraction?.area ?? property.area) != null
									? form.fields.area.as('number', (fraction?.area ?? property.area)!)
									: form.fields.area.as('number')}
							/>
							<Field.FieldError errors={form.fields.area.issues()} />
						</Field.FieldContent>
					</Field.Field>

					<Field.Field data-invalid={isInvalid(form.fields.tipology.issues())}>
						<Field.FieldLabel>Tipology</Field.FieldLabel>
						<Field.FieldContent>
							<Input
								{...(fraction?.tipology ?? property.tipology) != null
									? form.fields.tipology.as('text', (fraction?.tipology ?? property.tipology)!)
									: form.fields.tipology.as('text')}
							/>
							<Field.FieldError errors={form.fields.tipology.issues()} />
						</Field.FieldContent>
					</Field.Field>

					<Field.Field data-invalid={isInvalid(form.fields.description.issues())}>
						<Field.FieldLabel>Description</Field.FieldLabel>
						<Field.FieldContent>
							<Textarea
								{...(fraction?.description ?? property.description) != null
									? form.fields.description.as(
											'text',
											(fraction?.description ?? property.description)!
										)
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
									{...(fraction?.patrimonial_value ?? property.patrimonial_value) != null
										? form.fields.patrimonial_value.as(
												'number',
												(fraction?.patrimonial_value ?? property.patrimonial_value)!
											)
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
									{...(fraction?.market_value ?? property.market_value) != null
										? form.fields.market_value.as(
												'number',
												(fraction?.market_value ?? property.market_value)!
											)
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
					<input hidden {...form.fields.address.id.as('number', property.address.id)} />

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field>
							<Field.FieldLabel>Country</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									readonly
									class="cursor-default bg-muted/40 text-muted-foreground"
									{...form.fields.address.country.as('text', property.address.country)}
								/>
							</Field.FieldContent>
						</Field.Field>

						<Field.Field>
							<Field.FieldLabel>Region</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									readonly
									class="cursor-default bg-muted/40 text-muted-foreground"
									{...form.fields.address.region.as('text', property.address.region)}
								/>
							</Field.FieldContent>
						</Field.Field>
					</div>

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field>
							<Field.FieldLabel>Street Address</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									readonly
									class="cursor-default bg-muted/40 text-muted-foreground"
									{...form.fields.address.address.as('text', property.address.address)}
								/>
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.fraction.issues())}>
							<Field.FieldLabel>Fraction</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...fraction?.fraction != null
										? form.fields.fraction.as('text', fraction.fraction)
										: form.fields.fraction.as('text')}
								/>
								<Field.FieldError errors={form.fields.fraction.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field>
							<Field.FieldLabel>Postal Code</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									readonly
									class="cursor-default bg-muted/40 text-muted-foreground"
									{...form.fields.address.postal_code.as('text', property.address.postal_code)}
								/>
							</Field.FieldContent>
						</Field.Field>

						<Field.Field>
							<Field.FieldLabel>City</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									readonly
									class="cursor-default bg-muted/40 text-muted-foreground"
									{...form.fields.address.city.as('text', property.address.city)}
								/>
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
