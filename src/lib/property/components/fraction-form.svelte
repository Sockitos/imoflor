<script lang="ts">
	import { Button } from '@/shared/components/ui/button';
	import * as Field from '@/shared/components/ui/field';
	import { Input } from '@/shared/components/ui/input';
	import * as Select from '@/shared/components/ui/select';
	import { Separator } from '@/shared/components/ui/separator';
	import * as Sheet from '@/shared/components/ui/sheet';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { Textarea } from '@/shared/components/ui/textarea';
	import { toastError, toastSuccess } from '@/shared/toast';
	import { untrack } from 'svelte';
	import { upsertFraction } from '../property.remote';
	import { fractionSchema } from '../schemas';
	import type { Fraction, Property } from '../types';
	import {
		fractionTypeOptions,
		propertyClassOptions,
		type FractionType,
		type PropertyClass,
	} from '../types';

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

	const fraction = $derived(propertyOrFraction.fraction);
	const parent = $derived(propertyOrFraction.property);

	const form = $derived(fraction != null ? upsertFraction.for(fraction.id) : upsertFraction);
	const isEdit = $derived(fraction != null);

	$effect.pre(() => {
		if (open) {
			untrack(() => {
				if (fraction) {
					form.fields.set({
						id: fraction.id,
						class: fraction.class,
						type: fraction.type,
						matrix: fraction.matrix,
						conservatory: fraction.conservatory,
						area: fraction.area ?? undefined,
						tipology: fraction.tipology ?? undefined,
						description: fraction.description ?? undefined,
						patrimonial_value: fraction.patrimonial_value ?? undefined,
						market_value: fraction.market_value ?? undefined,
						address: fraction.address,
						fraction: fraction.fraction,
						parent_id: fraction.parent_id,
					});
				}
			});
			return;
		}

		untrack(() => form.element?.reset());
	});

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
						toastSuccess(
							isEdit ? 'Fraction updated successfully' : 'Fraction created successfully'
						);
						open = false;
					}
				} catch (error) {
					toastError(error);
				}
			})}
			onfocusout={() => form.validate()}
			class="flex flex-col gap-8 px-4"
		>
			{#if fraction}
				<input hidden {...form.fields.id.as('number')} />
				<input hidden {...form.fields.parent_id.as('number')} />
				<input hidden {...form.fields.address.id.as('number')} />
			{:else if parent}
				<input hidden {...form.fields.parent_id.as('number', parent.id)} />
				<input hidden {...form.fields.address.id.as('number', parent.address.id)} />
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
									value={form.fields.class.value() ?? parent?.class}
									onValueChange={(v) => {
										if (v) form.fields.class.set(v as PropertyClass);
									}}
								>
									<Select.Trigger>
										{form.fields.class.value()
											? propertyClassOptions[form.fields.class.value()!]
											: parent
												? propertyClassOptions[parent.class]
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
									{...parent
										? form.fields.class.as('text', parent.class)
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
									value={form.fields.type.value()}
									onValueChange={(v) => {
										if (v) form.fields.type.set(v as FractionType);
									}}
								>
									<Select.Trigger>
										{form.fields.type.value()
											? fractionTypeOptions[form.fields.type.value()!]
											: 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(fractionTypeOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input hidden {...form.fields.type.as('text')} />
								<Field.FieldError errors={form.fields.type.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.matrix.issues())}>
							<Field.FieldLabel>Matrix</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...parent
										? form.fields.matrix.as('text', parent.matrix)
										: form.fields.matrix.as('text')}
								/>
								<Field.FieldError errors={form.fields.matrix.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.conservatory.issues())}>
							<Field.FieldLabel>Conservatory</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...parent
										? form.fields.conservatory.as('text', parent.conservatory)
										: form.fields.conservatory.as('text')}
								/>
								<Field.FieldError errors={form.fields.conservatory.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>

					<Field.Field data-invalid={isInvalid(form.fields.area.issues())}>
						<Field.FieldLabel>Area</Field.FieldLabel>
						<Field.FieldContent>
							<Input
								{...parent?.area != null
									? form.fields.area.as('number', parent.area)
									: form.fields.area.as('number')}
							/>
							<Field.FieldError errors={form.fields.area.issues()} />
						</Field.FieldContent>
					</Field.Field>

					<Field.Field data-invalid={isInvalid(form.fields.tipology.issues())}>
						<Field.FieldLabel>Tipology</Field.FieldLabel>
						<Field.FieldContent>
							<Input
								{...parent?.tipology != null
									? form.fields.tipology.as('text', parent.tipology)
									: form.fields.tipology.as('text')}
							/>
							<Field.FieldError errors={form.fields.tipology.issues()} />
						</Field.FieldContent>
					</Field.Field>

					<Field.Field data-invalid={isInvalid(form.fields.description.issues())}>
						<Field.FieldLabel>Description</Field.FieldLabel>
						<Field.FieldContent>
							<Textarea
								{...parent?.description != null
									? form.fields.description.as('text', parent.description)
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
									{...parent?.patrimonial_value != null
										? form.fields.patrimonial_value.as('number', parent.patrimonial_value)
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
									{...parent?.market_value != null
										? form.fields.market_value.as('number', parent.market_value)
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
					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field>
							<Field.FieldLabel>Country</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									readonly
									class="cursor-default bg-muted/40 text-muted-foreground"
									{...parent
										? form.fields.address.country.as('text', parent.address.country)
										: form.fields.address.country.as('text')}
								/>
							</Field.FieldContent>
						</Field.Field>

						<Field.Field>
							<Field.FieldLabel>Region</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									readonly
									class="cursor-default bg-muted/40 text-muted-foreground"
									{...parent
										? form.fields.address.region.as('text', parent.address.region)
										: form.fields.address.region.as('text')}
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
									{...parent
										? form.fields.address.address.as('text', parent.address.address)
										: form.fields.address.address.as('text')}
								/>
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.fraction.issues())}>
							<Field.FieldLabel>Fraction</Field.FieldLabel>
							<Field.FieldContent>
								<Input {...form.fields.fraction.as('text')} />
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
									{...parent
										? form.fields.address.postal_code.as('text', parent.address.postal_code)
										: form.fields.address.postal_code.as('text')}
								/>
							</Field.FieldContent>
						</Field.Field>

						<Field.Field>
							<Field.FieldLabel>City</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									readonly
									class="cursor-default bg-muted/40 text-muted-foreground"
									{...parent
										? form.fields.address.city.as('text', parent.address.city)
										: form.fields.address.city.as('text')}
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
