<script lang="ts">
	import { Button, buttonVariants } from '@/shared/components/ui/button';
	import { Calendar } from '@/shared/components/ui/calendar';
	import * as Field from '@/shared/components/ui/field';
	import { Input } from '@/shared/components/ui/input';
	import * as Popover from '@/shared/components/ui/popover';
	import { Separator } from '@/shared/components/ui/separator';
	import * as Sheet from '@/shared/components/ui/sheet';
	import { currencyFormatter, dateFormatter } from '@/shared/formatters';
	import { cn } from '@/shared/utils';
	import { DateFormatter, getLocalTimeZone, parseAbsolute } from '@internationalized/date';
	import { CalendarIcon } from 'lucide-svelte';
	import { createRentUpdateSchema } from '../../schemas';
	import { createRentUpdate, getRentUpdates } from '../../contract.remote';
	import { Spinner } from '@/shared/components/ui/spinner';

	interface Props {
		open?: boolean;
		contractId: number;
	}

	let { open = $bindable(false), contractId }: Props = $props();

	const form = $derived(createRentUpdate.for(contractId));

	let updateDateStr = $state<string | undefined>(new Date().toISOString());
	const df = new DateFormatter('en-US', { dateStyle: 'long' });
	const updateDate = $derived(
		updateDateStr ? parseAbsolute(updateDateStr, getLocalTimeZone()) : undefined
	);

	function isInvalid(issues?: { message?: string }[]) {
		return (issues?.length ?? 0) > 0;
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto sm:max-w-3xl">
		<Sheet.Header>
			<Sheet.Title>Add new rent update</Sheet.Title>
			<Sheet.Description>Fill the form below to add a new rent update.</Sheet.Description>
		</Sheet.Header>
		<Separator />
		<form
			{...form.preflight(createRentUpdateSchema).enhance(async (f) => {
				try {
					if (await f.submit()) {
						open = false;
						f.form.reset();
					}
				} catch (err) {
					console.error(err);
				}
			})}
			onfocusout={form.validate}
			class="flex flex-col gap-6 px-4 py-4"
		>
			<input hidden {...form.fields.contract_id.as('number', contractId)} />

			<div class="grid grid-cols-2 items-start gap-x-4">
				<Field.Field data-invalid={isInvalid(form.fields.rent.issues())}>
					<Field.FieldLabel>Rent</Field.FieldLabel>
					<Field.FieldContent>
						<Input {...form.fields.rent.as('number')} />
						<Field.FieldError errors={form.fields.rent.issues()} />
					</Field.FieldContent>
				</Field.Field>

				<Field.Field data-invalid={isInvalid(form.fields.update_date.issues())}>
					<Field.FieldLabel>Update Date</Field.FieldLabel>
					<Field.FieldContent>
						<Popover.Root>
							<Popover.Trigger
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
										updateDateStr = v?.toDate(getLocalTimeZone()).toISOString();
									}}
								/>
							</Popover.Content>
						</Popover.Root>
						<input
							hidden
							{...updateDateStr
								? form.fields.update_date.as('text', updateDateStr)
								: form.fields.update_date.as('text')}
						/>
						<Field.FieldError errors={form.fields.update_date.issues()} />
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
		<Separator class="my-5" />
		<h3 class="mb-4 text-lg font-medium">Update History</h3>
		<svelte:boundary>
			{@const updates = await getRentUpdates(contractId)}

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
						<span class="text-sm font-medium">Rent:</span>
						<span class="text-sm text-muted-foreground">
							{currencyFormatter.format(update.rent)}
						</span>
					</div>
				</div>
			{/each}

			{#snippet pending()}
				<div class="flex items-center justify-center px-4 py-6 lg:px-8">
					<Spinner class="size-6" />
				</div>
			{/snippet}

			{#snippet failed(_, reset)}
				<div class="flex flex-col items-center gap-y-4 px-4 py-6 lg:px-8">
					<p class="text-sm text-destructive">Failed to load rent updates.</p>
					<Button variant="outline" class="w-fit" onclick={reset}>Retry</Button>
				</div>
			{/snippet}
		</svelte:boundary>
	</Sheet.Content>
</Sheet.Root>
