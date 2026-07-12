<script lang="ts">
	import { Button, buttonVariants } from '@/shared/components/ui/button';
	import { Calendar } from '@/shared/components/ui/calendar';
	import * as Field from '@/shared/components/ui/field';
	import { Input } from '@/shared/components/ui/input';
	import * as Popover from '@/shared/components/ui/popover';
	import * as Select from '@/shared/components/ui/select';
	import { Separator } from '@/shared/components/ui/separator';
	import * as Sheet from '@/shared/components/ui/sheet';
	import { Spinner } from '@/shared/components/ui/spinner';
	import type { Gender, MaritalStatus } from '@/shared/types';
	import { genderOptions, maritalStatusOptions } from '@/shared/types';
	import { cn } from '@/shared/utils';
	import { DateFormatter, getLocalTimeZone, parseAbsolute } from '@internationalized/date';
	import { CalendarIcon } from 'lucide-svelte';
	import { tenantSchema } from '../schemas';
	import { upsertTenant } from '../tenant.remote';
	import type { Tenant } from '../types';

	interface Props {
		open?: boolean;
		tenant?: Tenant;
	}

	let { open = $bindable(false), tenant }: Props = $props();

	const df = new DateFormatter('en-US', {
		dateStyle: 'long',
	});

	function isInvalid(issues?: { message?: string }[]) {
		return (issues?.length ?? 0) > 0;
	}

	const form = $derived(tenant != null ? upsertTenant.for(tenant.id) : upsertTenant);
	const isEdit = $derived(tenant != null);
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto data-[side=right]:sm:max-w-2xl">
		<Sheet.Header>
			<Sheet.Title>{isEdit ? 'Edit tenant' : 'Add new tenant'}</Sheet.Title>
			<Sheet.Description>
				{isEdit ? 'Update the tenant details below.' : 'Fill the form below to add a new tenant.'}
			</Sheet.Description>
		</Sheet.Header>
		<Separator />
		<form
			{...form.preflight(tenantSchema).enhance(async (f) => {
				try {
					if (await f.submit()) {
						open = false;
						if (!isEdit) f.element.reset();
					}
				} catch (err) {
					console.error(err);
				}
			})}
			onfocusout={() => form.validate()}
			class="flex flex-col gap-8 px-4"
		>
			{#if tenant?.id != null}
				<input hidden {...form.fields.id.as('number', tenant.id)} />
			{/if}

			<Field.FieldSet>
				<Field.FieldLegend>Identification</Field.FieldLegend>
				<Field.FieldGroup>
					<Field.Field data-invalid={isInvalid(form.fields.name.issues())}>
						<Field.FieldLabel>Name</Field.FieldLabel>
						<Field.FieldContent>
							<Input
								{...tenant?.name != null
									? form.fields.name.as('text', tenant.name)
									: form.fields.name.as('text')}
							/>
							<Field.FieldError errors={form.fields.name.issues()} />
						</Field.FieldContent>
					</Field.Field>

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.gender.issues())}>
							<Field.FieldLabel>Gender</Field.FieldLabel>
							<Field.FieldContent>
								<Select.Root
									type="single"
									value={form.fields.gender.value() ?? tenant?.gender}
									onValueChange={(v) => {
										if (v) form.fields.gender.set(v as Gender);
									}}
								>
									<Select.Trigger>
										{form.fields.gender.value()
											? genderOptions[form.fields.gender.value()!]
											: tenant?.gender
												? genderOptions[tenant.gender]
												: 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(genderOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input
									hidden
									{...tenant != null
										? form.fields.gender.as('text', tenant.gender)
										: form.fields.gender.as('text')}
								/>
								<Field.FieldError errors={form.fields.gender.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.marital_status.issues())}>
							<Field.FieldLabel>Marital Status</Field.FieldLabel>
							<Field.FieldContent>
								<Select.Root
									type="single"
									value={form.fields.marital_status.value() ?? tenant?.marital_status}
									onValueChange={(v) => {
										if (v) form.fields.marital_status.set(v as MaritalStatus);
									}}
								>
									<Select.Trigger>
										{form.fields.marital_status.value()
											? maritalStatusOptions[form.fields.marital_status.value()!]
											: tenant?.marital_status
												? maritalStatusOptions[tenant.marital_status]
												: 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(maritalStatusOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input
									hidden
									{...tenant != null
										? form.fields.marital_status.as('text', tenant.marital_status)
										: form.fields.marital_status.as('text')}
								/>
								<Field.FieldError errors={form.fields.marital_status.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.nationality.issues())}>
							<Field.FieldLabel>Nationality</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...tenant?.nationality != null
										? form.fields.nationality.as('text', tenant.nationality)
										: form.fields.nationality.as('text')}
								/>
								<Field.FieldError errors={form.fields.nationality.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.birth_date.issues())}>
							<Field.FieldLabel for="birth_date">Birth Date</Field.FieldLabel>
							<Field.FieldContent>
								<Popover.Root>
									<Popover.Trigger
										id="birth_date"
										class={cn(
											buttonVariants({ variant: 'outline' }),
											'w-full justify-start pl-4 text-left font-normal',
											!form.fields.birth_date.value() &&
												!tenant?.birth_date &&
												'text-muted-foreground'
										)}
									>
										{form.fields.birth_date.value()
											? df.format(
													parseAbsolute(
														form.fields.birth_date.value()!,
														getLocalTimeZone()
													).toDate()
												)
											: tenant?.birth_date
												? df.format(parseAbsolute(tenant.birth_date, getLocalTimeZone()).toDate())
												: 'Pick a date'}
										<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
									</Popover.Trigger>
									<Popover.Content class="w-auto p-0" side="top">
										<Calendar
											type="single"
											value={form.fields.birth_date.value()
												? parseAbsolute(form.fields.birth_date.value()!, getLocalTimeZone())
												: tenant?.birth_date
													? parseAbsolute(tenant.birth_date, getLocalTimeZone())
													: undefined}
											onValueChange={(v) => {
												form.fields.birth_date.set(v?.toDate(getLocalTimeZone()).toISOString());
											}}
										/>
									</Popover.Content>
								</Popover.Root>
								<input
									hidden
									{...tenant?.birth_date != null
										? form.fields.birth_date.as('text', tenant.birth_date)
										: form.fields.birth_date.as('text')}
								/>
								<Field.FieldError errors={form.fields.birth_date.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.id_type.issues())}>
							<Field.FieldLabel>ID Type</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...tenant?.id_type != null
										? form.fields.id_type.as('text', tenant.id_type)
										: form.fields.id_type.as('text')}
								/>
								<Field.FieldError errors={form.fields.id_type.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.id_expiration_date.issues())}>
							<Field.FieldLabel for="id_expiration_date">ID Expiration Date</Field.FieldLabel>
							<Field.FieldContent>
								<Popover.Root>
									<Popover.Trigger
										id="id_expiration_date"
										class={cn(
											buttonVariants({ variant: 'outline' }),
											'w-full justify-start pl-4 text-left font-normal',
											!tenant?.id_expiration_date &&
												!form.fields.id_expiration_date.value() &&
												'text-muted-foreground'
										)}
									>
										{tenant?.id_expiration_date
											? df.format(
													parseAbsolute(tenant.id_expiration_date, getLocalTimeZone()).toDate()
												)
											: form.fields.id_expiration_date.value()
												? df.format(
														parseAbsolute(
															form.fields.id_expiration_date.value()!,
															getLocalTimeZone()
														).toDate()
													)
												: 'Pick a date'}
										<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
									</Popover.Trigger>
									<Popover.Content class="w-auto p-0" side="top">
										<Calendar
											type="single"
											value={tenant?.id_expiration_date
												? parseAbsolute(tenant.id_expiration_date, getLocalTimeZone())
												: form.fields.id_expiration_date.value()
													? parseAbsolute(
															form.fields.id_expiration_date.value()!,
															getLocalTimeZone()
														)
													: undefined}
											onValueChange={(v) => {
												form.fields.id_expiration_date.set(
													v?.toDate(getLocalTimeZone()).toISOString()
												);
											}}
										/>
									</Popover.Content>
								</Popover.Root>
								<input
									hidden
									{...tenant?.id_expiration_date != null
										? form.fields.id_expiration_date.as('text', tenant.id_expiration_date)
										: form.fields.id_expiration_date.as('text')}
								/>
								<Field.FieldError errors={form.fields.id_expiration_date.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.id_number.issues())}>
							<Field.FieldLabel>ID Number</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...tenant?.id_number != null
										? form.fields.id_number.as('text', tenant.id_number)
										: form.fields.id_number.as('text')}
								/>
								<Field.FieldError errors={form.fields.id_number.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.tax_id_number.issues())}>
							<Field.FieldLabel>Tax ID Number</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...tenant?.tax_id_number != null
										? form.fields.tax_id_number.as('text', tenant.tax_id_number)
										: form.fields.tax_id_number.as('text')}
								/>
								<Field.FieldError errors={form.fields.tax_id_number.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>
				</Field.FieldGroup>
			</Field.FieldSet>

			<Field.FieldSet>
				<Field.FieldLegend>Address</Field.FieldLegend>
				<Field.FieldGroup>
					{#if tenant?.address.id != null}
						<input hidden {...form.fields.address.id.as('number', tenant.address.id)} />
					{/if}

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.address.country.issues())}>
							<Field.FieldLabel>Country</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...tenant?.address.country != null
										? form.fields.address.country.as('text', tenant.address.country)
										: form.fields.address.country.as('text')}
								/>
								<Field.FieldError errors={form.fields.address.country.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.address.region.issues())}>
							<Field.FieldLabel>Region</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...tenant?.address.region != null
										? form.fields.address.region.as('text', tenant.address.region)
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
								{...tenant?.address.address != null
									? form.fields.address.address.as('text', tenant.address.address)
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
									{...tenant?.address.postal_code != null
										? form.fields.address.postal_code.as('text', tenant.address.postal_code)
										: form.fields.address.postal_code.as('text')}
								/>
								<Field.FieldError errors={form.fields.address.postal_code.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.address.city.issues())}>
							<Field.FieldLabel>City</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...tenant?.address.city != null
										? form.fields.address.city.as('text', tenant.address.city)
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
					<Field.Field data-invalid={isInvalid(form.fields.email.issues())}>
						<Field.FieldLabel>Email</Field.FieldLabel>
						<Field.FieldContent>
							<Input
								{...tenant?.email != null
									? form.fields.email.as('text', tenant.email)
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
									{...tenant?.mobile != null
										? form.fields.mobile.as('text', tenant.mobile)
										: form.fields.mobile.as('text')}
								/>
								<Field.FieldError errors={form.fields.mobile.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.phone.issues())}>
							<Field.FieldLabel>Phone</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...tenant?.phone != null
										? form.fields.phone.as('text', tenant.phone)
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
