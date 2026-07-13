<script lang="ts">
	import { Button, buttonVariants } from '@/shared/components/ui/button';
	import { Calendar } from '@/shared/components/ui/calendar';
	import * as Dialog from '@/shared/components/ui/dialog';
	import * as Field from '@/shared/components/ui/field';
	import { Input } from '@/shared/components/ui/input';
	import * as Popover from '@/shared/components/ui/popover';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { cn } from '@/shared/utils';
	import { DateFormatter, getLocalTimeZone, parseAbsolute } from '@internationalized/date';
	import { CalendarIcon } from 'lucide-svelte';
	import { createDueNote } from '../../contract.remote';
	import { createDueNoteSchema } from '../../schemas';

	interface Props {
		open?: boolean;
		contractId: number;
	}

	let { open = $bindable(false), contractId }: Props = $props();

	const form = $derived(createDueNote.for(contractId));

	let dueDateStr = $state<string | undefined>(new Date().toISOString());
	const df = new DateFormatter('en-US', { dateStyle: 'long' });
	const dueDate = $derived(dueDateStr ? parseAbsolute(dueDateStr, getLocalTimeZone()) : undefined);

	function isInvalid(issues?: { message?: string }[]) {
		return (issues?.length ?? 0) > 0;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add Due Note</Dialog.Title>
			<Dialog.Description>Add a due note to the contract.</Dialog.Description>
		</Dialog.Header>
		<form
			{...form.preflight(createDueNoteSchema).enhance(async (f) => {
				try {
					if (await f.submit()) {
						open = false;
						f.element.reset();
					}
				} catch (err) {
					console.error(err);
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

				<Field.Field data-invalid={isInvalid(form.fields.due_date.issues())}>
					<Field.FieldLabel>Due Date</Field.FieldLabel>
					<Field.FieldContent>
						<Popover.Root>
							<Popover.Trigger
								class={cn(
									buttonVariants({ variant: 'outline' }),
									'w-full justify-start pl-4 text-left font-normal',
									!dueDate && 'text-muted-foreground'
								)}
							>
								{dueDate ? df.format(dueDate.toDate()) : 'Pick a date'}
								<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
							</Popover.Trigger>
							<Popover.Content class="w-auto p-0" side="top">
								<Calendar
									type="single"
									value={dueDate}
									onValueChange={(v) => {
										dueDateStr = v?.toDate(getLocalTimeZone()).toISOString();
									}}
								/>
							</Popover.Content>
						</Popover.Root>
						<input
							hidden
							{...dueDateStr
								? form.fields.due_date.as('text', dueDateStr)
								: form.fields.due_date.as('text')}
						/>
						<Field.FieldError errors={form.fields.due_date.issues()} />
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
