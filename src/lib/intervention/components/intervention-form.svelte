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
	import { cn, parsePlainDate, toPlainDateString } from '@/shared/utils';
	import TicketOptionItem from '@/ticket/components/ticket-option-item.svelte';
	import { getTicketOptions } from '@/ticket/ticket.remote';
	import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { CalendarIcon } from 'lucide-svelte';
	import { toastError, toastSuccess } from '@/shared/toast';
	import { untrack } from 'svelte';
	import { upsertIntervention } from '../intervention.remote';
	import { interventionSchema } from '../schemas';
	import type { Intervention } from '../types';
	import {
		canTransitionInterventionStatus,
		interventionStatusOptions,
		interventionStatusValues,
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

	$effect.pre(() => {
		if (open) {
			untrack(() => {
				if (intervention) {
					form.fields.set({
						id: intervention.id,
						type: intervention.type,
						status: intervention.status,
						start_date: intervention.start_date ?? undefined,
						end_date: intervention.end_date ?? undefined,
						description: intervention.description,
						property_id: intervention.property.id,
						ticket_id: intervention.ticket?.id,
					});
				}
			});
			return;
		}

		untrack(() => form.element?.reset());
	});

	const availableStatuses = $derived(
		interventionStatusValues.filter(
			(value) => intervention == null || canTransitionInterventionStatus(intervention.status, value)
		)
	);

	const df = new DateFormatter('en-US', { dateStyle: 'long' });

	function isInvalid(issues?: { message?: string }[]) {
		return (issues?.length ?? 0) > 0;
	}

	function dateLabel(value: string | undefined) {
		const date = value ? parsePlainDate(value) : undefined;
		return date ? df.format(date.toDate(getLocalTimeZone())) : 'Pick a date';
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
						toastSuccess(
							isEdit ? 'Intervention updated successfully' : 'Intervention created successfully'
						);
						open = false;
					}
				} catch (error) {
					toastError(error);
				}
			})}
			onfocusout={() => form.validate()}
			class="flex flex-col gap-8 px-4"
		>
			{#if intervention}
				<input hidden {...form.fields.id.as('number')} />
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
									value={form.fields.type.value()}
									onValueChange={(v) => {
										if (v) form.fields.type.set(v as InterventionType);
									}}
								>
									<Select.Trigger>
										{form.fields.type.value()
											? interventionTypeOptions[form.fields.type.value()!]
											: 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(interventionTypeOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input hidden {...form.fields.type.as('text')} />
								<Field.FieldError errors={form.fields.type.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.status.issues())}>
							<Field.FieldLabel>Status</Field.FieldLabel>
							<Field.FieldContent>
								<Select.Root
									type="single"
									value={form.fields.status.value() ?? defaultStatus}
									onValueChange={(v) => {
										if (v) form.fields.status.set(v as InterventionStatus);
									}}
								>
									<Select.Trigger>
										{(form.fields.status.value() ?? defaultStatus)
											? interventionStatusOptions[(form.fields.status.value() ?? defaultStatus)!]
											: 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each availableStatuses as value (value)}
											<Select.Item {value} label={interventionStatusOptions[value]} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input
									hidden
									{...!intervention && defaultStatus != null
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
											!form.fields.start_date.value() && 'text-muted-foreground'
										)}
									>
										{dateLabel(form.fields.start_date.value())}
										<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
									</Popover.Trigger>
									<Popover.Content class="w-auto p-0" side="top">
										<Calendar
											type="single"
											value={parsePlainDate(form.fields.start_date.value())}
											onValueChange={(v) => {
												form.fields.start_date.set(toPlainDateString(v));
											}}
										/>
									</Popover.Content>
								</Popover.Root>
								<input hidden {...form.fields.start_date.as('text')} />
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
											!form.fields.end_date.value() && 'text-muted-foreground'
										)}
									>
										{dateLabel(form.fields.end_date.value())}
										<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
									</Popover.Trigger>
									<Popover.Content class="w-auto p-0" side="top">
										<Calendar
											type="single"
											value={parsePlainDate(form.fields.end_date.value())}
											onValueChange={(v) => {
												form.fields.end_date.set(toPlainDateString(v));
											}}
										/>
									</Popover.Content>
								</Popover.Root>
								<input hidden {...form.fields.end_date.as('text')} />
								<Field.FieldError errors={form.fields.end_date.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>

					<Field.Field data-invalid={isInvalid(form.fields.description.issues())}>
						<Field.FieldLabel>Description</Field.FieldLabel>
						<Field.FieldContent>
							<Textarea {...form.fields.description.as('text')} />
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

								<EntitySelector
									bind:entityId={
										() => form.fields.property_id.value(), (id) => form.fields.property_id.set(id)
									}
									options={spreadOptions}
								>
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
							{#if form.fields.property_id.value() != null}
								<input hidden {...form.fields.property_id.as('number')} />
							{/if}
							<Field.FieldError errors={form.fields.property_id.issues()} />
						</Field.FieldContent>
					</Field.Field>

					<Field.Field data-invalid={isInvalid(form.fields.ticket_id.issues())}>
						<Field.FieldLabel>Ticket</Field.FieldLabel>
						<Field.FieldContent>
							<svelte:boundary>
								{@const options = await getTicketOptions()}
								<EntitySelector
									bind:entityId={
										() => form.fields.ticket_id.value(), (id) => form.fields.ticket_id.set(id)
									}
									{options}
								>
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

							{#if form.fields.ticket_id.value() != null}
								<input hidden {...form.fields.ticket_id.as('number')} />
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
