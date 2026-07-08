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

	type Props =
		| {
				open?: boolean;
				property: Property;
				fraction?: never;
		  }
		| {
				open?: boolean;
				property?: never;
				fraction: Fraction;
		  };

	let { open = $bindable(false), ...propertyOrFraction }: Props = $props();

	const form = $derived(
		propertyOrFraction.fraction != null
			? upsertFraction.for(propertyOrFraction.fraction.id)
			: upsertFraction
	);
	const isEdit = $derived(propertyOrFraction.fraction != null);

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
			onfocusout={form.validate}
			class="flex flex-col gap-8 px-4"
		>
			{#if propertyOrFraction.fraction?.id != null}
				<input hidden {...form.fields.id.as('number', propertyOrFraction.fraction.id)} />
			{/if}
			<input
				hidden
				{...form.fields.parent_id.as(
					'number',
					propertyOrFraction.fraction?.parent_id ?? propertyOrFraction.property!.id
				)}
			/>

			<Field.FieldSet>
				<Field.FieldLegend>Information</Field.FieldLegend>
				<Field.FieldGroup>
					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.class.issues())}>
							<Field.FieldLabel>Class</Field.FieldLabel>
							<Field.FieldContent>
								<Select.Root
									type="single"
									value={form.fields.class.value() ??
										propertyOrFraction.fraction?.class ??
										propertyOrFraction.property!.class}
									onValueChange={(v) => {
										if (v) form.fields.class.set(v as PropertyClass);
									}}
								>
									<Select.Trigger>
										{form.fields.class.value()
											? propertyClassOptions[form.fields.class.value()!]
											: propertyClassOptions[
													propertyOrFraction.fraction?.class ?? propertyOrFraction.property!.class
												]}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(propertyClassOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input
									hidden
									{...form.fields.class.as(
										'text',
										propertyOrFraction.fraction?.class ?? propertyOrFraction.property!.class
									)}
								/>
								<Field.FieldError errors={form.fields.class.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.type.issues())}>
							<Field.FieldLabel>Type</Field.FieldLabel>
							<Field.FieldContent>
								<Select.Root
									type="single"
									value={form.fields.type.value() ?? propertyOrFraction.fraction?.type}
									onValueChange={(v) => {
										if (v) form.fields.type.set(v as FractionType);
									}}
								>
									<Select.Trigger>
										{form.fields.type.value()
											? fractionTypeOptions[form.fields.type.value()!]
											: propertyOrFraction.fraction?.type
												? fractionTypeOptions[propertyOrFraction.fraction.type]
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
									{...propertyOrFraction.fraction != null
										? form.fields.type.as('text', propertyOrFraction.fraction.type)
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
									{...form.fields.matrix.as(
										'text',
										propertyOrFraction.fraction?.matrix ?? propertyOrFraction.property!.matrix
									)}
								/>
								<Field.FieldError errors={form.fields.matrix.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.conservatory.issues())}>
							<Field.FieldLabel>Conservatory</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...form.fields.conservatory.as(
										'text',
										propertyOrFraction.fraction?.conservatory ??
											propertyOrFraction.property!.conservatory
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
								{...(propertyOrFraction.fraction?.area ?? propertyOrFraction.property!.area) != null
									? form.fields.area.as(
											'number',
											(propertyOrFraction.fraction?.area ?? propertyOrFraction.property!.area)!
										)
									: form.fields.area.as('number')}
							/>
							<Field.FieldError errors={form.fields.area.issues()} />
						</Field.FieldContent>
					</Field.Field>

					<Field.Field data-invalid={isInvalid(form.fields.tipology.issues())}>
						<Field.FieldLabel>Tipology</Field.FieldLabel>
						<Field.FieldContent>
							<Input
								{...(propertyOrFraction.fraction?.tipology ??
									propertyOrFraction.property!.tipology) != null
									? form.fields.tipology.as(
											'text',
											(propertyOrFraction.fraction?.tipology ??
												propertyOrFraction.property!.tipology)!
										)
									: form.fields.tipology.as('text')}
							/>
							<Field.FieldError errors={form.fields.tipology.issues()} />
						</Field.FieldContent>
					</Field.Field>

					<Field.Field data-invalid={isInvalid(form.fields.description.issues())}>
						<Field.FieldLabel>Description</Field.FieldLabel>
						<Field.FieldContent>
							<Textarea
								{...(propertyOrFraction.fraction?.description ??
									propertyOrFraction.property!.description) != null
									? form.fields.description.as(
											'text',
											(propertyOrFraction.fraction?.description ??
												propertyOrFraction.property!.description)!
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
									{...(propertyOrFraction.fraction?.patrimonial_value ??
										propertyOrFraction.property!.patrimonial_value) != null
										? form.fields.patrimonial_value.as(
												'number',
												(propertyOrFraction.fraction?.patrimonial_value ??
													propertyOrFraction.property!.patrimonial_value)!
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
									{...(propertyOrFraction.fraction?.market_value ??
										propertyOrFraction.property!.market_value) != null
										? form.fields.market_value.as(
												'number',
												(propertyOrFraction.fraction?.market_value ??
													propertyOrFraction.property!.market_value)!
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
					<input
						hidden
						{...form.fields.address.id.as(
							'number',
							(propertyOrFraction.fraction?.address ?? propertyOrFraction.property!.address).id
						)}
					/>

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field>
							<Field.FieldLabel>Country</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									readonly
									class="cursor-default bg-muted/40 text-muted-foreground"
									{...form.fields.address.country.as(
										'text',
										(propertyOrFraction.fraction?.address ?? propertyOrFraction.property!.address)
											.country
									)}
								/>
							</Field.FieldContent>
						</Field.Field>

						<Field.Field>
							<Field.FieldLabel>Region</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									readonly
									class="cursor-default bg-muted/40 text-muted-foreground"
									{...form.fields.address.region.as(
										'text',
										(propertyOrFraction.fraction?.address ?? propertyOrFraction.property!.address)
											.region
									)}
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
									{...form.fields.address.address.as(
										'text',
										(propertyOrFraction.fraction?.address ?? propertyOrFraction.property!.address)
											.address
									)}
								/>
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.fraction.issues())}>
							<Field.FieldLabel>Fraction</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...propertyOrFraction.fraction?.fraction != null
										? form.fields.fraction.as('text', propertyOrFraction.fraction!.fraction)
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
									{...form.fields.address.postal_code.as(
										'text',
										(propertyOrFraction.fraction?.address ?? propertyOrFraction.property!.address)
											.postal_code
									)}
								/>
							</Field.FieldContent>
						</Field.Field>

						<Field.Field>
							<Field.FieldLabel>City</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									readonly
									class="cursor-default bg-muted/40 text-muted-foreground"
									{...form.fields.address.city.as(
										'text',
										(propertyOrFraction.fraction?.address ?? propertyOrFraction.property!.address)
											.city
									)}
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
