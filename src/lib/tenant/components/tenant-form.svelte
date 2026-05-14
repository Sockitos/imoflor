<script lang="ts">
	import * as Select from '$lib/shared/components/ui/select';
	import { DateFormatter, getLocalTimeZone, parseAbsolute } from '@internationalized/date';
	import { Button, buttonVariants } from '@shared/components/ui/button';
	import { Calendar } from '@shared/components/ui/calendar';
	import * as Form from '@shared/components/ui/form';
	import { Input } from '@shared/components/ui/input';
	import * as Popover from '@shared/components/ui/popover';
	import { Separator } from '@shared/components/ui/separator';
	import * as Sheet from '@shared/components/ui/sheet';
	import { genderOptions, maritalStatusOptions } from '@shared/types';
	import { cn } from '@shared/utils';
	import { CalendarIcon, Loader2 } from 'lucide-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { createTenantSchema, type CreateTenantSchema } from '../schemas';

	interface Props {
		open?: boolean;
		data: SuperValidated<Infer<CreateTenantSchema>>;
		action: string;
	}

	let { open = $bindable(false), data, action }: Props = $props();

	const form = superForm(data, {
		validators: zod4Client(createTenantSchema),
		dataType: 'json',
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

	let birthDate = $derived(
		$formData.birth_date ? parseAbsolute($formData.birth_date, getLocalTimeZone()) : undefined
	);

	let idExpirationDate = $derived(
		$formData.id_expiration_date
			? parseAbsolute($formData.id_expiration_date, getLocalTimeZone())
			: undefined
	);
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto sm:max-w-3xl">
		<Sheet.Header>
			<Sheet.Title>Add new tenant</Sheet.Title>
			<Sheet.Description>Fill the form below to add a new tenant.</Sheet.Description>
		</Sheet.Header>
		<Separator class="my-5" />
		<form method="POST" use:enhance {action} class="px-4">
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
										{$formData.gender ? genderOptions[$formData.gender] : 'Select'}
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
										{$formData.marital_status
											? maritalStatusOptions[$formData.marital_status]
											: 'Select'}
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
										{birthDate ? df.format(birthDate.toDate()) : 'Pick a date'}
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
								<input hidden value={$formData.birth_date} name={props.name} />
								<Form.FieldErrors />
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
										{idExpirationDate ? df.format(idExpirationDate.toDate()) : 'Pick a date'}
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
				<div class="grid grid-cols-2 items-start gap-x-4">
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
				</div>
			</div>
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Address</h3>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<input hidden bind:value={$formData.address.id} name="address.id" />
					<Form.Field {form} name="address.country">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Country</Form.Label>
								<Input {...props} bind:value={$formData.address.country} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="address.region">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Region</Form.Label>
								<Input {...props} bind:value={$formData.address.region} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				<Form.Field {form} name="address.address">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Address</Form.Label>
							<Input {...props} bind:value={$formData.address.address} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="address.postal_code">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Postal Code</Form.Label>
								<Input {...props} bind:value={$formData.address.postal_code} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="address.city">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>City</Form.Label>
								<Input {...props} bind:value={$formData.address.city} />
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
