<script lang="ts">
	import { Button, buttonVariants } from '@/shared/components/ui/button';
	import { Calendar } from '@/shared/components/ui/calendar';
	import * as Dialog from '@/shared/components/ui/dialog';
	import * as Field from '@/shared/components/ui/field';
	import { Input } from '@/shared/components/ui/input';
	import * as Popover from '@/shared/components/ui/popover';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { toastError, toastSuccess } from '@/shared/toast';
	import { Textarea } from '@/shared/components/ui/textarea';
	import { cn } from '@/shared/utils';
	import { DateFormatter, getLocalTimeZone, parseAbsolute } from '@internationalized/date';
	import { CalendarIcon } from 'lucide-svelte';
	import { untrack } from 'svelte';
	import { createRentPayment } from '../../contract.remote';
	import { createRentPaymentSchema } from '../../schemas';

	interface Props {
		open?: boolean;
		contractId: number;
	}

	let { open = $bindable(false), contractId }: Props = $props();

	const form = $derived(createRentPayment.for(contractId));
	const defaultOccurredAt = new Date().toISOString();
	const df = new DateFormatter('en-US', { dateStyle: 'long' });

	$effect.pre(() => {
		if (open) {
			untrack(() => form.fields.occurred_at.set(defaultOccurredAt));
			return;
		}

		untrack(() => form.element?.reset());
	});

	function isInvalid(issues?: { message?: string }[]) {
		return (issues?.length ?? 0) > 0;
	}

	function dateLabel(value: string | undefined) {
		const date = value ? parseAbsolute(value, getLocalTimeZone()) : undefined;
		return date ? df.format(date.toDate()) : 'Pick a date';
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add Rent Payment</Dialog.Title>
			<Dialog.Description>Add a rent payment to the contract.</Dialog.Description>
		</Dialog.Header>
		<form
			{...form.preflight(createRentPaymentSchema).enhance(async (f) => {
				try {
					if (await f.submit()) {
						toastSuccess('Rent payment created successfully');
						open = false;
					}
				} catch (error) {
					toastError(error);
				}
			})}
			onfocusout={() => form.validate()}
		>
			<input hidden {...form.fields.contract_id.as('number', contractId)} />
			<div class="grid gap-4 py-4">
				<Field.Field data-invalid={isInvalid(form.fields.value.issues())}>
					<Field.FieldLabel>Value</Field.FieldLabel>
					<Field.FieldContent>
						<Input {...form.fields.value.as('number')} />
						<Field.FieldError errors={form.fields.value.issues()} />
					</Field.FieldContent>
				</Field.Field>

				<Field.Field data-invalid={isInvalid(form.fields.occurred_at.issues())}>
					<Field.FieldLabel>Date</Field.FieldLabel>
					<Field.FieldContent>
						<Popover.Root>
							<Popover.Trigger
								class={cn(
									buttonVariants({ variant: 'outline' }),
									'w-full justify-start pl-4 text-left font-normal',
									!form.fields.occurred_at.value() && 'text-muted-foreground'
								)}
							>
								{dateLabel(form.fields.occurred_at.value())}
								<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
							</Popover.Trigger>
							<Popover.Content class="w-auto p-0" side="top">
								<Calendar
									type="single"
									value={parseAbsolute(
										String(form.fields.occurred_at.as('text', defaultOccurredAt).value),
										getLocalTimeZone()
									)}
									onValueChange={(v) => {
										form.fields.occurred_at.set(v?.toDate(getLocalTimeZone()).toISOString());
									}}
								/>
							</Popover.Content>
						</Popover.Root>
						<input hidden {...form.fields.occurred_at.as('text', defaultOccurredAt)} />
						<Field.FieldError errors={form.fields.occurred_at.issues()} />
					</Field.FieldContent>
				</Field.Field>

				<Field.Field>
					<Field.FieldLabel>Description</Field.FieldLabel>
					<Field.FieldContent>
						<Textarea {...form.fields.description.as('text')} />
					</Field.FieldContent>
				</Field.Field>
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
				<Button type="submit" disabled={!!form.pending}>
					{#if form.pending}
						<Spinner />
					{/if}
					Submit
				</Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
