<script lang="ts">
	import { Button } from '@/shared/components/ui/button';
	import * as Field from '@/shared/components/ui/field';
	import { Input } from '@/shared/components/ui/input';
	import { Separator } from '@/shared/components/ui/separator';
	import * as Sheet from '@/shared/components/ui/sheet';
	import { Textarea } from '@/shared/components/ui/textarea';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { vendorSchema } from '../schemas';
	import { upsertVendor } from '../vendor.remote';
	import type { Vendor } from '../types';

	interface Props {
		open?: boolean;
		vendor?: Vendor;
	}

	let { open = $bindable(false), vendor }: Props = $props();

	const form = $derived(vendor != null ? upsertVendor.for(vendor.id) : upsertVendor);
	const isEdit = $derived(vendor != null);

	function isInvalid(issues?: { message?: string }[]) {
		return (issues?.length ?? 0) > 0;
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto data-[side=right]:sm:max-w-2xl">
		<Sheet.Header>
			<Sheet.Title>{isEdit ? 'Edit vendor' : 'Add new vendor'}</Sheet.Title>
			<Sheet.Description>
				{isEdit ? 'Update the vendor details below.' : 'Fill the form below to add a new vendor.'}
			</Sheet.Description>
		</Sheet.Header>
		<Separator />
		<form
			{...form.preflight(vendorSchema).enhance(async (f) => {
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
			{#if vendor?.id != null}
				<input hidden {...form.fields.id.as('number', vendor.id)} />
			{/if}

			<Field.FieldSet>
				<Field.FieldLegend>Identification</Field.FieldLegend>
				<Field.FieldGroup>
					<Field.Field data-invalid={isInvalid(form.fields.name.issues())}>
						<Field.FieldLabel>Name</Field.FieldLabel>
						<Field.FieldContent>
							<Input
								{...vendor?.name != null
									? form.fields.name.as('text', vendor.name)
									: form.fields.name.as('text')}
							/>
							<Field.FieldError errors={form.fields.name.issues()} />
						</Field.FieldContent>
					</Field.Field>

					<Field.Field data-invalid={isInvalid(form.fields.tax_id_number.issues())}>
						<Field.FieldLabel>Tax ID Number</Field.FieldLabel>
						<Field.FieldContent>
							<Input
								{...vendor?.tax_id_number != null
									? form.fields.tax_id_number.as('text', vendor.tax_id_number)
									: form.fields.tax_id_number.as('text')}
							/>
							<Field.FieldError errors={form.fields.tax_id_number.issues()} />
						</Field.FieldContent>
					</Field.Field>

					<Field.Field data-invalid={isInvalid(form.fields.description.issues())}>
						<Field.FieldLabel>Description</Field.FieldLabel>
						<Field.FieldContent>
							<Textarea
								{...vendor?.description != null
									? form.fields.description.as('text', vendor.description)
									: form.fields.description.as('text')}
							/>
							<Field.FieldError errors={form.fields.description.issues()} />
						</Field.FieldContent>
					</Field.Field>
				</Field.FieldGroup>
			</Field.FieldSet>

			<Field.FieldSet>
				<Field.FieldLegend>Address</Field.FieldLegend>
				<Field.FieldGroup>
					{#if vendor?.address?.id != null}
						<input hidden {...form.fields.address.id.as('number', vendor.address.id)} />
					{/if}

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.address.country.issues())}>
							<Field.FieldLabel>Country</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...vendor?.address?.country != null
										? form.fields.address.country.as('text', vendor.address.country)
										: form.fields.address.country.as('text')}
								/>
								<Field.FieldError errors={form.fields.address.country.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.address.region.issues())}>
							<Field.FieldLabel>Region</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...vendor?.address?.region != null
										? form.fields.address.region.as('text', vendor.address.region)
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
								{...vendor?.address?.address != null
									? form.fields.address.address.as('text', vendor.address.address)
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
									{...vendor?.address?.postal_code != null
										? form.fields.address.postal_code.as('text', vendor.address.postal_code)
										: form.fields.address.postal_code.as('text')}
								/>
								<Field.FieldError errors={form.fields.address.postal_code.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.address.city.issues())}>
							<Field.FieldLabel>City</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...vendor?.address?.city != null
										? form.fields.address.city.as('text', vendor.address.city)
										: form.fields.address.city.as('text')}
								/>
								<Field.FieldError errors={form.fields.address.city.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>
				</Field.FieldGroup>
			</Field.FieldSet>

			<Field.FieldSet>
				<Field.FieldLegend>Contacts</Field.FieldLegend>
				<Field.FieldGroup>
					<Field.Field data-invalid={isInvalid(form.fields.website.issues())}>
						<Field.FieldLabel>Website</Field.FieldLabel>
						<Field.FieldContent>
							<Input
								{...vendor?.website != null
									? form.fields.website.as('text', vendor.website)
									: form.fields.website.as('text')}
							/>
							<Field.FieldError errors={form.fields.website.issues()} />
						</Field.FieldContent>
					</Field.Field>

					<Field.Field data-invalid={isInvalid(form.fields.email.issues())}>
						<Field.FieldLabel>Email</Field.FieldLabel>
						<Field.FieldContent>
							<Input
								type="email"
								{...vendor?.email != null
									? form.fields.email.as('text', vendor.email)
									: form.fields.email.as('text')}
							/>
							<Field.FieldError errors={form.fields.email.issues()} />
						</Field.FieldContent>
					</Field.Field>

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.mobile.issues())}>
							<Field.FieldLabel>Mobile</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									type="tel"
									{...vendor?.mobile != null
										? form.fields.mobile.as('text', vendor.mobile)
										: form.fields.mobile.as('text')}
								/>
								<Field.FieldError errors={form.fields.mobile.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.phone.issues())}>
							<Field.FieldLabel>Phone</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									type="tel"
									{...vendor?.phone != null
										? form.fields.phone.as('text', vendor.phone)
										: form.fields.phone.as('text')}
								/>
								<Field.FieldError errors={form.fields.phone.issues()} />
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
