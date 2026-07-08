<script lang="ts">
	import PropertyOptionItem from '@/property/components/property-option-item.svelte';
	import { getPropertyOptions } from '@/property/property.remote';
	import EntitySelector from '@/shared/components/entity-selector.svelte';
	import { Button, buttonVariants } from '@/shared/components/ui/button';
	import { Calendar } from '@/shared/components/ui/calendar';
	import * as Field from '@/shared/components/ui/field';
	import * as Popover from '@/shared/components/ui/popover';
	import * as Select from '@/shared/components/ui/select';
	import { Separator } from '@/shared/components/ui/separator';
	import * as Sheet from '@/shared/components/ui/sheet';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { Textarea } from '@/shared/components/ui/textarea';
	import { cn } from '@/shared/utils';
	import TicketOptionItem from '@/ticket/components/ticket-option-item.svelte';
	import { getTicketOptions } from '@/ticket/ticket.remote';
	import { DateFormatter, getLocalTimeZone, parseAbsolute } from '@internationalized/date';
	import { CalendarIcon } from 'lucide-svelte';
	import { upsertIntervention } from '../intervention.remote';
	import { interventionSchema } from '../schemas';
	import type { Intervention } from '../types';
	import {
		interventionStatusOptions,
		interventionTypeOptions,
		type InterventionStatus,
		type InterventionType,
	} from '../types';

	interface Props {
		open?: boolean;
		intervention?: Intervention;
		defaultStatus?: InterventionStatus;
	}

	let { open = $bindable(false), intervention, defaultStatus }: Props = $props();

	const form = $derived(
		intervention != null ? upsertIntervention.for(intervention.id) : upsertIntervention
	);
	const isEdit = $derived(intervention != null);

	let propertyId = $state<number | undefined>();
	let ticketId = $state<number | undefined>();

	const status = $derived(intervention?.status ?? defaultStatus);

	$effect(() => {
		if (open) {
			propertyId = intervention?.property.id;
			ticketId = intervention?.ticket?.id ?? undefined;
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
			<Sheet.Title>{isEdit ? 'Edit intervention' : 'Add new intervention'}</Sheet.Title>
			<Sheet.Description>
				{isEdit
					? 'Update the intervention details below.'
					: 'Fill the form below to add a new intervention.'}
			</Sheet.Description>
		</Sheet.Header>
		<Separator />
		<form
			{...form.preflight(interventionSchema).enhance(async (f) => {
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
			{#if intervention?.id != null}
				<input hidden {...form.fields.id.as('number', intervention.id)} />
			{/if}

			<Field.FieldSet>
				<Field.FieldLegend>Information</Field.FieldLegend>
				<Field.FieldGroup>
					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.type.issues())}>
							<Field.FieldLabel>Type</Field.FieldLabel>
							<Field.FieldContent>
								<Select.Root
									type="single"
									value={form.fields.type.value() ?? intervention?.type}
									onValueChange={(v) => {
										if (v) form.fields.type.set(v as InterventionType);
									}}
								>
									<Select.Trigger>
										{form.fields.type.value()
											? interventionTypeOptions[form.fields.type.value()!]
											: intervention?.type
												? interventionTypeOptions[intervention.type]
												: 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(interventionTypeOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input
									hidden
									{...intervention != null
										? form.fields.type.as('text', intervention.type)
										: form.fields.type.as('text')}
								/>
								<Field.FieldError errors={form.fields.type.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.status.issues())}>
							<Field.FieldLabel>Status</Field.FieldLabel>
							<Field.FieldContent>
								<Select.Root
									type="single"
									value={form.fields.status.value() ?? status}
									onValueChange={(v) => {
										if (v) form.fields.status.set(v as InterventionStatus);
									}}
								>
									<Select.Trigger>
										{form.fields.status.value()
											? interventionStatusOptions[form.fields.status.value()!]
											: status
												? interventionStatusOptions[status!]
												: 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(interventionStatusOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input
									hidden
									{...intervention != null
										? form.fields.status.as('text', intervention.status)
										: defaultStatus != null
											? form.fields.status.as('text', defaultStatus)
											: form.fields.status.as('text')}
								/>
								<Field.FieldError errors={form.fields.status.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.start_date.issues())}>
							<Field.FieldLabel for="start_date">Start Date</Field.FieldLabel>
							<Field.FieldContent>
								<Popover.Root>
									<Popover.Trigger
										id="start_date"
										class={cn(
											buttonVariants({ variant: 'outline' }),
											'w-full justify-start pl-4 text-left font-normal',
											!form.fields.start_date.value() &&
												!intervention?.start_date &&
												'text-muted-foreground'
										)}
									>
										{form.fields.start_date.value()
											? df.format(
													parseAbsolute(
														form.fields.start_date.value()!,
														getLocalTimeZone()
													).toDate()
												)
											: intervention?.start_date
												? df.format(
														parseAbsolute(intervention.start_date, getLocalTimeZone()).toDate()
													)
												: 'Pick a date'}
										<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
									</Popover.Trigger>
									<Popover.Content class="w-auto p-0" side="top">
										<Calendar
											type="single"
											value={form.fields.start_date.value()
												? parseAbsolute(form.fields.start_date.value()!, getLocalTimeZone())
												: intervention?.start_date
													? parseAbsolute(intervention.start_date, getLocalTimeZone())
													: undefined}
											onValueChange={(v) => {
												form.fields.start_date.set(v?.toDate(getLocalTimeZone()).toISOString());
											}}
										/>
									</Popover.Content>
								</Popover.Root>
								<input
									hidden
									{...intervention?.start_date != null
										? form.fields.start_date.as('text', intervention.start_date)
										: form.fields.start_date.as('text')}
								/>
								<Field.FieldError errors={form.fields.start_date.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.end_date.issues())}>
							<Field.FieldLabel for="end_date">End Date</Field.FieldLabel>
							<Field.FieldContent>
								<Popover.Root>
									<Popover.Trigger
										id="end_date"
										class={cn(
											buttonVariants({ variant: 'outline' }),
											'w-full justify-start pl-4 text-left font-normal',
											!form.fields.end_date.value() &&
												!intervention?.end_date &&
												'text-muted-foreground'
										)}
									>
										{form.fields.end_date.value()
											? df.format(
													parseAbsolute(form.fields.end_date.value()!, getLocalTimeZone()).toDate()
												)
											: intervention?.end_date
												? df.format(
														parseAbsolute(intervention.end_date, getLocalTimeZone()).toDate()
													)
												: 'Pick a date'}
										<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
									</Popover.Trigger>
									<Popover.Content class="w-auto p-0" side="top">
										<Calendar
											type="single"
											value={form.fields.end_date.value()
												? parseAbsolute(form.fields.end_date.value()!, getLocalTimeZone())
												: intervention?.end_date
													? parseAbsolute(intervention.end_date, getLocalTimeZone())
													: undefined}
											onValueChange={(v) => {
												form.fields.end_date.set(v?.toDate(getLocalTimeZone()).toISOString());
											}}
										/>
									</Popover.Content>
								</Popover.Root>
								<input
									hidden
									{...intervention?.end_date != null
										? form.fields.end_date.as('text', intervention.end_date)
										: form.fields.end_date.as('text')}
								/>
								<Field.FieldError errors={form.fields.end_date.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>

					<Field.Field data-invalid={isInvalid(form.fields.description.issues())}>
						<Field.FieldLabel>Description</Field.FieldLabel>
						<Field.FieldContent>
							<Textarea
								{...intervention?.description != null
									? form.fields.description.as('text', intervention.description)
									: form.fields.description.as('text')}
							/>
							<Field.FieldError errors={form.fields.description.issues()} />
						</Field.FieldContent>
					</Field.Field>

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

					<Field.Field data-invalid={isInvalid(form.fields.ticket_id.issues())}>
						<Field.FieldLabel>Ticket</Field.FieldLabel>
						<Field.FieldContent>
							<svelte:boundary>
								{@const options = await getTicketOptions()}
								<EntitySelector bind:entityId={ticketId} {options}>
									{#snippet displayOption(option)}
										<TicketOptionItem {option} />
									{/snippet}
									{#snippet children(option)}
										<TicketOptionItem {option} />
									{/snippet}
								</EntitySelector>

								{#snippet pending()}
									<div class="flex items-center justify-center">
										<Spinner class="size-6" />
									</div>
								{/snippet}

								{#snippet failed(_, reset)}
									<div class="flex flex-col items-center gap-y-4">
										<p class="text-sm text-destructive">Failed to load tickets.</p>
										<Button variant="outline" class="w-fit" onclick={reset}>Retry</Button>
									</div>
								{/snippet}
							</svelte:boundary>

							{#if ticketId != null}
								<input hidden {...form.fields.ticket_id.as('number', ticketId)} />
							{/if}
							<Field.FieldError errors={form.fields.ticket_id.issues()} />
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
