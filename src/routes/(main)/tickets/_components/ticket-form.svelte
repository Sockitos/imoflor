<script lang="ts">
	import { page } from '$app/stores';
	import EntitySelector from '@/components/entity-selector.svelte';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Calendar } from '@/components/ui/calendar';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import * as Popover from '@/components/ui/popover';
	import * as Select from '@/components/ui/select';
	import { Separator } from '@/components/ui/separator';
	import * as Sheet from '@/components/ui/sheet';
	import { Textarea } from '@/components/ui/textarea';
	import {
		createTicketSchema,
		priorityOptions,
		statusOptions,
		type CreateTicketSchema,
	} from '@/schemas/ticket';
	import { cn } from '@/utils';
	import {
		DateFormatter,
		getLocalTimeZone,
		parseAbsolute,
		type DateValue,
	} from '@internationalized/date';
	import { CalendarIcon, Loader2 } from 'lucide-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let open = false;
	export let data: SuperValidated<Infer<CreateTicketSchema>>;
	export let action: string;

	const form = superForm(data, {
		validators: zodClient(createTicketSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				open = false;
			}
		},
		invalidateAll: 'force',
	});

	const { form: formData, enhance, submitting } = form;

	$: selectedPriority = $formData.priority
		? {
				value: $formData.priority,
				label: priorityOptions[$formData.priority],
			}
		: undefined;

	$: selectedStatus = $formData.status
		? {
				value: $formData.status,
				label: statusOptions[$formData.status],
			}
		: undefined;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long',
	});

	let date: DateValue | undefined;
	$: date = $formData.date ? parseAbsolute($formData.date, getLocalTimeZone()) : undefined;
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto sm:max-w-[40rem]">
		<Sheet.Header>
			<Sheet.Title>Add new ticket</Sheet.Title>
			<Sheet.Description>Fill the form below to add a new ticket.</Sheet.Description>
		</Sheet.Header>
		<Separator class="my-5" />
		<form method="POST" use:enhance {action}>
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Information</h3>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="date">
						<Form.Control id="date" let:attrs>
							<Form.Label for="date">Date</Form.Label>
							<Popover.Root>
								<Popover.Trigger
									{...attrs}
									class={cn(
										buttonVariants({ variant: 'outline' }),
										'w-full justify-start pl-4 text-left font-normal',
										!date && 'text-muted-foreground'
									)}
								>
									{date ? df.format(date.toDate()) : 'Pick a date'}
									<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" side="top">
									<Calendar
										initialFocus
										value={date}
										onValueChange={(v) => {
											if (v) {
												$formData.date = v.toDate(getLocalTimeZone()).toISOString();
											} else {
												$formData.date = '';
											}
										}}
									/>
								</Popover.Content>
							</Popover.Root>
							<Form.FieldErrors />
							<input hidden value={$formData.date} name={attrs.name} />
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="title">
						<Form.Control let:attrs>
							<Form.Label>Title</Form.Label>
							<Input {...attrs} bind:value={$formData.title} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
				</div>
				<Form.Field {form} name="description">
					<Form.Control let:attrs>
						<Form.Label>Description</Form.Label>
						<Textarea {...attrs} bind:value={$formData.description} />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="priority">
						<Form.Control let:attrs>
							<Form.Label>Priority</Form.Label>
							<Select.Root
								{...attrs}
								selected={selectedPriority}
								onSelectedChange={(v) => {
									if (v) {
										$formData.priority = v.value;
									}
								}}
							>
								<Select.Trigger {...attrs}>
									<Select.Value placeholder="Select" />
								</Select.Trigger>
								<Select.Content>
									{#each Object.entries(priorityOptions) as [value, label]}
										<Select.Item {value} {label} />
									{/each}
								</Select.Content>
							</Select.Root>
							<input hidden bind:value={$formData.priority} name={attrs.name} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="status">
						<Form.Control let:attrs>
							<Form.Label>Status</Form.Label>
							<Select.Root
								{...attrs}
								selected={selectedStatus}
								onSelectedChange={(v) => {
									if (v) {
										$formData.status = v.value;
									}
								}}
							>
								<Select.Trigger {...attrs}>
									<Select.Value placeholder="Select" />
								</Select.Trigger>
								<Select.Content>
									{#each Object.entries(statusOptions) as [value, label]}
										<Select.Item {value} {label} />
									{/each}
								</Select.Content>
							</Select.Root>
							<input hidden bind:value={$formData.status} name={attrs.name} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
				</div>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="property_id">
						<Form.Control let:attrs>
							<Form.Label>Property</Form.Label>
							<EntitySelector
								bind:value={$formData.property_id}
								options={$page.data.propertyOptions}
							/>
							<input hidden bind:value={$formData.property_id} name={attrs.name} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="fraction_id">
						<Form.Control let:attrs>
							<Form.Label>Fraction</Form.Label>
							<EntitySelector
								bind:value={$formData.fraction_id}
								options={$page.data.fractionOptions}
							/>
							<input hidden bind:value={$formData.fraction_id} name={attrs.name} />
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
