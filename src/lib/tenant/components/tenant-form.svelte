<script lang="ts">
	import * as Select from '@/shared/components/ui/select';
	import { DateFormatter, getLocalTimeZone, parseAbsolute } from '@internationalized/date';
	import { Button, buttonVariants } from '@/shared/components/ui/button';
	import { Calendar } from '@/shared/components/ui/calendar';
	import * as Field from '@/shared/components/ui/field';
	import { Input } from '@/shared/components/ui/input';
	import * as Popover from '@/shared/components/ui/popover';
	import { Separator } from '@/shared/components/ui/separator';
	import * as Sheet from '@/shared/components/ui/sheet';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { genderOptions, maritalStatusOptions } from '@/shared/types';
	import type { Gender, MaritalStatus } from '@/shared/types';
	import { cn } from '@/shared/utils';
	import { CalendarIcon, Loader2 } from 'lucide-svelte';
	import { createTenantSchema, updateTenantSchema } from '../schemas';
	import { createTenant, getTenant, updateTenant } from '../tenant.remote';
	import type { Tenant } from '../types';

	type TenantFormInstance = typeof createTenant | ReturnType<typeof updateTenant.for>;

	interface Props {
		open?: boolean;
		tenantId?: number;
	}

	let { open = $bindable(false), tenantId }: Props = $props();

	const isEdit = $derived(tenantId != null);

	const df = new DateFormatter('en-US', {
		dateStyle: 'long',
	});

	function isInvalid(issues?: { message?: string }[]) {
		return (issues?.length ?? 0) > 0;
	}

	function fieldValue<T>(current: T | undefined, fallback: T | undefined) {
		return current ?? fallback;
	}
</script>

