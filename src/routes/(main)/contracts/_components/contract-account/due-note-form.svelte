<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Calendar } from '@/components/ui/calendar';
	import * as Dialog from '@/components/ui/dialog';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import * as Popover from '@/components/ui/popover';
	import { createDueNoteSchema, type CreateDueNoteSchema } from '@/schemas/due-note';
	import { cn } from '@/utils';
	import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date';
	import { CalendarIcon, Loader2 } from 'lucide-svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	interface Props {
		open?: boolean;
		data: SuperValidated<Infer<CreateDueNoteSchema>>;
	}

	let { open = $bindable(false), data }: Props = $props();

	const form = superForm(data, {
		validators: zod4Client(createDueNoteSchema),
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

	let dueDate = $derived($formData.due_date ? parseDate($formData.due_date) : undefined);
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add Due Note</Dialog.Title>
			<Dialog.Description>Add a due note to the contract.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" use:enhance action="?/createDueNote">
			<div class="grid gap-4 py-4">
				<Form.Field {form} name="value">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Value</Form.Label>
							<Input type="number" step="any" {...props} bind:value={$formData.value} />
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="due_date">
					<Form.Control id="date">
						{#snippet children({ props })}
							<Form.Label for="date">Due Date</Form.Label>
							<Popover.Root>
								<Popover.Trigger
									{...props}
									class={cn(
										buttonVariants({ variant: 'outline' }),
										'w-full justify-start pl-4 text-left font-normal',
										!dueDate && 'text-muted-foreground'
									)}
								>
									{dueDate ? df.format(dueDate.toDate(getLocalTimeZone())) : 'Pick a date'}
									<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" side="top">
									<Calendar
										type="single"
										initialFocus
										value={dueDate}
										onValueChange={(v) => {
											if (v) {
												$formData.due_date = v.toString();
											} else {
												$formData.due_date = '';
											}
										}}
									/>
								</Popover.Content>
							</Popover.Root>
							<Form.FieldErrors />
							<input hidden value={$formData.due_date} name={props.name} />
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
