<script lang="ts">
	import { page } from '$app/state';
	import * as Tabs from '@/shared/components/ui/tabs';
	import { DateFormatter, getLocalTimeZone, parseAbsolute } from '@internationalized/date';
	import EntitySelector from '@/shared/components/entity-selector.svelte';
	import { Button, buttonVariants } from '@/shared/components/ui/button';
	import { Calendar } from '@/shared/components/ui/calendar';
	import * as Form from '@/shared/components/ui/form';
	import { Input } from '@/shared/components/ui/input';
	import * as Popover from '@/shared/components/ui/popover';
	import { Separator } from '@/shared/components/ui/separator';
	import * as Sheet from '@/shared/components/ui/sheet';
	import { cn } from '@/shared/utils';
	import { CalendarIcon } from 'lucide-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { createContractSchema, type CreateContractSchema } from '../schemas';
	import { Spinner } from '@/shared/components/ui/spinner';

	interface Props {
		open?: boolean;
		data: SuperValidated<Infer<CreateContractSchema>>;
		action: string;
	}

	let { open = $bindable(false), data, action }: Props = $props();

	const form = superForm(data, {
		validators: zod4Client(createContractSchema),
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

	let startDate = $derived(
		$formData.start_date ? parseAbsolute($formData.start_date, getLocalTimeZone()) : undefined
	);

	let endDate = $derived(
		$formData.end_date ? parseAbsolute($formData.end_date, getLocalTimeZone()) : undefined
	);
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto sm:max-w-3xl">
		<Sheet.Header>
			<Sheet.Title>Add new contract</Sheet.Title>
			<Sheet.Description>Fill the form below to add a new contract.</Sheet.Description>
		</Sheet.Header>
		<Separator class="my-5" />
		<Tabs.Root bind:value={$formData.type} class="mb-5">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="renting">Renting</Tabs.Trigger>
				<Tabs.Trigger value="lending">Lending</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
		<form method="POST" use:enhance {action} class="px-4">
			<input hidden value={$formData.type} name="type" />
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Information</h3>
				<Form.Field {form} name="property_id">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Property</Form.Label>
							<EntitySelector
								bind:value={$formData.property_id}
								options={page.data.propertyOptions}
							/>
							<input hidden bind:value={$formData.property_id} name={props.name} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="tenant_id">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Tenant</Form.Label>
							<EntitySelector bind:value={$formData.tenant_id} options={page.data.tenantOptions} />
							<input hidden bind:value={$formData.tenant_id} name={props.name} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="start_date">
						<Form.Control id="start_date">
							{#snippet children({ props })}
								<Form.Label for="start_date">Start Date</Form.Label>
								<Popover.Root>
									<Popover.Trigger
										{...props}
										class={cn(
											buttonVariants({ variant: 'outline' }),
											'w-full justify-start pl-4 text-left font-normal',
											!startDate && 'text-muted-foreground'
										)}
									>
										{startDate ? df.format(startDate.toDate()) : 'Pick a date'}
										<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
									</Popover.Trigger>
									<Popover.Content class="w-auto p-0" side="top">
										<Calendar
											type="single"
											value={startDate}
											onValueChange={(v) => {
												if (v) {
													$formData.start_date = v.toDate(getLocalTimeZone()).toISOString();
												}
											}}
										/>
									</Popover.Content>
								</Popover.Root>
								<Form.FieldErrors />
								<input hidden value={$formData.start_date} name={props.name} />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="end_date">
						<Form.Control id="end_date">
							{#snippet children({ props })}
								<Form.Label for="end_date">End Date</Form.Label>
								<Popover.Root>
									<Popover.Trigger
										{...props}
										class={cn(
											buttonVariants({ variant: 'outline' }),
											'w-full justify-start pl-4 text-left font-normal',
											!endDate && 'text-muted-foreground'
										)}
									>
										{endDate ? df.format(endDate.toDate()) : 'Pick a date'}
										<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
									</Popover.Trigger>
									<Popover.Content class="w-auto p-0" side="top">
										<Calendar
											type="single"
											value={endDate}
											onValueChange={(v) => {
												if (v) {
													$formData.end_date = v.toDate(getLocalTimeZone()).toISOString();
												}
											}}
										/>
									</Popover.Content>
								</Popover.Root>
								<Form.FieldErrors />
								<input hidden value={$formData.end_date} name={props.name} />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				{#if $formData.type === 'renting'}
					<Form.Field {form} name="rent">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Rent</Form.Label>
								<Input type="number" step="any" {...props} bind:value={$formData.rent} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				{:else if $formData.type === 'lending'}
					<div class="grid grid-cols-2 items-start gap-x-4">
						<Form.Field {form} name="sale_value">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Sale Value</Form.Label>
									<Input type="number" step="any" {...props} bind:value={$formData.sale_value} />
									<Form.FieldErrors />
								{/snippet}
							</Form.Control>
						</Form.Field>
						<Form.Field {form} name="down_payment">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Down Payment</Form.Label>
									<Input type="number" step="any" {...props} bind:value={$formData.down_payment} />
									<Form.FieldErrors />
								{/snippet}
							</Form.Control>
						</Form.Field>
					</div>
					<Form.Field {form} name="installment">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Installment</Form.Label>
								<Input type="number" step="any" {...props} bind:value={$formData.installment} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<div class="grid grid-cols-2 items-start gap-x-4">
						<Form.Field {form} name="yearly_raise">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Yearly Raise</Form.Label>
									<Input type="number" step="any" {...props} bind:value={$formData.yearly_raise} />
									<Form.FieldErrors />
								{/snippet}
							</Form.Control>
						</Form.Field>
						<Form.Field {form} name="interest">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Interest</Form.Label>
									<Input type="number" step="any" {...props} bind:value={$formData.interest} />
									<Form.FieldErrors />
								{/snippet}
							</Form.Control>
						</Form.Field>
					</div>
				{/if}
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
						<Spinner />
					{/if}
					Submit
				</Form.Button>
			</div>
		</form>
	</Sheet.Content>
</Sheet.Root>