{#snippet form(tenantForm: TenantFormInstance, tenant?: Tenant)}
	{@const birthDateValue =
		tenantForm.fields.birth_date.value() ?? tenant?.birth_date ?? undefined}
	{@const idExpirationDateValue =
		tenantForm.fields.id_expiration_date.value() ?? tenant?.id_expiration_date ?? undefined}
	{@const birthDate = birthDateValue
		? parseAbsolute(birthDateValue, getLocalTimeZone())
		: undefined}
	{@const idExpirationDate = idExpirationDateValue
		? parseAbsolute(idExpirationDateValue, getLocalTimeZone())
		: undefined}

	<Field.FieldSet>
		<Field.FieldLegend>Identification</Field.FieldLegend>
		<Field.FieldGroup>
			<Field.Field data-invalid={isInvalid(tenantForm.fields.name.issues())}>
				<Field.FieldLabel>Name</Field.FieldLabel>
				<Field.FieldContent>
					<Input
						{...(tenant
							? tenantForm.fields.name.as('text', tenant.name)
							: tenantForm.fields.name.as('text'))}
					/>
					<Field.FieldError errors={tenantForm.fields.name.issues()} />
				</Field.FieldContent>
			</Field.Field>

			<div class="grid grid-cols-2 items-start gap-x-4">
				<Field.Field data-invalid={isInvalid(tenantForm.fields.gender.issues())}>
					<Field.FieldLabel>Gender</Field.FieldLabel>
					<Field.FieldContent>
						{@const gender = fieldValue(tenantForm.fields.gender.value(), tenant?.gender)}
						<Select.Root
							type="single"
							value={gender}
							onValueChange={(v) => {
								if (v) tenantForm.fields.gender.set(v as Gender);
							}}
						>
							<Select.Trigger>
								{gender ? genderOptions[gender] : 'Select'}
							</Select.Trigger>
							<Select.Content>
								{#each Object.entries(genderOptions) as [value, label] (value)}
									<Select.Item {value} {label} />
								{/each}
							</Select.Content>
						</Select.Root>
						{#if gender}
							<input {...tenantForm.fields.gender.as('hidden', gender)} />
						{/if}
						<Field.FieldError errors={tenantForm.fields.gender.issues()} />
					</Field.FieldContent>
				</Field.Field>

				<Field.Field data-invalid={isInvalid(tenantForm.fields.marital_status.issues())}>
					<Field.FieldLabel>Marital Status</Field.FieldLabel>
					<Field.FieldContent>
						{@const maritalStatus = fieldValue(
							tenantForm.fields.marital_status.value(),
							tenant?.marital_status
						)}
						<Select.Root
							type="single"
							value={maritalStatus}
							onValueChange={(v) => {
								if (v) tenantForm.fields.marital_status.set(v as MaritalStatus);
							}}
						>
							<Select.Trigger>
								{maritalStatus ? maritalStatusOptions[maritalStatus] : 'Select'}
							</Select.Trigger>
							<Select.Content>
								{#each Object.entries(maritalStatusOptions) as [value, label] (value)}
									<Select.Item {value} {label} />
								{/each}
							</Select.Content>
						</Select.Root>
						{#if maritalStatus}
							<input {...tenantForm.fields.marital_status.as('hidden', maritalStatus)} />
						{/if}
						<Field.FieldError errors={tenantForm.fields.marital_status.issues()} />
					</Field.FieldContent>
				</Field.Field>
			</div>

			<div class="grid grid-cols-2 items-start gap-x-4">
				<Field.Field data-invalid={isInvalid(tenantForm.fields.nationality.issues())}>
					<Field.FieldLabel>Nationality</Field.FieldLabel>
					<Field.FieldContent>
						<Input
							{...(tenant
								? tenantForm.fields.nationality.as('text', tenant.nationality)
								: tenantForm.fields.nationality.as('text'))}
						/>
						<Field.FieldError errors={tenantForm.fields.nationality.issues()} />
					</Field.FieldContent>
				</Field.Field>

				<Field.Field data-invalid={isInvalid(tenantForm.fields.birth_date.issues())}>
					<Field.FieldLabel for="birth_date">Birth Date</Field.FieldLabel>
					<Field.FieldContent>
						<Popover.Root>
							<Popover.Trigger
								id="birth_date"
								class={cn(
									buttonVariants({ variant: 'outline' }),
									'w-full justify-start pl-4 text-left font-normal',
									!birthDate && 'text-muted-foreground'
								)}
							>
								{birthDate ? df.format(birthDate.toDate()) : 'Pick a date'}
								<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
							</Popover.Trigger>
							<Popover.Content class="w-auto p-0" side="top">
								<Calendar
									type="single"
									value={birthDate}
									onValueChange={(v) => {
										tenantForm.fields.birth_date.set(
											v ? v.toDate(getLocalTimeZone()).toISOString() : undefined
										);
									}}
								/>
							</Popover.Content>
						</Popover.Root>
						{#if birthDateValue}
							<input {...tenantForm.fields.birth_date.as('hidden', birthDateValue)} />
						{/if}
						<Field.FieldError errors={tenantForm.fields.birth_date.issues()} />
					</Field.FieldContent>
				</Field.Field>
			</div>

			<div class="grid grid-cols-2 items-start gap-x-4">
				<Field.Field data-invalid={isInvalid(tenantForm.fields.id_type.issues())}>
					<Field.FieldLabel>ID Type</Field.FieldLabel>
					<Field.FieldContent>
						<Input
							{...(tenant
								? tenantForm.fields.id_type.as('text', tenant.id_type)
								: tenantForm.fields.id_type.as('text'))}
						/>
						<Field.FieldError errors={tenantForm.fields.id_type.issues()} />
					</Field.FieldContent>
				</Field.Field>

				<Field.Field data-invalid={isInvalid(tenantForm.fields.id_expiration_date.issues())}>
					<Field.FieldLabel for="id_expiration_date">ID Expiration Date</Field.FieldLabel>
					<Field.FieldContent>
						<Popover.Root>
							<Popover.Trigger
								id="id_expiration_date"
								class={cn(
									buttonVariants({ variant: 'outline' }),
									'w-full justify-start pl-4 text-left font-normal',
									!idExpirationDate && 'text-muted-foreground'
								)}
							>
								{idExpirationDate ? df.format(idExpirationDate.toDate()) : 'Pick a date'}
								<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
							</Popover.Trigger>
							<Popover.Content class="w-auto p-0" side="top">
								<Calendar
									type="single"
									value={idExpirationDate}
									onValueChange={(v) => {
										tenantForm.fields.id_expiration_date.set(
											v ? v.toDate(getLocalTimeZone()).toISOString() : undefined
										);
									}}
								/>
							</Popover.Content>
						</Popover.Root>
						{#if idExpirationDateValue}
							<input {...tenantForm.fields.id_expiration_date.as('hidden', idExpirationDateValue)} />
						{/if}
						<Field.FieldError errors={tenantForm.fields.id_expiration_date.issues()} />
					</Field.FieldContent>
				</Field.Field>
			</div>

			<div class="grid grid-cols-2 items-start gap-x-4">
				<Field.Field data-invalid={isInvalid(tenantForm.fields.id_number.issues())}>
					<Field.FieldLabel>ID Number</Field.FieldLabel>
					<Field.FieldContent>
						<Input
							{...(tenant
								? tenantForm.fields.id_number.as('text', tenant.id_number)
								: tenantForm.fields.id_number.as('text'))}
						/>
						<Field.FieldError errors={tenantForm.fields.id_number.issues()} />
					</Field.FieldContent>
				</Field.Field>

				<Field.Field data-invalid={isInvalid(tenantForm.fields.tax_id_number.issues())}>
					<Field.FieldLabel>Tax ID Number</Field.FieldLabel>
					<Field.FieldContent>
						<Input
							{...(tenant
								? tenantForm.fields.tax_id_number.as('text', tenant.tax_id_number)
								: tenantForm.fields.tax_id_number.as('text'))}
						/>
						<Field.FieldError errors={tenantForm.fields.tax_id_number.issues()} />
					</Field.FieldContent>
				</Field.Field>
			</div>
		</Field.FieldGroup>
	</Field.FieldSet>

	<Field.FieldSet>
		<Field.FieldLegend>Address</Field.FieldLegend>
		<Field.FieldGroup>
			{#if tenant?.address.id != null}
				<input hidden {...tenantForm.fields.address.id.as('number', tenant.address.id)} />
			{/if}

			<div class="grid grid-cols-2 items-start gap-x-4">
				<Field.Field data-invalid={isInvalid(tenantForm.fields.address.country.issues())}>
					<Field.FieldLabel>Country</Field.FieldLabel>
					<Field.FieldContent>
						<Input
							{...(tenant
								? tenantForm.fields.address.country.as('text', tenant.address.country)
								: tenantForm.fields.address.country.as('text'))}
						/>
						<Field.FieldError errors={tenantForm.fields.address.country.issues()} />
					</Field.FieldContent>
				</Field.Field>

				<Field.Field data-invalid={isInvalid(tenantForm.fields.address.region.issues())}>
					<Field.FieldLabel>Region</Field.FieldLabel>
					<Field.FieldContent>
						<Input
							{...(tenant
								? tenantForm.fields.address.region.as('text', tenant.address.region)
								: tenantForm.fields.address.region.as('text'))}
						/>
						<Field.FieldError errors={tenantForm.fields.address.region.issues()} />
					</Field.FieldContent>
				</Field.Field>
			</div>

			<Field.Field data-invalid={isInvalid(tenantForm.fields.address.address.issues())}>
				<Field.FieldLabel>Address</Field.FieldLabel>
				<Field.FieldContent>
					<Input
						{...(tenant
							? tenantForm.fields.address.address.as('text', tenant.address.address)
							: tenantForm.fields.address.address.as('text'))}
					/>
					<Field.FieldError errors={tenantForm.fields.address.address.issues()} />
				</Field.FieldContent>
			</Field.Field>

			<div class="grid grid-cols-2 items-start gap-x-4">
				<Field.Field data-invalid={isInvalid(tenantForm.fields.address.postal_code.issues())}>
					<Field.FieldLabel>Postal Code</Field.FieldLabel>
					<Field.FieldContent>
						<Input
							{...(tenant
								? tenantForm.fields.address.postal_code.as('text', tenant.address.postal_code)
								: tenantForm.fields.address.postal_code.as('text'))}
						/>
						<Field.FieldError errors={tenantForm.fields.address.postal_code.issues()} />
					</Field.FieldContent>
				</Field.Field>

				<Field.Field data-invalid={isInvalid(tenantForm.fields.address.city.issues())}>
					<Field.FieldLabel>City</Field.FieldLabel>
					<Field.FieldContent>
						<Input
							{...(tenant
								? tenantForm.fields.address.city.as('text', tenant.address.city)
								: tenantForm.fields.address.city.as('text'))}
						/>
						<Field.FieldError errors={tenantForm.fields.address.city.issues()} />
					</Field.FieldContent>
				</Field.Field>
			</div>
		</Field.FieldGroup>
	</Field.FieldSet>

	<Field.FieldSet>
		<Field.FieldLegend>Contacts</Field.FieldLegend>
		<Field.FieldGroup>
			<Field.Field data-invalid={isInvalid(tenantForm.fields.email.issues())}>
				<Field.FieldLabel>Email</Field.FieldLabel>
				<Field.FieldContent>
					<Input
						{...(tenant?.email != null
							? tenantForm.fields.email.as('text', tenant.email)
							: tenantForm.fields.email.as('text'))}
					/>
					<Field.FieldError errors={tenantForm.fields.email.issues()} />
				</Field.FieldContent>
			</Field.Field>

			<div class="grid grid-cols-2 items-start gap-x-4">
				<Field.Field data-invalid={isInvalid(tenantForm.fields.mobile.issues())}>
					<Field.FieldLabel>Mobile</Field.FieldLabel>
					<Field.FieldContent>
						<Input
							{...(tenant?.mobile != null
								? tenantForm.fields.mobile.as('text', tenant.mobile)
								: tenantForm.fields.mobile.as('text'))}
						/>
						<Field.FieldError errors={tenantForm.fields.mobile.issues()} />
					</Field.FieldContent>
				</Field.Field>

				<Field.Field data-invalid={isInvalid(tenantForm.fields.phone.issues())}>
					<Field.FieldLabel>Phone</Field.FieldLabel>
					<Field.FieldContent>
						<Input
							{...(tenant?.phone != null
								? tenantForm.fields.phone.as('text', tenant.phone)
								: tenantForm.fields.phone.as('text'))}
						/>
						<Field.FieldError errors={tenantForm.fields.phone.issues()} />
					</Field.FieldContent>
				</Field.Field>
			</div>
		</Field.FieldGroup>
	</Field.FieldSet>

	<div class="flex flex-row items-center justify-end gap-4 pt-2">
		<Button
			variant="ghost"
			onclick={(e) => {
				e.preventDefault();
				open = false;
			}}
		>
			Cancel
		</Button>
		<Button type="submit" disabled={!!tenantForm.pending}>
			{#if tenantForm.pending}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Submit
		</Button>
	</div>
{/snippet}

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto sm:max-w-3xl">
		<Sheet.Header>
			<Sheet.Title>{isEdit ? 'Edit tenant' : 'Add new tenant'}</Sheet.Title>
			<Sheet.Description>
				{isEdit
					? 'Update the tenant details below.'
					: 'Fill the form below to add a new tenant.'}
			</Sheet.Description>
		</Sheet.Header>
		<Separator class="my-5" />
		{#if open}
			{#if isEdit && tenantId != null}
				<svelte:boundary>
					{@const tenant = await getTenant(tenantId)}
					{@const tenantForm = updateTenant.for(tenantId)}

					<form
						{...tenantForm.preflight(updateTenantSchema).enhance(async (f) => {
							try {
								if (await f.submit()) {
									open = false;
								}
							} catch (err) {
								console.error(err);
							}
						})}
						class="px-4"
					>
						<input hidden {...tenantForm.fields.id.as('number', tenantId)} />
						{@render form(tenantForm, tenant)}
					</form>

					{#snippet pending()}
						<div class="flex items-center justify-center px-4 py-12">
							<Spinner class="size-6" />
						</div>
					{/snippet}

					{#snippet failed(_, reset)}
						<div class="flex flex-col items-center gap-y-4 px-4 py-12">
							<p class="text-sm text-destructive">Failed to load tenant.</p>
							<Button variant="outline" class="w-fit" onclick={reset}>Retry</Button>
						</div>
					{/snippet}
				</svelte:boundary>
			{:else}
				<form
					{...createTenant.preflight(createTenantSchema).enhance(async (f) => {
						try {
							if (await f.submit()) {
								open = false;
								f.form.reset();
							}
						} catch (err) {
							console.error(err);
						}
					})}
					class="px-4"
				>
					{@render form(createTenant)}
				</form>
			{/if}
		{/if}
	</Sheet.Content>
</Sheet.Root>
