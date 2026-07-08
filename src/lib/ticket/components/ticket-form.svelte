<script lang="ts">
	import PropertyOptionItem from '@/property/components/property-option-item.svelte';
	import { getPropertyOptions } from '@/property/property.remote';
	import EntitySelector from '@/shared/components/entity-selector.svelte';
	import { Button, buttonVariants } from '@/shared/components/ui/button';
	import { Calendar } from '@/shared/components/ui/calendar';
	import * as Field from '@/shared/components/ui/field';
	import { Input } from '@/shared/components/ui/input';
	import * as Popover from '@/shared/components/ui/popover';
	import * as Select from '@/shared/components/ui/select';
	import { Separator } from '@/shared/components/ui/separator';
	import * as Sheet from '@/shared/components/ui/sheet';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { Textarea } from '@/shared/components/ui/textarea';
	import { cn } from '@/shared/utils';
	import { DateFormatter, getLocalTimeZone, parseAbsolute } from '@internationalized/date';
	import { CalendarIcon } from 'lucide-svelte';
	import { ticketSchema } from '../schemas';
	import { upsertTicket } from '../ticket.remote';
	import type { Ticket } from '../types';
	import {
		ticketPriorityOptions,
		ticketStatusOptions,
		type TicketPriority,
		type TicketStatus,
	} from '../types';

	interface Props {
		open?: boolean;
		ticket?: Ticket;
		defaultStatus?: TicketStatus;
	}

	let { open = $bindable(false), ticket, defaultStatus }: Props = $props();

	const form = $derived(ticket != null ? upsertTicket.for(ticket.id) : upsertTicket);
	const isEdit = $derived(ticket != null);

	let propertyId = $state<number | undefined>();

	$effect(() => {
		if (open) {
			propertyId = ticket?.property.id;
		}
	});

	const df = new DateFormatter('en-US', { dateStyle: 'long' });

	function isInvalid(issues?: { message?: string }[]) {
		return (issues?.length ?? 0) > 0;
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto data-[side=right]:sm:max-w-2xl">
		<Sheet.Header>
			<Sheet.Title>{isEdit ? 'Edit ticket' : 'Add new ticket'}</Sheet.Title>
			<Sheet.Description>
				{isEdit ? 'Update the ticket details below.' : 'Fill the form below to add a new ticket.'}
			</Sheet.Description>
		</Sheet.Header>
		<Separator />
		<form
			{...form.preflight(ticketSchema).enhance(async (f) => {
				try {
					if (await f.submit()) {
						open = false;
						if (!isEdit) f.element.reset();
					}
				} catch (err) {
					console.error(err);
				}
			})}
			onfocusout={() => form.validate()}
			class="flex flex-col gap-8 px-4"
		>
			{#if ticket?.id != null}
				<input hidden {...form.fields.id.as('number', ticket.id)} />
			{/if}

			<Field.FieldSet>
				<Field.FieldLegend>Information</Field.FieldLegend>
				<Field.FieldGroup>
					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.date.issues())}>
							<Field.FieldLabel for="date">Date</Field.FieldLabel>
							<Field.FieldContent>
								<Popover.Root>
									<Popover.Trigger
										id="date"
										class={cn(
											buttonVariants({ variant: 'outline' }),
											'w-full justify-start pl-4 text-left font-normal',
											!form.fields.date.value() && !ticket?.date && 'text-muted-foreground'
										)}
									>
										{form.fields.date.value()
											? df.format(
													parseAbsolute(form.fields.date.value()!, getLocalTimeZone()).toDate()
												)
											: ticket?.date
												? df.format(parseAbsolute(ticket.date, getLocalTimeZone()).toDate())
												: 'Pick a date'}
										<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
									</Popover.Trigger>
									<Popover.Content class="w-auto p-0" side="top">
										<Calendar
											type="single"
											value={form.fields.date.value()
												? parseAbsolute(form.fields.date.value()!, getLocalTimeZone())
												: ticket?.date
													? parseAbsolute(ticket.date, getLocalTimeZone())
													: undefined}
											onValueChange={(v) => {
												form.fields.date.set(v?.toDate(getLocalTimeZone()).toISOString());
											}}
										/>
									</Popover.Content>
								</Popover.Root>
								<input
									hidden
									{...ticket?.date != null
										? form.fields.date.as('text', ticket.date)
										: form.fields.date.as('text')}
								/>
								<Field.FieldError errors={form.fields.date.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.title.issues())}>
							<Field.FieldLabel>Title</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...ticket?.title != null
										? form.fields.title.as('text', ticket.title)
										: form.fields.title.as('text')}
								/>
								<Field.FieldError errors={form.fields.title.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>

					<Field.Field data-invalid={isInvalid(form.fields.description.issues())}>
						<Field.FieldLabel>Description</Field.FieldLabel>
						<Field.FieldContent>
							<Textarea
								{...ticket?.description != null
									? form.fields.description.as('text', ticket.description)
									: form.fields.description.as('text')}
							/>
							<Field.FieldError errors={form.fields.description.issues()} />
						</Field.FieldContent>
					</Field.Field>

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.priority.issues())}>
							<Field.FieldLabel>Priority</Field.FieldLabel>
							<Field.FieldContent>
								<Select.Root
									type="single"
									value={form.fields.priority.value() ?? ticket?.priority}
									onValueChange={(v) => {
										if (v) form.fields.priority.set(v as TicketPriority);
									}}
								>
									<Select.Trigger>
										{form.fields.priority.value()
											? ticketPriorityOptions[form.fields.priority.value()!]
											: ticket?.priority
												? ticketPriorityOptions[ticket.priority]
												: 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(ticketPriorityOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input
									hidden
									{...ticket != null
										? form.fields.priority.as('text', ticket.priority)
										: form.fields.priority.as('text')}
								/>
								<Field.FieldError errors={form.fields.priority.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.status.issues())}>
							<Field.FieldLabel>Status</Field.FieldLabel>
							<Field.FieldContent>
								<Select.Root
									type="single"
									value={form.fields.status.value() ?? ticket?.status ?? defaultStatus}
									onValueChange={(v) => {
										if (v) form.fields.status.set(v as TicketStatus);
									}}
								>
									<Select.Trigger>
										{form.fields.status.value()
											? ticketStatusOptions[form.fields.status.value()!]
											: (ticket?.status ?? defaultStatus)
												? ticketStatusOptions[(ticket?.status ?? defaultStatus)!]
												: 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(ticketStatusOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input
									hidden
									{...ticket != null
										? form.fields.status.as('text', ticket.status)
										: defaultStatus != null
											? form.fields.status.as('text', defaultStatus)
											: form.fields.status.as('text')}
								/>
								<Field.FieldError errors={form.fields.status.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>

					<Field.Field data-invalid={isInvalid(form.fields.property_id.issues())}>
						<Field.FieldLabel>Property</Field.FieldLabel>
						<Field.FieldContent>
							<svelte:boundary>
								{@const options = await getPropertyOptions()}
								{@const spreadOptions = options.flatMap((option) => [
									option,
									...(option.children ?? []),
								])}

								<EntitySelector bind:entityId={propertyId} options={spreadOptions}>
									{#snippet displayOption(option)}
										<PropertyOptionItem {option} />
									{/snippet}
									{#snippet children(option)}
										<PropertyOptionItem {option} indent={!option.children} />
									{/snippet}
								</EntitySelector>

								{#snippet pending()}
									<div class="flex items-center justify-center">
										<Spinner class="size-6" />
									</div>
								{/snippet}
								{#snippet failed(_, reset)}
									<div class="flex flex-col items-center gap-y-4">
										<p class="text-sm text-destructive">Failed to load properties.</p>
										<Button variant="outline" class="w-fit" onclick={reset}>Retry</Button>
									</div>
								{/snippet}
							</svelte:boundary>
							{#if propertyId != null}
								<input hidden {...form.fields.property_id.as('number', propertyId)} />
							{/if}
							<Field.FieldError errors={form.fields.property_id.issues()} />
						</Field.FieldContent>
					</Field.Field>
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
