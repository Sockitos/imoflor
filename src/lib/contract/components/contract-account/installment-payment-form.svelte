<script lang="ts">
	import { Button, buttonVariants } from '@/shared/components/ui/button';
	import { Calendar } from '@/shared/components/ui/calendar';
	import * as Dialog from '@/shared/components/ui/dialog';
	import * as Field from '@/shared/components/ui/field';
	import { Input } from '@/shared/components/ui/input';
	import * as Popover from '@/shared/components/ui/popover';
	import { Textarea } from '@/shared/components/ui/textarea';
	import { cn } from '@/shared/utils';
	import { DateFormatter, getLocalTimeZone, parseAbsolute } from '@internationalized/date';
	import { CalendarIcon } from 'lucide-svelte';
	import { createInstallmentPaymentSchema } from '../../schemas';
	import { createInstallmentPayment } from '../../contract.remote';
	import { calculateInterest } from '../../utils';
	import type { LendingContract } from '../../types';
	import { Spinner } from '@/shared/components/ui/spinner';

	interface Props {
		open?: boolean;
		contractId: number;
		contract: LendingContract;
	}

	let { open = $bindable(false), contractId, contract }: Props = $props();

	const form = $derived(createInstallmentPayment.for(contractId));

	let paymentDateStr = $state<string | undefined>(new Date().toISOString());
	let paymentValue = $state(contract.data.installment);

	const initialInterest = $derived(calculateInterest(contract, paymentDateStr));
	let interest = $state(initialInterest);
	let amortization = $state(paymentValue - initialInterest);

	const df = new DateFormatter('en-US', { dateStyle: 'long' });
	const paymentDate = $derived(
		paymentDateStr ? parseAbsolute(paymentDateStr, getLocalTimeZone()) : undefined
	);

	function recalculate() {
		interest = calculateInterest(contract, paymentDateStr);
		amortization = paymentValue - interest;
	}

	function isInvalid(issues?: { message?: string }[]) {
		return (issues?.length ?? 0) > 0;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add Installment Payment</Dialog.Title>
			<Dialog.Description>Add an installment payment to the contract.</Dialog.Description>
		</Dialog.Header>
		<form
			{...form.preflight(createInstallmentPaymentSchema).enhance(async (f) => {
				try {
					if (await f.submit()) {
						open = false;
						f.form.reset();
					}
				} catch (err) {
					console.error(err);
				}
			})}
		>
			<input hidden {...form.fields.contract_id.as('number', contractId)} />
			<div class="grid gap-4 py-4">
				<Field.Field data-invalid={isInvalid(form.fields.value.issues())}>
					<Field.FieldLabel>Value</Field.FieldLabel>
					<Field.FieldContent>
						<Input
							type="number"
							step="any"
							name="value"
							bind:value={paymentValue}
							oninput={recalculate}
						/>
						<Field.FieldError errors={form.fields.value.issues()} />
					</Field.FieldContent>
				</Field.Field>

				<Field.Field data-invalid={isInvalid(form.fields.interest.issues())}>
					<Field.FieldLabel>Interest</Field.FieldLabel>
					<Field.FieldContent>
						<Input
							type="number"
							step="any"
							name="interest"
							bind:value={interest}
							oninput={recalculate}
						/>
						<Field.FieldError errors={form.fields.interest.issues()} />
					</Field.FieldContent>
				</Field.Field>

				<Field.Field data-invalid={isInvalid(form.fields.amortization.issues())}>
					<Field.FieldLabel>Amortization</Field.FieldLabel>
					<Field.FieldContent>
						<Input type="number" step="any" name="amortization" bind:value={amortization} />
						<Field.FieldError errors={form.fields.amortization.issues()} />
					</Field.FieldContent>
				</Field.Field>

				<Field.Field data-invalid={isInvalid(form.fields.date.issues())}>
					<Field.FieldLabel>Date</Field.FieldLabel>
					<Field.FieldContent>
						<Popover.Root>
							<Popover.Trigger
								class={cn(
									buttonVariants({ variant: 'outline' }),
									'w-full justify-start pl-4 text-left font-normal',
									!paymentDate && 'text-muted-foreground'
								)}
							>
								{paymentDate ? df.format(paymentDate.toDate()) : 'Pick a date'}
								<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
							</Popover.Trigger>
							<Popover.Content class="w-auto p-0" side="top">
								<Calendar
									type="single"
									value={paymentDate}
									onValueChange={(v) => {
										paymentDateStr = v?.toDate(getLocalTimeZone()).toISOString();
										recalculate();
									}}
								/>
							</Popover.Content>
						</Popover.Root>
						<input
							hidden
							{...paymentDateStr
								? form.fields.date.as('text', paymentDateStr)
								: form.fields.date.as('text')}
						/>
						<Field.FieldError errors={form.fields.date.issues()} />
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
