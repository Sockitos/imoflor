<script lang="ts">
	import { page } from '$app/stores';
	import PageSubtitle from '@/components/page-subtitle.svelte';
	import PageTitle from '@/components/page-title.svelte';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { Separator } from '@/components/ui/separator';
	import { currencyFormatter } from '@/formatters';
	import dayjs from 'dayjs';
	import {
		AlertTriangle,
		ArrowUpDown,
		CheckCheck,
		FileX,
		HandCoins,
		Link,
		Pencil,
		PiggyBank,
		PlusCircle,
		Trash,
	} from 'lucide-svelte';
	import DueNoteForm from '../_components/contract-account/due-note-form.svelte';
	import InstallmentPaymentForm from '../_components/contract-account/installment-payment-form.svelte';
	import RentPaymentForm from '../_components/contract-account/rent-payment-form.svelte';
	import ContractDeleteDialog from '../_components/contract-delete-dialog.svelte';
	import ContractForm from '../_components/contract-form.svelte';
	import InstallmentUpdateForm from '../_components/installment-update/installment-update-form.svelte';
	import RentUpdateForm from '../_components/rent-update/rent-update-form.svelte';
	import ContractAccountTable from './../_components/contract-account/contract-account-table.svelte';

	export let data;
	$: ({
		contract,
		contractAccount,
		rentUpdates,
		installmentUpdates,
		updateContractForm,
		deleteContractForm,
		createRentUpdateForm,
		createInstallmentUpdateForm,
		createDueNoteForm,
		createRentPaymentForm,
		createInstallmentPaymentForm,
	} = data);

	let openForm = $page.url.searchParams.get('action') === 'edit';
	let openDeleteDialog = false;
	let openRentUpdateForm = false;
	let openInstallmentUpdateForm = false;
	let openEndContractDialog = false;
	let openDueNoteForm = false;
	let openPaymentForm = false;
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>Contract #{contract.id}</PageTitle>
			<PageSubtitle>Last updated in 01/01/2024</PageSubtitle>
		</div>
		<div class="flex flex-row gap-x-4">
			<Button variant="outline">
				<FileX class="mr-2 h-4 w-4" />
				End Contract
			</Button>
			{#if contract.type === 'renting'}
				<Button on:click={() => (openRentUpdateForm = true)} variant="outline">
					<ArrowUpDown class="mr-2 h-4 w-4" />
					Update Rent
				</Button>
			{:else}
				<Button on:click={() => (openInstallmentUpdateForm = true)} variant="outline">
					<FileX class="mr-2 h-4 w-4" />
					Update Installment
				</Button>
			{/if}
			<Button on:click={() => (openForm = true)} variant="outline">
				<Pencil class="mr-2 h-4 w-4" />
				Edit
			</Button>
			<Button on:click={() => (openDeleteDialog = true)} variant="destructive">
				<Trash class="mr-2 h-4 w-4" />
				Delete
			</Button>
		</div>
	</div>
	<Separator />
	<div class="grid grid-cols-1 gap-y-12 xl:grid-cols-3 xl:gap-x-6">
		<div class="flex flex-col gap-y-12">
			<dl class="flex flex-col gap-y-8">
				<div class="flex flex-col gap-y-2">
					<div class="text-lg font-semibold tracking-tight">Information</div>
					<div>
						<dt class="text-sm text-muted-foreground">Start Date</dt>
						<dd>{dayjs(contract.start_date).format('DD/MM/YYYY')}</dd>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">End Date</dt>
						<dd>
							{#if contract.end_date}
								{dayjs(contract.end_date).format('DD/MM/YYYY')}
							{:else}
								<br />
							{/if}
						</dd>
					</div>
					{#if contract.type === 'renting'}
						<div>
							<dt class="text-sm text-muted-foreground">Rent</dt>
							<dd>
								{currencyFormatter.format(contract.data.rent)}
								{#if contract.data.next_update}
									<br />
									<span class="text-sm text-muted-foreground">
										next update: {currencyFormatter.format(contract.data.next_update.rent)}
										({dayjs(contract.data.next_update.update_date).format('DD/MM/YYYY')})
									</span>
								{/if}
							</dd>
						</div>
					{:else}
						<div>
							<dt class="text-sm text-muted-foreground">Sale Value</dt>
							<dd>{contract.data.sale_value}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Down Payment</dt>
							<dd>{contract.data.down_payment}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Installment</dt>
							<dd>{contract.data.installment}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Interest</dt>
							<dd>{contract.data.interest}</dd>
						</div>
					{/if}
					<div>
						<dt class="text-sm text-muted-foreground">Fraction</dt>
						<dd class="flex flex-row items-center gap-x-2">
							{contract.fraction.label}
							<Button size="iconsm" variant="ghost" href="/fractions/{contract.fraction.id}">
								<Link class="h-4 w-4" />
							</Button>
						</dd>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">Tenants</dt>
						{#each contract.tenants as tenant}
							<dd class="flex flex-row items-center gap-x-2">
								{tenant.label}
								<Button size="iconsm" variant="ghost" href="/tenants/{tenant.id}">
									<Link class="h-4 w-4" />
								</Button>
							</dd>
						{/each}
					</div>
				</div>
			</dl>
		</div>
		<div class="col-span-2 flex flex-col gap-y-8">
			<div class="grid grid-cols-3 gap-x-4">
				{#if contract.type === 'renting'}
					<Card.Root>
						<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
							<Card.Title class="text-sm font-medium">Current Rent</Card.Title>
							<HandCoins class="h-4 w-4 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">
								{currencyFormatter.format(contract.data.rent)}
							</div>
							<p class="text-xs text-muted-foreground">
								{#if contract.data.next_update}
									next update on the {dayjs(contract.data.next_update.update_date).format(
										'DD/MM/YYYY'
									)}
								{:else}
									no update scheduled yet
								{/if}
							</p>
						</Card.Content>
					</Card.Root>
				{:else}
					<Card.Root>
						<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
							<Card.Title class="text-sm font-medium">Current Installment</Card.Title>
							<HandCoins class="h-4 w-4 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">
								{currencyFormatter.format(contract.data.installment)}
							</div>
							<p class="text-xs text-muted-foreground">
								{#if contract.data.next_update}
									next update on the {dayjs(contract.data.next_update.update_date).format(
										'DD/MM/YYYY'
									)}
								{:else}
									no update scheduled yet
								{/if}
							</p>
						</Card.Content>
					</Card.Root>
				{/if}
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium">Current Balance</Card.Title>
						{#if contract.balance >= 0}
							<CheckCheck class="h-4 w-4 text-muted-foreground" />
						{:else}
							<AlertTriangle class="h-4 w-4 text-muted-foreground" />
						{/if}
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold">{currencyFormatter.format(contract.balance)}</div>
						<p class="text-xs text-muted-foreground">
							{#if contract.balance >= 0}
								no debt
							{:else}
								contract is in debt
							{/if}
						</p>
					</Card.Content>
				</Card.Root>
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium">Total Revenue</Card.Title>
						<PiggyBank class="h-4 w-4 text-muted-foreground" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold">
							{currencyFormatter.format(
								contractAccount
									.filter((item) => item.type !== 'due_note')
									.reduce((sum, account) => sum + account.value, 0)
							)}
						</div>
						<p class="text-xs text-muted-foreground">since contract start</p>
					</Card.Content>
				</Card.Root>
			</div>
			<div class="flex flex-col gap-y-6">
				<div class="flex items-start justify-between">
					<div>
						<h2 class="text-lg font-semibold">Account</h2>
						<p class="text-sm text-muted-foreground">
							List of all payments and due notes for this contract
						</p>
					</div>
					<div class="flex flex-row gap-x-4">
						<Button on:click={() => (openDueNoteForm = true)} variant="outline">
							<PlusCircle class="mr-2 h-4 w-4" />
							Due Note
						</Button>
						<Button on:click={() => (openPaymentForm = true)}>
							<PlusCircle class="mr-2 h-4 w-4" />
							Payment
						</Button>
					</div>
				</div>
				<ContractAccountTable {contractAccount} />
			</div>
		</div>
	</div>
</div>

<ContractForm data={updateContractForm} action="?/update" bind:open={openForm} />

<ContractDeleteDialog {contract} data={deleteContractForm} bind:open={openDeleteDialog} />

{#if contract.type === 'renting'}
	<RentUpdateForm
		data={createRentUpdateForm}
		bind:open={openRentUpdateForm}
		updates={rentUpdates}
	/>
{:else}
	<InstallmentUpdateForm
		data={createInstallmentUpdateForm}
		bind:open={openInstallmentUpdateForm}
		updates={installmentUpdates}
	/>
{/if}

<DueNoteForm data={createDueNoteForm} bind:open={openDueNoteForm} />

{#if contract.type === 'renting'}
	<RentPaymentForm data={createRentPaymentForm} bind:open={openPaymentForm} />
{:else}
	<InstallmentPaymentForm
		data={createInstallmentPaymentForm}
		{contract}
		bind:open={openPaymentForm}
	/>
{/if}
