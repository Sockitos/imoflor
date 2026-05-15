<script lang="ts">
	import { page } from '$app/state';
	import { DateFormatter, getLocalTimeZone, parseAbsolute } from '@internationalized/date';
	import EntitySelector from '@/shared/components/entity-selector.svelte';
	import { Button, buttonVariants } from '@/shared/components/ui/button';
	import { Calendar } from '@/shared/components/ui/calendar';
	import * as Form from '@/shared/components/ui/form';
	import { Input } from '@/shared/components/ui/input';
	import * as Popover from '@/shared/components/ui/popover';
	import * as Select from '@/shared/components/ui/select';
	import { Separator } from '@/shared/components/ui/separator';
	import * as Sheet from '@/shared/components/ui/sheet';
	import { Textarea } from '@/shared/components/ui/textarea';
	import { cn } from '@/shared/utils';
	import { CalendarIcon, Loader2 } from 'lucide-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { createTicketSchema, type CreateTicketSchema } from '../schemas';
	import { ticketPriorityOptions, ticketStatusOptions } from '../types';

	interface Props {
		open?: boolean;
		data: SuperValidated<Infer<CreateTicketSchema>>;
		action: string;
	}

	let { open = $bindable(false), data, action }: Props = $props();

	const form = superForm(data, {
		validators: zod4Client(createTicketSchema),
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

	let date = $derived(
		$formData.date ? parseAbsolute($formData.date, getLocalTimeZone()) : undefined
	);
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto sm:max-w-3xl">
		<Sheet.Header>
			<Sheet.Title>Add new ticket</Sheet.Title>
			<Sheet.Description>Fill the form below to add a new ticket.</Sheet.Description>
		</Sheet.Header>
		<Separator class="my-5" />
		<form method="POST" use:enhance {action} class="px-4">
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Information</h3>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="date">
						<Form.Control id="date">
							{#snippet children({ props })}
								<Form.Label for="date">Date</Form.Label>
								<Popover.Root>
									<Popover.Trigger
										{...props}
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
											type="single"
											value={date}
											onValueChange={(v) => {
												if (v) {
													$formData.date = v.toDate(getLocalTimeZone()).toISOString();
												}
											}}
										/>
									</Popover.Content>
								</Popover.Root>
								<Form.FieldErrors />
								<input hidden value={$formData.date} name={props.name} />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="title">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Title</Form.Label>
								<Input {...props} bind:value={$formData.title} />
								<Form.FieldErrors />
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
					<Form.Field {form} name="priority">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Priority</Form.Label>
								<Select.Root {...props} type="single" bind:value={$formData.priority}>
									<Select.Trigger {...props}>
										{$formData.priority ? ticketPriorityOptions[$formData.priority] : 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(ticketPriorityOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input hidden bind:value={$formData.priority} name={props.name} />
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
										{$formData.status ? ticketStatusOptions[$formData.status] : 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(ticketStatusOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input hidden bind:value={$formData.status} name={props.name} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
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
