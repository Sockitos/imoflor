<script lang="ts">
	import { page } from '$app/state';
	import EntitySelector from '@/components/entity-selector.svelte';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Calendar } from '@/components/ui/calendar';
	import * as Form from '@/components/ui/form';
	import * as Popover from '@/components/ui/popover';
	import * as Select from '@/components/ui/select';
	import { Separator } from '@/components/ui/separator';
	import * as Sheet from '@/components/ui/sheet';
	import { Textarea } from '@/components/ui/textarea';
	import {
		createInterventionSchema,
		statusOptions,
		typeOptions,
		type CreateInterventionSchema,
	} from '@/schemas/intervention';
	import { cn } from '@/utils';
	import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date';
	import { CalendarIcon, Loader2 } from 'lucide-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface Props {
		open?: boolean;
		data: SuperValidated<Infer<CreateInterventionSchema>>;
		action: string;
	}

	let { open = $bindable(false), data, action }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(createInterventionSchema),
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

	let startDate = $derived($formData.start_date ? parseDate($formData.start_date) : undefined);

	let endDate = $derived($formData.end_date ? parseDate($formData.end_date) : undefined);
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto sm:max-w-[40rem]">
		<Sheet.Header>
			<Sheet.Title>Add new intervention</Sheet.Title>
			<Sheet.Description>Fill the form below to add a new intervention.</Sheet.Description>
		</Sheet.Header>
		<Separator class="my-5" />
		<form method="POST" use:enhance {action}>
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Information</h3>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="type">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Type</Form.Label>
								<Select.Root {...props} type="single" bind:value={$formData.type}>
									<Select.Trigger {...props}>
										{$formData.type ? typeOptions[$formData.type] : 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(typeOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input hidden bind:value={$formData.type} name={props.name} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="status">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Status</Form.Label>
								<Select.Root {...props} type="single" bind:value={$formData.status}>
									<Select.Trigger {...props}>
										{$formData.status ? statusOptions[$formData.status] : 'Select'}
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="not_started">Not Started</Select.Item>
										<Select.Item value="in_progress">In Progress</Select.Item>
										<Select.Item value="completed">Completed</Select.Item>
										<Select.Item value="cancelled">Cancelled</Select.Item>
									</Select.Content>
								</Select.Root>
								<input hidden bind:value={$formData.status} name={props.name} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="start_date">
						<Form.Control id="date">
							{#snippet children({ props })}
								<Form.Label for="date">Start Date</Form.Label>
								<Popover.Root>
									<Popover.Trigger
										{...props}
										class={cn(
											buttonVariants({ variant: 'outline' }),
											'w-full justify-start pl-4 text-left font-normal',
											!startDate && 'text-muted-foreground'
										)}
									>
										{startDate ? df.format(startDate.toDate(getLocalTimeZone())) : 'Pick a date'}
										<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
									</Popover.Trigger>
									<Popover.Content class="w-auto p-0" side="top">
										<Calendar
											type="single"
											initialFocus
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
						<Form.Control id="date">
							{#snippet children({ props })}
								<Form.Label for="date">End Date</Form.Label>
								<Popover.Root>
									<Popover.Trigger
										{...props}
										class={cn(
											buttonVariants({ variant: 'outline' }),
											'w-full justify-start pl-4 text-left font-normal',
											!endDate && 'text-muted-foreground'
										)}
									>
										{endDate ? df.format(endDate.toDate(getLocalTimeZone())) : 'Pick a date'}
										<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
									</Popover.Trigger>
									<Popover.Content class="w-auto p-0" side="top">
										<Calendar
											type="single"
											initialFocus
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
				<Form.Field {form} name="description">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Description</Form.Label>
							<Textarea {...props} bind:value={$formData.description} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<div class="grid grid-cols-2 items-start gap-x-4">
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
					<Form.Field {form} name="fraction_id">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Fraction</Form.Label>
								<EntitySelector
									bind:value={$formData.fraction_id}
									options={page.data.fractionOptions}
								/>
								<input hidden bind:value={$formData.fraction_id} name={props.name} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				<Form.Field {form} name="ticket_id">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Ticket</Form.Label>
							<EntitySelector bind:value={$formData.ticket_id} options={page.data.ticketOptions} />
							<input hidden bind:value={$formData.ticket_id} name={props.name} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
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
