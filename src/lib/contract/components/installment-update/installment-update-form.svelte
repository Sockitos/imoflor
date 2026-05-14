<script lang="ts">
	import { Button, buttonVariants } from '@shared/components/ui/button';
	import { Calendar } from '@shared/components/ui/calendar';
	import * as Form from '@shared/components/ui/form';
	import { Input } from '@shared/components/ui/input';
	import * as Popover from '@shared/components/ui/popover';
	import { Separator } from '@shared/components/ui/separator';
	import * as Sheet from '@shared/components/ui/sheet';
	import { currencyFormatter, dateFormatter } from '@shared/formatters';
	import { cn } from '@shared/utils';
	import { DateFormatter, getLocalTimeZone, parseAbsolute } from '@internationalized/date';
	import { CalendarIcon, Loader2 } from 'lucide-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { createInstallmentUpdateSchema, type CreateInstallmentUpdateSchema } from '../../schemas';
	import type { InstallmentUpdate } from '../../types';

	interface Props {
		open?: boolean;
		data: SuperValidated<Infer<CreateInstallmentUpdateSchema>>;
		updates: InstallmentUpdate[];
	}

	let { open = $bindable(false), data, updates }: Props = $props();

	const form = superForm(data, {
		validators: zod4Client(createInstallmentUpdateSchema),
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

	let updateDate = $derived(
		$formData.update_date ? parseAbsolute($formData.update_date, getLocalTimeZone()) : undefined
	);
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto sm:max-w-3xl">
		<Sheet.Header>
			<Sheet.Title>Add new installment update</Sheet.Title>
			<Sheet.Description>Fill the form below to add a new installment update.</Sheet.Description>
		</Sheet.Header>
		<Separator class="my-5" />
		<form method="POST" use:enhance action="?/createInstallmentUpdate" class="px-4">
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Information</h3>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="installment">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Installment</Form.Label>
								<Input type="number" step="any" {...props} bind:value={$formData.installment} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="update_date">
						<Form.Control id="update_date">
							{#snippet children({ props })}
								<Form.Label for="update_date">Update Date</Form.Label>
								<Popover.Root>
									<Popover.Trigger
										{...props}
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
											type="single"
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
								<input hidden value={$formData.update_date} name={props.name} />
								<Form.FieldErrors />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="interest">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Interest</Form.Label>
								<Input type="number" step="any" {...props} bind:value={$formData.interest} />
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
			</div>
		</form>
		<Separator class="my-5" />
		<h3 class="mb-4 text-lg font-medium">Update History</h3>
		{#each updates as update (update.id)}
			<div class="flex h-24 flex-row items-stretch gap-4">
				<div class="flex w-2 flex-col items-center border-primary">
					<div class="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary"></div>
					<Separator orientation="vertical" class="flex-1" />
				</div>
				<div>
					<div class="flex items-center">
						<CalendarIcon class="mr-2 h-4 w-4 text-muted-foreground" />
						<span class="text-sm text-muted-foreground">{dateFormatter(update.update_date)}</span>
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
