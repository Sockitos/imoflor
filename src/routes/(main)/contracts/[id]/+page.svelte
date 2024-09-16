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
		FileX,
		HandCoins,
		Link,
		Pencil,
		PiggyBank,
		PlusCircle,
		Trash,
	} from 'lucide-svelte';
	import ContractDeleteDialog from '../_components/contract-delete-dialog.svelte';
	import ContractForm from '../_components/contract-form.svelte';
	import ContractAccountTable from './../_components/contract-account-table.svelte';

	export let data;
	$: ({ contract, contractAccount, updateForm, deleteForm } = data);

	let openForm = $page.url.searchParams.get('action') === 'edit';
	let openDeleteDialog = false;
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>Contract #{data.contract.id}</PageTitle>
			<PageSubtitle>Last updated in 01/01/2024</PageSubtitle>
		</div>
		<div class="flex flex-row gap-x-4">
			<Button variant="outline">
				<FileX class="mr-2 h-4 w-4" />
				End Contract
			</Button>
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
					<div class="text-lg font-semibold tracking-tight">Identification</div>
					<div>
						<dt class="text-sm text-muted-foreground">Start Date</dt>
						<dd>{dayjs(data.contract.start_date).format('DD/MM/YYYY')}</dd>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">End Date</dt>
						<dd>
							{#if data.contract.end_date}
								{dayjs(data.contract.end_date).format('DD/MM/YYYY')}
							{:else}
								<br />
							{/if}
						</dd>
					</div>
					{#if data.contract.type === 'renting'}
						<div class="flex flex-row items-center justify-between">
							<div>
								<dt class="text-sm text-muted-foreground">Rent</dt>
								<dd>
									{currencyFormatter.format(data.contract.data.rent)}
									{#if data.contract.data.next_update}
										<br />
										<span class="text-sm text-muted-foreground">
											next update: {currencyFormatter.format(data.contract.data.next_update.rent)}
											({dayjs(data.contract.data.next_update.update_date).format('DD/MM/YYYY')})
										</span>
									{/if}
								</dd>
							</div>
							<Button size="sm" variant="secondary">Updates</Button>
						</div>
					{:else}
						<div>
							<dt class="text-sm text-muted-foreground">Sale Value</dt>
							<dd>{data.contract.data.sale_value}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Down Payment</dt>
							<dd>{data.contract.data.down_payment}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Installment</dt>
							<dd>{data.contract.data.installment}</dd>
						</div>
						<div>
							<dt class="text-sm text-muted-foreground">Tax</dt>
							<dd>{data.contract.data.tax}</dd>
						</div>
					{/if}
					<div>
						<dt class="text-sm text-muted-foreground">Fraction</dt>
						<dd class="flex flex-row items-center gap-x-2">
							{data.contract.fraction.label}
							<Button size="iconsm" variant="ghost">
								<Link class="h-4 w-4" />
							</Button>
						</dd>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">Tenants</dt>
						{#each data.contract.tenants as tenant}
							<dd class="flex flex-row items-center gap-x-2">
								{tenant.label}
								<Button size="iconsm" variant="ghost">
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
				{#if data.contract.type === 'renting'}
					<Card.Root>
						<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
							<Card.Title class="text-sm font-medium">Current Rent</Card.Title>
							<HandCoins class="h-4 w-4 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">
								{currencyFormatter.format(data.contract.data.rent)}
							</div>
							<p class="text-xs text-muted-foreground">next update on the 01/01/2024</p>
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
								{currencyFormatter.format(data.contract.data.installment)}
							</div>
							<p class="text-xs text-muted-foreground">next update on the 01/01/2024</p>
						</Card.Content>
					</Card.Root>
				{/if}
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium">Current Balance</Card.Title>
						<AlertTriangle class="h-4 w-4 text-muted-foreground" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold">{currencyFormatter.format(data.contract.balance)}</div>
						<p class="text-xs text-muted-foreground">lorem ipsum</p>
					</Card.Content>
				</Card.Root>
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium">Total Revenue</Card.Title>
						<PiggyBank class="h-4 w-4 text-muted-foreground" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold">{currencyFormatter.format(200000)}</div>
						<p class="text-xs text-muted-foreground">+20.1% from last month</p>
					</Card.Content>
				</Card.Root>
			</div>
			<div class="flex flex-col gap-y-6">
				<div class="flex items-start justify-between">
					<div>
						<h2 class="text-lg font-semibold">Account</h2>
						<p class="text-sm text-muted-foreground">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
							incididunt ut labore et dolore magna aliqua.
						</p>
					</div>
					<div class="flex flex-row gap-x-4">
						<Button variant="outline">
							<PlusCircle class="mr-2 h-4 w-4" />
							Due Note
						</Button>
						<Button>
							<PlusCircle class="mr-2 h-4 w-4" />
							Payment
						</Button>
					</div>
				</div>
				<ContractAccountTable contractAccount={data.contractAccount} />
			</div>
		</div>
	</div>
</div>

<ContractForm data={updateForm} action="?/update" bind:open={openForm} />

<ContractDeleteDialog {contract} data={deleteForm} bind:open={openDeleteDialog} />
