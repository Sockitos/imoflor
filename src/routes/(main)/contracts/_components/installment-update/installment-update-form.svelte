<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Calendar } from '@/components/ui/calendar';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import * as Popover from '@/components/ui/popover';
	import { Separator } from '@/components/ui/separator';
	import * as Sheet from '@/components/ui/sheet';
	import { currencyFormatter } from '@/formatters';
	import {
		createInstallmentUpdateSchema,
		type CreateInstallmentUpdateSchema,
	} from '@/schemas/installment-update';
	import type { InstallmentUpdate } from '@/types/types';
	import { cn } from '@/utils';
	import {
		DateFormatter,
		getLocalTimeZone,
		parseAbsolute,
		type DateValue,
	} from '@internationalized/date';
	import dayjs from 'dayjs';
	import { CalendarIcon, Loader2 } from 'lucide-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let open = false;
	export let data: SuperValidated<Infer<CreateInstallmentUpdateSchema>>;
	export let updates: InstallmentUpdate[];

	const form = superForm(data, {
		validators: zodClient(createInstallmentUpdateSchema),
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

	let updateDate: DateValue | undefined;
	$: updateDate = $formData.update_date
		? parseAbsolute($formData.update_date, getLocalTimeZone())
		: undefined;
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto sm:max-w-[40rem]">
		<Sheet.Header>
			<Sheet.Title>Add new installment update</Sheet.Title>
			<Sheet.Description>Fill the form below to add a new installment update.</Sheet.Description>
		</Sheet.Header>
		<Separator class="my-5" />
		<form method="POST" use:enhance action="?/createInstallmentUpdate">
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Information</h3>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="installment">
						<Form.Control let:attrs>
							<Form.Label>Installment</Form.Label>
							<Input type="number" step="any" {...attrs} bind:value={$formData.installment} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="update_date">
						<Form.Control id="update_date" let:attrs>
							<Form.Label for="update_date">Update Date</Form.Label>
							<Popover.Root>
								<Popover.Trigger
									{...attrs}
									class={cn(
										buttonVariants({ variant: 'outline' }),
										'w-full justify-start pl-4 text-left font-normal',
										!updateDate && 'text-muted-foreground'
									)}
								>
									{updateDate ? df.format(updateDate.toDate()) : 'Pick a date'}
									<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" side="top">
									<Calendar
										initialFocus
										value={updateDate}
										onValueChange={(v) => {
											if (v) {
												$formData.update_date = v.toDate(getLocalTimeZone()).toISOString();
											} else {
												$formData.update_date = '';
											}
										}}
									/>
								</Popover.Content>
							</Popover.Root>
							<input hidden value={$formData.update_date} name={attrs.name} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
				</div>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="interest">
						<Form.Control let:attrs>
							<Form.Label>Interest</Form.Label>
							<Input type="number" step="any" {...attrs} bind:value={$formData.interest} />
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
			</div>
		</form>
		<Separator class="my-5" />
		<h3 class="mb-4 text-lg font-medium">Update History</h3>
		{#each updates as update}
			<div class="flex h-24 flex-row items-stretch gap-4">
				<div class="flex w-2 flex-col items-center border-primary">
					<div class="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary"></div>
					<Separator orientation="vertical" class="flex-1" />
				</div>
				<div>
					<div class="flex items-center">
						<CalendarIcon class="mr-2 h-4 w-4 text-muted-foreground" />
						<span class="text-sm text-muted-foreground"
							>{dayjs(update.update_date).format('DD/MM/YYYY')}</span
						>
					</div>
					<span class="text-sm font-medium">Installment:</span>
					<span class="text-sm text-muted-foreground">
						{currencyFormatter.format(update.installment)}
					</span>
					<br />
					<span class="text-sm font-medium">Interest:</span>
					<span class="text-sm text-muted-foreground">
						{currencyFormatter.format(update.interest)}
					</span>
				</div>
			</div>
		{/each}
	</Sheet.Content>
</Sheet.Root>
