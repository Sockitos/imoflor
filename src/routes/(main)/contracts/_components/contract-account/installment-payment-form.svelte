<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Calendar } from '@/components/ui/calendar';
	import * as Dialog from '@/components/ui/dialog';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import * as Popover from '@/components/ui/popover';
	import { Textarea } from '@/components/ui/textarea';
	import {
		createInstallmentPaymentSchema,
		type CreateInstallmentPaymentSchema,
	} from '@/schemas/installment-payment';
	import type { LendingContract } from '@/types/types';
	import { calculateInterest, cn } from '@/utils';
	import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date';
	import { CalendarIcon, Loader2 } from 'lucide-svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface Props {
		open?: boolean;
		contract: LendingContract;
		data: SuperValidated<Infer<CreateInstallmentPaymentSchema>>;
	}

	let { open = $bindable(false), contract, data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(createInstallmentPaymentSchema),
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

	let date = $derived($formData.date ? parseDate($formData.date) : undefined);

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
		<form method="POST" use:enhance action="?/createInstallmentPayment">
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
									{date ? df.format(date.toDate(getLocalTimeZone())) : 'Pick a date'}
									<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" side="top">
									<Calendar
										type="single"
										initialFocus
										value={date}
										onValueChange={(v) => {
											if (v) {
												$formData.date = v.toString();
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
