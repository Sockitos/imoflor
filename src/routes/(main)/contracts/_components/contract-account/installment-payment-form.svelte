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
	import {
		DateFormatter,
		getLocalTimeZone,
		parseAbsolute,
		type DateValue,
	} from '@internationalized/date';
	import { CalendarIcon, Loader2 } from 'lucide-svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let open = false;
	export let contract: LendingContract;
	export let data: SuperValidated<Infer<CreateInstallmentPaymentSchema>>;

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

	let date: DateValue | undefined;
	$: date = $formData.date ? parseAbsolute($formData.date, getLocalTimeZone()) : undefined;

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
					<Form.Control let:attrs>
						<Form.Label>Value</Form.Label>
						<Input
							type="number"
							step="any"
							{...attrs}
							bind:value={$formData.value}
							on:change={handleValueDateChange}
						/>
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="interest">
					<Form.Control let:attrs>
						<Form.Label>Interest</Form.Label>
						<Input type="number" step="any" {...attrs} bind:value={$formData.interest} />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="amortization">
					<Form.Control let:attrs>
						<Form.Label>Amortization</Form.Label>
						<Input type="number" step="any" {...attrs} bind:value={$formData.amortization} />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
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
											handleValueDateChange();
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
				<Form.Field {form} name="description">
					<Form.Control let:attrs>
						<Form.Label for="description">Description</Form.Label>
						<Textarea {...attrs} bind:value={$formData.description} />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
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
	</Dialog.Content>
</Dialog.Root>
