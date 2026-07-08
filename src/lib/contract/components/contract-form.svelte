<script lang="ts">
	import EntitySelector from '@/shared/components/entity-selector.svelte';
	import { Button, buttonVariants } from '@/shared/components/ui/button';
	import { Calendar } from '@/shared/components/ui/calendar';
	import * as Field from '@/shared/components/ui/field';
	import { Input } from '@/shared/components/ui/input';
	import * as Popover from '@/shared/components/ui/popover';
	import { Separator } from '@/shared/components/ui/separator';
	import * as Sheet from '@/shared/components/ui/sheet';
	import * as Tabs from '@/shared/components/ui/tabs';
	import { cn } from '@/shared/utils';
	import { DateFormatter, getLocalTimeZone, parseAbsolute } from '@internationalized/date';
	import { CalendarIcon } from 'lucide-svelte';
	import { contractSchema } from '../schemas';
	import { upsertContract } from '../contract.remote';
	import { contractTypeValues, type Contract, type ContractType } from '../types';
	import { getPropertyOptions } from '@/property/property.remote';
	import { getTenantOptions } from '@/tenant/tenant.remote';
	import { Spinner } from '@/shared/components/ui/spinner';
	import PropertyOptionItem from '@/property/components/property-option-item.svelte';
	import TenantOptionItem from '@/tenant/components/tenant-option-item.svelte';

	interface Props {
		open?: boolean;
		contract?: Contract;
	}

	let { open = $bindable(false), contract }: Props = $props();

	const form = $derived(contract != null ? upsertContract.for(contract.id) : upsertContract);
	const isEdit = $derived(contract != null);

	const rentingContract = $derived(contract?.type === 'renting' ? contract : undefined);
	const lendingContract = $derived(contract?.type === 'lending' ? contract : undefined);

	type FormFields = typeof form.fields;
	const rentingFields = $derived(form.fields as Extract<FormFields, { rent: unknown }>);
	const lendingFields = $derived(form.fields as Extract<FormFields, { sale_value: unknown }>);

	let contractType = $state<ContractType>('renting');

	let propertyId = $state<number | undefined>();
	let tenantId = $state<number | undefined>();

	let startDateStr = $state<string | undefined>();
	let endDateStr = $state<string | undefined>();

	const startDate = $derived(
		startDateStr ? parseAbsolute(startDateStr, getLocalTimeZone()) : undefined
	);
	const endDate = $derived(endDateStr ? parseAbsolute(endDateStr, getLocalTimeZone()) : undefined);

	$effect(() => {
		if (contract?.type) {
			contractType = contract.type;
		}

		if (contract?.property?.id) {
			propertyId = contract.property.id;
		}

		if (contract?.tenants?.[0]?.id) {
			tenantId = contract.tenants[0].id;
		}

		if (contract?.start_date) {
			startDateStr = contract.start_date;
		}

		if (contract?.end_date) {
			endDateStr = contract.end_date;
		}
	});

	const df = new DateFormatter('en-US', { dateStyle: 'long' });
	function isInvalid(issues?: { message?: string }[]) {
		return (issues?.length ?? 0) > 0;
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="overflow-y-auto data-[side=right]:sm:max-w-2xl">
		<Sheet.Header>
			<Sheet.Title>{isEdit ? 'Edit contract' : 'Add new contract'}</Sheet.Title>
			<Sheet.Description>
				{isEdit
					? 'Update the contract details below.'
					: 'Fill the form below to add a new contract.'}
			</Sheet.Description>
		</Sheet.Header>
		<Separator />
		<Tabs.Root bind:value={contractType} class="mb-5">
			<Tabs.List class="grid w-full grid-cols-2">
				{#each contractTypeValues as type (type)}
					<Tabs.Trigger value={type} class="capitalize">{type}</Tabs.Trigger>
				{/each}
			</Tabs.List>
		</Tabs.Root>
		<form
			{...form.preflight(contractSchema).enhance(async (f) => {
				try {
					if (await f.submit()) {
						open = false;
						if (!isEdit) f.form.reset();
					}
				} catch (err) {
					console.error(err);
				}
			})}
			onfocusout={() => form.validate()}
			class="flex flex-col gap-6 px-4 pb-4"
		>
			{#if contract?.id != null}
				<input hidden {...form.fields.id.as('number', contract.id)} />
			{/if}
			<input hidden name="type" value={contractType} />

			<Field.FieldGroup>
				<Field.Field data-invalid={isInvalid(form.fields.property_id.issues())}>
					<Field.FieldLabel>Property</Field.FieldLabel>
					<Field.FieldContent>
						<svelte:boundary>
							{@const options = await getPropertyOptions()}
							{@const spreadOptions = options.flatMap((option) => [
								option,
								...(option.children ?? []),
							])}

							<EntitySelector bind:entityId={propertyId} options={spreadOptions}>
								{#snippet displayOption(option)}
									<PropertyOptionItem {option} />
								{/snippet}
								{#snippet children(option)}
									<PropertyOptionItem {option} indent={!option.children} />
								{/snippet}
							</EntitySelector>

							{#snippet pending()}
								<div class="flex items-center justify-center">
									<Spinner class="size-6" />
								</div>
							{/snippet}

							{#snippet failed(_, reset)}
								<div class="flex flex-col items-center gap-y-4">
									<p class="text-sm text-destructive">Failed to load properties.</p>
									<Button variant="outline" class="w-fit" onclick={reset}>Retry</Button>
								</div>
							{/snippet}
						</svelte:boundary>
						<input
							hidden
							{...propertyId != null
								? form.fields.property_id.as('number', propertyId)
								: form.fields.property_id.as('number')}
						/>
						<Field.FieldError errors={form.fields.property_id.issues()} />
					</Field.FieldContent>
				</Field.Field>

				<Field.Field data-invalid={isInvalid(form.fields.tenant_id.issues())}>
					<Field.FieldLabel>Tenant</Field.FieldLabel>
					<Field.FieldContent>
						<svelte:boundary>
							{@const tenantOptions = await getTenantOptions()}

							<EntitySelector bind:entityId={tenantId} options={tenantOptions}>
								{#snippet displayOption(option)}
									<TenantOptionItem {option} />
								{/snippet}
								{#snippet children(option)}
									<TenantOptionItem {option} />
								{/snippet}
							</EntitySelector>

							{#snippet pending()}
								<div class="flex items-center justify-center">
									<Spinner class="size-6" />
								</div>
							{/snippet}

							{#snippet failed(_, reset)}
								<div class="flex flex-col items-center gap-y-4">
									<p class="text-sm text-destructive">Failed to load tenants.</p>
									<Button variant="outline" class="w-fit" onclick={reset}>Retry</Button>
								</div>
							{/snippet}
						</svelte:boundary>
						<input
							hidden
							{...tenantId != null
								? form.fields.tenant_id.as('number', tenantId)
								: form.fields.tenant_id.as('number')}
						/>
						<Field.FieldError errors={form.fields.tenant_id.issues()} />
					</Field.FieldContent>
				</Field.Field>

				<div class="grid grid-cols-2 items-start gap-x-4">
					<Field.Field data-invalid={isInvalid(form.fields.start_date.issues())}>
						<Field.FieldLabel>Start Date</Field.FieldLabel>
						<Field.FieldContent>
							<Popover.Root>
								<Popover.Trigger
									class={cn(
										buttonVariants({ variant: 'outline' }),
										'w-full justify-start pl-4 text-left font-normal',
										!startDate && 'text-muted-foreground'
									)}
								>
									{startDate ? df.format(startDate.toDate()) : 'Pick a date'}
									<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" side="top">
									<Calendar
										type="single"
										value={startDate}
										onValueChange={(v) => {
											startDateStr = v?.toDate(getLocalTimeZone()).toISOString();
										}}
									/>
								</Popover.Content>
							</Popover.Root>
							<input
								hidden
								{...startDateStr
									? form.fields.start_date.as('text', startDateStr)
									: form.fields.start_date.as('text')}
							/>
							<Field.FieldError errors={form.fields.start_date.issues()} />
						</Field.FieldContent>
					</Field.Field>

					<Field.Field>
						<Field.FieldLabel>End Date</Field.FieldLabel>
						<Field.FieldContent>
							<Popover.Root>
								<Popover.Trigger
									class={cn(
										buttonVariants({ variant: 'outline' }),
										'w-full justify-start pl-4 text-left font-normal',
										!endDate && 'text-muted-foreground'
									)}
								>
									{endDate ? df.format(endDate.toDate()) : 'Pick a date'}
									<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" side="top">
									<Calendar
										type="single"
										value={endDate}
										onValueChange={(v) => {
											endDateStr = v?.toDate(getLocalTimeZone()).toISOString();
										}}
									/>
								</Popover.Content>
							</Popover.Root>
							<input hidden name="end_date" value={endDateStr} />
						</Field.FieldContent>
					</Field.Field>
				</div>

				{#if contractType === 'renting'}
					<Field.Field data-invalid={isInvalid(rentingFields.rent.issues())}>
						<Field.FieldLabel>Rent</Field.FieldLabel>
						<Field.FieldContent>
							<Input
								{...rentingContract?.data.rent !== undefined
									? rentingFields.rent.as('number', rentingContract?.data.rent)
									: rentingFields.rent.as('number')}
							/>
							<Field.FieldError errors={rentingFields.rent.issues()} />
						</Field.FieldContent>
					</Field.Field>
				{:else}
					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(lendingFields.sale_value.issues())}>
							<Field.FieldLabel>Sale Value</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...lendingContract?.data.sale_value !== undefined
										? lendingFields.sale_value.as('number', lendingContract?.data.sale_value)
										: lendingFields.sale_value.as('number')}
								/>
								<Field.FieldError errors={lendingFields.sale_value.issues()} />
							</Field.FieldContent>
						</Field.Field>
						<Field.Field data-invalid={isInvalid(lendingFields.down_payment.issues())}>
							<Field.FieldLabel>Down Payment</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...lendingContract?.data.down_payment !== undefined
										? lendingFields.down_payment.as('number', lendingContract?.data.down_payment)
										: lendingFields.down_payment.as('number')}
								/>
								<Field.FieldError errors={lendingFields.down_payment.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>
					<Field.Field data-invalid={isInvalid(lendingFields.installment.issues())}>
						<Field.FieldLabel>Installment</Field.FieldLabel>
						<Field.FieldContent>
							<Input
								{...lendingContract?.data.installment !== undefined
									? lendingFields.installment.as('number', lendingContract?.data.installment)
									: lendingFields.installment.as('number')}
							/>
							<Field.FieldError errors={lendingFields.installment.issues()} />
						</Field.FieldContent>
					</Field.Field>
					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(lendingFields.yearly_raise.issues())}>
							<Field.FieldLabel>Yearly Raise</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...lendingContract?.data.yearly_raise !== undefined
										? lendingFields.yearly_raise.as('number', lendingContract?.data.yearly_raise)
										: lendingFields.yearly_raise.as('number')}
								/>
								<Field.FieldError errors={lendingFields.yearly_raise.issues()} />
							</Field.FieldContent>
						</Field.Field>
						<Field.Field data-invalid={isInvalid(lendingFields.interest.issues())}>
							<Field.FieldLabel>Interest</Field.FieldLabel>
							<Field.FieldContent>
								<Input
									{...lendingContract?.data.interest !== undefined
										? lendingFields.interest.as('number', lendingContract?.data.interest)
										: lendingFields.interest.as('number')}
								/>
								<Field.FieldError errors={lendingFields.interest.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>
				{/if}
			</Field.FieldGroup>

			<Sheet.Footer class="flex flex-row items-center justify-end gap-4 px-0 pt-0">
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
			</Sheet.Footer>
		</form>
	</Sheet.Content>
</Sheet.Root>
