<script lang="ts">
	import { Button, buttonVariants } from '@/shared/components/ui/button';
	import { Calendar } from '@/shared/components/ui/calendar';
	import * as Dialog from '@/shared/components/ui/dialog';
	import * as Form from '@/shared/components/ui/form';
	import { Input } from '@/shared/components/ui/input';
	import * as Popover from '@/shared/components/ui/popover';
	import { Textarea } from '@/shared/components/ui/textarea';
	import { cn } from '@/shared/utils';
	import { DateFormatter, getLocalTimeZone, parseAbsolute } from '@internationalized/date';
	import { CalendarIcon, Loader2 } from 'lucide-svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import {
		createInstallmentPaymentSchema,
		type CreateInstallmentPaymentSchema,
	} from '../../schemas';
	import type { LendingContract } from '../../types';
	import { calculateInterest } from '../../utils';

	interface Props {
		open?: boolean;
		contract: LendingContract;
		data: SuperValidated<Infer<CreateInstallmentPaymentSchema>>;
	}

	let { open = $bindable(false), contract, data }: Props = $props();

	const form = superForm(data, {
		validators: zod4Client(createInstallmentPaymentSchema),
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

	let paymentDate = $derived(
		$formData.date ? parseAbsolute($formData.date, getLocalTimeZone()) : undefined
	);

	function handleValueDateChange() {
		$formData.interest = calculateInterest(contract, $formData.date);
		$formData.amortization = $formData.value - $formData.interest;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add Installment Payment</Dialog.Title>
			<Dialog.Description>Add a Installment payment to the contract.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" use:enhance action="?/createInstallmentPayment" class="px-1">
			<div class="grid gap-4 py-4">
				<Form.Field {form} name="value">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Value</Form.Label>
							<Input
								type="number"
								step="any"
								{...props}
								bind:value={$formData.value}
								oninput={handleValueDateChange}
							/>
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
				<Form.Field {form} name="amortization">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Amortization</Form.Label>
							<Input type="number" step="any" {...props} bind:value={$formData.amortization} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="date">
					<Form.Control id="installment_payment_date">
						{#snippet children({ props })}
							<Form.Label for="installment_payment_date">Date</Form.Label>
							<Popover.Root>
								<Popover.Trigger
									{...props}
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
											if (v) {
												$formData.date = v.toDate(getLocalTimeZone()).toISOString();
												handleValueDateChange();
											} else {
												$formData.date = '';
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
				<Form.Field {form} name="description">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label for="description">Description</Form.Label>
							<Textarea {...props} bind:value={$formData.description} />
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
	</Dialog.Content>
</Dialog.Root>
