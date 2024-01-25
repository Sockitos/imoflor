<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Calendar } from '@/components/ui/calendar';
	import * as Form from '@/components/ui/form';
	import * as Popover from '@/components/ui/popover';
	import {
		createTenantSchema,
		updateTenantSchema,
		type CreateTenantSchema,
		type UpdateTenantSchema,
	} from '@/schemas/tenant';
	import { cn } from '@/utils';
	import { CalendarIcon, Loader2 } from 'lucide-svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	export let form: SuperValidated<CreateTenantSchema> | SuperValidated<UpdateTenantSchema>;
	const sForm = superForm(form);

	$: editing = !!form.data.id;
	$: submitting = sForm.submitting;
</script>

<Form.Root
	method="POST"
	action={editing ? '/tenants?/update' : '/tenants?/create'}
	controlled
	form={sForm}
	schema={editing ? updateTenantSchema : createTenantSchema}
	let:config
>
	<div class="mb-5 space-y-3">
		<h3 class="text-lg font-medium">Identification</h3>
		<Form.Field {config} name="name">
			<Form.Item>
				<Form.Label>Name</Form.Label>
				<Form.Input />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<div class="grid grid-cols-2 items-start space-x-4">
			<Form.Field {config} name="gender">
				<Form.Item>
					<Form.Label>Gender</Form.Label>
					<Form.Select>
						<Form.SelectTrigger placeholder="Select" />
						<Form.SelectContent>
							<Form.SelectItem value="male">Male</Form.SelectItem>
							<Form.SelectItem value="female">Female</Form.SelectItem>
							<Form.SelectItem value="other">Other</Form.SelectItem>
						</Form.SelectContent>
					</Form.Select>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="marital_status">
				<Form.Item>
					<Form.Label>Marital Status</Form.Label>
					<Form.Select>
						<Form.SelectTrigger placeholder="Select" />
						<Form.SelectContent>
							<Form.SelectItem value="single">Single</Form.SelectItem>
							<Form.SelectItem value="married">Married</Form.SelectItem>
							<Form.SelectItem value="union">Union</Form.SelectItem>
							<Form.SelectItem value="divorced">Divorced</Form.SelectItem>
							<Form.SelectItem value="widowed">Widowed</Form.SelectItem>
						</Form.SelectContent>
					</Form.Select>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		</div>
		<div class="grid grid-cols-2 items-start space-x-4">
			<Form.Field {config} name="nationality">
				<Form.Item>
					<Form.Label>Nationality</Form.Label>
					<Form.Input />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="birth_date">
				<Form.Item>
					<Form.Label for="birth_date">Birth Date</Form.Label>
					<Popover.Root>
						<Form.Control id="birth_date" let:attrs>
							<Popover.Trigger
								id="birth_date"
								{...attrs}
								class={cn(
									buttonVariants({ variant: 'outline' }),
									'w-full justify-start pl-4 text-left font-normal',
									!false && 'text-muted-foreground'
								)}
							>
								Pick a date
								<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
							</Popover.Trigger>
						</Form.Control>
						<Popover.Content class="w-auto p-0" side="top">
							<Calendar initialFocus onValueChange={(v) => {}} />
						</Popover.Content>
					</Popover.Root>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		</div>
		<div class="grid grid-cols-2 items-start space-x-4">
			<Form.Field {config} name="id_type">
				<Form.Item>
					<Form.Label>ID Type</Form.Label>
					<Form.Input />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="id_expiration_date">
				<Form.Item>
					<Form.Label for="id_expiration_date">ID Expiration Date</Form.Label>
					<Popover.Root>
						<Form.Control id="id_expiration_date" let:attrs>
							<Popover.Trigger
								id="id_expiration_date"
								{...attrs}
								class={cn(
									buttonVariants({ variant: 'outline' }),
									'w-full justify-start pl-4 text-left font-normal',
									!false && 'text-muted-foreground'
								)}
							>
								Pick a date
								<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
							</Popover.Trigger>
						</Form.Control>
						<Popover.Content class="w-auto p-0" side="top">
							<Calendar initialFocus onValueChange={(v) => {}} />
						</Popover.Content>
					</Popover.Root>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		</div>
		<div class="grid grid-cols-3 items-start space-x-4">
			<Form.Field {config} name="id_number">
				<Form.Item>
					<Form.Label>ID Number</Form.Label>
					<Form.Input />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="ss_number">
				<Form.Item>
					<Form.Label>SS Number</Form.Label>
					<Form.Input />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="nif">
				<Form.Item>
					<Form.Label>F Number</Form.Label>
					<Form.Input />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		</div>
	</div>
	<div class="mb-5 space-y-3">
		<h3 class="text-lg font-medium">Address</h3>
		<div class="grid grid-cols-2 items-start space-x-4">
			<Form.Field {config} name="country">
				<Form.Item>
					<Form.Label>Country</Form.Label>
					<Form.Input />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="region">
				<Form.Item>
					<Form.Label>Region</Form.Label>
					<Form.Input />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		</div>
		<Form.Field {config} name="address">
			<Form.Item>
				<Form.Label>Address</Form.Label>
				<Form.Input />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<div class="grid grid-cols-2 items-start space-x-4">
			<Form.Field {config} name="postal_code">
				<Form.Item>
					<Form.Label>Postal Code</Form.Label>
					<Form.Input />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="city">
				<Form.Item>
					<Form.Label>City</Form.Label>
					<Form.Input />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		</div>
	</div>
	<div class="mb-5 space-y-3">
		<h3 class="text-lg font-medium">Contacts</h3>
		<Form.Field {config} name="email">
			<Form.Item>
				<Form.Label>Email</Form.Label>
				<Form.Input />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<div class="grid grid-cols-2 items-start space-x-4">
			<Form.Field {config} name="mobile">
				<Form.Item>
					<Form.Label>Mobile</Form.Label>
					<Form.Input />
					<Form.Validation />
				</Form.Item>
			</Form.Field><Form.Field {config} name="phone">
				<Form.Item>
					<Form.Label>Phone</Form.Label>
					<Form.Input />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		</div>
	</div>
	<div class="flex flex-row items-center justify-end gap-4">
		<Button
			variant={'ghost'}
			on:click={(e) => {
				e.preventDefault();
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
</Form.Root>
