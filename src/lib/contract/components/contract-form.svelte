<script lang="ts">
	import PropertyOptionItem from '@/property/components/property-option-item.svelte';
	import { getPropertyOptions } from '@/property/property.remote';
	import EntitySelector from '@/shared/components/entity-selector.svelte';
	import { Button, buttonVariants } from '@/shared/components/ui/button';
	import { Calendar } from '@/shared/components/ui/calendar';
	import * as Field from '@/shared/components/ui/field';
	import { Input } from '@/shared/components/ui/input';
	import * as Popover from '@/shared/components/ui/popover';
	import { Separator } from '@/shared/components/ui/separator';
	import * as Sheet from '@/shared/components/ui/sheet';
	import { Spinner } from '@/shared/components/ui/spinner';
	import * as Tabs from '@/shared/components/ui/tabs';
	import { cn, parsePlainDate, toPlainDateString } from '@/shared/utils';
	import TenantOptionItem from '@/tenant/components/tenant-option-item.svelte';
	import { getTenantOptions } from '@/tenant/tenant.remote';
	import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { CalendarIcon } from 'lucide-svelte';
	import { toastError, toastSuccess } from '@/shared/toast';
	import { untrack } from 'svelte';
	import type { z } from 'zod';
	import { upsertContract } from '../contract.remote';
	import { contractSchema } from '../schemas';
	import { contractTypeValues, type Contract, type ContractType } from '../types';

	interface Props {
		open?: boolean;
		contract?: Contract;
	}

	let { open = $bindable(false), contract }: Props = $props();

	const form = $derived(contract != null ? upsertContract.for(contract.id) : upsertContract);
	const isEdit = $derived(contract != null);

	type FormFields = typeof form.fields;
	const rentingFields = $derived(form.fields as Extract<FormFields, { rent: unknown }>);
	const lendingFields = $derived(form.fields as Extract<FormFields, { sale_value: unknown }>);

	type ContractInput = z.infer<typeof contractSchema>;
	type TypeField = {
		as: (type: 'text', value?: 'renting') => Record<string, unknown>;
		set: (value: ContractType) => void;
		value: () => ContractType | undefined;
	};

	const typeField = $derived(form.fields.type as unknown as TypeField);
	const contractType = $derived(typeField.value() ?? 'renting');

	$effect.pre(() => {
		if (open) {
			untrack(() => {
				if (contract?.type === 'renting') {
					(form.fields.set as (value: ContractInput) => void)({
						id: contract.id,
						type: 'renting',
						property_id: contract.property.id,
						tenant_id: contract.tenants[0].id,
						start_date: contract.start_date,
						end_date: contract.end_date ?? undefined,
						rent: contract.data.rent,
					});
				} else if (contract?.type === 'lending') {
					(form.fields.set as (value: ContractInput) => void)({
						id: contract.id,
						type: 'lending',
						property_id: contract.property.id,
						tenant_id: contract.tenants[0].id,
						start_date: contract.start_date,
						end_date: contract.end_date ?? undefined,
						sale_value: contract.data.sale_value,
						down_payment: contract.data.down_payment,
						yearly_raise: contract.data.yearly_raise,
						installment: contract.data.installment,
						interest: contract.data.interest,
					});
				}
			});
			return;
		}

		untrack(() => form.element?.reset());
	});

	const df = new DateFormatter('en-US', { dateStyle: 'long' });

	function isInvalid(issues?: { message?: string }[]) {
		return (issues?.length ?? 0) > 0;
	}

	function dateLabel(value: string | undefined) {
		const date = value ? parsePlainDate(value) : undefined;
		return date ? df.format(date.toDate(getLocalTimeZone())) : 'Pick a date';
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
		<Tabs.Root
			bind:value={() => contractType, (value) => typeField.set(value as ContractType)}
			class="mb-5"
		>
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
						toastSuccess(
							isEdit ? 'Contract updated successfully' : 'Contract created successfully'
						);
						open = false;
					}
				} catch (error) {
					toastError(error);
				}
			})}
			onfocusout={() => form.validate()}
			class="flex flex-col gap-6 px-4 pb-4"
		>
			{#if contract}
				<input hidden {...form.fields.id.as('number')} />
			{/if}
			<input hidden {...contract ? typeField.as('text') : typeField.as('text', 'renting')} />

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

							<EntitySelector
								bind:entityId={
									() => form.fields.property_id.value(), (id) => form.fields.property_id.set(id)
								}
								options={spreadOptions}
							>
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
						{#if form.fields.property_id.value() != null}
							<input hidden {...form.fields.property_id.as('number')} />
						{/if}
						<Field.FieldError errors={form.fields.property_id.issues()} />
					</Field.FieldContent>
				</Field.Field>

				<Field.Field data-invalid={isInvalid(form.fields.tenant_id.issues())}>
					<Field.FieldLabel>Tenant</Field.FieldLabel>
					<Field.FieldContent>
						<svelte:boundary>
							{@const tenantOptions = await getTenantOptions()}

							<EntitySelector
								bind:entityId={
									() => form.fields.tenant_id.value(), (id) => form.fields.tenant_id.set(id)
								}
								options={tenantOptions}
							>
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
						{#if form.fields.tenant_id.value() != null}
							<input hidden {...form.fields.tenant_id.as('number')} />
						{/if}
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
										!form.fields.start_date.value() && 'text-muted-foreground'
									)}
								>
									{dateLabel(form.fields.start_date.value())}
									<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" side="top">
									<Calendar
										type="single"
										value={parsePlainDate(form.fields.start_date.value())}
										onValueChange={(v) => {
											form.fields.start_date.set(toPlainDateString(v));
										}}
									/>
								</Popover.Content>
							</Popover.Root>
							<input hidden {...form.fields.start_date.as('text')} />
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
										!form.fields.end_date.value() && 'text-muted-foreground'
									)}
								>
									{dateLabel(form.fields.end_date.value())}
									<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" side="top">
									<Calendar
										type="single"
										value={parsePlainDate(form.fields.end_date.value())}
										onValueChange={(v) => {
											form.fields.end_date.set(toPlainDateString(v));
										}}
									/>
								</Popover.Content>
							</Popover.Root>
							<input hidden {...form.fields.end_date.as('text')} />
						</Field.FieldContent>
					</Field.Field>
				</div>

				{#if contractType === 'renting'}
					<Field.Field data-invalid={isInvalid(rentingFields.rent.issues())}>
						<Field.FieldLabel>Rent</Field.FieldLabel>
						<Field.FieldContent>
							<Input {...rentingFields.rent.as('number')} />
							<Field.FieldError errors={rentingFields.rent.issues()} />
						</Field.FieldContent>
					</Field.Field>
				{:else}
					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(lendingFields.sale_value.issues())}>
							<Field.FieldLabel>Sale Value</Field.FieldLabel>
							<Field.FieldContent>
								<Input {...lendingFields.sale_value.as('number')} />
								<Field.FieldError errors={lendingFields.sale_value.issues()} />
							</Field.FieldContent>
						</Field.Field>
						<Field.Field data-invalid={isInvalid(lendingFields.down_payment.issues())}>
							<Field.FieldLabel>Down Payment</Field.FieldLabel>
							<Field.FieldContent>
								<Input {...lendingFields.down_payment.as('number')} />
								<Field.FieldError errors={lendingFields.down_payment.issues()} />
							</Field.FieldContent>
						</Field.Field>
					</div>
					<Field.Field data-invalid={isInvalid(lendingFields.installment.issues())}>
						<Field.FieldLabel>Installment</Field.FieldLabel>
						<Field.FieldContent>
							<Input {...lendingFields.installment.as('number')} />
							<Field.FieldError errors={lendingFields.installment.issues()} />
						</Field.FieldContent>
					</Field.Field>
					<div class="grid grid-cols-2 items-start gap-x-4">
						<Field.Field data-invalid={isInvalid(lendingFields.yearly_raise.issues())}>
							<Field.FieldLabel>Yearly Raise</Field.FieldLabel>
							<Field.FieldContent>
								<Input {...lendingFields.yearly_raise.as('number')} />
								<Field.FieldError errors={lendingFields.yearly_raise.issues()} />
							</Field.FieldContent>
						</Field.Field>
						<Field.Field data-invalid={isInvalid(lendingFields.interest.issues())}>
							<Field.FieldLabel>Interest</Field.FieldLabel>
							<Field.FieldContent>
								<Input {...lendingFields.interest.as('number')} />
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
