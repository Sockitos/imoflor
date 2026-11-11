<script lang="ts">
	import { Button, buttonVariants } from '@/shared/components/ui/button';
	import { Calendar } from '@/shared/components/ui/calendar';
	import * as Dialog from '@/shared/components/ui/dialog';
	import * as Field from '@/shared/components/ui/field';
	import { Input } from '@/shared/components/ui/input';
	import * as Popover from '@/shared/components/ui/popover';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { toastError, toastSuccess } from '@/shared/toast';
	import { cn, parsePlainDate, toPlainDateString } from '@/shared/utils';
	import { DateFormatter, getLocalTimeZone, today } from '@internationalized/date';
	import { CalendarIcon } from 'lucide-svelte';
	import { untrack } from 'svelte';
	import { createDueNote } from '../../contract.remote';
	import { createDueNoteSchema } from '../../schemas';

	interface Props {
		open?: boolean;
		contractId: number;
	}

	let { open = $bindable(false), contractId }: Props = $props();

	const form = $derived(createDueNote.for(contractId));
	const defaultDueDate = today(getLocalTimeZone()).toString();
	const df = new DateFormatter('en-US', { dateStyle: 'long' });

	$effect.pre(() => {
		if (open) {
			untrack(() => form.fields.due_date.set(defaultDueDate));
			return;
		}

		untrack(() => form.element?.reset());
	});

	function isInvalid(issues?: { message?: string }[]) {
		return (issues?.length ?? 0) > 0;
	}

	function dateLabel(value: string | undefined) {
		const date = value ? parsePlainDate(value) : undefined;
		return date ? df.format(date.toDate(getLocalTimeZone())) : 'Pick a date';
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
						toastSuccess('Due note created successfully');
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

				<Field.Field data-invalid={isInvalid(form.fields.due_date.issues())}>
					<Field.FieldLabel>Due Date</Field.FieldLabel>
					<Field.FieldContent>
						<Popover.Root>
							<Popover.Trigger
								class={cn(
									buttonVariants({ variant: 'outline' }),
									'w-full justify-start pl-4 text-left font-normal',
									!form.fields.due_date.value() && 'text-muted-foreground'
								)}
							>
								{dateLabel(form.fields.due_date.value())}
								<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
							</Popover.Trigger>
							<Popover.Content class="w-auto p-0" side="top">
								<Calendar
									type="single"
									value={parsePlainDate(form.fields.due_date.value())}
									onValueChange={(v) => {
										form.fields.due_date.set(toPlainDateString(v));
									}}
								/>
							</Popover.Content>
						</Popover.Root>
						<input hidden {...form.fields.due_date.as('text', defaultDueDate)} />
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
