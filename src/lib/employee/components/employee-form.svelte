<script lang="ts">
	import { Button, buttonVariants } from '@/shared/components/ui/button';
	import { Calendar } from '@/shared/components/ui/calendar';
	import * as Field from '@/shared/components/ui/field';
	import { Input } from '@/shared/components/ui/input';
	import * as Popover from '@/shared/components/ui/popover';
	import * as Select from '@/shared/components/ui/select';
	import { Separator } from '@/shared/components/ui/separator';
	import * as Sheet from '@/shared/components/ui/sheet';
	import type { Gender, MaritalStatus } from '@/shared/types';
	import { genderOptions, maritalStatusOptions } from '@/shared/types';
	import { cn } from '@/shared/utils';
	import { DateFormatter, getLocalTimeZone, parseAbsolute } from '@internationalized/date';
	import { CalendarIcon } from 'lucide-svelte';
	import { employeeSchema } from '../schemas';
	import { upsertEmployee } from '../employee.remote';
	import type { Employee, SalaryType } from '../types';
	import { salaryTypeOptions } from '../types';
	import { Spinner } from '@/shared/components/ui/spinner';

	interface Props {
		open?: boolean;
		employee?: Employee;
	}

	let { open = $bindable(false), employee }: Props = $props();

	const df = new DateFormatter('en-US', {
		dateStyle: 'long',
	});

	function isInvalid(issues?: { message?: string }[]) {
		return (issues?.length ?? 0) > 0;
	}

	const form = $derived(employee != null ? upsertEmployee.for(employee.id) : upsertEmployee);
	const isEdit = $derived(employee != null);
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto data-[side=right]:sm:max-w-3xl">
		<Sheet.Header>
			<Sheet.Title>{isEdit ? 'Edit employee' : 'Add new employee'}</Sheet.Title>
			<Sheet.Description>
				{isEdit
					? 'Update the employee details below.'
					: 'Fill the form below to add a new employee.'}
			</Sheet.Description>
		</Sheet.Header>
		<Separator />
		<form
			{...form.preflight(employeeSchema).enhance(async (f) => {
				try {
					if (await f.submit()) {
						open = false;
						if (!isEdit) f.form.reset();
					}
				} catch (err) {
					console.error(err);
				}
			})}
			onfocusout={() => form.validate()}
			class="flex flex-col gap-8 px-4"
		>
			{#if employee?.id != null}
				<input hidden {...form.fields.id.as('number', employee.id)} />
			{/if}

			<Field.FieldSet>
				<Field.FieldLegend>Position</Field.FieldLegend>
				<Field.FieldGroup>
					<Field.Field data-invalid={isInvalid(form.fields.position.issues())}>
						<Field.FieldLabel>Job Title</Field.FieldLabel>
						<Field.FieldContent>
							<Input
								{...employee?.position != null
									? form.fields.position.as('text', employee.position)
									: form.fields.position.as('text')}
							/>
							<Field.FieldError errors={form.fields.position.issues()} />
						</Field.FieldContent>
					</Field.Field>

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.salary_type.issues())}>
							<Field.FieldLabel>Type</Field.FieldLabel>
							<Field.FieldContent>
								<Select.Root
									type="single"
									value={form.fields.salary_type.value() ?? employee?.salary_type}
									onValueChange={(v) => {
										if (v) form.fields.salary_type.set(v as SalaryType);
									}}
								>
									<Select.Trigger>
										{form.fields.salary_type.value()
											? salaryTypeOptions[form.fields.salary_type.value()!]
											: employee?.salary_type
												? salaryTypeOptions[employee.salary_type]
												: 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(salaryTypeOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input
									hidden
									{...employee != null
										? form.fields.salary_type.as('text', employee.salary_type)
										: form.fields.salary_type.as('text')}
								/>
								<Field.FieldError errors={form.fields.salary_type.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.salary.issues())}>
							<Field.FieldLabel>Salary</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...employee?.salary != null
										? form.fields.salary.as('number', String(employee.salary))
										: form.fields.salary.as('number')}
								/>
								<Field.FieldError errors={form.fields.salary.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>
				</Field.FieldGroup>
			</Field.FieldSet>

			<Field.FieldSet>
				<Field.FieldLegend>Identification</Field.FieldLegend>
				<Field.FieldGroup>
					<Field.Field data-invalid={isInvalid(form.fields.name.issues())}>
						<Field.FieldLabel>Name</Field.FieldLabel>
						<Field.FieldContent>
							<Input
								{...employee?.name != null
									? form.fields.name.as('text', employee.name)
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
									value={form.fields.gender.value() ?? employee?.gender}
									onValueChange={(v) => {
										if (v) form.fields.gender.set(v as Gender);
									}}
								>
									<Select.Trigger>
										{form.fields.gender.value()
											? genderOptions[form.fields.gender.value()!]
											: employee?.gender
												? genderOptions[employee.gender]
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
									{...employee != null
										? form.fields.gender.as('text', employee.gender)
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
									value={form.fields.marital_status.value() ?? employee?.marital_status}
									onValueChange={(v) => {
										if (v) form.fields.marital_status.set(v as MaritalStatus);
									}}
								>
									<Select.Trigger>
										{form.fields.marital_status.value()
											? maritalStatusOptions[form.fields.marital_status.value()!]
											: employee?.marital_status
												? maritalStatusOptions[employee.marital_status]
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
									{...employee != null
										? form.fields.marital_status.as('text', employee.marital_status)
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
									{...employee?.nationality != null
										? form.fields.nationality.as('text', employee.nationality)
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
												!employee?.birth_date &&
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
											: employee?.birth_date
												? df.format(parseAbsolute(employee.birth_date, getLocalTimeZone()).toDate())
												: 'Pick a date'}
										<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
									</Popover.Trigger>
									<Popover.Content class="w-auto p-0" side="top">
										<Calendar
											type="single"
											value={form.fields.birth_date.value()
												? parseAbsolute(form.fields.birth_date.value()!, getLocalTimeZone())
												: employee?.birth_date
													? parseAbsolute(employee.birth_date, getLocalTimeZone())
													: undefined}
											onValueChange={(v) => {
												form.fields.birth_date.set(v?.toDate(getLocalTimeZone()).toISOString());
											}}
										/>
									</Popover.Content>
								</Popover.Root>
								<input
									hidden
									{...employee?.birth_date != null
										? form.fields.birth_date.as('text', employee.birth_date)
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
									{...employee?.id_type != null
										? form.fields.id_type.as('text', employee.id_type)
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
											!employee?.id_expiration_date &&
												!form.fields.id_expiration_date.value() &&
												'text-muted-foreground'
										)}
									>
										{employee?.id_expiration_date
											? df.format(
													parseAbsolute(employee.id_expiration_date, getLocalTimeZone()).toDate()
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
											value={employee?.id_expiration_date
												? parseAbsolute(employee.id_expiration_date, getLocalTimeZone())
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
									{...employee?.id_expiration_date != null
										? form.fields.id_expiration_date.as('text', employee.id_expiration_date)
										: form.fields.id_expiration_date.as('text')}
								/>
								<Field.FieldError errors={form.fields.id_expiration_date.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>

					<div class="grid grid-cols-3 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.id_number.issues())}>
							<Field.FieldLabel>ID Number</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...employee?.id_number != null
										? form.fields.id_number.as('text', employee.id_number)
										: form.fields.id_number.as('text')}
								/>
								<Field.FieldError errors={form.fields.id_number.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.tax_id_number.issues())}>
							<Field.FieldLabel>Tax ID Number</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...employee?.tax_id_number != null
										? form.fields.tax_id_number.as('text', employee.tax_id_number)
										: form.fields.tax_id_number.as('text')}
								/>
								<Field.FieldError errors={form.fields.tax_id_number.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.ss_number.issues())}>
							<Field.FieldLabel>SS Number</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...employee?.ss_number != null
										? form.fields.ss_number.as('text', employee.ss_number)
										: form.fields.ss_number.as('text')}
								/>
								<Field.FieldError errors={form.fields.ss_number.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>
				</Field.FieldGroup>
			</Field.FieldSet>

			<Field.FieldSet>
				<Field.FieldLegend>Address</Field.FieldLegend>
				<Field.FieldGroup>
					{#if employee?.address?.id != null}
						<input hidden {...form.fields.address.id.as('number', employee.address.id)} />
					{/if}

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.address.country.issues())}>
							<Field.FieldLabel>Country</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...employee?.address?.country != null
										? form.fields.address.country.as('text', employee.address.country)
										: form.fields.address.country.as('text')}
								/>
								<Field.FieldError errors={form.fields.address.country.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.address.region.issues())}>
							<Field.FieldLabel>Region</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...employee?.address?.region != null
										? form.fields.address.region.as('text', employee.address.region)
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
								{...employee?.address?.address != null
									? form.fields.address.address.as('text', employee.address.address)
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
									{...employee?.address?.postal_code != null
										? form.fields.address.postal_code.as('text', employee.address.postal_code)
										: form.fields.address.postal_code.as('text')}
								/>
								<Field.FieldError errors={form.fields.address.postal_code.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.address.city.issues())}>
							<Field.FieldLabel>City</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...employee?.address?.city != null
										? form.fields.address.city.as('text', employee.address.city)
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
								{...employee?.email != null
									? form.fields.email.as('text', employee.email)
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
									{...employee?.mobile != null
										? form.fields.mobile.as('text', employee.mobile)
										: form.fields.mobile.as('text')}
								/>
								<Field.FieldError errors={form.fields.mobile.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.phone.issues())}>
							<Field.FieldLabel>Phone</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...employee?.phone != null
										? form.fields.phone.as('text', employee.phone)
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
