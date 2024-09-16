<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Calendar } from '@/components/ui/calendar';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import * as Popover from '@/components/ui/popover';
	import { Separator } from '@/components/ui/separator';
	import * as Sheet from '@/components/ui/sheet';
	import {
		createEmployeeSchema,
		salaryTypeOptions,
		type CreateEmployeeSchema,
	} from '@/schemas/employee';
	import { genderOptions } from '@/schemas/gender';
	import { maritalStatusOptions } from '@/schemas/marital-status';
	import { cn } from '@/utils';
	import {
		DateFormatter,
		getLocalTimeZone,
		parseAbsolute,
		type DateValue,
	} from '@internationalized/date';
	import { CalendarIcon, Loader2 } from 'lucide-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';

	export let open = false;
	export let data: SuperValidated<Infer<CreateEmployeeSchema>>;
	export let action: string;

	const form = superForm(data, {
		validators: zodClient(createEmployeeSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				open = false;
			}
		},
	});

	const { form: formData, enhance, submitting } = form;

	$: selectedGender = $formData.gender
		? {
				value: $formData.gender,
				label: genderOptions[$formData.gender],
			}
		: undefined;

	$: selectedMaritalStatus = $formData.marital_status
		? {
				value: $formData.marital_status,
				label: maritalStatusOptions[$formData.marital_status],
			}
		: undefined;

	$: selectedSalaryType = $formData.salary_type
		? {
				value: $formData.salary_type,
				label: salaryTypeOptions[$formData.salary_type],
			}
		: undefined;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long',
	});

	let birthDate: DateValue | undefined;
	$: birthDate = $formData.birth_date
		? parseAbsolute($formData.birth_date, getLocalTimeZone())
		: undefined;

	let idExpirationDate: DateValue | undefined;
	$: idExpirationDate = $formData.id_expiration_date
		? parseAbsolute($formData.id_expiration_date, getLocalTimeZone())
		: undefined;
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto sm:max-w-[40rem]">
		<Sheet.Header>
			<Sheet.Title>Add new employee</Sheet.Title>
			<Sheet.Description>Fill the form below to add a new employee.</Sheet.Description>
		</Sheet.Header>
		<Separator class="my-5" />
		<form method="POST" use:enhance {action}>
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Position</h3>
				<Form.Field {form} name="position">
					<Form.Control let:attrs>
						<Form.Label>Job Title</Form.Label>
						<Input {...attrs} bind:value={$formData.position} />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="salary_type">
						<Form.Control let:attrs>
							<Form.Label>Type</Form.Label>
							<Select.Root
								{...attrs}
								selected={selectedSalaryType}
								onSelectedChange={(v) => {
									if (v) {
										$formData.salary_type = v.value;
									}
								}}
							>
								<Select.Trigger {...attrs}>
									<Select.Value placeholder="Select" />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="hourly">Hourly</Select.Item>
									<Select.Item value="monthly">Monthly</Select.Item>
								</Select.Content>
							</Select.Root>
							<input hidden bind:value={$formData.salary_type} name={attrs.name} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="salary">
						<Form.Control let:attrs>
							<Form.Label>Salary</Form.Label>
							<Input type="number" step="any" {...attrs} bind:value={$formData.salary} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
				</div>
			</div>
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Identification</h3>
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label>Name</Form.Label>
						<Input {...attrs} bind:value={$formData.name} />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="gender">
						<Form.Control let:attrs>
							<Form.Label>Gender</Form.Label>
							<Select.Root
								{...attrs}
								selected={selectedGender}
								onSelectedChange={(v) => {
									if (v) {
										$formData.gender = v.value;
									}
								}}
							>
								<Select.Trigger {...attrs}>
									<Select.Value placeholder="Select" />
								</Select.Trigger>
								<Select.Content>
									{#each Object.entries(genderOptions) as [value, label]}
										<Select.Item {value} {label} />
									{/each}
								</Select.Content>
							</Select.Root>
							<input hidden bind:value={$formData.gender} name={attrs.name} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="marital_status">
						<Form.Control let:attrs>
							<Form.Label>Marital Status</Form.Label>
							<Select.Root
								{...attrs}
								selected={selectedMaritalStatus}
								onSelectedChange={(v) => {
									if (v) {
										$formData.marital_status = v.value;
									}
								}}
							>
								<Select.Trigger {...attrs}>
									<Select.Value placeholder="Select" />
								</Select.Trigger>
								<Select.Content>
									{#each Object.entries(maritalStatusOptions) as [value, label]}
										<Select.Item {value} {label} />
									{/each}
								</Select.Content>
							</Select.Root>
							<input hidden bind:value={$formData.marital_status} name={attrs.name} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
				</div>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="nationality">
						<Form.Control let:attrs>
							<Form.Label>Nationality</Form.Label>
							<Input {...attrs} bind:value={$formData.nationality} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="birth_date">
						<Form.Control id="birth_date" let:attrs>
							<Form.Label for="birth_date">Birth Date</Form.Label>
							<Popover.Root>
								<Popover.Trigger
									{...attrs}
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
										initialFocus
										value={birthDate}
										onValueChange={(v) => {
											if (v) {
												$formData.birth_date = v.toDate(getLocalTimeZone()).toISOString();
											} else {
												$formData.birth_date = '';
											}
										}}
									/>
								</Popover.Content>
							</Popover.Root>
							<Form.FieldErrors />
							<input hidden value={$formData.birth_date} name={attrs.name} />
						</Form.Control>
					</Form.Field>
				</div>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="id_type">
						<Form.Control let:attrs>
							<Form.Label>ID Type</Form.Label>
							<Input {...attrs} bind:value={$formData.id_type} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="id_expiration_date">
						<Form.Control id="id_expiration_date" let:attrs>
							<Form.Label for="id_expiration_date">ID Expiration Date</Form.Label>
							<Popover.Root>
								<Popover.Trigger
									{...attrs}
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
										initialFocus
										value={idExpirationDate}
										onValueChange={(v) => {
											if (v) {
												$formData.id_expiration_date = v.toDate(getLocalTimeZone()).toISOString();
											} else {
												$formData.id_expiration_date = '';
											}
										}}
									/>
								</Popover.Content>
							</Popover.Root>
							<input hidden value={$formData.id_expiration_date} name={attrs.name} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
				</div>
				<div class="grid grid-cols-3 items-start gap-x-4">
					<Form.Field {form} name="id_number">
						<Form.Control let:attrs>
							<Form.Label>ID Number</Form.Label>
							<Input {...attrs} bind:value={$formData.id_number} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="tax_id_number">
						<Form.Control let:attrs>
							<Form.Label>Tax ID Number</Form.Label>
							<Input {...attrs} bind:value={$formData.tax_id_number} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="ss_number">
						<Form.Control let:attrs>
							<Form.Label>SS Number</Form.Label>
							<Input {...attrs} bind:value={$formData.ss_number} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
				</div>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="ss_number">
						<Form.Control let:attrs>
							<Form.Label>SS Number</Form.Label>
							<Input {...attrs} bind:value={$formData.ss_number} />
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
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Contacts</h3>
				<Form.Field {form} name="email">
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input {...attrs} bind:value={$formData.email} />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="mobile">
						<Form.Control let:attrs>
							<Form.Label>Mobile</Form.Label>
							<Input {...attrs} bind:value={$formData.mobile} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field><Form.Field {form} name="phone">
						<Form.Control let:attrs>
							<Form.Label>Phone</Form.Label>
							<Input {...attrs} bind:value={$formData.phone} />
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
