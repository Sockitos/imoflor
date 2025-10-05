<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Calendar } from '@/components/ui/calendar';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import * as Popover from '@/components/ui/popover';
	import { Separator } from '@/components/ui/separator';
	import * as Sheet from '@/components/ui/sheet';
	import { currencyFormatter } from '@/formatters';
	import { createRentUpdateSchema, type CreateRentUpdateSchema } from '@/schemas/rent-update';
	import type { RentUpdate } from '@/types/types';
	import { cn } from '@/utils';
	import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date';
	import dayjs from 'dayjs';
	import { CalendarIcon, Loader2 } from 'lucide-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	interface Props {
		open?: boolean;
		data: SuperValidated<Infer<CreateRentUpdateSchema>>;
		updates: RentUpdate[];
	}

	let { open = $bindable(false), data, updates }: Props = $props();

	const form = superForm(data, {
		validators: zod4Client(createRentUpdateSchema),
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

	let updateDate = $derived($formData.update_date ? parseDate($formData.update_date) : undefined);
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto sm:max-w-[40rem]">
		<Sheet.Header>
			<Sheet.Title>Add new rent update</Sheet.Title>
			<Sheet.Description>Fill the form below to add a new rent update.</Sheet.Description>
		</Sheet.Header>
		<Separator class="my-5" />
		<form method="POST" use:enhance action="?/createRentUpdate">
			<div class="mb-5 space-y-3">
				<h3 class="text-lg font-medium">Information</h3>
				<div class="grid grid-cols-2 items-start gap-x-4">
					<Form.Field {form} name="rent">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Rent</Form.Label>
								<Input type="number" step="any" {...props} bind:value={$formData.rent} />
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
										{updateDate ? df.format(updateDate.toDate(getLocalTimeZone())) : 'Pick a date'}
										<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
									</Popover.Trigger>
									<Popover.Content class="w-auto p-0" side="top">
										<Calendar
											type="single"
											initialFocus
											value={updateDate}
											onValueChange={(v) => {
												if (v) {
													$formData.update_date = v.toString();
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
				<div class="border-primary flex w-2 flex-col items-center">
					<div class="bg-primary mt-1 h-2 w-2 shrink-0 rounded-full"></div>
					<Separator orientation="vertical" class="flex-1" />
				</div>
				<div>
					<div class="flex items-center">
						<CalendarIcon class="text-muted-foreground mr-2 h-4 w-4" />
						<span class="text-muted-foreground text-sm"
							>{dayjs(update.update_date).format('DD/MM/YYYY')}</span
						>
					</div>
					<span class="text-sm font-medium">Rent:</span>
					<span class="text-muted-foreground text-sm">
						{currencyFormatter.format(update.rent)}
					</span>
				</div>
			</div>
		{/each}
	</Sheet.Content>
</Sheet.Root>
