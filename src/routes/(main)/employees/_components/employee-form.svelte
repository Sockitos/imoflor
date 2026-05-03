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
	import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date';
	import { CalendarIcon, Loader2 } from 'lucide-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	interface Props {
		open?: boolean;
		data: SuperValidated<Infer<CreateEmployeeSchema>>;
		action: string;
	}

	let { open = $bindable(false), data, action }: Props = $props();

	const form = superForm(data, {
		validators: zod4Client(createEmployeeSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				open = false;
			}
		},
		invalidateAll: 'force',
	});

	const { form: formData, enhance, submitting } = form;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long',
	});

	let birthDate = $derived($formData.birth_date ? parseDate($formData.birth_date) : undefined);

	let idExpirationDate = $derived(
		$formData.id_expiration_date ? parseDate($formData.id_expiration_date) : undefined
	);
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
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Job Title</Form.Label>
							<Input {...props} bind:value={$formData.position} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="salary_type">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Type</Form.Label>
								<Select.Root {...props} type="single" bind:value={$formData.salary_type}>
									<Select.Trigger {...props}>
										{$formData.salary_type ? $formData.salary_type : 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(salaryTypeOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input hidden bind:value={$formData.salary_type} name={props.name} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="salary">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Salary</Form.Label>
								<Input type="number" step="any" {...props} bind:value={$formData.salary} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
			</div>
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Identification</h3>
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Name</Form.Label>
							<Input {...props} bind:value={$formData.name} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="gender">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Gender</Form.Label>
								<Select.Root {...props} type="single" bind:value={$formData.gender}>
									<Select.Trigger {...props}>
										{$formData.gender ? $formData.gender : 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(genderOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input hidden bind:value={$formData.gender} name={props.name} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="marital_status">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Marital Status</Form.Label>
								<Select.Root {...props} type="single" bind:value={$formData.marital_status}>
									<Select.Trigger {...props}>
										{$formData.marital_status ? $formData.marital_status : 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(maritalStatusOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input hidden bind:value={$formData.marital_status} name={props.name} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="nationality">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Nationality</Form.Label>
								<Input {...props} bind:value={$formData.nationality} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="birth_date">
						<Form.Control id="birth_date">
							{#snippet children({ props })}
								<Form.Label for="birth_date">Birth Date</Form.Label>
								<Popover.Root>
									<Popover.Trigger
										{...props}
										class={cn(
											buttonVariants({ variant: 'outline' }),
											'w-full justify-start pl-4 text-left font-normal',
											!birthDate && 'text-muted-foreground'
										)}
									>
										{birthDate ? df.format(birthDate.toDate(getLocalTimeZone())) : 'Pick a date'}
										<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
									</Popover.Trigger>
									<Popover.Content class="w-auto p-0" side="top">
										<Calendar
											type="single"
											value={birthDate}
											onValueChange={(v) => {
												if (v) {
													$formData.birth_date = v.toDate(getLocalTimeZone()).toISOString();
												}
											}}
										/>
									</Popover.Content>
								</Popover.Root>
								<Form.FieldErrors />
								<input hidden value={$formData.birth_date} name={props.name} />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="id_type">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>ID Type</Form.Label>
								<Input {...props} bind:value={$formData.id_type} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="id_expiration_date">
						<Form.Control id="id_expiration_date">
							{#snippet children({ props })}
								<Form.Label for="id_expiration_date">ID Expiration Date</Form.Label>
								<Popover.Root>
									<Popover.Trigger
										{...props}
										class={cn(
											buttonVariants({ variant: 'outline' }),
											'w-full justify-start pl-4 text-left font-normal',
											!idExpirationDate && 'text-muted-foreground'
										)}
									>
										{idExpirationDate
											? df.format(idExpirationDate.toDate(getLocalTimeZone()))
											: 'Pick a date'}
										<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
									</Popover.Trigger>
									<Popover.Content class="w-auto p-0" side="top">
										<Calendar
											type="single"
											value={idExpirationDate}
											onValueChange={(v) => {
												if (v) {
													$formData.id_expiration_date = v.toDate(getLocalTimeZone()).toISOString();
												}
											}}
										/>
									</Popover.Content>
								</Popover.Root>
								<input hidden value={$formData.id_expiration_date} name={props.name} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				<div class="grid grid-cols-3 items-start gap-x-4">
					<Form.Field {form} name="id_number">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>ID Number</Form.Label>
								<Input {...props} bind:value={$formData.id_number} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="tax_id_number">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Tax ID Number</Form.Label>
								<Input {...props} bind:value={$formData.tax_id_number} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="ss_number">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>SS Number</Form.Label>
								<Input {...props} bind:value={$formData.ss_number} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
			</div>
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Address</h3>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="country">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Country</Form.Label>
								<Input {...props} bind:value={$formData.country} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="region">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Region</Form.Label>
								<Input {...props} bind:value={$formData.region} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				<Form.Field {form} name="address">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Address</Form.Label>
							<Input {...props} bind:value={$formData.address} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="postal_code">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Postal Code</Form.Label>
								<Input {...props} bind:value={$formData.postal_code} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="city">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>City</Form.Label>
								<Input {...props} bind:value={$formData.city} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
			</div>
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Contacts</h3>
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input {...props} bind:value={$formData.email} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="mobile">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Mobile</Form.Label>
								<Input {...props} bind:value={$formData.mobile} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field><Form.Field {form} name="phone">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Phone</Form.Label>
								<Input {...props} bind:value={$formData.phone} />
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
