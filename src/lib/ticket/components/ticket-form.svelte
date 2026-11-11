<script lang="ts">
	import PropertyOptionItem from '@/property/components/property-option-item.svelte';
	import { getPropertyOptions } from '@/property/property.remote';
	import EntitySelector from '@/shared/components/entity-selector.svelte';
	import { Button } from '@/shared/components/ui/button';
	import * as Field from '@/shared/components/ui/field';
	import { Input } from '@/shared/components/ui/input';
	import * as Select from '@/shared/components/ui/select';
	import { Separator } from '@/shared/components/ui/separator';
	import * as Sheet from '@/shared/components/ui/sheet';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { Textarea } from '@/shared/components/ui/textarea';
	import { ticketSchema } from '../schemas';
	import { toastError, toastSuccess } from '@/shared/toast';
	import { untrack } from 'svelte';
	import { upsertTicket } from '../ticket.remote';
	import type { Ticket } from '../types';
	import {
		canTransitionTicketStatus,
		ticketPriorityOptions,
		ticketStatusOptions,
		ticketStatusValues,
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

	$effect.pre(() => {
		if (open) {
			untrack(() => {
				if (ticket) {
					form.fields.set({
						id: ticket.id,
						title: ticket.title,
						description: ticket.description,
						priority: ticket.priority,
						status: ticket.status,
						property_id: ticket.property.id,
					});
				}
			});
			return;
		}

		untrack(() => form.element?.reset());
	});

	const availableStatuses = $derived(
		ticketStatusValues.filter(
			(status) => ticket == null || canTransitionTicketStatus(ticket.status, status)
		)
	);

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
						toastSuccess(isEdit ? 'Ticket updated successfully' : 'Ticket created successfully');
						open = false;
					}
				} catch (error) {
					toastError(error);
				}
			})}
			onfocusout={() => form.validate()}
			class="flex flex-col gap-8 px-4"
		>
			{#if ticket}
				<input hidden {...form.fields.id.as('number')} />
			{/if}

			<Field.FieldSet>
				<Field.FieldLegend>Information</Field.FieldLegend>
				<Field.FieldGroup>
					<Field.Field data-invalid={isInvalid(form.fields.title.issues())}>
						<Field.FieldLabel>Title</Field.FieldLabel>
						<Field.FieldContent>
							<Input {...form.fields.title.as('text')} />
							<Field.FieldError errors={form.fields.title.issues()} />
						</Field.FieldContent>
					</Field.Field>

					<Field.Field data-invalid={isInvalid(form.fields.description.issues())}>
						<Field.FieldLabel>Description</Field.FieldLabel>
						<Field.FieldContent>
							<Textarea {...form.fields.description.as('text')} />
							<Field.FieldError errors={form.fields.description.issues()} />
						</Field.FieldContent>
					</Field.Field>

					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(form.fields.priority.issues())}>
							<Field.FieldLabel>Priority</Field.FieldLabel>
							<Field.FieldContent>
								<Select.Root
									type="single"
									value={form.fields.priority.value()}
									onValueChange={(v) => {
										if (v) form.fields.priority.set(v as TicketPriority);
									}}
								>
									<Select.Trigger>
										{form.fields.priority.value()
											? ticketPriorityOptions[form.fields.priority.value()!]
											: 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(ticketPriorityOptions) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input hidden {...form.fields.priority.as('text')} />
								<Field.FieldError errors={form.fields.priority.issues()} />
							</Field.FieldContent>
						</Field.Field>

						<Field.Field data-invalid={isInvalid(form.fields.status.issues())}>
							<Field.FieldLabel>Status</Field.FieldLabel>
							<Field.FieldContent>
								<Select.Root
									type="single"
									value={form.fields.status.value() ?? defaultStatus}
									onValueChange={(v) => {
										if (v) form.fields.status.set(v as TicketStatus);
									}}
								>
									<Select.Trigger>
										{(form.fields.status.value() ?? defaultStatus)
											? ticketStatusOptions[(form.fields.status.value() ?? defaultStatus)!]
											: 'Select'}
									</Select.Trigger>
									<Select.Content>
										{#each availableStatuses as value (value)}
											<Select.Item {value} label={ticketStatusOptions[value]} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input
									hidden
									{...!ticket && defaultStatus != null
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
